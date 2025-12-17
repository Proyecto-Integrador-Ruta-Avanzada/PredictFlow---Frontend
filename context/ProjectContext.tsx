"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import api from "@/lib/api";
import { authService } from "@/services/auth.service";

export type Status = "todo" | "inprogress" | "done";
export type Risk = "low" | "medium" | "high" | "critical";

export type Sprint = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  isActive: boolean;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: Status;
  risk?: Risk;
  estimationHours?: number;
  assignee?: string;
  order: number;
  sprintId: string | null;
  // backend mapping
  boardColumnId?: string;
};

type ProjectContextType = {
  sprints: Sprint[];
  tasks: Task[];
  activeSprint: Sprint | null;

  isLoading: boolean;

  createSprint: (data: Omit<Sprint, "id" | "isActive">) => Promise<void>;
  updateSprint: (id: string, patch: Omit<Sprint, "id">) => Promise<void>;
  deleteSprint: (id: string) => Promise<void>;
  setActiveSprint: (id: string) => Promise<void>;
  completeSprint: (id: string) => Promise<void>;

  addTask: (task: Task) => Promise<void>;
  updateTask: (taskId: string, patch: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  moveTask: (taskId: string, newStatus: Status, newIndex: number) => Promise<void>;
  moveTaskToSprint: (taskId: string, sprintId: string | null) => Promise<void>;
};

const ProjectContext = createContext<ProjectContextType | null>(null);

function safeId(v: any) {
  return String(v?.id ?? v?.taskId ?? v?.sprintId ?? v?._id ?? "");
}

function mapStatusFromColumnName(name: string): Status {
  const n = name.toLowerCase();
  if (n.includes("progress")) return "inprogress";
  if (n.includes("done") || n.includes("hecho") || n.includes("termin")) return "done";
  return "todo";
}

export function ProjectProvider({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [boardId, setBoardId] = useState<string | null>(null);
  const [columnsByStatus, setColumnsByStatus] = useState<Record<Status, string>>({
    todo: "",
    inprogress: "",
    done: "",
  });
  const [activeSprintId, setActiveSprintId] = useState<string | null>(null);
  const currentUserIdRef = useRef<string | null>(null);

  const activeSprint = useMemo(
    () => sprints.find((s) => s.isActive) ?? null,
    [sprints]
  );

  const hydrate = async () => {
    setIsLoading(true);
    try {
      // 1) user
      try {
        const me = await authService.me();
        currentUserIdRef.current = me?.id ?? me?.userId ?? null;
      } catch {
        currentUserIdRef.current = null;
      }

      // 2) sprints
      let sprintList: any[] = [];
      try {
        const sp = await api.get(`/api/Sprint/project/${projectId}`);
        sprintList = Array.isArray(sp.data) ? sp.data : sp.data?.items ?? [];
      } catch (e: any) {
        if (e?.response?.status === 404) {
          sprintList = [];
        } else {
          throw e;
        }
      }

      const normalizedSprints: Sprint[] = sprintList.map((s: any) => ({
        id: safeId(s),
        name: String(s?.name ?? "Sprint"),
        startDate: String(s?.startDate ?? s?.start ?? ""),
        endDate: String(s?.endDate ?? s?.end ?? ""),
        description: String(s?.goal ?? s?.description ?? ""),
        isActive: false,
      }));

      // active sprint persisted per project
      const persisted = typeof window !== "undefined" ? localStorage.getItem(`pf:activeSprint:${projectId}`) : null;
      const initialActive = persisted && normalizedSprints.some((s) => s.id === persisted)
        ? persisted
        : normalizedSprints[0]?.id ?? null;

      setActiveSprintId(initialActive);
      setSprints(
        normalizedSprints.map((s) => ({ ...s, isActive: initialActive ? s.id === initialActive : false }))
      );

      // 3) board
      let boards: any[] = [];
      try {
        const boardsRes = await api.get(`/api/Board/project/${projectId}`);
        boards = Array.isArray(boardsRes.data) ? boardsRes.data : boardsRes.data?.items ?? [];
      } catch (e: any) {
        if (e?.response?.status === 404) {
          boards = []; // ✅ no hay boards todavía
        } else {
          throw e;
        }
      }

      let bid = safeId(boards[0]);

      if (!bid) {
        const created = await api.post(`/api/Board`, { projectId, name: "Main Board" });
        bid = safeId(created.data);
      }

      setBoardId(bid);


      // 4) columns
      const colRes = await api.get(`/api/BoardColumn/board/${bid}`);
      let cols = Array.isArray(colRes.data) ? colRes.data : colRes.data?.items ?? [];
      if (!Array.isArray(cols) || cols.length === 0) {
        // create standard columns
        const todo = await api.post(`/api/BoardColumn`, { boardId: bid, name: "To Do", position: 0 });
        const prog = await api.post(`/api/BoardColumn`, { boardId: bid, name: "In Progress", position: 1 });
        const done = await api.post(`/api/BoardColumn`, { boardId: bid, name: "Done", position: 2 });
        cols = [todo.data, prog.data, done.data];
      }

      const statusToCol: Record<Status, string> = { todo: "", inprogress: "", done: "" };
      for (const c of cols) {
        const cid = safeId(c);
        const st = mapStatusFromColumnName(String(c?.name ?? ""));
        if (!statusToCol[st]) statusToCol[st] = cid;
      }
      setColumnsByStatus(statusToCol);

      // 5) tasks (best effort)
      let loadedTasks: Task[] = [];
      try {
        const full = await api.get(`/api/Board/${bid}/full`);
        const columns = full.data?.columns ?? full.data?.boardColumns ?? [];
        if (Array.isArray(columns)) {
          for (const c of columns) {
            const cid = safeId(c);
            const st = mapStatusFromColumnName(String(c?.name ?? ""));
            const tlist = c?.tasks ?? [];
            if (Array.isArray(tlist)) {
              for (const t of tlist) {
                loadedTasks.push({
                  id: safeId(t),
                  title: String(t?.title ?? ""),
                  description: t?.description ?? "",
                  status: st,
                  risk: "low",
                  estimationHours: Number(t?.estimatedHours ?? t?.estimationHours ?? 0) || 0,
                  assignee: String(t?.assignedTo ?? t?.assignee ?? ""),
                  order: Number(t?.position ?? t?.order ?? 0) || 0,
                  sprintId: null,
                  boardColumnId: cid,
                });
              }
            }
          }
        }
      } catch {
        // no-op
      }

      // 6) sprint-task mapping (best effort)
      const active = initialActive;
      if (active) {
        try {
          const stRes = await api.get(`/api/Sprint/${active}/tasks`);
          const stList = Array.isArray(stRes.data) ? stRes.data : stRes.data?.items ?? [];
          const ids = new Set(stList.map((t: any) => safeId(t)));
          loadedTasks = loadedTasks.map((t) => (ids.has(t.id) ? { ...t, sprintId: active } : t));
        } catch {
          // no-op
        }
      }

      // sort by order per status
      loadedTasks.sort((a, b) => a.order - b.order);
      setTasks(loadedTasks);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const persistActiveSprint = (id: string | null) => {
    if (typeof window === "undefined") return;
    if (id) localStorage.setItem(`pf:activeSprint:${projectId}`, id);
    else localStorage.removeItem(`pf:activeSprint:${projectId}`);
  };

  const createSprint: ProjectContextType["createSprint"] = async (data) => {
    await api.post(`/api/Sprint`, {
      projectId,
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      goal: data.description,
    });
    await hydrate();
  };

  const updateSprint: ProjectContextType["updateSprint"] = async (id, patch) => {
    await api.put(`/api/Sprint/${id}`, {
      projectId,
      name: patch.name,
      startDate: patch.startDate,
      endDate: patch.endDate,
      goal: patch.description,
    });
    await hydrate();
  };

  const deleteSprint: ProjectContextType["deleteSprint"] = async (id) => {
    await api.delete(`/api/Sprint/${id}`);
    if (activeSprintId === id) {
      setActiveSprintId(null);
      persistActiveSprint(null);
    }
    await hydrate();
  };

  const setActiveSprintFn: ProjectContextType["setActiveSprint"] = async (id) => {
    setActiveSprintId(id);
    persistActiveSprint(id);
    setSprints((prev) => prev.map((s) => ({ ...s, isActive: s.id === id })));
    // refresh sprint-task mapping
    try {
      const stRes = await api.get(`/api/Sprint/${id}/tasks`);
      const stList = Array.isArray(stRes.data) ? stRes.data : stRes.data?.items ?? [];
      const ids = new Set(stList.map((t: any) => safeId(t)));
      setTasks((prev) => prev.map((t) => ({ ...t, sprintId: ids.has(t.id) ? id : null })));
    } catch {
      // ignore
    }
  };

  const completeSprint: ProjectContextType["completeSprint"] = async (id) => {
    // No hay endpoint en swagger para "completar"; hacemos lógica local.
    const remaining = sprints.filter((s) => s.id !== id);
    const nextActive = remaining[0]?.id ?? null;
    setSprints(remaining.map((s) => ({ ...s, isActive: nextActive ? s.id === nextActive : false })));
    setActiveSprintId(nextActive);
    persistActiveSprint(nextActive);
    setTasks((prev) => prev.map((t) => (t.sprintId === id ? { ...t, sprintId: null } : t)));
  };

  const addTask: ProjectContextType["addTask"] = async (task) => {
    const colId = task.status ? columnsByStatus[task.status] : columnsByStatus.todo;
    if (!colId) {
      // If columns not ready, re-hydrate.
      await hydrate();
    }
    const createdBy = currentUserIdRef.current ?? "";
    const assignedTo = task.assignee ?? createdBy;
    try {
      await api.post(`/api/Task`, {
        boardColumnId: columnsByStatus[task.status] || columnsByStatus.todo,
        title: task.title,
        description: task.description ?? "",
        createdBy,
        assignedTo,
        priority: "Medium",
        storyPoints: 0,
        estimatedHours: task.estimationHours ?? 0,
      });
      await hydrate();
    } catch {
      // fallback local
      setTasks((prev) => [{ ...task, boardColumnId: columnsByStatus[task.status] }, ...prev]);
    }
  };

  const updateTask: ProjectContextType["updateTask"] = async (taskId, patch) => {
    // Swagger only supports status and move.
    const current = tasks.find((t) => t.id === taskId);
    const nextStatus = patch.status ?? current?.status;

    try {
      if (nextStatus && current && nextStatus !== current.status) {
        const newColumnId = columnsByStatus[nextStatus];
        if (newColumnId) {
          await api.put(`/api/Task/${taskId}/move`, { newColumnId });
        } else {
          await api.put(`/api/Task/${taskId}/status`, { status: nextStatus });
        }
      }
    } catch {
      // ignore
    }

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, ...patch, status: (nextStatus as Status) ?? t.status } : t
      )
    );
  };

  const deleteTask: ProjectContextType["deleteTask"] = async (taskId) => {
    // No hay delete en swagger: eliminamos solo en UI.
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const moveTask: ProjectContextType["moveTask"] = async (taskId, newStatus, newIndex) => {
    const newColumnId = columnsByStatus[newStatus];
    if (newColumnId) {
      try {
        await api.put(`/api/Task/${taskId}/move`, { newColumnId });
      } catch {
        // ignore
      }
    }

    // local reordering
    setTasks((prev) => {
      const next = prev.map((t) => (t.id === taskId ? { ...t, status: newStatus, boardColumnId: newColumnId } : t));
      const moved = next.find((t) => t.id === taskId);
      if (!moved) return next;

      const group = next
        .filter((t) => t.sprintId === moved.sprintId && t.status === newStatus && t.id !== taskId)
        .sort((a, b) => a.order - b.order);

      const clamped = Math.max(0, Math.min(newIndex, group.length));
      group.splice(clamped, 0, { ...moved });

      const updatedIds = new Set(group.map((g) => g.id));
      return next.map((t) => {
        if (!updatedIds.has(t.id)) return t;
        const idx = group.findIndex((g) => g.id === t.id);
        return { ...t, order: idx };
      });
    });
  };

  const moveTaskToSprint: ProjectContextType["moveTaskToSprint"] = async (taskId, sprintId) => {
    try {
      if (sprintId) {
        await api.post(`/api/Sprint/${sprintId}/tasks/${taskId}`);
      } else if (activeSprintId) {
        await api.delete(`/api/Sprint/${activeSprintId}/tasks/${taskId}`);
      }
    } catch {
      // ignore
    }

    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, sprintId } : t)));
  };

  const value: ProjectContextType = {
    sprints,
    tasks,
    activeSprint,
    isLoading,
    createSprint,
    updateSprint,
    deleteSprint,
    setActiveSprint: setActiveSprintFn,
    completeSprint,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    moveTaskToSprint,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used within ProjectProvider");
  return ctx;
}

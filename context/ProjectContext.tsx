"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

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
};

type ProjectContextType = {
  sprints: Sprint[];
  tasks: Task[];
  activeSprint: Sprint | null;

  createSprint: (data: Omit<Sprint, "id" | "isActive">) => Promise<void> | void;
  updateSprint: (id: string, patch: Omit<Sprint, "id">) => Promise<void> | void;
  deleteSprint: (id: string) => Promise<void> | void;
  setActiveSprint: (id: string) => Promise<void> | void;
  completeSprint: (id: string) => Promise<void> | void;

  addTask: (task: Task) => Promise<void> | void;
  updateTask: (taskId: string, patch: Partial<Task>) => Promise<void> | void;
  deleteTask: (taskId: string) => Promise<void> | void;
  moveTask: (taskId: string, newStatus: Status, newIndex: number) => Promise<void> | void;

  moveTaskToSprint: (taskId: string, sprintId: string | null) => Promise<void> | void;
};

const ProjectContext = createContext<ProjectContextType | null>(null);

function normalizeStatus(status: any): Status {
  if (status === "review") return "inprogress";
  if (status === "in_progress") return "inprogress";
  if (status === "inprogress") return "inprogress";
  if (status === "done") return "done";
  return "todo";
}

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [sprints, setSprints] = useState<Sprint[]>([
    {
      id: "sprint-1",
      name: "Sprint 1",
      startDate: "2025-01-01",
      endDate: "2025-01-14",
      description: "Objetivo: flujo base del proyecto",
      isActive: true,
    },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "t-1",
      title: "Login UI",
      description: "Pantalla login + validaciones",
      status: "todo",
      risk: "medium",
      estimationHours: 4,
      assignee: "Sneider",
      order: 0,
      sprintId: "sprint-1",
    },
    {
      id: "t-2",
      title: "Integrar sidebar",
      description: "Mejorar UX y navegación",
      status: "inprogress",
      risk: "high",
      estimationHours: 3,
      assignee: "Carlos",
      order: 0,
      sprintId: "sprint-1",
    },
    {
      id: "t-3",
      title: "Backlog: refactor estilos",
      description: "Eliminar blancos y unificar theme",
      status: "todo",
      risk: "low",
      estimationHours: 2,
      assignee: "",
      order: 0,
      sprintId: null,
    },
  ]);

  const activeSprint = useMemo(
    () => sprints.find((s) => s.isActive) ?? null,
    [sprints]
  );

  const createSprint: ProjectContextType["createSprint"] = async (data) => {
    const id = crypto.randomUUID();

    setSprints((prev) => {
      const shouldBeActive = prev.length === 0;
      return [{ id, isActive: shouldBeActive, ...data }, ...prev];
    });
  };

  const updateSprint: ProjectContextType["updateSprint"] = async (id, patch) => {
    setSprints((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const deleteSprint: ProjectContextType["deleteSprint"] = async (id) => {

    setTasks((prev) =>
      prev.map((t) => (t.sprintId === id ? { ...t, sprintId: null } : t))
    );

    setSprints((prev) => {
      const remaining = prev.filter((s) => s.id !== id);

      const hasActive = remaining.some((s) => s.isActive);
      if (!hasActive && remaining.length > 0) {
        const firstId = remaining[0].id;
        return remaining.map((s) => ({ ...s, isActive: s.id === firstId }));
      }

      return remaining;
    });
  };

  const setActiveSprint: ProjectContextType["setActiveSprint"] = async (id) => {
    setSprints((prev) => prev.map((s) => ({ ...s, isActive: s.id === id })));
  };

  const completeSprint: ProjectContextType["completeSprint"] = async (id) => {

    setTasks((prev) =>
      prev.map((t) => {
        if (t.sprintId !== id) return t;
        if (t.status === "done") return t;
        return { ...t, sprintId: null };
      })
    );

    setSprints((prev) => {
      const remaining = prev.filter((s) => s.id !== id);
      const nextActive = remaining[0]?.id ?? null;
      return remaining.map((s) => ({ ...s, isActive: nextActive ? s.id === nextActive : false }));
    });
  };

  const addTask: ProjectContextType["addTask"] = async (task) => {
    const normalized: Task = { ...task, status: normalizeStatus(task.status) };
    setTasks((prev) => [normalized, ...prev]);
  };

  const updateTask: ProjectContextType["updateTask"] = async (taskId, patch) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              ...patch,
              status: patch.status ? normalizeStatus(patch.status) : t.status,
            }
          : t
      )
    );
  };

  const deleteTask: ProjectContextType["deleteTask"] = async (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const moveTask: ProjectContextType["moveTask"] = async (taskId, newStatus, newIndex) => {

    setTasks((prev) => {
      const next = prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      );

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
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, sprintId, order: 0 } 
          : t
      )
    );
  };

  const value: ProjectContextType = {
    sprints,
    tasks,
    activeSprint,
    createSprint,
    updateSprint,
    deleteSprint,
    setActiveSprint,
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

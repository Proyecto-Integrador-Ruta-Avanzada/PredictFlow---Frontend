import { useState } from "react";
import type { Task } from "@/lib/mockData";
import { initialTasks } from "@/lib/mockData";
import api from "@/lib/api";

const USE_API = Boolean(process.env.NEXT_PUBLIC_API_URL);

export function useKanban(projectId?: string) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (!USE_API) return;

    await api.delete(`/tasks/${id}`);
  };

  const fetchTasks = async () => {
    if (!USE_API) return tasks;
    setTasks([]);
    const res = await api.get(`/projects/${projectId}/tasks`);
    setTasks(res.data);
    return res.data;
  };

  const sortByOrder = (a: Task, b: Task) => a.order - b.order;

  const getColumns = () => {
    return {
      todo: tasks.filter((t) => t.status === "todo").sort(sortByOrder),
      inprogress: tasks
        .filter((t) => t.status === "inprogress")
        .sort(sortByOrder),
      review: tasks.filter((t) => t.status === "review").sort(sortByOrder),
      done: tasks.filter((t) => t.status === "done").sort(sortByOrder),
    };
  };

  const moveTask = async (
    taskId: string,
    newStatus: Task["status"],
    newIndex: number
  ) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus, order: newIndex } : t
      )
    );

    if (!USE_API) return;

    try {
      await api.patch(`/tasks/${taskId}`, {
        status: newStatus,
        order: newIndex,
      });
    } catch (err) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status: prev.find((pt) => pt.id === taskId)?.status || "todo",
                order: prev.find((pt) => pt.id === taskId)?.order || 0,
              }
            : t
        )
      );
      throw err;
    }
  };
  const addTask = async (task: Task) => {
    const order = tasks.filter((t) => t.status === task.status).length;

    const newTask = { ...task, order };

    if (!USE_API) {
      setTasks((prev) => [...prev, newTask]);
      return;
    }

    const res = await api.post(`/projects/${projectId}/tasks`, newTask);
    setTasks((prev) => [...prev, res.data]);
  };

  const updateTask = async (taskId: string, patch: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...patch } : t))
    );
    if (!USE_API) return;
    await api.patch(`/tasks/${taskId}`, patch);
  };

  return {
    tasks,
    getColumns,
    moveTask,
    addTask,
    updateTask,
    deleteTask,
    fetchTasks,
  };
}

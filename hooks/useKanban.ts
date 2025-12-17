"use client";

import { useMemo } from "react";
import { useProject } from "@/context/ProjectContext";

export function useKanban() {
  const {
    tasks,
    activeSprint,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
  } = useProject();

  const boardTasks = useMemo(() => {
    if (!activeSprint) return [];
    return tasks
      .filter((t) => t.sprintId === activeSprint.id)
      .slice()
      .sort((a, b) => a.order - b.order);
  }, [tasks, activeSprint]);

  const getColumns = useMemo(() => {
    const cols = {
      todo: [] as typeof boardTasks,
      inprogress: [] as typeof boardTasks,
      done: [] as typeof boardTasks,
    };

    for (const t of boardTasks) {
      if (t.status === "done") cols.done.push(t);
      else if (t.status === "inprogress") cols.inprogress.push(t);
      else cols.todo.push(t);
    }

    (Object.keys(cols) as Array<keyof typeof cols>).forEach((k) => {
      cols[k].sort((a, b) => a.order - b.order);
    });

    return () => cols;
  }, [boardTasks]);

  return {
    tasks: boardTasks,
    activeSprint,
    getColumns: getColumns(),
    moveTask,
    updateTask,
    deleteTask,
    addTask,
  };
}

"use client";

import React, { useState } from "react";
import TaskDrawer from "./TaskDrawer";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { useKanban } from "@/hooks/useKanban";
import SortableTask from "./SortableTask";
import KanbanColumn from "./KanbanColumn";
import styles from "@/styles/kanban.module.scss";

type Status = "todo" | "inprogress" | "done";

const COLUMN_TITLES: Record<Status, string> = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

export default function KanbanBoard() {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const {
    tasks,
    activeSprint,
    getColumns, 
    moveTask,
    updateTask,
    deleteTask,
    addTask,
  } = useKanban();

  const cols = getColumns;

  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = (task: any) => {
    setSelectedTask(task);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedTask(null);
  };

  const createNewTask = () => {
    if (!activeSprint) return;

    openDrawer({
      id: crypto.randomUUID(),
      title: "",
      description: "",
      status: "todo",
      risk: "low",
      estimationHours: 0,
      assignee: "",
      order: cols.todo.length,
      sprintId: activeSprint.id,
    });
  };

  const columnIds: Record<Status, string> = {
    todo: "column-todo",
    inprogress: "column-inprogress",
    done: "column-done",
  };

  const taskIds: Record<Status, string[]> = {
    todo: cols.todo.map((t) => t.id),
    inprogress: cols.inprogress.map((t) => t.id),
    done: cols.done.map((t) => t.id),
  };

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const sourceColumn = (Object.keys(taskIds) as Status[]).find((col) =>
      taskIds[col].includes(activeId)
    );

    const targetColumn = (Object.keys(taskIds) as Status[]).find((col) =>
      taskIds[col].includes(overId)
    );

    if (overId.startsWith("column-")) {
      const newStatus = overId.replace("column-", "") as Status;
      await moveTask(activeId, newStatus, taskIds[newStatus].length);
      return;
    }

    if (!sourceColumn || !targetColumn) return;

    if (sourceColumn === targetColumn) {
      const oldIndex = taskIds[sourceColumn].indexOf(activeId);
      const newIndex = taskIds[targetColumn].indexOf(overId);
      if (oldIndex === newIndex) return;

      const reordered = arrayMove(taskIds[sourceColumn], oldIndex, newIndex);
      for (let i = 0; i < reordered.length; i++) {
        await updateTask(reordered[i], { order: i });
      }
      return;
    }

    const newIndex = taskIds[targetColumn].indexOf(overId);
    await moveTask(activeId, targetColumn, newIndex);
  };

  const handleDeleteTask = () => {
    if (!selectedTask) return;
    deleteTask(selectedTask.id);
    closeDrawer();
  };

  const handleSaveTask = (taskId: string, patch: any) => {
    const exists = tasks.some((t) => t.id === taskId);

    if (exists) {
      updateTask(taskId, patch);
    } else {
      addTask({
        id: taskId,
        ...patch,
        status: patch.status ?? "todo",
        order: cols.todo.length,
      });
    }

    closeDrawer();
  };

  if (!activeSprint) {
    return (
      <div className={styles.emptyState}>
        <h2>No hay sprint activo</h2>
        <p>Activa un sprint para ver el tablero.</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <div className={styles.kanbanContainer}>
        {(Object.keys(columnIds) as Status[]).map((status) => (
          <KanbanColumn
            key={status}
            id={columnIds[status]}
            title={COLUMN_TITLES[status]}
            count={cols[status].length}
          >
            <SortableContext
              items={taskIds[status]}
              strategy={verticalListSortingStrategy}
            >
              {cols[status].map((task) => (
                <SortableTask
                  key={task.id}
                  task={task}
                  onClick={() => openDrawer(task)}
                />
              ))}
            </SortableContext>

            {status === "todo" && (
              <button className={styles.addTaskButton} onClick={createNewTask}>
                + Nueva tarea
              </button>
            )}
          </KanbanColumn>
        ))}

        {selectedTask && (
          <TaskDrawer
            key={selectedTask.id}
            open={drawerOpen}
            task={selectedTask}
            onClose={closeDrawer}
            onSave={handleSaveTask}
            onDelete={handleDeleteTask}
          />
        )}
      </div>
    </DndContext>
  );
}

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

type Status = "todo" | "inprogress" | "review" | "done";

export default function KanbanBoard() {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const { tasks, getColumns, moveTask, updateTask, deleteTask } = useKanban();
  const cols = getColumns();

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

  const columnIds: Record<Status, string> = {
    todo: "column-todo",
    inprogress: "column-inprogress",
    review: "column-review",
    done: "column-done",
  };

  const taskIds: Record<Status, string[]> = {
    todo: cols.todo.map((t) => t.id),
    inprogress: cols.inprogress.map((t) => t.id),
    review: cols.review.map((t) => t.id),
    done: cols.done.map((t) => t.id),
  };

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // 🟢 encontrar columnas
    const sourceColumn = (Object.keys(taskIds) as Status[]).find((col) =>
      taskIds[col].includes(activeId)
    );

    const targetColumn = (Object.keys(taskIds) as Status[]).find((col) =>
      taskIds[col].includes(overId)
    );

    // 🟥 mover a columna vacía
    if (overId.startsWith("column-")) {
      const newStatus = overId.replace("column-", "") as Status;
      await moveTask(activeId, newStatus, taskIds[newStatus].length);
      return;
    }

    if (!sourceColumn || !targetColumn) return;

    // 🟡 REORDENAR DENTRO DE LA MISMA COLUMNA
    if (sourceColumn === targetColumn) {
      const oldIndex = taskIds[sourceColumn].indexOf(activeId);
      const newIndex = taskIds[targetColumn].indexOf(overId);

      if (oldIndex === newIndex) return;

      const reordered = arrayMove(
        taskIds[sourceColumn],
        oldIndex,
        newIndex
      );

      // 🔁 actualizar orden de cada task
      for (let i = 0; i < reordered.length; i++) {
        await updateTask(reordered[i], { order: i });
      }

      return;
    }

    // 🔵 mover entre columnas
    const newIndex = taskIds[targetColumn].indexOf(overId);
    await moveTask(activeId, targetColumn, newIndex);
  };

  const handleDeleteTask = () => {
    if (!selectedTask) return;
    deleteTask(selectedTask.id);
    closeDrawer();
  };

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
            title={status.replace(/^\w/, (c) => c.toUpperCase())}
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
          </KanbanColumn>
        ))}

        {selectedTask && (
          <TaskDrawer
            key={selectedTask.id}
            open={drawerOpen}
            task={selectedTask}
            onClose={closeDrawer}
            onSave={updateTask}
            onDelete={handleDeleteTask}
          />
        )}
      </div>
    </DndContext>
  );
}

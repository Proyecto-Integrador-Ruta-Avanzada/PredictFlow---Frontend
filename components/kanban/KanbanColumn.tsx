"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import styles from "@/styles/kanban.module.scss";

export default function KanbanColumn({
  title,
  count,
  children,
  id,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
  id: string;
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className={styles.column}>
      <div className={styles.columnTitle}>
        <span>{title}</span>
        <span>{count}</span>
      </div>

      <div className={styles.taskList}>{children}</div>
    </div>
  );
}

"use client";

import { useState } from "react";
import styles from "@/styles/drawer.module.scss";
import type { Task } from "@/lib/mockData";

interface Props {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (taskId: string, patch: Partial<Task>) => void;
  onDelete: () => void;
}

export default function TaskDrawer({
  open,
  task,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [form, setForm] = useState<Partial<Task>>(task ?? {});

  if (!open || !task) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(task.id, {
      title: form.title,
      description: form.description,
      status: form.status,
      risk: form.risk,
      estimationHours: Number(form.estimationHours),
      assignee: form.assignee,
    });
    onClose();
  };

  return (
    <div className={`${styles.drawer} ${styles.open}`}>
      <div className={styles.header}>
        <input
          className={styles.titleInput}
          name="title"
          value={form.title || ""}
          onChange={handleChange}
        />
        <button onClick={onClose}>✕</button>
      </div>

      <div className={styles.content}>
        <label>
          Descripción
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Estado
          <select
            name="status"
            value={form.status || "todo"}
            onChange={handleChange}
          >
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </label>

        <label>
          Riesgo
          <select
            name="risk"
            value={form.risk || "low"}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </label>

        <label>
          Estimación (horas)
          <input
            type="number"
            name="estimationHours"
            value={form.estimationHours || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Asignado a
          <input
            name="assignee"
            value={form.assignee || ""}
            onChange={handleChange}
          />
        </label>

        <div className={styles.actions}>
          <button onClick={onClose}>Cerrar</button>

          <button className={styles.primary} onClick={handleSave}>
            Guardar cambios
          </button>

          <button
            className={styles.danger}
            onClick={() => {
              if (confirm("¿Eliminar esta tarea?")) {
                onDelete();
                onClose();
              }
            }}
          >
            Eliminar tarea
          </button>
        </div>
      </div>
    </div>
  );
}

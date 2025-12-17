"use client";

import { useMemo, useState } from "react";
import styles from "@/styles/taskDrawer.module.scss";

type Status = "todo" | "inprogress" | "done";
type Risk = "low" | "medium" | "high" | "critical";

type TaskShape = {
  id: string;
  title: string;
  description?: string;
  status: Status;
  risk?: Risk;
  estimationHours?: number;
  assignee?: string;
  order?: number;
  sprintId?: string | null;
};

type Props = {
  open: boolean;
  task: TaskShape;
  onClose: () => void;
  onSave: (taskId: string, patch: Partial<TaskShape>) => void;
  onDelete: () => void;
};

export default function TaskDrawer(props: Props) {
  const { open, task } = props;
  if (!open) return null;

  return <TaskDrawerInner key={task.id} {...props} />;
}

function TaskDrawerInner({ task, onClose, onSave, onDelete }: Omit<Props, "open">) {
  const initialDraft = useMemo(
    () => ({
      title: task.title ?? "",
      description: task.description ?? "",
      status: (task.status as Status) ?? "todo",
      risk: (task.risk as Risk) ?? "low",
      estimationHours: task.estimationHours ?? 0,
      assignee: task.assignee ?? "",
    }),
    [task]
  );

  const [draft, setDraft] = useState(initialDraft);
  const [error, setError] = useState("");

  const save = () => {
    if (!draft.title.trim()) {
      setError("El título es obligatorio");
      return;
    }

    onSave(task.id, {
      title: draft.title.trim(),
      description: draft.description?.trim() || "",
      status: draft.status,
      risk: draft.risk,
      estimationHours: draft.estimationHours,
      assignee: draft.assignee?.trim() || "",
    });

    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Tarea</h3>
            <div className={styles.meta}>ID: {task.id}</div>
          </div>

          <button className={styles.iconBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <label className={styles.label}>Título</label>
          <input
            className={styles.input}
            value={draft.title}
            onChange={(e) => {
              setError("");
              setDraft((d) => ({ ...d, title: e.target.value }));
            }}
            placeholder="Ej: Implementar login"
          />

          <label className={styles.label}>Descripción</label>
          <textarea
            className={styles.textarea}
            value={draft.description}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            placeholder="Describe la tarea…"
          />

          <div className={styles.grid}>
            <div>
              <label className={styles.label}>Estado</label>
              <select
                className={styles.select}
                value={draft.status}
                onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as Status }))}
              >
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className={styles.label}>Riesgo</label>
              <select
                className={styles.select}
                value={draft.risk}
                onChange={(e) => setDraft((d) => ({ ...d, risk: e.target.value as Risk }))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className={styles.grid}>
            <div>
              <label className={styles.label}>Estimación (horas)</label>
              <input
                className={styles.input}
                type="number"
                value={draft.estimationHours}
                onChange={(e) => setDraft((d) => ({ ...d, estimationHours: Number(e.target.value) }))}
                min={0}
              />
            </div>

            <div>
              <label className={styles.label}>Asignado a</label>
              <input
                className={styles.input}
                value={draft.assignee}
                onChange={(e) => setDraft((d) => ({ ...d, assignee: e.target.value }))}
                placeholder="Nombre"
              />
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        <div className={styles.footer}>
          <button className={styles.secondaryBtn} onClick={onClose}>
            Cancelar
          </button>

          <button className={styles.dangerBtn} onClick={onDelete}>
            Eliminar
          </button>

          <button className={styles.primaryBtn} onClick={save}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

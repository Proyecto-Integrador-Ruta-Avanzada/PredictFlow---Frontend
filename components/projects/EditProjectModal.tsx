"use client";

import { useState } from "react";
import styles from "@/styles/projects.module.scss";
import { Project } from "@/hooks/useProjects";

interface Props {
  open: boolean;
  project: Project | null;
  onClose: () => void;
  onSave: (data: Partial<Project>) => void;
}

export default function EditProjectModal({
  open,
  project,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState(() => ({
    name: project?.name ?? "",
    description: project?.description ?? "",
    status: project?.status ?? "active",
  }));

  if (!open || !project) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h2>Editar proyecto</h2>

        <label className={styles.field}>
          Nombre
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>

        <label className={styles.field}>
          Descripción
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </label>

        <label className={styles.field}>
          Estado
          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as any })
            }
          >
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </label>

        <div className={styles.modalActions}>
          <button onClick={onClose}>Cancelar</button>
          <button
            className={styles.primary}
            onClick={() => {
              onSave(form);
              onClose();
            }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

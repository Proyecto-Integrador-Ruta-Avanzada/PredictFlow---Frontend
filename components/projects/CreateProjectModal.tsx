"use client";

import { useState } from "react";
import styles from "@/styles/projects.module.scss";

export default function CreateProjectModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; description?: string }) => void;
}) {
  const [form, setForm] = useState({ name: "", description: "" });

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = () => {
    if (!form.name.trim()) return;
    onCreate({ name: form.name, description: form.description });
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Nuevo proyecto</h2>

        <div className={styles.field}>
          <label className={styles.label}>Nombre del proyecto</label>
          <input
            className={styles.input}
            name="name"
            placeholder="Ej. Plataforma Predictiva"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Descripción</label>
          <textarea
            className={styles.textarea}
            name="description"
            placeholder="Describe el objetivo del proyecto"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.button} ${styles.secondary}`}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className={`${styles.button} ${styles.primary}`}
            onClick={submit}
          >
            Crear proyecto
          </button>
        </div>
      </div>
    </div>
  );
}

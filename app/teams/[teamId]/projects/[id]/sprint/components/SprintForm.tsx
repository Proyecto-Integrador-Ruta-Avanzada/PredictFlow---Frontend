"use client";

import { useState } from "react";
import styles from "@/styles/sprintForm.module.scss";

type CreateSprintInput = {
  name: string;
  startDate: string;
  endDate: string;
  description: string;
};

export default function SprintForm({
  onCreate,
}: {
  onCreate: (data: CreateSprintInput) => Promise<void> | void;
}) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name || !startDate || !endDate) {
      setError("Nombre, fecha inicio y fecha fin son obligatorios");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await onCreate({
        name,
        startDate,
        endDate,
        description,
      });

      setName("");
      setStartDate("");
      setEndDate("");
      setDescription("");
    } catch {
      setError("Error al crear sprint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.subtitle}>Crear Sprint</h2>

      <div className={styles.grid}>
        <input
          className={styles.input}
          type="text"
          placeholder="Nombre del sprint"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />

        <input
          className={styles.input}
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          disabled={loading}
        />

        <input
          className={styles.input}
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          disabled={loading}
        />
      </div>

      <textarea
        className={styles.textarea}
        placeholder="Descripción (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={loading}
      />

      <button className={styles.button} onClick={handleSubmit} disabled={loading}>
        {loading ? "Creando…" : "Crear sprint"}
      </button>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

"use client";

import { useState } from "react";
import styles from "@/styles/sprintsList.module.scss";
import { Sprint } from "../types";

interface Props {
  sprints?: Sprint[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, patch: Omit<Sprint, "id">) => Promise<void> | void;
  loadingId: string | null;
}

export default function SprintsList({
  sprints = [],
  onDelete,
  onUpdate,
  loadingId,
}: Props) {
  const [editing, setEditing] = useState<Sprint | null>(null);

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const openEdit = (s: Sprint) => {
    setEditing(s);
    setName(s.name);
    setStartDate(s.startDate);
    setEndDate(s.endDate);
    setDescription(s.description || "");
  };

  const close = () => setEditing(null);

  const save = async () => {
    if (!editing) return;
    if (!name || !startDate || !endDate) return;

    await onUpdate(editing.id, { name, startDate, endDate, description });
    close();
  };

  if (sprints.length === 0) {
    return <p className={styles.empty}>No hay sprints creados</p>;
  }

  return (
    <>
      <div className={styles.list}>
        {sprints.map((s) => {
          const isLoading = loadingId === s.id;

          return (
            <div key={s.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.cardTitle}>{s.name}</div>
                  <div className={styles.cardMeta}>
                    {s.startDate} — {s.endDate}
                  </div>
                </div>

                <div className={styles.actions}>
                  <button
                    className={styles.actionButton}
                    disabled={isLoading}
                    onClick={() => openEdit(s)}
                  >
                    Editar
                  </button>

                  <button
                    className={styles.actionButton}
                    disabled={isLoading}
                    onClick={() => onDelete(s.id)}
                  >
                    {isLoading ? "Eliminando…" : "Eliminar"}
                  </button>
                </div>
              </div>

              {s.description?.trim() ? (
                <p className={styles.description}>{s.description}</p>
              ) : (
                <p className={styles.descriptionEmpty}>Sin descripción</p>
              )}
            </div>
          );
        })}
      </div>

      {editing && (
        <div className={styles.modalOverlay} onClick={close}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Editar sprint</h3>
              <button className={styles.closeButton} onClick={close}>
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <label className={styles.label}>Nombre</label>
              <input
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div className={styles.grid}>
                <div>
                  <label className={styles.label}>Inicio</label>
                  <input
                    className={styles.input}
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className={styles.label}>Fin</label>
                  <input
                    className={styles.input}
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <label className={styles.label}>Descripción</label>
              <textarea
                className={styles.textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe el objetivo del sprint…"
              />
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.secondaryButton} onClick={close}>
                Cancelar
              </button>
              <button className={styles.primaryButton} onClick={save}>
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

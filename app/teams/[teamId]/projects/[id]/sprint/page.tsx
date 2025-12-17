"use client";

import { useMemo, useState } from "react";
import { useProject } from "@/context/ProjectContext";
import styles from "@/styles/sprint.module.scss";

export default function SprintPage() {
  const {
    sprints,
    tasks,
    activeSprint,
    setActiveSprint,
    completeSprint,
    moveTaskToSprint,
    addTask,
  } = useProject();

  const [newTitle, setNewTitle] = useState("");

  const backlog = useMemo(() => tasks.filter((t) => t.sprintId === null), [tasks]);
  const activeTasks = useMemo(
    () => tasks.filter((t) => t.sprintId === activeSprint?.id),
    [tasks, activeSprint?.id]
  );

  const createBacklogTask = async () => {
    if (!newTitle.trim()) return;

    await addTask({
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      description: "",
      status: "todo",
      risk: "low",
      estimationHours: 0,
      assignee: "",
      order: 0,
      sprintId: null,
    });

    setNewTitle("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Sprints</h1>
      </div>

      <div className={styles.grid}>
        <section className={styles.panel}>
          <div className={styles.panelTitle}>Sprints</div>

          {sprints.map((s) => (
            <div key={s.id} className={styles.sprintCard}>
              <div>
                <div className={styles.sprintName}>
                  {s.name} {s.isActive ? <span className={styles.badge}>Activo</span> : null}
                </div>
                <div className={styles.meta}>
                  {s.startDate} — {s.endDate}
                </div>
                <div className={styles.desc}>{s.description || "Sin descripción"}</div>
              </div>

              <div className={styles.sprintActions}>
                {!s.isActive && (
                  <button className={styles.btn} onClick={() => setActiveSprint(s.id)}>
                    Activar
                  </button>
                )}

                {s.isActive && (
                  <button className={styles.btnPrimary} onClick={() => completeSprint(s.id)}>
                    Completar sprint
                  </button>
                )}
              </div>
            </div>
          ))}
        </section>

        <section className={styles.panel}>
          <div className={styles.panelTitle}>
            Sprint activo: <b>{activeSprint?.name ?? "—"}</b>
          </div>

          <div className={styles.twoCols}>
            <div>
              <div className={styles.subTitle}>Backlog</div>

              <div className={styles.quickAdd}>
                <input
                  className={styles.quickInput}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Nueva tarea en backlog…"
                />
                <button className={styles.btn} onClick={createBacklogTask}>
                  Crear
                </button>
              </div>

              {backlog.length === 0 ? (
                <div className={styles.empty}>No hay tareas en backlog</div>
              ) : (
                backlog.map((t) => (
                  <div key={t.id} className={styles.issueRow}>
                    <div>
                      <div className={styles.issueTitle}>{t.title}</div>
                      <div className={styles.issueMeta}>Estado: {t.status}</div>
                    </div>

                    <button
                      className={styles.btn}
                      disabled={!activeSprint}
                      onClick={() => activeSprint && moveTaskToSprint(t.id, activeSprint.id)}
                    >
                      Añadir al sprint
                    </button>
                  </div>
                ))
              )}
            </div>

            <div>
              <div className={styles.subTitle}>Tareas del sprint</div>

              {activeTasks.length === 0 ? (
                <div className={styles.empty}>El sprint no tiene tareas</div>
              ) : (
                activeTasks.map((t) => (
                  <div key={t.id} className={styles.issueRow}>
                    <div>
                      <div className={styles.issueTitle}>{t.title}</div>
                      <div className={styles.issueMeta}>Estado: {t.status}</div>
                    </div>

                    <button className={styles.btn} onClick={() => moveTaskToSprint(t.id, null)}>
                      Enviar a backlog
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import CreateProjectModal from "@/components/projects/CreateProjectModal";
import Link from "next/link";
import styles from "@/styles/projects.module.scss";
import EditProjectModal from "@/components/projects/EditProjectModal";

export default function ProjectsPage() {
  const { projects, createProject, deleteProject, updateProject } =
    useProjects();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<null | any>(null);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Proyectos</h1>
        <button className={styles.createButton} onClick={() => setOpen(true)}>
          <span className={styles.plus}>＋</span>
          Nuevo proyecto
        </button>
      </div>

      <div className={styles.grid}>
        {projects.map((p) => (
          <div key={p.id} className={styles.cardWrapper}>
            <Link href={`/projects/${p.id}`} className={styles.card}>
              <h3 className={styles.title}>{p.name}</h3>

              {p.description && (
                <p className={styles.description}>{p.description}</p>
              )}

              <span className={styles.status}>{p.status}</span>
            </Link>
            <button
              className={styles.editButton}
              onClick={(e) => {
                e.stopPropagation();
                setEditing(p);
              }}
              aria-label="Editar proyecto"
            >
              ✏️
            </button>
            <EditProjectModal
              open={!!editing}
              project={editing}
              onClose={() => setEditing(null)}
              onSave={(data) => updateProject(editing!.id, data)}
            />

            <button
              className={styles.deleteButton}
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`¿Eliminar "${p.name}"?`)) {
                  deleteProject(p.id);
                }
              }}
              aria-label="Eliminar proyecto"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <CreateProjectModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={(data) => createProject({ ...data, status: "active" })}
      />
    </div>
  );
}

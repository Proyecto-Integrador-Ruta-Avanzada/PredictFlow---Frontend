"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTeams, Project } from "@/context/TeamsProdiver";
import styles from "@/styles/projects.module.scss";

export default function CreateProjectPage() {
  const params = useParams();
  let teamId = params.teamId;

  if (Array.isArray(teamId)) teamId = teamId[0];

  const { teams, projects, createProject, loadProjects } = useTeams();
  const router = useRouter();
  const [name, setName] = useState("");

  const team = teams.find((t) => t.id === teamId);
  if (!team) return <div>Equipo no encontrado</div>;

  const teamProjects = projects.filter((p: Project) => p.teamId === teamId);

  const handleCreateProject = async () => {
    if (!name.trim()) return;
    await createProject(teamId!, name.trim());
    await loadProjects(teamId!);
    setName("");
    router.push(`/teams/${teamId}/projects`);
  };

  return (
    <div className={styles.page} style={{ maxWidth: 720 }}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Crear proyecto</h1>
          <div style={{ opacity: 0.75, marginTop: 4 }}>Equipo: {team.name}</div>
        </div>

        <button
          className={styles.createButton}
          onClick={handleCreateProject}
          disabled={!name.trim()}
          type="button"
        >
          Crear
        </button>
      </div>

      <div className={styles.formCard}>
        <div className={styles.field}>
          <div className={styles.label}>Nombre del proyecto</div>
          <input
            value={name}
            placeholder="Ej: Growth Sprint Q1"
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.helper}>
          Se crea en el backend y luego se recarga la lista de proyectos.
        </div>
      </div>

      <div className={styles.subSection}>
        <div className={styles.subTitle}>Proyectos actuales</div>
        {teamProjects.length === 0 ? (
          <div style={{ opacity: 0.8 }}>No hay proyectos aún.</div>
        ) : (
          <ul className={styles.simpleList}>
            {teamProjects.map((p) => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTeams } from "@/context/TeamsProdiver";
import styles from "@/styles/projects.module.scss";

export default function TeamProjectsPage() {
  const params = useParams();
  let teamId = (params as any)?.teamId as string | string[] | undefined;
  if (Array.isArray(teamId)) teamId = teamId[0];

  const { teams, projects } = useTeams();
  const team = teamId ? teams.find((t) => t.id === teamId) : undefined;

  if (!teamId) return <div>TeamId inválido</div>;
  if (!team) {
    return (
      <div className={styles.page} style={{ maxWidth: 720 }}>
        <h1 className={styles.title}>Equipo no encontrado</h1>
        <p style={{ marginTop: 10, opacity: 0.8 }}>
          Si recargaste la página, recuerda que por ahora los equipos se guardan en memoria.
        </p>
        <p style={{ marginTop: 10 }}>
          <Link href="/onboarding/team" style={{ textDecoration: "underline" }}>
            Volver a crear/seleccionar equipo
          </Link>
        </p>
      </div>
    );
  }

  const teamProjects = projects.filter((p) => p.teamId === teamId);

  return (
    <div className={styles.page} style={{ maxWidth: 1000 }}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Proyectos</h1>
          <div style={{ opacity: 0.75, marginTop: 4 }}>Equipo: {team.name}</div>
        </div>

        <Link className={styles.createButton} href={`/teams/${teamId}/projects/new`}>
          <span className={styles.plus}>+</span>
          Nuevo proyecto
        </Link>
      </div>

      {teamProjects.length === 0 ? (
        <p style={{ marginTop: 18, opacity: 0.8 }}>
          Aún no hay proyectos para este equipo.
        </p>
      ) : (
        <div className={styles.grid}>
          {teamProjects.map((p) => (
            <Link
              key={p.id}
              href={`/teams/${teamId}/projects/${p.id}/kanban`}
              className={styles.card}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{p.name}</div>
                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>ID: {p.id}</div>
              </div>

              <div className={styles.active}>Abrir tablero →</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

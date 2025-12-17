"use client";

import styles from "@/styles/ProjectSidebar.module.scss";
import { Team, Project, useTeams } from "@/context/TeamsProdiver";
import { useRouter } from "next/navigation";

interface Props {
  team: Team;
  projects: Project[];
}

export default function ProjectSidebar({ team, projects }: Props) {
  const router = useRouter();
  const { createProject } = useTeams();

  const handleCreateProject = async () => {
    const name = prompt("Nombre del proyecto");
    if (!name?.trim()) return;

    const newProject = await createProject(team.id, name.trim());
    router.push(`/teams/${team.id}/projects/${newProject.id}/kanban`);
  };

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>{team.name}</h2>

      <ul className={styles.list}>
        {projects.map((p) => (
          <li
            key={p.id}
            className={styles.item}
            onClick={() => router.push(`/teams/${team.id}/projects/${p.id}/kanban`)}
          >
            {p.name}
          </li>
        ))}
      </ul>

      <button className={styles.button} onClick={handleCreateProject}>
        Crear proyecto
      </button>
    </aside>
  );
}

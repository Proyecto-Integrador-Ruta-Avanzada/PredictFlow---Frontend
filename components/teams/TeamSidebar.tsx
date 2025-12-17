"use client";

import styles from "@/styles/teamSidebar.module.scss";
import { Team } from "@/context/TeamsProdiver";
import { useRouter } from "next/navigation";

interface Props {
  teams: Team[];
}

export default function TeamSidebar({ teams }: Props) {
  const router = useRouter();

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Mis equipos</h2>

      <ul className={styles.list}>
        {teams.map((team) => (
          <li
            key={team.id}
            className={styles.item}
            onClick={() => router.push(`/teams/${team.id}/projects/new`)}
          >
            {team.name}
          </li>
        ))}
      </ul>
    </aside>
  );
}

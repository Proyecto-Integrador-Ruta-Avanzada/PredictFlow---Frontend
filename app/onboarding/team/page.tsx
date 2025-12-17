"use client";

import { useTeams } from "@/context/TeamsProdiver";
import CreateTeamForm from "@/components/teams/CreateTeamForm";
import styles from "@/styles/onboarding-team.module.scss";

export default function OnboardingTeamPage() {
  const { createTeam } = useTeams();

  const handleCreate = async (name: string) => {
    await createTeam(name);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div>
          <h1 className={styles.title}>Crea tu equipo</h1>
          <p className={styles.subtitle}>
            Define el equipo con el que vas a trabajar. Luego podrás crear proyectos, invitar
            miembros y empezar a planear sprints.
          </p>
        </div>

        <CreateTeamForm onCreate={handleCreate} />
      </div>
    </div>
  );
}

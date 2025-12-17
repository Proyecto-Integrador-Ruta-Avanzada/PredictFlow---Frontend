"use client";

import { useState } from "react";
import styles from "@/styles/onboarding-team.module.scss";

interface Props {
  onCreate: (name: string) => void;
}

export default function CreateTeamForm({ onCreate }: Props) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === "") return;
    onCreate(name.trim());
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formRow}>
      <input
        type="text"
        placeholder="Nombre del equipo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={styles.input}
      />

      <button type="submit" className={styles.button} disabled={!name.trim()}>
        Crear equipo
      </button>
    </form>
  );
}

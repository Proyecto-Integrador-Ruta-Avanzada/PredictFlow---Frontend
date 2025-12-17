"use client";

import { useState } from "react";
import styles from "@/styles/members/inviteMember.module.scss";

export default function InviteForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const invite = async () => {
    if (!email) {
      setError("Ingresa un correo válido");
      return;
    }

    setError("");
    setLoading(true);

    try {
      console.log("Invitación enviada a:", email);
      setEmail("");
    } catch {
      setError("Error al enviar invitación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <input
          className={styles.input}
          type="email"
          placeholder="correo@empresa.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
        />

        <button
          className={styles.button}
          onClick={invite}
          disabled={loading}
        >
          {loading ? "Enviando…" : "Invitar"}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

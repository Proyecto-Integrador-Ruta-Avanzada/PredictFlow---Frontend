"use client";

import { InvitationStatus as Status } from "./types";
import styles from "@/styles/invitation.module.scss";

interface Props {
  status: Status;
  email?: string;
  message?: string;
  onAccept?: () => void;
}

export default function InvitationStatus({
  status,
  email,
  message,
  onAccept
}: Props) {
  console.log(status)

  if (status === "loading") {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p className={styles.message}>Verificando invitación…</p>
        </div>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p className={`${styles.message} ${styles.error}`}>
            {message || "La invitación no es válida"}
          </p>
        </div>
      </div>
    );
  }

  if (status === "accepted") {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p className={`${styles.message} ${styles.success}`}>
            Invitación aceptada correctamente. Ya puedes ingresar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Has sido invitado</h1>
        <p className={styles.subtitle}>Has recibido una invitación para unirte</p>
        <p className={styles.email}>{email}</p>

        <button
          className={styles.button}
          onClick={onAccept}
        >
          Aceptar invitación
        </button>
      </div>
    </div>
  );
}

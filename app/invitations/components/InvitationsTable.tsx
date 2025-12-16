"use client";

import { Invitation } from "../types";
import styles from "@/styles/invitations/invitations.module.scss";

interface Props {
  invitations: Invitation[];
  onResend: (id: string) => void;
  onCancel: (id: string) => void;
  loadingId?: string | null;
}

export default function InvitationsTable({
  invitations,
  onResend,
  onCancel,
  loadingId,
}: Props) {
  if (invitations.length === 0) {
    return <p className={styles.empty}>No hay invitaciones pendientes</p>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Email</th>
          <th>Fecha de invitación</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {invitations.map(inv => {
          const isLoading = loadingId === inv.id;

          return (
            <tr key={inv.id}>
              <td>{inv.email}</td>
              <td>{inv.invitedAt}</td>
              <td>
                <div className={styles.actions}>
                  <button
                    className={styles.actionButton}
                    disabled={isLoading}
                    onClick={() => onResend(inv.id)}
                  >
                    {isLoading ? "Reenviando…" : "Reenviar"}
                  </button>

                  <button
                    className={styles.actionButton}
                    disabled={isLoading}
                    onClick={() => onCancel(inv.id)}
                  >
                    Cancelar
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

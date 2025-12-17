"use client";

import { useState } from "react";
import InviteForm from "./components/InviteForm";
import InvitationsTable from "./components/InvitationsTable";
import styles from "@/styles/invitations/invitations.module.scss";
import { useAppContext } from "@/context/AppContext";

export default function InvitationsPage() {
  const { invitations, cancelInvitation } = useAppContext();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleResend = async (id: string) => {
    setLoadingId(id);

    try {
      console.log("Reenviando invitación:", id);
      await new Promise(r => setTimeout(r, 800));
    } finally {
      setLoadingId(null);
    }
  };

  const handleCancel = async (id: string) => {
    setLoadingId(id);

    try {
      console.log("Cancelando invitación:", id);
      await new Promise(r => setTimeout(r, 500));
      cancelInvitation(id);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Invitaciones</h1>
      </div>

      <InviteForm />

      <InvitationsTable
        invitations={invitations}
        onResend={handleResend}
        onCancel={handleCancel}
        loadingId={loadingId}
      />
    </div>
  );
}

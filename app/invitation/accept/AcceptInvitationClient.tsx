"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { invitationService } from "@/services/invitation.service";
import InvitationStatus from "./InvitationStatus";
import { InvitationStatus as Status } from "./types";
import { useAppContext } from "@/context/AppContext";

export default function AcceptInvitationClient() {
  const params = useSearchParams();
  const code = params.get("code");
  const email = params.get("email");

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  const { acceptInvitation } = useAppContext();

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      if (!code || !email) {
        if (!cancelled) {
          setStatus("invalid");
          setMessage("Invitación inválida o incompleta");
        }
        return;
      }

      try {
        const result = await invitationService.verify(code, email);

        if (cancelled) return;

        if (!result.codeIsValid) {
          setStatus("invalid");
          setMessage(result.message);
        } else if (result.alreadyAccepted) {
          setStatus("accepted");
        } else {
          setStatus("valid");
        }
      } catch {
        if (!cancelled) {
          setStatus("invalid");
          setMessage("Error al verificar la invitación");
        }
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [code, email]);

  const handleAcceptInvitation = async () => {
    if (!code || !email) return;

    window.location.href = "/dashboard"
    await invitationService.accept(code);
    acceptInvitation(email);
    setStatus("accepted");
    
  };

  return (
    <InvitationStatus
      status={status}
      email={email ?? undefined}
      message={message}
      onAccept={handleAcceptInvitation}
    />
  );
}

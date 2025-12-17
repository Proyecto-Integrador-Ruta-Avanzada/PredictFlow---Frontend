import { Suspense } from "react";
import AcceptInvitationClient from "./AcceptInvitationClient";
import InvitationStatus from "./InvitationStatus";

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <AcceptInvitationClient />
    </Suspense>
  );
}

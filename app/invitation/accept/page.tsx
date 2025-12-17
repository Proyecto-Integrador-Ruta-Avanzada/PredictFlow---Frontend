import { Suspense } from "react";
import AcceptInvitationClient from "./AcceptInvitationClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <AcceptInvitationClient />
    </Suspense>
  );
}

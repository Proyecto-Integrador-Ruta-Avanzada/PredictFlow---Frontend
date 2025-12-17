import { redirect } from "next/navigation";

export default function TeamRootPage({ params }: { params: { teamId: string } }) {
  // The canonical entry for a team should be its projects list.
  // This also prevents confusing UX where /teams/:teamId showed a different
  // "Crear proyecto" screen than /teams/:teamId/projects/new.
  redirect(`/teams/${params.teamId}/projects`);
}

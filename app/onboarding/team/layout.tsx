"use client";

import { useTeams } from "@/context/TeamsProdiver";
import TeamSidebar from "@/components/teams/TeamSidebar";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  // IMPORTANT:
  // Do NOT mount another TeamsProvider here.
  // RootLayout already wraps the entire app in TeamsProvider, and
  // mounting a second provider creates a separate state "island".
  // That was causing teams created in onboarding to disappear
  // when navigating to /teams/* routes.
  return <LayoutInner>{children}</LayoutInner>;
}

function LayoutInner({ children }: { children: React.ReactNode }) {
  const { teams } = useTeams();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <TeamSidebar teams={teams} />
      <main style={{ flex: 1, padding: 40 }}>{children}</main>
    </div>
  );
}

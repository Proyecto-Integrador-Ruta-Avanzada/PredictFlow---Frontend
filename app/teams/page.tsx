"use client";

import Link from "next/link";
import { useTeams } from "@/context/TeamsProdiver";

export default function TeamsPage() {
  const { teams } = useTeams();

  return (
    <div style={{ maxWidth: 720, margin: "60px auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Mis equipos</h1>

      {teams.length === 0 ? (
        <p style={{ marginTop: 16, opacity: 0.8 }}>
          Aún no tienes equipos. Crea uno en <Link href="/onboarding/team">/onboarding/team</Link>.
        </p>
      ) : (
        <ul style={{ marginTop: 16, display: "grid", gap: 10, padding: 0, listStyle: "none" }}>
          {teams.map((t) => (
            <li key={t.id} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{t.name}</div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>{t.id}</div>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <Link href={`/teams/${t.id}/projects`} style={{ textDecoration: "underline" }}>
                    Ver proyectos
                  </Link>
                  <Link href={`/teams/${t.id}/projects/new`} style={{ textDecoration: "underline" }}>
                    Crear proyecto
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

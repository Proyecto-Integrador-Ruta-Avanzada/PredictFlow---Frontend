"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import styles from "@/styles/members/memberTable.module.scss";

type Params = {
  teamId?: string;
  id?: string;
};

type Member = {
  id: string;
  name: string;
  email: string;
  role: string;
  projects: number;
  workload: string;
  performance: string;
};

export default function MembersPage() {
  const params = useParams<Params>();
  const teamId = params.teamId ?? "";
  const projectId = params.id ?? "";

  // ✅ Mock temporal (front only). Luego lo conectas al backend sin cambiar UI.
  const members = useMemo<Member[]>(
    () => [
      {
        id: "m1",
        name: "Sneider",
        email: "sneider@email.com",
        role: "Admin",
        projects: 1,
        workload: "Alta",
        performance: "Excelente",
      },
      {
        id: "m2",
        name: "Carlos Gómez",
        email: "carlos@email.com",
        role: "Developer",
        projects: 1,
        workload: "Media",
        performance: "Buena",
      },
      {
        id: "m3",
        name: "Laura Pérez",
        email: "laura@email.com",
        role: "QA",
        projects: 1,
        workload: "Baja",
        performance: "Buena",
      },
    ],
    []
  );

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Miembros</h1>

      <div style={{ marginBottom: 14, opacity: 0.8, fontSize: 12 }}>
        Team: <b>{teamId || "-"}</b> · Proyecto: <b>{projectId || "-"}</b>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Proyectos</th>
              <th>Carga actual</th>
              <th>Rendimiento estimado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.email}</td>
                <td>{m.role}</td>
                <td>{m.projects}</td>
                <td>{m.workload}</td>
                <td>{m.performance}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      style={buttonStyle()}
                      onClick={() => alert(`Ver perfil: ${m.name}`)}
                    >
                      Ver
                    </button>
                    <button
                      style={buttonStyle("danger")}
                      onClick={() => alert(`Eliminar: ${m.name}`)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Mantengo estos botones inline para no obligarte a crear otro SCSS.
 * Si quieres, los paso a SCSS también.
 */
function buttonStyle(variant: "default" | "danger" = "default"): React.CSSProperties {
  const base: React.CSSProperties = {
    borderRadius: 10,
    padding: "8px 10px",
    fontSize: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.90)",
    cursor: "pointer",
  };

  if (variant === "danger") {
    return {
      ...base,
      border: "1px solid rgba(255,90,90,0.25)",
      background: "rgba(255,90,90,0.10)",
    };
  }

  return base;
}

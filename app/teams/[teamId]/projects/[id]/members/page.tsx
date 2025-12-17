"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "@/styles/members/memberTable.module.scss";
import api from "@/lib/api";

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

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!teamId) {
        setMembers([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await api.get(`/api/Team/${teamId}/members`);
        const list = Array.isArray(res.data) ? res.data : res.data?.items ?? [];

        const mapped: Member[] = list.map((m: any) => ({
          id: String(m?.id ?? m?.userId ?? m?._id ?? ""),
          name: String(m?.name ?? m?.fullName ?? m?.email ?? ""),
          email: String(m?.email ?? ""),
          role: String(m?.role ?? m?.teamRole ?? "Member"),
          projects: Number(m?.projectsCount ?? m?.projects?.length ?? 0) || 0,
          workload: String(m?.workload ?? "—"),
          performance: String(m?.performance ?? "—"),
        }));

        if (!cancelled) setMembers(mapped);
      } catch {
        if (!cancelled) setMembers([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [teamId]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Miembros</h1>

      <div style={{ marginBottom: 14, opacity: 0.8, fontSize: 12 }}>
        Team: <b>{teamId || "-"}</b> · Proyecto: <b>{projectId || "-"}</b>
      </div>

      <div className={styles.tableWrap}>
        {loading ? (
          <div style={{ opacity: 0.8 }}>Cargando miembros…</div>
        ) : null}
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

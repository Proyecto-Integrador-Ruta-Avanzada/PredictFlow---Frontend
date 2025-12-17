"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import styles from "@/styles/projectSidebar.module.scss";

type Params = {
  teamId?: string;
  id?: string;
};

export default function Sidebar() {
  const params = useParams<Params>();
  const pathname = usePathname();

  const teamId = params.teamId ?? "";
  const projectId = params.id ?? "";

  const base =
    teamId && projectId ? `/teams/${teamId}/projects/${projectId}` : "";

  const links = [
    { label: "Tablero", href: `${base}/kanban` },
    { label: "Sprint", href: `${base}/sprint` },
    { label: "Miembros", href: `${base}/members` },

    { label: "Invitar miembro", href: `${base}/invitations` },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandTitle}>Proyecto</div>
        <div className={styles.brandMeta}>
          Team: <b>{teamId || "-"}</b> · Project: <b>{projectId || "-"}</b>
        </div>
      </div>

      <nav className={styles.nav}>
        {links.map((l) => {
          const isActive = l.href && pathname?.startsWith(l.href);

          return (
            <Link
              key={l.label}
              href={l.href || "/"}
              className={`${styles.link} ${isActive ? styles.active : ""}`}
            >
              <span className={styles.icon}>•</span>
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className={styles.spacer} />

      <div className={styles.footer}>
        <div>PredictFlow</div>
        <div>Sidebar de proyecto</div>
      </div>
    </aside>
  );
}

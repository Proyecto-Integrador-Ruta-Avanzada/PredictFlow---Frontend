"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useTeams } from "@/context/TeamsProdiver";
import styles from "@/styles/teamSidebar.module.scss";

export default function TeamSidebar() {
  const params = useParams();
  const pathname = usePathname();
  let teamId = (params as any)?.teamId as string | string[] | undefined;
  if (Array.isArray(teamId)) teamId = teamId[0];

  const { teams } = useTeams();
  const activeTeam = teamId ? teams.find((t) => t.id === teamId) : undefined;

  const isActive = (href: string) => {
    if (!pathname) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>PredictFlow</div>

      <nav className={styles.nav}>
        <ul className={styles.list}>
          <li className={styles.item}>
            <Link className={isActive("/teams") ? styles.activeLink : styles.link} href="/teams">
              Mis equipos
            </Link>
          </li>
          {activeTeam ? (
            <>
              <li className={styles.section}>
                <div className={styles.sectionLabel}>Equipo</div>
                <div className={styles.sectionValue}>{activeTeam.name}</div>
              </li>

              <li className={styles.item}>
                <Link
                  className={
                    isActive(`/teams/${activeTeam.id}/projects`)
                      ? styles.activeLink
                      : styles.link
                  }
                  href={`/teams/${activeTeam.id}/projects`}
                >
                  Proyectos
                </Link>
              </li>
              <li className={styles.item}>
                <Link
                  className={
                    isActive(`/teams/${activeTeam.id}/projects/new`)
                      ? styles.activeLink
                      : styles.link
                  }
                  href={`/teams/${activeTeam.id}/projects/new`}
                >
                  Crear proyecto
                </Link>
              </li>
            </>
          ) : (
            <li className={styles.item}>
              <Link
                className={isActive("/onboarding/team") ? styles.activeLink : styles.link}
                href="/onboarding/team"
              >
                Crear equipo
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <div className={styles.footer}>v0.1 • Teams</div>
    </aside>
  );
}

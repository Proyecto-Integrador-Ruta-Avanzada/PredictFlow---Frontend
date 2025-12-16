"use client";
import styles from "@/styles/sidebar.module.scss";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>PredictFlow</div>
      <nav>
        <ul>
          <li><Link href="/dashboard">Inicio</Link></li>
          <li><Link href="/projects/1/kanban">Tablero</Link></li>
          <li><Link href="/projects">Proyectos</Link></li>
          <li><Link href="/members">Miembros</Link></li>
          <li><Link href="/invitations">Invitar Miembros</Link></li>
        </ul>
      </nav>
      <div className={styles.footer}>v0.1</div>
    </aside>
  );
}

"use client";

import styles from "@/styles/topbar.module.scss";

export default function Topbar() {
  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <input className={styles.search} placeholder="Buscar tareas, proyectos..." />
      </div>

      <div className={styles.right}>
      </div>
    </header>
  );
}

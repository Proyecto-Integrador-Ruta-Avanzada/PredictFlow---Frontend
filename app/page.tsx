import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/landing.module.scss";

export default function LandingPage() {
  return (
    <div className={styles.page}>
      {/* HEADER (se mantiene igual) */}
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logoWrapper}>
            <Image
              src="/Brand/PredictFlow-logo.png"
              alt="PredictFlow logo"
              width={42}
              height={42}
              priority
            />
          </div>

          <div className={styles.name}>
            <span>PredictFlow</span>
            <span className={styles.tagline}>Project execution with clarity</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <Link className={styles.navLink} href="/login">
            Iniciar sesión
          </Link>
          <Link className={styles.navCta} href="/register">
            Crear cuenta
          </Link>
        </nav>
      </header>

      <main className={styles.main}>
        {/* HERO */}
        <section className={styles.hero}>
          <p className={styles.kicker}>
            Gestión moderna para equipos que ejecutan
          </p>

          <h1 className={styles.title}>
            Convierte planes
            <br />
            en resultados reales.
          </h1>

          <p className={styles.subtitle}>
            PredictFlow ayuda a los equipos a trabajar con claridad, mantener foco
            y tomar mejores decisiones en cada proyecto. Menos fricción operativa,
            más ejecución consistente y visibilidad real del avance.
          </p>

          {/* CTA PRINCIPAL — ÚNICO */}
          <div className={styles.actions}>
            <Link className={styles.primaryBtn} href="/plans">
              Ver planes
            </Link>
          </div>
        </section>

        {/* BENEFICIOS */}
        <section className={styles.grid}>
          <article className={styles.card}>
            <h2>Claridad operativa</h2>
            <p>
              Alinea a todo el equipo con prioridades claras, responsabilidades
              visibles y una visión compartida del progreso del trabajo.
            </p>
          </article>

          <article className={styles.card}>
            <h2>Ejecución sin fricción</h2>
            <ul>
              <li>Flujos de trabajo simples y ordenados.</li>
              <li>Colaboración clara entre miembros del equipo.</li>
              <li>Seguimiento continuo del avance.</li>
              <li>Identificación temprana de bloqueos.</li>
            </ul>
          </article>

          <article className={styles.card}>
            <h2>Diseñado para crecer</h2>
            <p>
              PredictFlow se adapta a equipos pequeños y escala con organizaciones
              en crecimiento, manteniendo siempre una experiencia profesional y
              enfocada en resultados.
            </p>
          </article>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} PredictFlow</span>
        <span className={styles.dot}>•</span>
        <span>Build smarter. Execute better.</span>
      </footer>
    </div>
  );
}

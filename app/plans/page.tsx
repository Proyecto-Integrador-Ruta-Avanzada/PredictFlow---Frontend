import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/plans.module.scss";

const plans = [
  {
    name: "Starter",
    price: "Gratis",
    period: "",
    description:
      "Ideal para comenzar sin fricción, ordenar el trabajo y ganar claridad desde el primer día.",
    features: [
      "1 proyecto activo",
      "Tablero Kanban intuitivo",
      "Hasta 3 miembros",
      "Gestión básica de tareas",
      "Soporte comunitario",
    ],
    cta: { label: "Comenzar gratis", href: "/register" },
    highlighted: false,
    badge: "",
    note: "Perfecto para probar PredictFlow sin compromiso.",
  },
  {
    name: "Growth",
    price: "$8",
    period: "USD / mes",
    description:
      "Pensado para equipos en crecimiento que necesitan foco, control y ejecución constante.",
    features: [
      "Proyectos ilimitados",
      "Miembros ilimitados",
      "Gestión avanzada de invitaciones",
      "Priorización y riesgos",
      "Seguimiento del progreso del equipo",
      "Soporte estándar prioritario",
    ],
    cta: { label: "Elegir Growth", href: "/register" },
    highlighted: true,
    badge: "Más popular",
    note: "La mejor relación entre precio, control y escalabilidad.",
  },
  {
    name: "Enterprise",
    price: "Personalizado",
    period: "",
    description:
      "Para organizaciones que requieren gobernanza, personalización y acompañamiento estratégico.",
    features: [
      "Roles y permisos avanzados",
      "Integraciones personalizadas",
      "Soporte dedicado",
      "SLA y acuerdos empresariales",
      "Despliegue privado u on-premise",
    ],
    cta: { label: "Hablar con ventas", href: "/register" },
    highlighted: false,
    badge: "",
    note: "Diseñado para operaciones críticas y equipos grandes.",
  },
];

export default function PlansPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          <div className={styles.logoWrapper}>
            <Image
              src="/Brand/PredictFlow-logo.png"
              alt="PredictFlow logo"
              width={34}
              height={34}
              priority
            />
          </div>
          <span className={styles.brandName}>PredictFlow</span>
        </Link>

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
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <p className={styles.kicker}>Planes diseñados para equipos que ejecutan</p>
            <h1 className={styles.title}>
              Escala tu operación
              <br />
              con claridad y control.
            </h1>
            <p className={styles.subtitle}>
              Elige el plan que mejor se adapte a tu equipo y mantén una ejecución ordenada:
              foco, visibilidad y decisiones con contexto.
            </p>
          </div>

          <div className={styles.heroBack}>
            <Link className={styles.backBtn} href="/">
              ← Volver al inicio
            </Link>
          </div>
        </section>

        <section className={styles.grid}>
          {plans.map((p) => (
            <article
              key={p.name}
              className={`${styles.card} ${p.highlighted ? styles.highlighted : ""}`}
            >
              {p.badge ? <div className={styles.badge}>{p.badge}</div> : null}

              <div className={styles.cardTop}>
                <h2 className={styles.planName}>{p.name}</h2>

                <div className={styles.priceBlock}>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>{p.price}</span>
                  </div>
                  {p.period ? <span className={styles.period}>{p.period}</span> : null}
                </div>
              </div>

              <p className={styles.desc}>{p.description}</p>

              <ul className={styles.list}>
                {p.features.map((f) => (
                  <li key={f} className={styles.listItem}>
                    <span className={styles.check} aria-hidden>
                      ✓
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                className={`${styles.button} ${
                  p.highlighted ? styles.primary : styles.secondary
                }`}
                href={p.cta.href}
              >
                {p.cta.label}
              </Link>

              <p className={styles.note}>{p.note}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

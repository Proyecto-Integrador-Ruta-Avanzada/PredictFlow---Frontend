"use client";

import Link from "next/link";
import { useState } from "react";
import { toast, Zoom, Slide } from "react-toastify";
import { useRouter } from "next/navigation";
import styles from "@/styles/auth.module.scss";

type Team = {
  id: string;
  name?: string;
};

type LoginSuccessResponse = {
  token: string;
  user: {
    id: string;
    teams: Team[];
  };
};

type LoginErrorResponse = {
  message: string;
};

type LoginResponse = LoginSuccessResponse | LoginErrorResponse;

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://tu-backend.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok) {
        if ("message" in data) {
          toast.error(data.message, { transition: Zoom });
        } else {
          toast.error("Error al iniciar sesión", { transition: Zoom });
        }
        return;
      }

      if ("token" in data) {
        localStorage.setItem("token", data.token);

        toast.success("Sesión iniciada correctamente", {
          transition: Slide,
        });

        setTimeout(() => {
          const teams = data.user.teams;

          if (teams.length === 0) {
            router.replace("/onboarding/team");
          } else {
            router.replace(`/teams/${teams[0].id}`);
          }
        }, 600);
      }
    } catch {
      toast.error("Error de conexión", {
        transition: Zoom,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Iniciar sesión</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            className={styles.input}
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className={styles.linksContainer}>
          <p className={styles.linkText}>
            ¿No tienes cuenta? <Link href="/register">Regístrate</Link>
          </p>
          <p className={styles.linkTextPassword}>
            ¿Olvidaste tu contraseña?{" "}
            <Link href="/forgot-password">Recupérala</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { toast, Zoom, Slide } from "react-toastify";
import { useRouter } from "next/navigation";
import styles from "@/styles/auth.module.scss";
import { authService } from "@/services/auth.service";

type LoginErrorResponse = {
  message: string;
};

type LoginResponse = any | LoginErrorResponse;

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
    if (loading) return;

    setLoading(true);

    try {
      const data = (await authService.login(form.email, form.password)) as LoginResponse;

      const token =
        data?.token ||
        data?.accessToken ||
        data?.jwt ||
        data?.data?.token ||
        data?.data?.accessToken;

      if (!token) {
        toast.error(data?.message || "No se recibió token del servidor", {
          transition: Zoom,
        });
        return;
      }

      localStorage.setItem("token", token);

      toast.success("Sesión iniciada correctamente", {
        transition: Slide,
      });

      setTimeout(() => {
        router.replace("/onboarding/team");
      }, 600);
    } catch (error: any) {
      const backendMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;

      toast.error(backendMsg || "Error de conexión", {
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

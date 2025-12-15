"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, Slide, Zoom } from "react-toastify";
import styles from "@/styles/auth.module.scss";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
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
      // Cambiar esta URL por el backend real
      const res = await fetch("https://tu-backend.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Error al registrarse", {
          transition: Zoom,
        });
        setLoading(false);
        return;
      }

      toast.success("Cuenta creada correctamente", {
        transition: Slide,
      });

      setTimeout(() => {
        router.replace("/login");
      }, 800);

    } catch (error) {
      toast.error("Ocurrió un error inesperado", {
        transition: Zoom,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Crear cuenta</h1>
        <p className={styles.subtitle}>
          Regístrate para acceder a PredictFlow
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Nombre completo"
            value={form.name}
            onChange={handleChange}
            className={styles.input}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className={styles.input}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className={styles.input}
            required
          />

          <button type="submit" className={styles.buttonRegister} disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        <p className={styles.linkText}>
          ¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link>
        </p>
        </form>
      </div>
    </div>
  );
}

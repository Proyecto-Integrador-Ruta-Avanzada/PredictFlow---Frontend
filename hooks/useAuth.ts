import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState<any>(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    }
    return null;
  });

  const login = (token: string, userData?: any) => {
    localStorage.setItem("token", token);
    if (userData) localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData || null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    if (typeof window !== "undefined") window.location.href = "/login";
  };

  return { user, login, logout };
}

"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { authService } from "@/services/auth.service";

const isUuid = (v: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

export type Team = {
  id: string;
  name: string;
};

export type Project = {
  id: string;
  teamId: string;
  name: string;
  description?: string;
};

interface TeamsContextType {
  teams: Team[];
  projects: Project[];
  isLoading: boolean;
  refresh: () => Promise<void>;
  loadProjects: (teamId: string) => Promise<void>;
  createTeam: (name: string) => Promise<Team>;
  createProject: (teamId: string, name: string) => Promise<Project>;
}

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

function normalizeTeam(t: any): Team {
  return {
    id: String(t?.id ?? t?.teamId ?? t?._id ?? ""),
    name: String(t?.name ?? t?.teamName ?? "Equipo"),
  };
}

function normalizeProject(p: any, fallbackTeamId?: string): Project {
  return {
    id: String(p?.id ?? p?.projectId ?? p?._id ?? ""),
    teamId: String(p?.teamId ?? fallbackTeamId ?? ""),
    name: String(p?.name ?? p?.projectName ?? "Proyecto"),
    description: p?.description ?? p?.goal ?? undefined,
  };
}

export function TeamsProvider({ children }: { children: React.ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    setIsLoading(true);
    try {
      const me = await authService.me();
      const userId = me?.id ?? me?.userId ?? me?.data?.id;

      // 1) Si vienen embebidos en /me, úsalos
      const embeddedTeams = me?.teams ?? me?.user?.teams ?? [];
      if (Array.isArray(embeddedTeams) && embeddedTeams.length > 0) {
        setTeams(embeddedTeams.map(normalizeTeam));
        return; // ✅ el finally igual corre
      }

      // 2) Si no vienen embebidos, consulta por userId
      if (userId) {
        const res = await api.get(`/api/Team/user/${userId}`);
        const list = Array.isArray(res.data) ? res.data : res.data?.items ?? [];
        setTeams(list.map(normalizeTeam));
      } else {
        setTeams([]);
      }
    } catch {
      setTeams([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProjects = async (teamId: string) => {
    try {
      const res = await api.get(`/api/Project/team/${teamId}`);
      const list = Array.isArray(res.data) ? res.data : res.data?.items ?? [];
      const normalized = list.map((p: any) => normalizeProject(p, teamId));
      setProjects((prev) => {
        const others = prev.filter((p) => p.teamId !== teamId);
        return [...others, ...normalized];
      });
    } catch {
      // no rompemos UI
    }
  };

  const fetchTeamsByUser = async (): Promise<Team[]> => {
    const me = await authService.me();
    const userId = me?.id ?? me?.userId ?? me?.data?.id;
    if (!userId) return [];

    const res = await api.get(`/api/Team/user/${userId}`);
    const list = Array.isArray(res.data) ? res.data : res.data?.items ?? [];
    return list.map(normalizeTeam);
  };

  const createTeam = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("El nombre del equipo es obligatorio");

    await api.post("/api/Team", { name: trimmed });

    // ✅ traer lista real y usarla
    let normalized = await fetchTeamsByUser();

    // Si por consistencia eventual aún no aparece, reintenta 1 vez
    if (!normalized.some((t) => t.name === trimmed)) {
      await new Promise((r) => setTimeout(r, 250));
      normalized = await fetchTeamsByUser();
    }

    setTeams(normalized);

    const created = [...normalized].reverse().find((t) => t.name === trimmed);
    if (!created?.id) throw new Error("No pude obtener el equipo creado desde el servidor");

    return created;
  };

  const createProject = async (teamId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("El nombre del proyecto es obligatorio");
    if (!isUuid(teamId)) throw new Error(`teamId inválido (no es UUID): ${teamId}`);

    // ✅ Backend exige description no vacío
    const description = "Sin descripción";

    const res = await api.post("/api/Project", {
      teamId,
      name: trimmed,
      description,
    });

    const created = normalizeProject(
      res.data ?? { id: crypto.randomUUID(), teamId, name: trimmed, description },
      teamId
    );

    setProjects((prev) => {
      const exists = prev.some((p) => p.id === created.id);
      return exists ? prev : [...prev, created];
    });

    return created;
  };

  useEffect(() => {
    refresh();
  }, []);

  const value: TeamsContextType = useMemo(
    () => ({ teams, projects, isLoading, refresh, loadProjects, createTeam, createProject }),
    [teams, projects, isLoading]
  );

  return <TeamsContext.Provider value={value}>{children}</TeamsContext.Provider>;
}

export function useTeams(): TeamsContextType {
  const context = useContext(TeamsContext);
  if (!context) throw new Error("useTeams must be used within a TeamsProvider");
  return context;
}

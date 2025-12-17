"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { authService } from "@/services/auth.service";

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
      // Preferimos /profile/me (usa el token del interceptor).
      const me = await authService.me();
      const userId = me?.id ?? me?.userId ?? me?.data?.id;

      // Algunos backends devuelven teams embebidos en /me
      const embeddedTeams = me?.teams ?? me?.user?.teams ?? [];
      if (Array.isArray(embeddedTeams) && embeddedTeams.length > 0) {
        setTeams(embeddedTeams.map(normalizeTeam));
        return;
      }

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
      // si falla, no rompemos UI
    }
  };

  const createTeam = async (name: string) => {
    const res = await api.post("/api/Team", { name });
    const created = normalizeTeam(res.data ?? { id: crypto.randomUUID(), name });
    setTeams((prev) => {
      const exists = prev.some((t) => t.id === created.id);
      return exists ? prev : [...prev, created];
    });
    return created;
  };

  const createProject = async (teamId: string, name: string) => {
    // Swagger: POST /api/Project (ProjectRequestDto)
    const res = await api.post("/api/Project", {
      teamId,
      name,
      description: "",
    });
    const created = normalizeProject(res.data ?? { id: crypto.randomUUID(), teamId, name }, teamId);
    setProjects((prev) => {
      const exists = prev.some((p) => p.id === created.id);
      return exists ? prev : [...prev, created];
    });
    return created;
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

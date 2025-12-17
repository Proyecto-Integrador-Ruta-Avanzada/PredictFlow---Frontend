"use client";

import * as React from "react";
import { createContext, useContext, useState, ReactNode } from "react";

export type Team = {
  id: string;
  name: string;
};

export type Project = {
  id: string;
  teamId: string;
  name: string;
};

interface TeamsContextType {
  teams: Team[];
  projects: Project[];
  createTeam: (name: string) => Team;
  createProject: (teamId: string, name: string) => Project;
}

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

interface TeamsProviderProps {
  children: ReactNode;
}

export function TeamsProvider({ children }: TeamsProviderProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const createTeam = (name: string) => {
    const newTeam: Team = { id: crypto.randomUUID(), name };
    setTeams((prev) => [...prev, newTeam]);
    return newTeam;
  };

  const createProject = (teamId: string, name: string) => {
    const newProject: Project = { id: crypto.randomUUID(), teamId, name };
    setProjects((prev) => [...prev, newProject]);
    return newProject;
  };

  return (
    <TeamsContext.Provider
      value={{ teams, projects, createTeam, createProject }}
    >
      {children}
    </TeamsContext.Provider>
  );
}

export function useTeams(): TeamsContextType {
  const context = useContext(TeamsContext);
  if (!context) throw new Error("useTeams must be used within a TeamsProvider");
  return context;
}

"use client";

import { useState } from "react";

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: "active" | "inactive";
}

const USE_API = false;

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "PredictFlow",
      description: "Plataforma predictiva",
      status: "active",
    },
    {
      id: "2",
      name: "Computadora",
      description: "nueva computadora",
      status: "active",
    },
  ]);

  const createProject = async (data: Omit<Project, "id">) => {
    if (!USE_API) {
      setProjects((prev: Project[]) => [
        ...prev,
        { ...data, id: crypto.randomUUID() },
      ]);
      return;
    }

    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const updateProject = async (
    id: string,
    data: Partial<Project>
  ) => {
    if (!USE_API) {
      setProjects((prev: Project[]) =>
        prev.map((p) => (p.id === id ? { ...p, ...data } : p))
      );
      return;
    }

    await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const deleteProject = async (id: string) => {
    if (!USE_API) {
      setProjects((prev: Project[]) =>
        prev.filter((p) => p.id !== id)
      );
      return;
    }

    await fetch(`/api/projects/${id}`, {
      method: "DELETE",
    });
  };

  return {
    projects,
    createProject,
    updateProject,
    deleteProject,
  };
}

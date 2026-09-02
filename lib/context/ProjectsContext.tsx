"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CurrencyCode } from "../calculations/currency";

export type CalculatorType = "wall" | "ceiling" | "paint" | "cost";

export interface SavedProject {
  id: string;
  name: string;
  date: string; // ISO string
  calculatorType: CalculatorType;
  dimensionsSummary?: string;
  area?: number;
  areaUnit?: string;
  paintQuantity?: number;
  paintUnit?: string;
  totalCost?: number;
  currency?: CurrencyCode;
  materials?: Array<{ name: string; quantity: number; unitPrice: number }>;
  notes?: string;
  rawInputs?: Record<string, any>;
}

export interface ProjectsContextType {
  projects: SavedProject[];
  saveProject: (data: Omit<SavedProject, "id" | "date">) => SavedProject;
  updateProject: (id: string, updates: Partial<SavedProject>) => void;
  duplicateProject: (id: string) => SavedProject | null;
  deleteProject: (id: string) => void;
  getProject: (id: string) => SavedProject | undefined;
}

const ProjectsContext = createContext<ProjectsContextType>({
  projects: [],
  saveProject: () => ({} as SavedProject),
  updateProject: () => {},
  duplicateProject: () => null,
  deleteProject: () => {},
  getProject: () => undefined,
});

const STORAGE_KEY = "paint_calc_projects";

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setProjects(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Error reading projects from localStorage", e);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.warn("Error saving projects to localStorage", e);
    }
  }, [projects, isMounted]);

  const saveProject = (data: Omit<SavedProject, "id" | "date">): SavedProject => {
    const newProject: SavedProject = {
      ...data,
      id: "proj_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      date: new Date().toISOString(),
    };
    setProjects((prev) => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<SavedProject>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const duplicateProject = (id: string): SavedProject | null => {
    const orig = projects.find((p) => p.id === id);
    if (!orig) return null;
    const duplicated: SavedProject = {
      ...orig,
      id: "proj_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      name: `${orig.name} (Copy)`,
      date: new Date().toISOString(),
    };
    setProjects((prev) => [duplicated, ...prev]);
    return duplicated;
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const getProject = (id: string) => {
    return projects.find((p) => p.id === id);
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        saveProject,
        updateProject,
        duplicateProject,
        deleteProject,
        getProject,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  return useContext(ProjectsContext);
}

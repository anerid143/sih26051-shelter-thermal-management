import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThermalProject } from '../types';
import {
  DEFAULT_HIMALAYAN_PROJECT,
  INITIAL_PROJECTS_LIST,
  generateThermalData,
  getStationId,
  loadStoredProjects,
  saveStoredProjects,
  loadStoredActiveId,
  saveStoredActiveId,
} from '../utils/projectHelpers';
import { checkBackendHealth } from '../services/backendApi';

export interface CreateProjectInput {
  name: string;
  location?: string;
  elevation?: number;
  iteration?: string;
  meshEngine?: string;
  status?: 'Validated' | 'Draft';
}

interface ProjectsContextType {
  projects: ThermalProject[];
  activeProject: ThermalProject;
  activeProjectId: string;
  selectProject: (projectId: string) => void;
  createProject: (input: CreateProjectInput) => ThermalProject;
  updateActiveProjectIteration: (iteration: string) => void;
  backendConnected: boolean;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Initialize projects from localStorage with fallback to default projects
  const [projects, setProjects] = useState<ThermalProject[]>(() => {
    const stored = loadStoredProjects();
    return stored.length > 0 ? stored : INITIAL_PROJECTS_LIST;
  });

  // 2. Initialize active project ID from localStorage with fallback
  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    const storedId = loadStoredActiveId();
    if (storedId) {
      const exists = loadStoredProjects().some((p) => p.id === storedId);
      if (exists) return storedId;
    }
    return DEFAULT_HIMALAYAN_PROJECT.id;
  });

  const [backendConnected, setBackendConnected] = useState<boolean>(true);

  // Background health check to Render backend without blocking
  useEffect(() => {
    let isMounted = true;
    checkBackendHealth().then((res) => {
      if (isMounted) {
        setBackendConnected(res.isHealthy);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Save projects to localStorage whenever projects state updates
  useEffect(() => {
    saveStoredProjects(projects);
  }, [projects]);

  // Save active project ID to localStorage whenever it changes
  useEffect(() => {
    saveStoredActiveId(activeProjectId);
  }, [activeProjectId]);

  // Determine active project object
  const activeProject =
    projects.find((p) => p.id === activeProjectId) ||
    projects[0] ||
    DEFAULT_HIMALAYAN_PROJECT;

  // Handler to select an active project
  const selectProject = (projectId: string) => {
    const exists = projects.some((p) => p.id === projectId);
    if (exists) {
      setActiveProjectId(projectId);
      saveStoredActiveId(projectId);
    }
  };

  // Handler to create a new project with its own unique telemetry data
  const createProject = (input: CreateProjectInput): ThermalProject => {
    const trimmedName = input.name.trim();
    const elevation = input.elevation !== undefined && !isNaN(input.elevation) ? input.elevation : 3100;
    const location = input.location?.trim() || 'High-Altitude Alpine Sector';
    const iteration = input.iteration?.trim() || 'Iteration v1.0 [Passive Solar Baseline]';
    const meshEngine = input.meshEngine?.trim() || '1D Transient Thermal Network';
    const status = input.status || 'Draft';

    // Unique project ID
    const uniqueId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const designCode = 'SIH26051';

    // Generate controlled, realistic, project-specific thermal data
    const thermalData = generateThermalData(trimmedName, elevation);

    const newProject: ThermalProject = {
      id: uniqueId,
      name: trimmedName,
      location,
      elevation,
      altitudeMeters: elevation,
      iteration,
      meshEngine,
      solverMesh: meshEngine,
      status,
      createdAt: new Date().toISOString().split('T')[0],
      lastRun: 'Just now',
      designCode,
      stationId: getStationId({ location, elevation }),
      latitude: '34.2000° N, 77.2000° E',
      data: thermalData,
    };

    setProjects((prev) => {
      const updated = [newProject, ...prev];
      saveStoredProjects(updated);
      return updated;
    });

    // Make the new project active
    setActiveProjectId(newProject.id);
    saveStoredActiveId(newProject.id);

    return newProject;
  };

  const updateActiveProjectIteration = (iteration: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProjectId
          ? { ...p, iteration }
          : p
      )
    );
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        activeProject,
        activeProjectId,
        selectProject,
        createProject,
        updateActiveProjectIteration,
        backendConnected,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = (): ProjectsContextType => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};

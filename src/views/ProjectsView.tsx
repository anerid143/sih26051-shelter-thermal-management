import React, { useState } from 'react';
import { ThermalProject } from '../types';

interface ProjectsViewProps {
  currentProject: ThermalProject;
  projects: ThermalProject[];
  onSelectProject: (proj: ThermalProject) => void;
  onCreateProject: (input: {
    name: string;
    location: string;
    elevation: number;
    iteration?: string;
    meshEngine?: string;
    status?: 'Validated' | 'Draft';
  }) => ThermalProject;
  onNavigateToOverview: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  currentProject,
  projects,
  onSelectProject,
  onCreateProject,
  onNavigateToOverview,
}) => {
  const [filter, setFilter] = useState<'all' | 'validated' | 'draft'>('all');
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newLocation, setNewLocation] = useState('Jammu, India');
  const [newElevation, setNewElevation] = useState<number>(2900);
  const [newIteration, setNewIteration] = useState('Iteration v1.0 [Passive Solar Baseline]');
  const [newMeshEngine, setNewMeshEngine] = useState('1D Transient Thermal Network');

  const filteredProjects = projects.filter((p) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'validated' && p.status === 'Validated') ||
      (filter === 'draft' && p.status === 'Draft');
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      (p.designCode && p.designCode.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const validatedCount = projects.filter((p) => p.status === 'Validated').length;
  const draftCount = projects.filter((p) => p.status === 'Draft').length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const created = onCreateProject({
      name: newProjectName.trim(),
      location: newLocation.trim() || 'Jammu, India',
      elevation: Number(newElevation) || 2900,
      iteration: newIteration.trim() || 'Iteration v1.0 [Passive Solar Baseline]',
      meshEngine: newMeshEngine.trim() || '1D Transient Thermal Network',
      status: 'Draft',
    });

    setIsCreating(false);
    setNewProjectName('');
    setNewLocation('Jammu, India');
    setNewElevation(2900);

    // Immediately select and switch to the new project's active session
    onSelectProject(created);
    onNavigateToOverview();
  };

  const handleActivateProject = (project: ThermalProject) => {
    onSelectProject(project);
    onNavigateToOverview();
  };

  return (
    <div className="p-4 flex flex-col gap-4 select-none pb-12">
      {/* Top Banner */}
      <div className="bg-surface-container-low p-4 rounded border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 font-label-data-sm text-[11px] text-secondary font-semibold uppercase">
            <span className="material-symbols-outlined text-[16px]">folder_open</span>
            <span>SIH26051 Habitat Projects Repository</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">High-Altitude Passive Shelter Projects</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Active thermal validation engineering files deployed across Eastern Ladakh, Siachen, and Himalayan sectors.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-3 py-1.5 rounded bg-primary text-white hover:bg-slate-800 transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add_circle</span>
          <span>New Thermal Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-2.5 rounded border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              filter === 'all' ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Sectors ({projects.length})
          </button>
          <button
            onClick={() => setFilter('validated')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              filter === 'validated'
                ? 'bg-white font-semibold text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Validated ({validatedCount})
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              filter === 'draft' ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Drafts ({draftCount})
          </button>
        </div>

        <div className="relative">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search sector, location or model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1 rounded border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-secondary w-64"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredProjects.map((p) => {
          const isCurrent = p.id === currentProject.id;
          return (
            <div
              key={p.id}
              className={`bg-white p-4 rounded border transition-all flex flex-col justify-between shadow-xs ${
                isCurrent ? 'border-secondary ring-1 ring-secondary/30' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-meta-caps text-[9px] text-secondary font-bold uppercase tracking-wider">
                      {p.designCode || 'SIH-HAB'}
                    </span>
                    {isCurrent && (
                      <span className="px-1.5 py-0.5 rounded bg-orange-100 text-secondary font-label-data-sm text-[10px] font-bold">
                        ACTIVE SESSION
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        p.status === 'Validated' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    ></span>
                    <span className="font-label-data-sm text-[10px] text-slate-600 font-medium">
                      {p.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-1">{p.name}</h3>
                <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[14px] text-slate-400">location_on</span>
                  <span>{p.location}</span>
                </p>

                {/* Telemetry Preview Badges */}
                <div className="mt-2.5 grid grid-cols-3 gap-1.5 font-label-data-sm text-[10px]">
                  <div className="bg-slate-50 p-1.5 rounded border border-slate-100 text-center">
                    <span className="text-slate-500 block text-[9px]">Indoor Operative</span>
                    <span className="font-bold text-slate-900">{p.data.indoorTemperature.toFixed(1)}°C</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded border border-slate-100 text-center">
                    <span className="text-slate-500 block text-[9px]">Solar Gain</span>
                    <span className="font-bold text-secondary">{p.data.solarGain.toFixed(1)} kWh/d</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded border border-slate-100 text-center">
                    <span className="text-slate-500 block text-[9px]">Autonomy</span>
                    <span className="font-bold text-emerald-700">{p.data.thermalAutonomy.toFixed(1)}%</span>
                  </div>
                </div>

                <div className="mt-2.5 p-2 bg-slate-50 rounded border border-slate-100 flex flex-col gap-1 text-[11px] font-mono">
                  <div className="flex justify-between text-slate-700">
                    <span className="text-slate-500 font-sans">Active Iteration:</span>
                    <span className="font-semibold text-slate-900 truncate max-w-[200px]">{p.iteration}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span className="text-slate-500 font-sans">Elevation ASL:</span>
                    <span className="font-semibold">{p.elevation.toLocaleString()} m</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span className="text-slate-500 font-sans">Mesh Engine:</span>
                    <span className="truncate max-w-[180px]">{p.meshEngine || p.solverMesh}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">Run: {p.lastRun}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleActivateProject(p)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                      isCurrent
                        ? 'bg-secondary text-white hover:bg-orange-800 shadow-xs'
                        : 'bg-primary text-white hover:bg-slate-800 shadow-xs'
                    }`}
                  >
                    <span>Active Session</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Project Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded border border-slate-300 w-full max-w-md p-5 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[18px]">add_circle</span>
                <span>Create New High-Altitude Habitat Project</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-slate-400 hover:text-slate-700 text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-3 flex flex-col gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Project / Habitat Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Example or Mountain Shelter"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 focus:outline-none focus:border-secondary text-slate-900 font-medium"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Location / Sector</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jammu, India"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 focus:outline-none focus:border-secondary text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Elevation (m ASL)</label>
                  <input
                    type="number"
                    required
                    min="500"
                    max="8000"
                    placeholder="2900"
                    value={newElevation}
                    onChange={(e) => setNewElevation(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 focus:outline-none focus:border-secondary text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Iteration Baseline</label>
                <input
                  type="text"
                  value={newIteration}
                  onChange={(e) => setNewIteration(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 focus:outline-none focus:border-secondary text-slate-900 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Thermal Solver Mesh Engine</label>
                <select
                  value={newMeshEngine}
                  onChange={(e) => setNewMeshEngine(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 focus:outline-none focus:border-secondary text-slate-900 bg-white"
                >
                  <option value="1D Transient Thermal Network">1D Transient Thermal Network</option>
                  <option value="3D FEA Implicit Sol-Air Solver">3D FEA Implicit Sol-Air Solver</option>
                  <option value="TRNSYS Multi-Zone Coupled Mesh">TRNSYS Multi-Zone Coupled Mesh</option>
                </select>
              </div>

              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px] text-slate-600 flex items-start gap-1.5 mt-1">
                <span className="material-symbols-outlined text-[15px] text-secondary shrink-0 mt-0.5">info</span>
                <span>
                  Initializes deterministic, project-specific thermal baseline telemetry (Indoor: 16–22°C, Solar Gain: 30–55 kWh/d, Heat Loss: 25–45 kWh/d).
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 mt-1">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-primary text-white font-semibold hover:bg-slate-800 cursor-pointer shadow-xs"
                >
                  Initialize Project &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

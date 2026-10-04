import React, { useState } from 'react';
import { HOURLY_TIMESTEP_DATA } from '../data/mockData';
import { ThermalProject } from '../types';

interface SimulationViewProps {
  onTriggerQuickSim: () => void;
  currentProject: ThermalProject;
}

export const SimulationView: React.FC<SimulationViewProps> = ({ onTriggerQuickSim, currentProject }) => {
  const [activeNode, setActiveNode] = useState<number>(3); // Living habitat node
  const [selectedTimestep, setSelectedTimestep] = useState<'1h' | '15m'>('1h');

  const { data } = currentProject;

  const nodes = [
    {
      id: 1,
      name: 'Node 1: Sol-Air Ambient Boundary',
      temp: `${data.outdoorTemperature.toFixed(1)} °C`,
      role: 'External Forcing',
      color: '#0284c7',
    },
    {
      id: 2,
      name: 'Node 2: South Glaze Outer Cavity',
      temp: `${(data.outdoorTemperature + data.solarGain * 0.33).toFixed(1)} °C`,
      role: 'Aperture Boundary',
      color: '#f59e0b',
    },
    {
      id: 3,
      name: 'Node 3: Trombe Wall Core Storage',
      temp: `${(data.indoorTemperature + data.solarGain * 0.23).toFixed(1)} °C`,
      role: 'Sensible Mass Storage',
      color: '#ea580c',
    },
    {
      id: 4,
      name: 'Node 4: Main Habitat Living Air',
      temp: `${data.indoorTemperature.toFixed(1)} °C`,
      role: 'Indoor Operative',
      color: '#10b981',
    },
    {
      id: 5,
      name: 'Node 5: Sub-Floor Rock Bed Heat Sink',
      temp: `${(data.indoorTemperature - 1.6).toFixed(1)} °C`,
      role: 'Regenerative Foundation',
      color: '#6366f1',
    },
  ];

  return (
    <div className="p-4 flex flex-col gap-4 select-none pb-12">
      {/* Top Banner */}
      <div className="bg-surface-container-low p-4 rounded border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 font-label-data-sm text-[11px] text-secondary font-semibold uppercase">
            <span className="material-symbols-outlined text-[16px]">memory</span>
            <span>Finite Difference 1D-RC Thermal Mesh Solver • {currentProject.name}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Transient Multi-Node Thermal Network Simulation
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            {currentProject.location} • {currentProject.elevation.toLocaleString()}m ASL • Coupled {currentProject.meshEngine || currentProject.solverMesh}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white p-0.5 rounded border border-slate-200 text-xs shadow-xs font-mono">
            <button
              onClick={() => setSelectedTimestep('1h')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                selectedTimestep === '1h' ? 'bg-primary text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Δt = 1.0 h
            </button>
            <button
              onClick={() => setSelectedTimestep('15m')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                selectedTimestep === '15m' ? 'bg-primary text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Δt = 0.25 h
            </button>
          </div>
          <button
            onClick={onTriggerQuickSim}
            className="px-3.5 py-1.5 rounded bg-secondary text-white hover:bg-orange-800 transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">play_arrow</span>
            <span>Execute 168h Run</span>
          </button>
        </div>
      </div>

      {/* Network Nodes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {nodes.map((node) => {
          const isSelected = activeNode === node.id;
          return (
            <button
              key={node.id}
              onClick={() => setActiveNode(node.id)}
              className={`p-3 rounded text-left transition-all border flex flex-col justify-between shadow-xs cursor-pointer ${
                isSelected
                  ? 'bg-white border-secondary ring-1 ring-secondary/30'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <span className="text-[10px] text-slate-500 font-meta-caps uppercase">{node.role}</span>
                <h4 className="text-xs font-bold text-slate-900 mt-0.5 leading-snug">{node.name}</h4>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-lg font-bold font-mono" style={{ color: node.color }}>
                  {node.temp}
                </span>
                <span className="text-[10px] font-mono text-slate-400">Node #{node.id}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Node Thermal Response Graph */}
      <div className="bg-white p-4 rounded border border-slate-200 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px] text-secondary">monitoring</span>
            <h3 className="text-sm font-bold text-slate-900">
              Diurnal Timestep Node Temperature Progression ({currentProject.name})
            </h3>
          </div>
          <span className="font-label-data-sm text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
            Convergence Residual: 1.1 × 10⁻⁵
          </span>
        </div>

        {/* Chart */}
        <div className="w-full h-64 bg-slate-50 rounded border border-slate-200/60 p-3 relative flex flex-col justify-between">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 600 200">
            {/* Horizontal Grid lines */}
            <line stroke="#cbd5e1" strokeDasharray="3 3" x1="40" x2="570" y1="30" y2="30"></line>
            <line stroke="#cbd5e1" strokeDasharray="3 3" x1="40" x2="570" y1="80" y2="80"></line>
            <line stroke="#cbd5e1" strokeDasharray="3 3" x1="40" x2="570" y1="130" y2="130"></line>
            <line stroke="#cbd5e1" x1="40" x2="570" y1="180" y2="180"></line>

            {/* Ambient (Blue) */}
            <path
              d="M 40 170 C 120 180, 200 170, 320 120 C 440 110, 500 150, 570 170"
              fill="none"
              stroke="#0284c7"
              strokeWidth="2"
            ></path>

            {/* Trombe Wall Core (Orange) */}
            <path
              d="M 40 100 C 140 105, 260 70, 340 40 C 420 35, 500 60, 570 95"
              fill="none"
              stroke="#ea580c"
              strokeWidth="2.5"
            ></path>

            {/* Habitat Living Air (Green) */}
            <path
              d="M 40 75 C 140 78, 260 72, 340 55 C 420 50, 500 65, 570 73"
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
            ></path>

            {/* Heat Sink Gravel Bed (Purple) */}
            <path
              d="M 40 85 C 140 86, 260 84, 340 75 C 420 70, 500 78, 570 83"
              fill="none"
              stroke="#6366f1"
              strokeWidth="2"
              strokeDasharray="4 2"
            ></path>
          </svg>

          {/* Timestep axis */}
          <div className="flex justify-between text-[11px] font-mono text-slate-500 px-4">
            {HOURLY_TIMESTEP_DATA.map((d) => (
              <span key={d.hour}>{d.hour}</span>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 font-label-data-sm pt-1">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#10b981] rounded-full"></span>
              <span className="font-semibold text-slate-900">Habitat Indoor Air ({data.indoorTemperature.toFixed(1)}°C)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#ea580c] rounded-full"></span>
              <span>Trombe Wall Core</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#6366f1] rounded-full"></span>
              <span>Rock Bed Heat Sink</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#0284c7] rounded-full"></span>
              <span>Ambient Outdoor Air ({data.outdoorTemperature.toFixed(1)}°C)</span>
            </span>
          </div>
          <span className="text-slate-800 font-medium font-mono">Diurnal Phase Lag: 8.4 Hours</span>
        </div>
      </div>
    </div>
  );
};

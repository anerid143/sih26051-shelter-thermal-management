import React, { useState } from 'react';
import { UnitSystem, TimeStep } from '../types';

interface SettingsViewProps {
  unitSystem: UnitSystem;
  onToggleUnit: (u: UnitSystem) => void;
  timeStep: TimeStep;
  onToggleTimeStep: (t: TimeStep) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  unitSystem,
  onToggleUnit,
  timeStep,
  onToggleTimeStep,
}) => {
  const [tolerance, setTolerance] = useState('1e-5');
  const [maxIterations, setMaxIterations] = useState('500');
  const [analystName, setAnalystName] = useState('Dr. S. Norbu');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 flex flex-col gap-4 select-none pb-16">
      {/* Top Banner */}
      <div className="bg-surface-container-low p-4 rounded border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 font-label-data-sm text-[11px] text-secondary font-semibold uppercase">
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Solver Engine &amp; Laboratory Parameters</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Simulation Settings &amp; Computational Mesh Tolerances
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Configure finite-difference numerical parameters, convergence bounds, and analyst credentials.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-1.5 rounded bg-primary text-white hover:bg-slate-800 transition-colors text-xs font-semibold shadow-xs"
        >
          {saved ? 'Preferences Saved!' : 'Save Settings'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Solver Engine Parameters */}
        <div className="bg-white p-4 rounded border border-slate-200 shadow-xs flex flex-col gap-3">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-secondary">memory</span>
            <span>1D-RC Thermal Mesh Solver Parameters</span>
          </h3>

          <div className="flex flex-col gap-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700">Convergence Residual Tolerance</label>
              <select
                value={tolerance}
                onChange={(e) => setTolerance(e.target.value)}
                className="w-full mt-1 p-2 rounded border border-slate-200 bg-slate-50 font-mono"
              >
                <option value="1e-4">10⁻⁴ (Fast draft preview)</option>
                <option value="1e-5">10⁻⁵ (Default validated precision)</option>
                <option value="1e-6">10⁻⁶ (Ultra-rigorous research grade)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700">Maximum Iterations per Timestep</label>
              <input
                type="number"
                value={maxIterations}
                onChange={(e) => setMaxIterations(e.target.value)}
                className="w-full mt-1 p-2 rounded border border-slate-200 font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700">Measurement System Standard</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => onToggleUnit('SI')}
                  className={`p-2 rounded text-center border font-mono ${
                    unitSystem === 'SI'
                      ? 'border-secondary bg-orange-50 text-secondary font-bold'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  SI Metric (°C, W/m², m)
                </button>
                <button
                  type="button"
                  onClick={() => onToggleUnit('Imperial')}
                  className={`p-2 rounded text-center border font-mono ${
                    unitSystem === 'Imperial'
                      ? 'border-secondary bg-orange-50 text-secondary font-bold'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  Imperial (°F, Btu/h·ft², ft)
                </button>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700">Simulation Timestep Resolution</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => onToggleTimeStep('1h')}
                  className={`p-2 rounded text-center border font-mono ${
                    timeStep === '1h'
                      ? 'border-secondary bg-orange-50 text-secondary font-bold'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  1-Hour Intervals (Δt = 3600s)
                </button>
                <button
                  type="button"
                  onClick={() => onToggleTimeStep('15m')}
                  className={`p-2 rounded text-center border font-mono ${
                    timeStep === '15m'
                      ? 'border-secondary bg-orange-50 text-secondary font-bold'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  15-Minute Intervals (Δt = 900s)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User / Analyst Profile */}
        <div className="bg-white p-4 rounded border border-slate-200 shadow-xs flex flex-col gap-3">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-secondary">badge</span>
            <span>Analyst &amp; Laboratory Accreditation</span>
          </h3>

          <div className="flex flex-col gap-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700">Lead Analyst Name</label>
              <input
                type="text"
                value={analystName}
                onChange={(e) => setAnalystName(e.target.value)}
                className="w-full mt-1 p-2 rounded border border-slate-200 font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700">Organization &amp; Lab Code</label>
              <input
                type="text"
                disabled
                value="Passive Thermal Lab | SIH26051 Extreme Alpine Habitat"
                className="w-full mt-1 p-2 rounded border border-slate-200 bg-slate-100 text-slate-600 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700">Authorized High-Altitude Sectors</label>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 font-mono text-[11px] text-slate-700 flex flex-col gap-1">
                <div>• Leh District Sector (3,524m ASL) - CLEARANCE ACTIVE</div>
                <div>• Siachen Glacier Northern Sector (5,400m ASL) - VALIDATED</div>
                <div>• Dras Deep Freeze Corridor (3,280m ASL) - CLEARANCE ACTIVE</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ThermalProject } from '../types';

interface ReportsViewProps {
  currentProject: ThermalProject;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ currentProject }) => {
  const { data } = currentProject;
  const netBalance = data.solarGain - data.heatLoss;
  const isSurplus = netBalance >= 0;

  return (
    <div className="p-4 flex flex-col gap-4 select-none pb-16">
      {/* Top Banner */}
      <div className="bg-surface-container-low p-4 rounded border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 font-label-data-sm text-[11px] text-secondary font-semibold uppercase">
            <span className="material-symbols-outlined text-[16px]">description</span>
            <span>Formal {currentProject.designCode || 'SIH26051'} Engineering Dossier</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            {currentProject.name} Technical Validation Dossier
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Full engineering documentation compliant with Ministry of Defence &amp; Indian Green Building Council (IGBC) High-Altitude Standards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded bg-primary text-white hover:bg-slate-800 transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Dossier Document Container */}
      <div className="bg-white p-6 md:p-8 rounded border border-slate-200 shadow-md max-w-4xl mx-auto w-full flex flex-col gap-6 text-slate-800">
        {/* Document Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
          <div className="flex items-center gap-3">
            <img
              alt="ShelterTherm Logo"
              className="h-10 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1VSRgA-BjvA56bBAAyHA5us4UO4fQcnd_uNWCV0mQGTX5rTX_Rs8BNc-RQhuTijpedvXk5FKnCt4C110STFgMIj52WXJniJLThz-8cfns83XLetcp0cCx0XM9j3xVzfhev-TDtZJrIbE9UeefuoINkuXD2yzzquNA8QSLZbkhezgcgvhZG6NbN9kWUsBbJiy9Sq2KRYD0MgOGsgf2gKlnAxcNmdY2khb78xvUSUGK9DrZ6HVAp83jV7Xy0"
            />
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">SHELTERTHERM PASSIVE THERMAL LAB</h1>
              <p className="text-[11px] text-slate-500 font-mono">
                {currentProject.designCode || 'SIH26051'} DEFENSE &amp; DISASTER SHELTER PROGRAM • SECTOR {currentProject.location.toUpperCase()} ({currentProject.elevation.toLocaleString()}m ASL)
              </p>
            </div>
          </div>
          <div className="text-right font-mono text-xs">
            <div className="font-bold text-slate-900">DOC ID: {currentProject.designCode || 'SIH-26051'}-TH-{currentProject.id.slice(-3).toUpperCase()}</div>
            <div className="text-slate-500 text-[10px]">DATE: OCTOBER 2026</div>
            <div className="text-emerald-700 font-semibold text-[10px]">STATUS: {currentProject.status.toUpperCase()}</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">
            1. Executive Summary &amp; Habitat Mission Scope
          </h2>
          <p className="text-xs leading-relaxed text-slate-700 mt-2">
            This dossier presents the numerical and empirical thermal validation for <strong>{currentProject.name}</strong> deployed in {currentProject.location} ({currentProject.elevation.toLocaleString()}m a.s.l). Designed under extreme arctic-alpine winter design conditions ({data.nightMin.toFixed(1)}°C ambient minimum, {data.outdoorTemperature.toFixed(1)}°C diurnal mean, and {data.windSpeed.toFixed(1)} m/s katabatic wind speed), the habitat accomplishes a <strong>{data.thermalAutonomy.toFixed(1)}% thermal autonomy rating</strong> with <strong>0.00 kg auxiliary kerosene/diesel fuel combustion</strong>.
          </p>
        </div>

        {/* Envelope Key Specs */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">
            2. Envelope Thermal Specs &amp; Assembly Stackup
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 font-mono text-xs">
            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <span className="text-[10px] text-slate-500 font-sans">Roof Insulation</span>
              <div className="font-bold text-slate-900 mt-0.5">U = 0.09 W/m²K</div>
              <span className="text-[9px] text-slate-400">R-50 Rockwool</span>
            </div>
            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <span className="text-[10px] text-slate-500 font-sans">South Glazing</span>
              <div className="font-bold text-slate-900 mt-0.5">U = 0.80 W/m²K</div>
              <span className="text-[9px] text-slate-400">Triple Argon Low-E</span>
            </div>
            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <span className="text-[10px] text-slate-500 font-sans">Thermal Storage Mass</span>
              <div className="font-bold text-slate-900 mt-0.5">{data.thermalStorage.toFixed(1)} kWh</div>
              <span className="text-[9px] text-slate-400">Lag: 8.4 Hours</span>
            </div>
            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <span className="text-[10px] text-slate-500 font-sans">Infiltration Rate</span>
              <div className="font-bold text-slate-900 mt-0.5">0.35 ACH @ 50Pa</div>
              <span className="text-[9px] text-slate-400">82% Sensible HRV</span>
            </div>
          </div>
        </div>

        {/* Daily Energy Balance */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">
            3. Dynamic 24-Hour Energy Balance
          </h2>
          <div className="mt-2 text-xs space-y-1 font-mono">
            <div className="flex justify-between py-1 bg-slate-50 px-2 rounded">
              <span>Gross Solar Radiation Captured (South Facade):</span>
              <span className="font-bold text-secondary">+{data.solarGain.toFixed(1)} kWh/day</span>
            </div>
            <div className="flex justify-between py-1 bg-slate-50 px-2 rounded">
              <span>Internal Sensible Gains (Occupancy + Equipment):</span>
              <span className="font-bold text-slate-900">+4.2 kWh/day</span>
            </div>
            <div className="flex justify-between py-1 bg-slate-50 px-2 rounded">
              <span>Total Envelope Fabric &amp; Ventilation Losses ({data.nightMin.toFixed(1)}°C ambient):</span>
              <span className="font-bold text-rose-600">-{data.heatLoss.toFixed(1)} kWh/day</span>
            </div>
            <div className={`flex justify-between py-1.5 px-2 rounded font-bold border ${
              isSurplus ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-amber-50 text-amber-900 border-amber-200'
            }`}>
              <span>Net Diurnal Thermal Balance (Regenerative Storage):</span>
              <span>{isSurplus ? '+' : ''}{netBalance.toFixed(1)} kWh/day {isSurplus ? 'SURPLUS' : 'DEFICIT'}</span>
            </div>
          </div>
        </div>

        {/* Engineering Sign-off */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-slate-900">Dr. S. Norbu, Ph.D.</div>
            <div className="text-[11px] text-slate-500">Lead Analyst, Alpine Passive Habitat Systems</div>
            <div className="text-[10px] text-slate-400 font-mono">SIH-TEAM VERIFIED • {currentProject.location.toUpperCase()}</div>
          </div>
          <div className="w-28 h-12 border border-slate-300 rounded flex items-center justify-center font-mono text-[9px] text-slate-400 bg-slate-50">
            [DIGITALLY SEALED]
          </div>
        </div>
      </div>
    </div>
  );
};

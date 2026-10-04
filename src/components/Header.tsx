import React from 'react';
import { UnitSystem, TimeStep, ProjectInfo } from '../types';

interface HeaderProps {
  currentProject: ProjectInfo;
  unitSystem: UnitSystem;
  onToggleUnit: (unit: UnitSystem) => void;
  timeStep: TimeStep;
  onToggleTimeStep: (step: TimeStep) => void;
  onRunQuickSim: () => void;
  onExportReport: () => void;
  isSimulating?: boolean;
  isDrawerOpen: boolean;
  onToggleDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProject,
  unitSystem,
  onToggleUnit,
  timeStep,
  onToggleTimeStep,
  onRunQuickSim,
  onExportReport,
  isSimulating = false,
  isDrawerOpen,
  onToggleDrawer,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_8px_rgba(0,0,0,0.03)] z-40 flex items-center justify-between px-3 md:px-5 select-none">
      {/* Left Zone: Hamburger Menu + Brand + Breadcrumbs */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Menu / Hamburger Icon */}
        <button
          onClick={onToggleDrawer}
          aria-label={isDrawerOpen ? 'Close navigation drawer' : 'Open navigation drawer'}
          title="Toggle Navigation Menu"
          className="p-1.5 rounded text-slate-700 hover:text-slate-950 hover:bg-slate-100 active:bg-slate-200 transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
        >
          <span className="material-symbols-outlined text-[24px]">
            {isDrawerOpen ? 'menu_open' : 'menu'}
          </span>
        </button>

        {/* Brand Wordmark & Icon */}
        <div
          onClick={onToggleDrawer}
          className="flex items-center gap-2 pr-2 md:pr-3 border-r border-slate-200/80 cursor-pointer group"
          title="Click to open navigation drawer"
        >
          <img
            alt="ShelterTherm Logo"
            className="h-7 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform"
            src="https://lh3.googleusercontent.com/aida/AEtjO1VSRgA-BjvA56bBAAyHA5us4UO4fQcnd_uNWCV0mQGTX5rTX_Rs8BNc-RQhuTijpedvXk5FKnCt4C110STFgMIj52WXJniJLThz-8cfns83XLetcp0cCx0XM9j3xVzfhev-TDtZJrIbE9UeefuoINkuXD2yzzquNA8QSLZbkhezgcgvhZG6NbN9kWUsBbJiy9Sq2KRYD0MgOGsgf2gKlnAxcNmdY2khb78xvUSUGK9DrZ6HVAp83jV7Xy0"
          />
          <span className="font-headline-sm text-base text-slate-900 font-semibold tracking-tight hidden sm:inline group-hover:text-secondary transition-colors">
            ShelterTherm
          </span>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 font-label-data-sm text-[12px] truncate">
          <span
            onClick={() => onToggleDrawer()}
            className="text-slate-500 hover:text-slate-800 transition-colors cursor-pointer hidden md:inline"
          >
            Projects
          </span>
          <span className="text-slate-400 hidden md:inline">/</span>
          <span
            className="text-slate-700 font-medium truncate max-w-[180px] sm:max-w-[260px] md:max-w-[320px]"
            title={`${currentProject.name} (${currentProject.location}, ${(currentProject.elevation || currentProject.altitudeMeters || 3500).toLocaleString()}m)`}
          >
            {currentProject.name} ({currentProject.location.split(',')[0]}, {(currentProject.elevation || currentProject.altitudeMeters || 3500).toLocaleString()}m)
          </span>
          <span className="text-slate-400 hidden sm:inline">/</span>
          <span className="text-secondary font-semibold hidden sm:inline">Active Session</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Metric System Selector */}
        <button
          onClick={() => onToggleUnit(unitSystem === 'SI' ? 'Imperial' : 'SI')}
          className="hidden sm:flex items-center bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded border border-slate-300/80 transition-colors text-slate-800"
          title="Click to toggle between Metric and Imperial units"
        >
          <span className="material-symbols-outlined text-[16px] text-slate-500 mr-1.5">straighten</span>
          <span className="font-label-data-sm text-[11px] font-medium">
            {unitSystem === 'SI' ? 'SI Metric (°C, W/m², m)' : 'Imperial (°F, Btu/h·ft², ft)'}
          </span>
        </button>

        {/* Timestep selector */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-300/80 font-label-data-sm text-[11px]">
          <button
            onClick={() => onToggleTimeStep('1h')}
            className={`px-2 py-0.5 rounded font-medium transition-all ${
              timeStep === '1h'
                ? 'bg-white font-semibold text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1h
          </button>
          <button
            onClick={() => onToggleTimeStep('15m')}
            className={`px-2 py-0.5 rounded font-medium transition-all ${
              timeStep === '15m'
                ? 'bg-white font-semibold text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            15m
          </button>
        </div>

        {/* Validation Engine Status */}
        <div className="hidden lg:inline-flex items-center px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-label-data-sm text-[11px] border border-slate-200">
          <span
            className={`w-2 h-2 rounded-full mr-1.5 ${
              isSimulating ? 'bg-amber-500 animate-spin' : 'bg-secondary animate-pulse'
            }`}
          ></span>
          <span>Validated: TRNSYS Engine</span>
        </div>

        {/* Primary Action: Run Quick Sim */}
        <button
          onClick={onRunQuickSim}
          disabled={isSimulating}
          className="flex items-center px-2.5 md:px-3 py-1.5 rounded bg-primary text-white hover:bg-slate-800 transition-colors text-xs font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.15)] disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[16px] mr-1">
            {isSimulating ? 'hourglass_top' : 'play_arrow'}
          </span>
          <span className="hidden sm:inline">{isSimulating ? 'Simulating...' : 'Run Quick Sim'}</span>
          <span className="sm:hidden">{isSimulating ? '...' : 'Sim'}</span>
        </button>

        {/* Secondary Action: Export Report */}
        <button
          onClick={onExportReport}
          className="hidden sm:flex items-center px-3 py-1.5 rounded bg-surface-container text-on-surface hover:bg-slate-200 transition-colors text-xs font-semibold border border-slate-300/60"
        >
          <span className="material-symbols-outlined text-[16px] mr-1">file_download</span>
          <span>Export Report</span>
        </button>

        {/* Avatar / Profile Toggle */}
        <div
          onClick={onToggleDrawer}
          className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-white cursor-pointer hover:ring-2 hover:ring-secondary transition-all"
          title="Dr. S. Norbu - Click to open drawer"
        >
          <span className="material-symbols-outlined text-white text-[18px]">person</span>
        </div>
      </div>
    </header>
  );
};

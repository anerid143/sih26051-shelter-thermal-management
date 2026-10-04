import React, { useState, useMemo } from 'react';
import { UnitSystem, TimeStep, HeatLossComponent, DayDataPoint, ThermalProject } from '../types';
import { HEAT_LOSS_COMPONENTS, SEVEN_DAY_DATA } from '../data/mockData';
import { getStationId } from '../utils/projectHelpers';

interface OverviewViewProps {
  currentProject: ThermalProject;
  unitSystem: UnitSystem;
  timeStep: TimeStep;
  onNavigateToDesign: () => void;
  onNavigateToCompare: () => void;
  onRunSimulation: () => void;
  onExportDossier: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  currentProject,
  unitSystem,
  timeStep: _timeStep,
  onNavigateToDesign,
  onNavigateToCompare,
  onRunSimulation,
  onExportDossier,
}) => {
  const [trendView, setTrendView] = useState<'hourly' | '15min' | 'daily'>('hourly');
  const [lossUnit, setLossUnit] = useState<'kwh' | 'wk' | 'percent'>('kwh');
  const [activeHoverIndex, setActiveHoverIndex] = useState<number>(3); // Jan 18 by default

  const { data } = currentProject;

  // Dynamically compute adjusted 7-day data points tailored to the active project
  const dynamicSevenDayData: DayDataPoint[] = useMemo(() => {
    const indoorDelta = data.indoorTemperature - 18.4;
    const outdoorDelta = data.outdoorTemperature - (-16.4);
    const solarRatio = data.solarGain > 0 ? data.solarGain / 42.8 : 1;

    return SEVEN_DAY_DATA.map((pt) => ({
      ...pt,
      tIndoor: Math.round((pt.tIndoor + indoorDelta) * 10) / 10,
      tAmbient: Math.round((pt.tAmbient + outdoorDelta) * 10) / 10,
      solarFlux: Math.round(pt.solarFlux * solarRatio),
    }));
  }, [data.indoorTemperature, data.outdoorTemperature, data.solarGain]);

  const currentHoverPoint: DayDataPoint =
    dynamicSevenDayData[activeHoverIndex] || dynamicSevenDayData[3] || SEVEN_DAY_DATA[3];

  const formatTemp = (c: number) => {
    if (unitSystem === 'Imperial') {
      const f = (c * 9) / 5 + 32;
      return `${f.toFixed(1)} °F`;
    }
    return `${c.toFixed(1)} °C`;
  };

  // Dynamically scaled heat loss components based on the active project's total heat loss
  const dynamicLossComponents: HeatLossComponent[] = useMemo(() => {
    const ratio = data.heatLoss > 0 ? data.heatLoss / 38.2 : 1;
    return HEAT_LOSS_COMPONENTS.map((c) => ({
      ...c,
      lossKwhDay: Math.round(c.lossKwhDay * ratio * 10) / 10,
      lossWK: Math.round(c.lossWK * ratio * 10) / 10,
    }));
  }, [data.heatLoss]);

  const getLossDisplay = (item: HeatLossComponent) => {
    if (lossUnit === 'kwh') return `${item.lossKwhDay.toFixed(1)} kWh`;
    if (lossUnit === 'wk') return `${item.lossWK.toFixed(1)} W/K`;
    return `${item.sharePercent.toFixed(1)}%`;
  };

  const deltaT = (data.indoorTemperature - data.outdoorTemperature).toFixed(1);
  const netBalance = (data.solarGain - data.heatLoss).toFixed(1);
  const isNetPositive = data.solarGain - data.heatLoss >= 0;

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Top Engineering Scope Bar */}
      <div className="p-4 bg-surface-container-low border-b border-slate-200/70 shadow-xs flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1 font-label-data-sm text-[11px] text-secondary uppercase tracking-wider font-semibold">
              <span className="material-symbols-outlined text-[16px] text-secondary">hdr_strong</span>
              <span>Extreme Alpine Habitat Modeling</span>
            </div>
            <div className="font-display-lg text-[26px] md:text-[30px] text-on-surface tracking-tight mt-0.5 font-bold">
              {currentProject.name}
            </div>
            <p className="font-body-sm text-xs text-slate-600 mt-0.5">
              {currentProject.location} • {currentProject.elevation.toLocaleString()}m a.s.l • Sub-Zero Winter Baseline (Jan 15–22) • {currentProject.iteration}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded bg-white text-slate-800 font-label-data-sm text-[11px] shadow-xs border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-secondary mr-2 animate-pulse"></span>
              Simulation: {currentProject.status === 'Validated' ? 'Completed (Convergence 10⁻⁵)' : 'Initialized Draft'}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-label-data-sm text-[11px] border border-slate-200">
              <span className="material-symbols-outlined text-[14px] mr-1 text-slate-500">schedule</span>
              Last Run: {currentProject.lastRun || 'Today, 14:32 IST'}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded bg-primary-container text-white font-label-data-sm text-[11px]">
              <span className="material-symbols-outlined text-[14px] mr-1 text-tertiary-fixed-dim">grain</span>
              Solver: {currentProject.meshEngine || currentProject.solverMesh || '1D Transient Thermal Network'}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Metric Grid (6 Telemetry Cards) */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Card 1: Indoor Operative */}
        <div className="bg-white p-3.5 rounded border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-meta-caps text-[10px] uppercase tracking-wider text-slate-500">Indoor Operative</span>
            <span className="p-1 rounded bg-slate-100 text-slate-800">
              <span className="material-symbols-outlined text-[16px]">thermostat</span>
            </span>
          </div>
          <div className="mt-2">
            <div className="font-label-data-lg text-xl text-slate-900 font-bold">{formatTemp(data.indoorTemperature)}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-label-data-sm text-[10px] font-semibold">
                Safe Zone
              </span>
              <span className="font-label-data-sm text-[11px] text-secondary font-semibold">ΔT +{deltaT}°C</span>
            </div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-slate-100 font-label-data-sm text-[11px] text-slate-500">
            Target: 16°C – 22°C envelope
          </div>
        </div>

        {/* Card 2: Outdoor Ambient */}
        <div className="bg-white p-3.5 rounded border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-meta-caps text-[10px] uppercase tracking-wider text-slate-500">Outdoor Ambient</span>
            <span className="p-1 rounded bg-sky-50 text-[#0284c7]">
              <span className="material-symbols-outlined text-[16px]">ac_unit</span>
            </span>
          </div>
          <div className="mt-2">
            <div className="font-label-data-lg text-xl text-slate-900 font-bold">{formatTemp(data.outdoorTemperature)}</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="font-label-data-sm text-[11px] text-slate-500">Night Min: {data.nightMin.toFixed(1)}°C</span>
            </div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-slate-100 font-label-data-sm text-[11px] text-slate-500 flex items-center justify-between">
            <span>Wind: {data.windSpeed.toFixed(1)} m/s WNW</span>
            <span className="text-secondary font-semibold">Peak: {(data.outdoorTemperature + 8.3).toFixed(1)}°C</span>
          </div>
        </div>

        {/* Card 3: Solar Insolation Gain */}
        <div className="bg-white p-3.5 rounded border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-meta-caps text-[10px] uppercase tracking-wider text-slate-500">Solar Insolation Gain</span>
            <span className="p-1 rounded bg-orange-100 text-orange-900">
              <span className="material-symbols-outlined text-[16px]">wb_sunny</span>
            </span>
          </div>
          <div className="mt-2">
            <div className="font-label-data-lg text-xl text-secondary font-bold">{data.solarGain.toFixed(1)} kWh/d</div>
            <div className="font-label-data-sm text-[11px] text-slate-500 mt-1">
              Direct Glaze: 68%
            </div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-slate-100 font-label-data-sm text-[11px] text-slate-500">
            Trombe Collector: 32%
          </div>
        </div>

        {/* Card 4: Total Daily Heat Loss */}
        <div className="bg-white p-3.5 rounded border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-meta-caps text-[10px] uppercase tracking-wider text-slate-500">Total Daily Heat Loss</span>
            <span className="p-1 rounded bg-slate-100 text-slate-800">
              <span className="material-symbols-outlined text-[16px]">trending_down</span>
            </span>
          </div>
          <div className="mt-2">
            <div className="font-label-data-lg text-xl text-slate-900 font-bold">{data.heatLoss.toFixed(1)} kWh/d</div>
            <div className="font-label-data-sm text-[11px] text-slate-500 mt-1">
              Transmission: 74%
            </div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-slate-100 font-label-data-sm text-[11px] text-slate-500">
            Infiltration (0.35 ACH): 26%
          </div>
        </div>

        {/* Card 5: Thermal Storage Mass */}
        <div className="bg-white p-3.5 rounded border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-meta-caps text-[10px] uppercase tracking-wider text-slate-500">Thermal Storage Mass</span>
            <span className="p-1 rounded bg-slate-100 text-slate-800">
              <span className="material-symbols-outlined text-[16px]">layers</span>
            </span>
          </div>
          <div className="mt-2">
            <div className="font-label-data-lg text-xl text-slate-900 font-bold">{data.thermalStorage.toFixed(1)} kWh</div>
            <div className="font-label-data-sm text-[11px] text-slate-500 mt-1">
              Packed Earth & Sand
            </div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-slate-100 font-label-data-sm text-[11px] text-secondary font-medium">
            Discharge: {(data.thermalStorage * 0.082).toFixed(1)} kW (Night)
          </div>
        </div>

        {/* Card 6: Thermal Autonomy */}
        <div className="bg-white p-3.5 rounded border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-meta-caps text-[10px] uppercase tracking-wider text-slate-500">Thermal Autonomy</span>
            <span className="p-1 rounded bg-orange-100 text-orange-900">
              <span className="material-symbols-outlined text-[16px]">bolt</span>
            </span>
          </div>
          <div className="mt-2">
            <div className="font-label-data-lg text-xl text-secondary font-bold">{data.thermalAutonomy.toFixed(1)} %</div>
            <div className="font-label-data-sm text-[11px] text-slate-500 mt-1">
              Aux Fuel Burn: 0.00 kg
            </div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-slate-100 font-label-data-sm text-[11px] text-slate-500">
            72h Polar Cold Snap Hold
          </div>
        </div>
      </div>

      {/* Row 1: Temperature Trajectory + Dynamic Heat Balance */}
      <div className="px-4 pb-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left: 7-Day Diurnal Curve Interactive Multi-Line Viewport (2/3) */}
        <div className="lg:col-span-2 bg-white p-4 rounded border border-slate-200/90 shadow-xs flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[20px] text-secondary">stacked_line_chart</span>
              <span className="font-headline-sm text-base text-slate-900 font-semibold">
                Temperature Dynamic Trend (7-Day Cold Wave)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 p-0.5 rounded font-label-data-sm text-[11px] border border-slate-200">
                <button
                  onClick={() => setTrendView('hourly')}
                  className={`px-2 py-0.5 rounded transition-all ${
                    trendView === 'hourly'
                      ? 'bg-white font-semibold text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Hourly
                </button>
                <button
                  onClick={() => setTrendView('15min')}
                  className={`px-2 py-0.5 rounded transition-all ${
                    trendView === '15min'
                      ? 'bg-white font-semibold text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  15-Min
                </button>
                <button
                  onClick={() => setTrendView('daily')}
                  className={`px-2 py-0.5 rounded transition-all ${
                    trendView === 'daily'
                      ? 'bg-white font-semibold text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Daily Avg
                </button>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-label-data-sm text-[11px] border border-slate-200">
                Jan 15–21
              </span>
            </div>
          </div>

          {/* Graph Surface with SVG Line Rendering */}
          <div className="relative w-full h-80 bg-slate-50/80 rounded p-3 flex flex-col justify-between overflow-hidden mt-3 border border-slate-200/60 select-none">
            {/* SVG lines */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 700 280">
              <defs>
                <linearGradient id="comfortGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#fd651e" stopOpacity="0.16"></stop>
                  <stop offset="100%" stopColor="#fd651e" stopOpacity="0.03"></stop>
                </linearGradient>
                <linearGradient id="solarGlow" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#a73a00" stopOpacity="0.25"></stop>
                  <stop offset="100%" stopColor="#a73a00" stopOpacity="0.0"></stop>
                </linearGradient>
              </defs>

              {/* Horizontal reference datums */}
              <line stroke="#cbd5e1" strokeDasharray="3 3" strokeWidth="0.8" x1="40" x2="680" y1="40" y2="40"></line>
              <line stroke="#cbd5e1" strokeDasharray="3 3" strokeWidth="0.8" x1="40" x2="680" y1="90" y2="90"></line>
              <line stroke="#cbd5e1" strokeDasharray="3 3" strokeWidth="0.8" x1="40" x2="680" y1="150" y2="150"></line>
              <line stroke="#cbd5e1" strokeDasharray="3 3" strokeWidth="0.8" x1="40" x2="680" y1="210" y2="210"></line>
              <line stroke="#cbd5e1" strokeWidth="1" x1="40" x2="680" y1="260" y2="260"></line>

              {/* Thermal Comfort Band (16°C to 22°C mapped roughly from y=50 to y=85) */}
              <rect fill="url(#comfortGradient)" height="35" width="640" x="40" y="55"></rect>

              {/* Outdoor Ambient Trace (Cool Sky / Cold Blue) */}
              <path
                d="M 40 220 C 70 240, 90 260, 130 250 C 160 215, 180 195, 220 200 C 250 255, 280 265, 320 255 C 360 205, 380 190, 420 195 C 450 245, 480 260, 520 250 C 560 200, 580 185, 620 195 C 650 240, 670 255, 680 250"
                fill="none"
                stroke="#188ace"
                strokeLinecap="round"
                strokeWidth="2.4"
              ></path>

              {/* Indoor Operative Temp Trace (Solar Bronze / Warm Amber) */}
              <path
                d="M 40 78 C 80 82, 100 84, 135 68 C 170 58, 200 62, 230 76 C 270 85, 290 86, 330 65 C 370 56, 400 60, 430 74 C 470 83, 490 85, 530 64 C 570 55, 600 58, 630 72 C 655 79, 670 81, 680 80"
                fill="none"
                stroke="#a73a00"
                strokeLinecap="round"
                strokeWidth="2.8"
              ></path>

              {/* Solar Radiation Pulses */}
              <path d="M 120 260 L 135 170 L 150 260 Z" fill="url(#solarGlow)"></path>
              <path d="M 220 260 L 235 165 L 250 260 Z" fill="url(#solarGlow)"></path>
              <path d="M 320 260 L 335 160 L 350 260 Z" fill="url(#solarGlow)"></path>
              <path d="M 420 260 L 435 165 L 450 260 Z" fill="url(#solarGlow)"></path>
              <path d="M 520 260 L 535 160 L 550 260 Z" fill="url(#solarGlow)"></path>
              <path d="M 620 260 L 635 165 L 650 260 Z" fill="url(#solarGlow)"></path>

              {/* Interactive Point Indicators */}
              {dynamicSevenDayData.map((pt, idx) => {
                const cx = 50 + idx * 95;
                const cyIndoor = idx === 3 ? 65 : 72 + Math.sin(idx * 1.5) * 8;
                const cyAmbient = idx === 3 ? 245 : 220 + Math.cos(idx * 2) * 25;
                const isHovered = activeHoverIndex === idx;

                return (
                  <g key={pt.day} className="cursor-pointer" onClick={() => setActiveHoverIndex(idx)}>
                    <circle
                      cx={cx}
                      cy={cyIndoor}
                      fill="#a73a00"
                      r={isHovered ? 6 : 4}
                      stroke="#ffffff"
                      strokeWidth="2"
                    ></circle>
                    <circle
                      cx={cx}
                      cy={cyAmbient}
                      fill="#188ace"
                      r={isHovered ? 5.5 : 3.5}
                      stroke="#ffffff"
                      strokeWidth="2"
                    ></circle>
                  </g>
                );
              })}
            </svg>

            {/* Dynamic Monospace Hover Tooltip HUD */}
            <div
              className="absolute bg-primary-container text-white p-2.5 rounded shadow-lg pointer-events-none border border-slate-700 transition-all duration-200"
              style={{
                left: `${Math.min(75, Math.max(12, 10 + activeHoverIndex * 13))}%`,
                top: '14px',
              }}
            >
              <div className="font-meta-caps text-[9px] text-tertiary-fixed-dim uppercase tracking-wider">
                {currentHoverPoint.label} • {currentHoverPoint.peakHour}
              </div>
              <div className="font-label-data-sm text-[12px] text-white mt-1">
                T_indoor: <span className="text-secondary-fixed font-bold">{currentHoverPoint.tIndoor.toFixed(1)} °C</span>
              </div>
              <div className="font-label-data-sm text-[12px] text-white">
                T_ambient: <span className="text-tertiary-fixed font-bold">{currentHoverPoint.tAmbient.toFixed(1)} °C</span>
              </div>
              <div className="font-label-data-sm text-[11px] text-slate-300">
                Solar Flux: {currentHoverPoint.solarFlux} W/m²
              </div>
            </div>

            {/* Vertical axis notations / clickable day columns */}
            <div className="flex justify-between items-end w-full pl-6 pr-4 font-label-data-sm text-[11px] text-slate-600 relative z-10">
              {dynamicSevenDayData.map((pt, idx) => (
                <button
                  key={pt.day}
                  onClick={() => setActiveHoverIndex(idx)}
                  className={`px-1.5 py-0.5 rounded transition-all text-center ${
                    activeHoverIndex === idx
                      ? 'bg-slate-200 text-slate-900 font-bold'
                      : 'hover:bg-slate-100 text-slate-500'
                  }`}
                >
                  {pt.day}
                </button>
              ))}
            </div>
          </div>

          {/* Graph Legends & Statistical Bounds */}
          <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 font-label-data-sm text-[11px]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-secondary rounded-full inline-block"></span>
                <span className="text-slate-800 font-medium">Indoor Operative Temp (Avg {data.indoorTemperature.toFixed(1)}°C)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-[#188ace] rounded-full inline-block"></span>
                <span className="text-slate-600">Ambient Dry Bulb (Min {data.nightMin.toFixed(1)}°C)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-2 bg-secondary/20 rounded-xs inline-block border border-secondary/40"></span>
                <span className="text-slate-600">Comfort Envelope (16–22°C)</span>
              </div>
            </div>
            <div className="text-slate-600">
              Maximum Diurnal Indoor Swing: <span className="text-slate-900 font-semibold">Δ 3.6°C</span> (High Stability)
            </div>
          </div>
        </div>

        {/* Right: Energy Balance & Sankey Flux (1/3) */}
        <div className="bg-white p-4 rounded border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px] text-secondary">schema</span>
                <span className="font-headline-sm text-base text-slate-900 font-semibold">
                  Thermal Balance Flux
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded font-label-data-sm text-[11px] font-semibold border ${
                isNetPositive
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                Net {isNetPositive ? '+' : ''}{netBalance} kWh
              </span>
            </div>
            <div className="font-body-sm text-xs text-slate-600 my-2.5">
              Dynamic 24h energy transfer chain across glazed aperture, Trombe thermal wall, and envelope losses.
            </div>

            {/* Compact Parametric Energy Flow Nodes */}
            <div className="flex flex-col gap-2">
              {/* Flow Node 1 */}
              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <div className="flex justify-between items-center font-label-data-sm text-[11px]">
                  <span className="text-slate-800 font-medium">1. Solar Irradiance on Glazing</span>
                  <span className="text-secondary font-bold">{(data.solarGain * 1.36).toFixed(1)} kWh/m²</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-secondary h-full rounded-full w-full"></div>
                </div>
              </div>

              {/* Flow Node 2 */}
              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <div className="flex justify-between items-center font-label-data-sm text-[11px]">
                  <span className="text-slate-800 font-medium">2. Aperture Transmittance (SHGC 0.73)</span>
                  <span className="text-slate-900 font-semibold">{data.solarGain.toFixed(1)} kWh/d</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full w-[73%]"></div>
                </div>
              </div>

              {/* Flow Node 3 */}
              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <div className="flex justify-between items-center font-label-data-sm text-[11px]">
                  <span className="text-slate-800 font-medium">3. Mass Wall / Bed Storage Absorb</span>
                  <span className="text-slate-900 font-semibold">{(data.thermalStorage * 1.93).toFixed(1)} kWh/d</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-[#188ace] h-full rounded-full w-[48%]"></div>
                </div>
              </div>

              {/* Flow Node 4 */}
              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <div className="flex justify-between items-center font-label-data-sm text-[11px]">
                  <span className="text-slate-800 font-medium">4. Fabric Envelope Transmission Losses</span>
                  <span className="text-rose-600 font-semibold">-{(data.heatLoss * 0.74).toFixed(1)} kWh/d</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full w-[47%]"></div>
                </div>
              </div>

              {/* Flow Node 5 */}
              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <div className="flex justify-between items-center font-label-data-sm text-[11px]">
                  <span className="text-slate-800 font-medium">5. HRV / Infiltration Ventilation Leak</span>
                  <span className="text-rose-600 font-semibold">-{(data.heatLoss * 0.26).toFixed(1)} kWh/d</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full w-[17%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Efficiency & Thermal Performance Score */}
          <div className="mt-3 bg-slate-100 p-3 rounded flex items-center justify-between border border-slate-200">
            <div className="flex flex-col">
              <span className="font-meta-caps text-[9px] text-slate-500 uppercase tracking-wider">
                Passive Heating Ratio
              </span>
              <span className="font-label-data-lg text-lg text-secondary font-bold">
                {data.thermalAutonomy >= 90 ? '100% Zero-Aux' : `${data.thermalAutonomy.toFixed(1)}% Solar Fraction`}
              </span>
            </div>
            <div className="text-right flex flex-col">
              <span className="font-meta-caps text-[9px] text-slate-500 uppercase tracking-wider">
                Equiv COP
              </span>
              <span className="font-label-data-lg text-lg text-slate-900 font-semibold">
                {data.thermalAutonomy >= 90 ? '∞ (Infinite)' : `${(data.thermalAutonomy / 15).toFixed(1)} (Ultra High)`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Heat Loss Engineering Breakdown + Isometric Envelope Render (1/2 + 1/2) */}
      <div className="px-4 pb-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Left: Component Heat Loss Analysis & Table (1/2) */}
        <div className="bg-white p-4 rounded border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px] text-slate-800">data_exploration</span>
                <span className="font-headline-sm text-base text-slate-900 font-semibold">
                  Component Heat Loss Breakdown
                </span>
              </div>
              <div className="flex items-center bg-slate-100 p-0.5 rounded font-label-data-sm text-[11px] border border-slate-200">
                <button
                  onClick={() => setLossUnit('kwh')}
                  className={`px-2 py-0.5 rounded transition-all ${
                    lossUnit === 'kwh'
                      ? 'bg-white font-semibold text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  kWh/day
                </button>
                <button
                  onClick={() => setLossUnit('wk')}
                  className={`px-2 py-0.5 rounded transition-all ${
                    lossUnit === 'wk'
                      ? 'bg-white font-semibold text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  W/K
                </button>
                <button
                  onClick={() => setLossUnit('percent')}
                  className={`px-2 py-0.5 rounded transition-all ${
                    lossUnit === 'percent'
                      ? 'bg-white font-semibold text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  % Total
                </button>
              </div>
            </div>
            <p className="font-body-sm text-xs text-slate-600 my-2">
              Quantitative thermal transmission through building envelope sub-assemblies during the extreme {data.nightMin.toFixed(1)}°C design freeze.
            </p>

            {/* Engineering Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-label-data-sm text-[11px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 uppercase font-meta-caps text-[9px] border-b border-slate-200">
                    <th className="py-2 px-2 font-semibold">Envelope Assembly</th>
                    <th className="py-2 px-2 font-semibold">U-Value</th>
                    <th className="py-2 px-2 font-semibold">Loss</th>
                    <th className="py-2 px-2 font-semibold text-right">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {dynamicLossComponents.map((item) => (
                    <tr key={item.assembly} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 px-2">
                        <div className="font-medium text-slate-900">{item.assembly}</div>
                        <div className="text-[10px] text-slate-500 font-sans">{item.details}</div>
                      </td>
                      <td className="py-2 px-2 font-medium">{item.uValue}</td>
                      <td className="py-2 px-2 font-semibold">{getLossDisplay(item)}</td>
                      <td className="py-2 px-2 text-right">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${
                            item.isCritical
                              ? 'bg-orange-100 text-orange-950 font-bold border border-orange-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {item.sharePercent.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Verification Badge Footer */}
          <div className="mt-3 pt-2 bg-slate-50 p-2.5 rounded border border-slate-200 flex items-center justify-between">
            <span className="font-label-data-sm text-[11px] text-slate-600 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
              <span>Passivhaus High-Altitude Benchmark Compliant</span>
            </span>
            <span className="font-label-data-sm text-[11px] font-bold text-slate-900 font-mono">
              Total: {data.heatLoss.toFixed(1)} kWh/day
            </span>
          </div>
        </div>

        {/* Right: 3D Shelter Wireframe & Immediate Action Console (1/2) */}
        <div className="bg-white p-4 rounded border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px] text-secondary">view_in_ar</span>
                <span className="font-headline-sm text-base text-slate-900 font-semibold truncate max-w-[280px]">
                  Active Model • {currentProject.name}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-primary-container text-white font-label-data-sm text-[11px]">
                CAD/FEA Synced
              </span>
            </div>

            {/* Architectural Cut-Section Render Preview */}
            <div className="relative w-full h-52 rounded overflow-hidden bg-slate-900 group mt-3 border border-slate-300">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt="Technical architectural section render of a high-altitude passive solar military shelter in snowy Ladakh mountains"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCG9Echt_N23aRK9mqU1-3CIK7VnQOur8G9fr37UbMdtENmbYif8QtBpNFSDFdGTS6RkT5u9ZeiITkH91csglezKRGhV9IiAGIrfhAbESgTi_VykQiI-I4qmBCdxozU_P5RccBXUdgpsXnjTO_SLDFiCRSO221bwFyvhSCPUmvk2wmiu4v7TNpZdutsK_A518_89e7EISQ8SlwsU7Yxjw7oEXYyiUHzNhJZLR6M4iCHqwj7pztc8Z9Y"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-3">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <div className="font-headline-sm text-sm font-semibold leading-tight">
                      Inclined Solar Glaze + Trombe Assembly
                    </div>
                    <div className="font-label-data-sm text-[11px] text-tertiary-fixed-dim">
                      Sector: {currentProject.location} • Alt: {currentProject.elevation.toLocaleString()}m
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-secondary text-white font-label-data-sm text-[10px] font-semibold">
                    Solar Optimized
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Spec Callout Grid */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-center font-label-data-sm text-[11px]">
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <div className="text-slate-500 font-meta-caps text-[9px] uppercase">Envelope R-Value</div>
                <div className="text-slate-900 font-bold mt-0.5">R-48.5 hr·ft²·°F/Btu</div>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <div className="text-slate-500 font-meta-caps text-[9px] uppercase">Trombe Lag Time</div>
                <div className="text-secondary font-bold mt-0.5">8.4 Hours Release</div>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <div className="text-slate-500 font-meta-caps text-[9px] uppercase">Altitude Pressure</div>
                <div className="text-slate-900 font-bold mt-0.5">
                  {(101.3 * Math.exp(-currentProject.elevation / 8400)).toFixed(1)} kPa
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Engineering Buttons */}
          <div className="mt-3 pt-2 border-t border-slate-100 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onRunSimulation}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-primary text-white hover:bg-slate-800 transition-colors text-xs font-semibold shadow-xs"
              >
                <span className="material-symbols-outlined text-[17px] text-secondary-fixed">memory</span>
                <span>Run Transient Simulation</span>
              </button>
              <button
                onClick={onNavigateToDesign}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-surface-container text-on-surface hover:bg-slate-200 transition-colors text-xs font-semibold border border-slate-300/70"
              >
                <span className="material-symbols-outlined text-[17px]">architecture</span>
                <span>Continue Shelter 3D Design</span>
              </button>
            </div>
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={onNavigateToCompare}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-label-data-sm text-[11px] transition-colors border border-slate-200"
              >
                <span className="material-symbols-outlined text-[15px]">compare_arrows</span>
                <span>Compare (3 Iterations)</span>
              </button>
              <button
                onClick={onExportDossier}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-label-data-sm text-[11px] transition-colors border border-slate-200"
              >
                <span className="material-symbols-outlined text-[15px]">picture_as_pdf</span>
                <span>Export SIH Technical Dossier</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Micro Footer Disclaimer / Engineering Metadata */}
      <div className="px-4 py-2 flex flex-wrap items-center justify-between text-slate-500 font-label-data-sm text-[11px] border-t border-slate-200/60 mt-1">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[15px] text-slate-400">info</span>
          <span>
            Engineering validation dossier for {currentProject.designCode || 'SIH26051'} • {currentProject.name} ({currentProject.location})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>ASHRAE Standard 55-2023 Adaptive Comfort Target</span>
          <span>•</span>
          <span className="text-slate-800 font-medium">Station ID: {getStationId(currentProject)}</span>
        </div>
      </div>
    </div>
  );
};


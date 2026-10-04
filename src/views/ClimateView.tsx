import React, { useState } from 'react';

export const ClimateView: React.FC = () => {
  const [selectedSeason, setSelectedSeason] = useState<'winter' | 'shoulder' | 'summer'>('winter');

  return (
    <div className="p-4 flex flex-col gap-4 select-none pb-12">
      {/* Top Banner */}
      <div className="bg-surface-container-low p-4 rounded border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 font-label-data-sm text-[11px] text-secondary font-semibold uppercase">
            <span className="material-symbols-outlined text-[16px]">thermostat</span>
            <span>Meteorological Station Telemetry • Station ID: LEH-IND-4299</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Extreme High-Altitude Alpine Climate Dataset
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Leh District (3,524m ASL) • Longitude 77.58° E, Latitude 34.15° N • Sub-Zero Arctic-Alpine Biome
          </p>
        </div>

        {/* Season selector */}
        <div className="flex items-center bg-white p-0.5 rounded border border-slate-200 text-xs shadow-xs">
          <button
            onClick={() => setSelectedSeason('winter')}
            className={`px-3 py-1 rounded transition-colors ${
              selectedSeason === 'winter'
                ? 'bg-secondary text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Extreme Winter (Jan)
          </button>
          <button
            onClick={() => setSelectedSeason('shoulder')}
            className={`px-3 py-1 rounded transition-colors ${
              selectedSeason === 'shoulder'
                ? 'bg-secondary text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Shoulder Freeze (Nov)
          </button>
          <button
            onClick={() => setSelectedSeason('summer')}
            className={`px-3 py-1 rounded transition-colors ${
              selectedSeason === 'summer'
                ? 'bg-secondary text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Alpine Summer (Jul)
          </button>
        </div>
      </div>

      {/* Climate 4-Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 font-meta-caps text-[10px]">
            <span>Peak Direct Solar DNI</span>
            <span className="material-symbols-outlined text-[16px] text-orange-500">wb_sunny</span>
          </div>
          <div className="text-xl font-bold font-mono text-secondary mt-1">
            {selectedSeason === 'winter' ? '1,040 W/m²' : selectedSeason === 'shoulder' ? '920 W/m²' : '1,120 W/m²'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Clearness Index Kt = 0.82 (Thin Atmosphere)</div>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 font-meta-caps text-[10px]">
            <span>Atmospheric Pressure</span>
            <span className="material-symbols-outlined text-[16px] text-sky-500">compress</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">65.2 kPa</div>
          <div className="text-[11px] text-slate-500 mt-1">0.64 atm (Air Density ρ = 0.88 kg/m³)</div>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 font-meta-caps text-[10px]">
            <span>Diurnal Temperature Swing</span>
            <span className="material-symbols-outlined text-[16px] text-indigo-500">swap_vert</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            {selectedSeason === 'winter' ? 'Δ 22.4 °C' : 'Δ 18.0 °C'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">High thermal oscillation necessitates mass</div>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 font-meta-caps text-[10px]">
            <span>Katabatic Wind Chill</span>
            <span className="material-symbols-outlined text-[16px] text-teal-600">air</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">6.8 m/s WNW</div>
          <div className="text-[11px] text-slate-500 mt-1">Max Gusts: 16.4 m/s over Khardung La ridge</div>
        </div>
      </div>

      {/* Visual Chart 1: Diurnal Insolation Curve vs Altitude Sun Angle */}
      <div className="bg-white p-4 rounded border border-slate-200 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px] text-secondary">solar_power</span>
            <h3 className="text-sm font-bold text-slate-900">
              Clear-Sky Solar Insolation &amp; Sun Altitude Angle (Leh Latitude 34.15° N)
            </h3>
          </div>
          <span className="font-label-data-sm text-[11px] text-slate-500">
            Winter Solstice: Noon Altitude = 32.4° • South Glaze Optimum Tilt = 58°
          </span>
        </div>

        <div className="w-full h-64 bg-slate-50 rounded border border-slate-200/60 p-3 relative flex flex-col justify-between">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 600 200">
            <defs>
              <linearGradient id="solarFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ea580c" stopOpacity="0.3"></stop>
                <stop offset="100%" stopColor="#ea580c" stopOpacity="0.0"></stop>
              </linearGradient>
            </defs>
            {/* Grid */}
            <line stroke="#cbd5e1" strokeDasharray="3 3" x1="30" x2="570" y1="30" y2="30"></line>
            <line stroke="#cbd5e1" strokeDasharray="3 3" x1="30" x2="570" y1="80" y2="80"></line>
            <line stroke="#cbd5e1" strokeDasharray="3 3" x1="30" x2="570" y1="130" y2="130"></line>
            <line stroke="#cbd5e1" x1="30" x2="570" y1="180" y2="180"></line>

            {/* Insolation Curve */}
            <path
              d="M 120 180 C 180 180, 240 40, 300 35 C 360 40, 420 180, 480 180 Z"
              fill="url(#solarFill)"
            ></path>
            <path
              d="M 120 180 C 180 180, 240 40, 300 35 C 360 40, 420 180, 480 180"
              fill="none"
              stroke="#ea580c"
              strokeWidth="2.5"
            ></path>

            {/* Ambient Temp inverted curve */}
            <path
              d="M 30 150 C 120 170, 200 160, 300 110 C 400 100, 480 145, 570 165"
              fill="none"
              stroke="#0284c7"
              strokeWidth="2"
            ></path>

            <circle cx="300" cy="35" fill="#ea580c" r="5" stroke="#ffffff" strokeWidth="2"></circle>
            <text fill="#a73a00" fontFamily="JetBrains Mono" fontSize="11" fontWeight="bold" x="310" y="32">
              Peak: 890 W/m² (13:00 IST)
            </text>
          </svg>

          <div className="flex justify-between text-[11px] font-mono text-slate-500 px-4">
            <span>06:00 (Sunrise)</span>
            <span>09:00</span>
            <span>12:00 (Solar Noon)</span>
            <span>15:00</span>
            <span>18:00 (Sunset)</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600 font-label-data-sm pt-1">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-secondary rounded-full"></span>
              <span>Global Horizontal / Tilt Irradiance</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-sky-500 rounded-full"></span>
              <span>Ambient Temperature Profile</span>
            </span>
          </div>
          <span className="text-slate-800 font-medium">Daily Global Radiation Sum: 4.82 kWh/m²/day</span>
        </div>
      </div>
    </div>
  );
};

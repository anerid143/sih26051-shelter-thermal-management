import React from 'react';

export const AnalysisView: React.FC = () => {
  return (
    <div className="p-4 flex flex-col gap-4 select-none pb-12">
      {/* Top Banner */}
      <div className="bg-surface-container-low p-4 rounded border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 font-label-data-sm text-[11px] text-secondary font-semibold uppercase">
            <span className="material-symbols-outlined text-[16px]">monitoring</span>
            <span>ASHRAE Standard 55-2023 Adaptive Comfort Target</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Thermal Autonomy, Damping Factor &amp; Comfort Psychrometrics
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Validation of indoor environmental quality (IEQ) and metabolic physiological comfort under sub-zero ambient stress.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            98.4% Winter Hours in Comfort Band
          </span>
        </div>
      </div>

      {/* 3 Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between font-meta-caps text-[10px] text-slate-500 uppercase">
              <span>Diurnal Damping Factor (μ)</span>
              <span className="material-symbols-outlined text-[16px] text-secondary">waves</span>
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              μ = 0.161 <span className="text-xs font-normal text-emerald-600">(83.9% Damped)</span>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Outdoor thermal wave of 22.4°C swing is flattened to an internal diurnal fluctuation of only 3.6°C.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
            Equation: μ = ΔT_indoor / ΔT_ambient
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between font-meta-caps text-[10px] text-slate-500 uppercase">
              <span>Trombe Phase Lag (ϕ)</span>
              <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
            </div>
            <div className="text-2xl font-bold font-mono text-secondary mt-1">
              ϕ = 8.4 Hours
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Peak solar insolation harvested at 13:00 IST conducts through the 380mm earth core and releases at 21:24 IST.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
            Matches night-time freezing peak (-24.2°C)
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between font-meta-caps text-[10px] text-slate-500 uppercase">
              <span>72h Polar Blizzard Hold</span>
              <span className="material-symbols-outlined text-[16px] text-sky-600">ac_unit</span>
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              T_min &gt; 14.8 °C
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Zero solar insolation stress test: 18.4 ton rock bed foundation prevents room freezing for 3 continuous days.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-emerald-600 font-semibold text-xs">
            Zero Fuel auxiliary heat consumption
          </div>
        </div>
      </div>

      {/* Comfort Band Chart */}
      <div className="bg-white p-4 rounded border border-slate-200 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px] text-secondary">grid_on</span>
            <h3 className="text-sm font-bold text-slate-900">
              ASHRAE 55 Adaptive Comfort Envelope vs Operative Temperatures
            </h3>
          </div>
          <span className="font-label-data-sm text-[11px] text-slate-500">
            Metabolic Rate: 1.2 met (Habitation) • Clothing Insulation: 1.5 clo (Winter garments)
          </span>
        </div>

        <div className="w-full h-56 bg-slate-50 rounded border border-slate-200/60 p-3 relative flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 600 180" preserveAspectRatio="none">
            {/* 80% Acceptability Zone */}
            <rect x="60" y="30" width="480" height="70" fill="#ecfdf5" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3"></rect>
            {/* 90% Optimum Zone */}
            <rect x="120" y="45" width="360" height="40" fill="#d1fae5" stroke="#059669" strokeWidth="1"></rect>

            <text x="70" y="45" fill="#047857" fontSize="10" fontFamily="Inter" fontWeight="bold">
              80% Adaptive Acceptability (16.0°C – 22.0°C)
            </text>
            <text x="130" y="60" fill="#065f46" fontSize="10" fontFamily="Inter" fontWeight="bold">
              90% Optimum Comfort Zone (17.5°C – 20.5°C)
            </text>

            {/* Scatter points of simulated hourly temperatures */}
            {[
              { x: 100, y: 70 }, { x: 140, y: 65 }, { x: 180, y: 55 }, { x: 220, y: 50 },
              { x: 260, y: 48 }, { x: 300, y: 52 }, { x: 340, y: 58 }, { x: 380, y: 62 },
              { x: 420, y: 60 }, { x: 460, y: 55 }, { x: 500, y: 64 }, { x: 520, y: 72 }
            ].map((pt, i) => (
              <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#a73a00" stroke="#ffffff" strokeWidth="1.5"></circle>
            ))}
          </svg>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600 font-label-data-sm pt-1">
          <span>Points represent hourly indoor operative temperature across cold freeze period.</span>
          <span className="font-semibold text-slate-900">Total Comfort Compliance: 98.4%</span>
        </div>
      </div>
    </div>
  );
};

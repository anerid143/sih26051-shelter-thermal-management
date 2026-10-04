import React from 'react';
import { ThermalProject } from '../types';

interface CompareDesignsViewProps {
  onSelectIteration: (iterName: string) => void;
  currentProject?: ThermalProject;
}

export const CompareDesignsView: React.FC<CompareDesignsViewProps> = ({
  onSelectIteration,
  currentProject,
}) => {
  const indoorMean = currentProject ? currentProject.data.indoorTemperature.toFixed(1) : '18.4';
  const autonomy = currentProject ? currentProject.data.thermalAutonomy.toFixed(1) : '94.2';
  const minIndoor = currentProject ? (currentProject.data.indoorTemperature - 1.9).toFixed(1) : '16.5';
  const projName = currentProject ? currentProject.name : 'ShelterTherm';
  const projIteration = currentProject ? currentProject.iteration : 'Iteration v3.4 [Trombe + Rock Bed]';
  const locationName = currentProject ? currentProject.location : 'Leh District';

  const designs = [
    {
      id: 'design-baseline',
      name: 'Design 0: Traditional Uninsulated High-Altitude Barracks',
      description: 'Single corrugated GI sheet + timber frame, diesel bukhari stove running 24/7.',
      uValueRoof: '1.80 W/m²K',
      uValueWall: '2.10 W/m²K',
      glazing: 'Single 4mm sheet glass (U=5.8)',
      auxFuelBurnSeason: '1,840 Liters Diesel',
      co2Emissions: '4.91 Tons CO₂',
      minIndoorTemp: '-4.2 °C (Freeze Risk)',
      meanIndoorTemp: '10.5 °C',
      thermalAutonomy: '12.4 %',
      capitalCost: 'Low (₹4.2L)',
      operatingCostSeason: '₹1,95,000 / winter',
      compliance: 'FAIL (Severe Freeze Risk)',
      isWinner: false,
    },
    {
      id: 'design-greenhouse',
      name: 'Design 1: Standard Polycarbonate Attached Solarium',
      description: 'Twin-wall 10mm PC sheet attachment with basic stone floor and rockwool wall.',
      uValueRoof: '0.28 W/m²K',
      uValueWall: '0.35 W/m²K',
      glazing: 'Twin-wall Polycarbonate (U=3.0)',
      auxFuelBurnSeason: '420 Liters Kerosene',
      co2Emissions: '1.12 Tons CO₂',
      minIndoorTemp: '+6.4 °C (Cold Drafts)',
      meanIndoorTemp: '14.8 °C',
      thermalAutonomy: '58.2 %',
      capitalCost: 'Moderate (₹6.8L)',
      operatingCostSeason: '₹48,000 / winter',
      compliance: 'Marginal Pass (Zone IV)',
      isWinner: false,
    },
    {
      id: 'design-v34',
      name: `Design 2: ${projName} [${projIteration}]`,
      description: 'R-48.5 envelope, 58° inclined triple argon glazing, 380mm earth Trombe, 18.4t gravel bed.',
      uValueRoof: '0.09 W/m²K',
      uValueWall: '0.12 W/m²K',
      glazing: 'Triple Argon Low-E (U=0.80)',
      auxFuelBurnSeason: '0.00 Liters (Zero-Aux)',
      co2Emissions: '0.00 Tons CO₂',
      minIndoorTemp: `+${minIndoor} °C (Optimal Comfort)`,
      meanIndoorTemp: `${indoorMean} °C`,
      thermalAutonomy: `${autonomy} % (Zero-Carbon)`,
      capitalCost: 'Optimized (₹8.4L)',
      operatingCostSeason: '₹0 / winter',
      compliance: '100% PASS (Zone V & ASHRAE 55)',
      isWinner: true,
    },
  ];

  return (
    <div className="p-4 flex flex-col gap-4 select-none pb-12">
      {/* Top Banner */}
      <div className="bg-surface-container-low p-4 rounded border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 font-label-data-sm text-[11px] text-secondary font-semibold uppercase">
            <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
            <span>Comparative Architectural Performance Matrix</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Design Iterations &amp; Carbon Neutrality Comparison
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Benchmarking conventional high-altitude barracks against passive solar envelope iterations in {locationName}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded bg-secondary text-white text-xs font-bold shadow-xs">
            ₹1.95L Annual Fuel Savings / Unit
          </span>
        </div>
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {designs.map((d) => (
          <div
            key={d.id}
            className={`bg-white rounded border flex flex-col justify-between shadow-xs ${
              d.isWinner
                ? 'border-secondary ring-2 ring-secondary/40 relative'
                : 'border-slate-200'
            }`}
          >
            {d.isWinner && (
              <div className="bg-secondary text-white text-[10px] font-bold font-meta-caps tracking-wider py-1 text-center rounded-t">
                RECOMMENDED SIH26051 BENCHMARK CONFIGURATION
              </div>
            )}

            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 leading-tight">{d.name}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{d.description}</p>

              <div className="mt-4 flex flex-col gap-2 font-label-data-sm text-xs divide-y divide-slate-100">
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500 font-sans">Thermal Autonomy:</span>
                  <span className={`font-bold font-mono ${d.isWinner ? 'text-secondary' : 'text-slate-900'}`}>
                    {d.thermalAutonomy}
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500 font-sans">Min Indoor Temp:</span>
                  <span className={`font-mono font-semibold ${d.isWinner ? 'text-emerald-700' : 'text-slate-800'}`}>
                    {d.minIndoorTemp}
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500 font-sans">Auxiliary Fuel / Season:</span>
                  <span className={`font-mono font-bold ${d.isWinner ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {d.auxFuelBurnSeason}
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500 font-sans">Winter Fuel Cost:</span>
                  <span className="font-mono text-slate-800">{d.operatingCostSeason}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500 font-sans">Roof U-Value:</span>
                  <span className="font-mono text-slate-800">{d.uValueRoof}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500 font-sans">Wall U-Value:</span>
                  <span className="font-mono text-slate-800">{d.uValueWall}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500 font-sans">Standard Compliance:</span>
                  <span className={`font-semibold ${d.isWinner ? 'text-emerald-700' : 'text-slate-600'}`}>
                    {d.compliance}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 rounded-b flex items-center justify-between">
              <span className="text-[10px] text-slate-500">CapEx: {d.capitalCost}</span>
              <button
                onClick={() => onSelectIteration(d.name)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  d.isWinner
                    ? 'bg-secondary text-white hover:bg-orange-800'
                    : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                }`}
              >
                {d.isWinner ? 'Active in Studio' : 'Load Configuration'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { MATERIAL_LAYERS } from '../data/mockData';

export const MaterialsView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Advanced Insulation', 'Thermal Storage Core', 'Sub-Grade Frost Skirt', 'Roof & Truss Insulation', 'Solar Aperture'];

  const filteredMaterials = selectedCategory === 'All'
    ? MATERIAL_LAYERS
    : MATERIAL_LAYERS.filter((m) => m.category === selectedCategory);

  return (
    <div className="p-4 flex flex-col gap-4 select-none pb-12">
      {/* Top Banner */}
      <div className="bg-surface-container-low p-4 rounded border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 font-label-data-sm text-[11px] text-secondary font-semibold uppercase">
            <span className="material-symbols-outlined text-[16px]">layers</span>
            <span>Himalayan Thermal Envelope Material Library</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Thermophysical Properties &amp; Local Sourcing
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Database of certified thermal conductivity (k), density, volumetric heat capacity, and high-altitude durability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-white text-slate-800 text-xs font-semibold border border-slate-200">
            IS:3792 &amp; EN 12667 Certified
          </span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors shrink-0 ${
              selectedCategory === cat
                ? 'bg-primary text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Materials Table Card */}
      <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-label-data-sm text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-600 uppercase font-meta-caps text-[10px] border-b border-slate-200">
                <th className="py-3 px-3">Material Assembly</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Thickness</th>
                <th className="py-3 px-3">Conductivity (k)</th>
                <th className="py-3 px-3">Density (ρ)</th>
                <th className="py-3 px-3">Thermal Resistance</th>
                <th className="py-3 px-3">Embodied Carbon &amp; Sourcing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredMaterials.map((mat) => (
                <tr key={mat.name} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{mat.name}</div>
                    <div className="text-[10px] text-slate-500 font-sans">{mat.localAvailability}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] border border-slate-200">
                      {mat.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono">{mat.thicknessMm} mm</td>
                  <td className="py-3 px-3 font-mono font-medium text-secondary">
                    {mat.conductivityK.toFixed(3)} W/m·K
                  </td>
                  <td className="py-3 px-3 font-mono">{mat.densityKgM3} kg/m³</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    R-{mat.rValueMetric.toFixed(2)} m²K/W
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-emerald-700 font-medium font-sans text-[11px]">
                      {mat.embodiedCarbon}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ShelterGeometryParams } from '../types';
import { INITIAL_GEOMETRY } from '../data/mockData';

interface ShelterDesignViewProps {
  onSubmitSolver: () => void;
  onExportIDF: () => void;
}

export const ShelterDesignView: React.FC<ShelterDesignViewProps> = ({
  onSubmitSolver,
  onExportIDF,
}) => {
  const [params, setParams] = useState<ShelterGeometryParams>(INITIAL_GEOMETRY);
  const [renderMode, setRenderMode] = useState<'solid' | 'wireframe' | 'flux'>('solid');
  const [presetName, setPresetName] = useState('Ladakh High-Pass Barracks');
  const [saveToast, setSaveToast] = useState(false);

  // Live calculations
  const L = params.length;
  const W = params.width;
  const H_ridge = params.ridgeHeight;
  const H_eaves = params.eavesHeight;
  const avgH = (H_ridge + H_eaves) / 2;

  const grossFloorArea = L * W;
  const netVolume = grossFloorArea * avgH;
  // Monopitch roof slope length = sqrt(W^2 + (H_ridge - H_eaves)^2)
  const roofSlope = Math.sqrt(Math.pow(W, 2) + Math.pow(H_ridge - H_eaves, 2));
  // Total envelope surface area = 2*GFA (floor+ceiling) + 2*L*avgH (north+south) + W*H_ridge + W*H_eaves + L*roofSlope
  const envelopeSurface = 2 * grossFloorArea + 2 * L * avgH + W * H_ridge + W * H_eaves + L * roofSlope;
  const svRatio = netVolume > 0 ? envelopeSurface / netVolume : 1.36;

  // South WWR %
  const southWallArea = L * H_eaves;
  const southWWR = southWallArea > 0 ? Math.min(100, Math.round((params.southGlazingArea / southWallArea) * 100)) : 38;

  // Preset switch
  const handleApplyPreset = (preset: string) => {
    setPresetName(preset);
    if (preset === 'Ladakh High-Pass Barracks') {
      setParams(INITIAL_GEOMETRY);
    } else if (preset === 'Siachen Glacial Outpost Habitation Pod') {
      setParams({
        ...INITIAL_GEOMETRY,
        length: 8.0,
        width: 5.0,
        pitchAngle: 40,
        ridgeHeight: 3.2,
        eavesHeight: 2.2,
        southGlazingArea: 14.5,
      });
    } else if (preset === 'Changtang High-Altitude Nomadic Educational Pod') {
      setParams({
        ...INITIAL_GEOMETRY,
        length: 12.0,
        width: 7.0,
        pitchAngle: 28,
        ridgeHeight: 3.6,
        eavesHeight: 2.5,
        southGlazingArea: 22.0,
      });
    }
  };

  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleReset = () => {
    setParams(INITIAL_GEOMETRY);
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Sub-Header Workspace Utility Strip */}
      <div className="w-full bg-surface-container-low px-4 py-2.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-200/70 shadow-xs select-none">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <h1 className="font-headline-sm text-sm md:text-base text-slate-900 font-semibold tracking-tight">
              Shelter Configuration • 3D Geometry & Thermal Envelope Studio
            </h1>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-label-data-sm text-[10px] font-medium border border-slate-200">
              SIH26051 Specs
            </span>
          </div>
          <p className="font-body-sm text-xs text-slate-600 mt-0.5">
            Parametric envelope modeling for high-altitude extreme terrain (Ladakh 4,200m ASL • Sub-Zero Envelope Optimization)
          </p>
        </div>

        {/* Quick Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleReset}
            className="px-2.5 py-1 rounded bg-white text-slate-700 hover:bg-slate-100 transition-colors text-xs font-medium flex items-center gap-1 border border-slate-200 shadow-xs"
            title="Revert to standard default parameters"
          >
            <span className="material-symbols-outlined text-[15px]">restart_alt</span>
            <span>Reset Defaults</span>
          </button>

          {/* Preset Selector */}
          <div className="relative group">
            <button className="px-2.5 py-1 rounded bg-white text-slate-800 hover:bg-slate-100 transition-colors text-xs font-medium flex items-center gap-1 border border-slate-200 shadow-xs">
              <span className="material-symbols-outlined text-[15px] text-secondary">bookmark</span>
              <span className="truncate max-w-[170px]">Preset: {presetName}</span>
              <span className="material-symbols-outlined text-[14px] text-slate-400">arrow_drop_down</span>
            </button>
            <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded border border-slate-200 shadow-lg py-1 hidden group-hover:block z-50">
              <button
                onClick={() => handleApplyPreset('Ladakh High-Pass Barracks')}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 text-slate-800 font-medium"
              >
                Ladakh High-Pass Barracks (10m x 6m)
              </button>
              <button
                onClick={() => handleApplyPreset('Siachen Glacial Outpost Habitation Pod')}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 text-slate-800"
              >
                Siachen Glacial Outpost (8m x 5m)
              </button>
              <button
                onClick={() => handleApplyPreset('Changtang High-Altitude Nomadic Educational Pod')}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 text-slate-800"
              >
                Changtang School Pod (12m x 7m)
              </button>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors text-xs font-medium flex items-center gap-1 border border-slate-300/80 shadow-xs"
          >
            <span className="material-symbols-outlined text-[15px]">save</span>
            <span>{saveToast ? 'Saved!' : 'Save v3.4'}</span>
          </button>

          <button
            onClick={onExportIDF}
            className="px-3 py-1 rounded bg-primary text-white hover:bg-slate-800 transition-colors text-xs font-semibold flex items-center gap-1 shadow-xs"
          >
            <span className="material-symbols-outlined text-[15px]">terminal</span>
            <span>Export CAD/IDF</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Split Engineering Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 w-full">
        {/* ========================================== */}
        {/* PANEL 1 (Left 28% ~ lg:col-span-3 or 4)    */}
        {/* PARAMETRIC ENVELOPE INPUTS                 */}
        {/* ========================================== */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-3">
          <div className="bg-white p-3.5 rounded border border-slate-200/90 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[20px]">tune</span>
                <span className="font-headline-sm text-sm font-semibold text-slate-900">
                  Geometry & Boundary
                </span>
              </div>
              <span className="font-meta-caps text-[9px] uppercase px-1.5 py-0.5 rounded bg-orange-100 text-orange-950 font-bold tracking-wider border border-orange-200">
                LIVE SOLVER
              </span>
            </div>

            {/* Section 1: Dimensions & Footprint */}
            <div className="flex flex-col gap-2.5 bg-slate-50 p-2.5 rounded border border-slate-200/60">
              <div className="flex items-center justify-between">
                <span className="font-meta-caps text-[10px] text-slate-800 uppercase tracking-wider font-semibold">
                  1. Dimensions & Footprint
                </span>
                <span className="font-label-data-sm text-[10px] text-slate-500">SI Unit [m]</span>
              </div>

              {/* Length */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-body-sm text-xs text-slate-600">Length (North-South Axis)</span>
                  <span className="font-label-data-md text-xs font-bold text-slate-900 font-mono">
                    {params.length.toFixed(1)} m
                  </span>
                </div>
                <input
                  className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-secondary"
                  max="18.0"
                  min="6.0"
                  step="0.5"
                  type="range"
                  value={params.length}
                  onChange={(e) => setParams({ ...params, length: parseFloat(e.target.value) })}
                />
              </div>

              {/* Width */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-body-sm text-xs text-slate-600">Width (East-West Depth)</span>
                  <span className="font-label-data-md text-xs font-bold text-slate-900 font-mono">
                    {params.width.toFixed(1)} m
                  </span>
                </div>
                <input
                  className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-secondary"
                  max="12.0"
                  min="4.0"
                  step="0.5"
                  type="range"
                  value={params.width}
                  onChange={(e) => setParams({ ...params, width: parseFloat(e.target.value) })}
                />
              </div>

              {/* Heights Grid */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="flex flex-col bg-white p-2 rounded border border-slate-200">
                  <span className="font-meta-caps text-[9px] text-slate-500 uppercase">Ridge Height</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <input
                      className="w-12 font-label-data-md text-sm font-bold text-slate-900 bg-transparent focus:outline-none"
                      step="0.1"
                      type="number"
                      value={params.ridgeHeight}
                      onChange={(e) =>
                        setParams({ ...params, ridgeHeight: parseFloat(e.target.value) || 3.4 })
                      }
                    />
                    <span className="font-label-data-sm text-[10px] text-slate-400">m</span>
                  </div>
                </div>

                <div className="flex flex-col bg-white p-2 rounded border border-slate-200">
                  <span className="font-meta-caps text-[9px] text-slate-500 uppercase">Eaves Height</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <input
                      className="w-12 font-label-data-md text-sm font-bold text-slate-900 bg-transparent focus:outline-none"
                      step="0.1"
                      type="number"
                      value={params.eavesHeight}
                      onChange={(e) =>
                        setParams({ ...params, eavesHeight: parseFloat(e.target.value) || 2.4 })
                      }
                    />
                    <span className="font-label-data-sm text-[10px] text-slate-400">m</span>
                  </div>
                </div>
              </div>

              {/* Floors */}
              <div className="flex items-center justify-between bg-white px-2 py-1.5 rounded border border-slate-200 text-xs">
                <span className="font-body-sm text-slate-700">Floor Scheme</span>
                <span className="font-label-data-sm text-[10px] text-[#004b73] bg-sky-50 px-1.5 py-0.5 rounded font-medium border border-sky-200">
                  {params.floorScheme}
                </span>
              </div>
            </div>

            {/* Section 2: Shape & Roof Configuration */}
            <div className="flex flex-col gap-2.5 bg-slate-50 p-2.5 rounded border border-slate-200/60">
              <div className="flex items-center justify-between">
                <span className="font-meta-caps text-[10px] text-slate-800 uppercase tracking-wider font-semibold">
                  2. Roof & Solar Azimuth
                </span>
                <span className="material-symbols-outlined text-[15px] text-secondary">wb_sunny</span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-body-sm text-xs text-slate-600">Shelter Form Envelope</label>
                <div className="p-1.5 rounded bg-white font-label-data-sm text-[11px] text-slate-900 flex items-center justify-between border border-slate-200">
                  <span>Compact Monolithic Box</span>
                  <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[10px]">
                    Min A/V
                  </span>
                </div>
              </div>

              {/* Roof Pitch */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-body-sm text-slate-600">Monopitch South Slope</span>
                  <span className="font-label-data-md text-xs font-bold text-secondary font-mono">
                    {params.pitchAngle}° Angle
                  </span>
                </div>
                <input
                  className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-secondary"
                  max="55"
                  min="15"
                  step="1"
                  type="range"
                  value={params.pitchAngle}
                  onChange={(e) => setParams({ ...params, pitchAngle: parseInt(e.target.value, 10) })}
                />
              </div>

              {/* Azimuth Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-body-sm text-slate-600">Orientation Azimuth</span>
                  <span className="font-label-data-md text-xs font-bold text-slate-900 font-mono">
                    {params.azimuthDeg === 0
                      ? '0° True South'
                      : params.azimuthDeg > 0
                      ? `+${params.azimuthDeg}° West`
                      : `${params.azimuthDeg}° East`}
                  </span>
                </div>
                <input
                  className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-slate-900"
                  max="45"
                  min="-45"
                  step="1"
                  type="range"
                  value={params.azimuthDeg}
                  onChange={(e) => setParams({ ...params, azimuthDeg: parseInt(e.target.value, 10) })}
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-label-data-sm px-0.5">
                  <span>-45° East</span>
                  <span className="font-bold text-secondary">0° South</span>
                  <span>+45° West</span>
                </div>
              </div>
            </div>

            {/* Section 3: Fenestration & Openings */}
            <div className="flex flex-col gap-2.5 bg-slate-50 p-2.5 rounded border border-slate-200/60">
              <div className="flex items-center justify-between">
                <span className="font-meta-caps text-[10px] text-slate-800 uppercase tracking-wider font-semibold">
                  3. Solar Apertures & Fenestration
                </span>
                <span className="px-1.5 py-0.5 rounded bg-secondary text-white font-label-data-sm text-[10px] font-bold">
                  {southWWR}% S-WWR
                </span>
              </div>

              {/* South Glazing */}
              <div className="flex flex-col gap-1 bg-white p-2 rounded border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-body-sm text-xs text-slate-900 font-medium">South Glazing Area</span>
                  <span className="font-label-data-md text-xs text-secondary font-bold font-mono">
                    {params.southGlazingArea.toFixed(1)} m²
                  </span>
                </div>
                <span className="font-body-sm text-[11px] text-slate-500">
                  Triple Argon Low-E (U = 0.80 W/m²K, SHGC = 0.62)
                </span>
                <input
                  className="w-full h-1 bg-slate-200 rounded appearance-none cursor-pointer accent-secondary mt-1"
                  max="30.0"
                  min="8.0"
                  step="0.5"
                  type="range"
                  value={params.southGlazingArea}
                  onChange={(e) =>
                    setParams({ ...params, southGlazingArea: parseFloat(e.target.value) })
                  }
                />
              </div>

              {/* Cold Buffer Facades */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-2 rounded border border-slate-200 flex flex-col">
                  <span className="font-meta-caps text-[9px] text-slate-500 uppercase">North Wall</span>
                  <span className="font-label-data-md text-xs font-semibold text-slate-900 mt-0.5 font-mono">
                    0.0 m²
                  </span>
                  <span className="text-[9px] text-slate-400">Earth-Bermed (R-42)</span>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200 flex flex-col">
                  <span className="font-meta-caps text-[9px] text-slate-500 uppercase">East/West Windows</span>
                  <span className="font-label-data-md text-xs font-semibold text-slate-900 mt-0.5 font-mono">
                    1.8 m² ea.
                  </span>
                  <span className="text-[9px] text-slate-400">Quad-glazed buffer</span>
                </div>
              </div>

              {/* Architectural Thermal Locks */}
              <div className="flex flex-col gap-1.5 pt-0.5">
                <label className="flex items-center justify-between bg-white px-2 py-1.5 rounded border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">meeting_room</span>
                    <span className="font-body-sm text-xs text-slate-800">Air-Lock Vestibule Buffer</span>
                  </div>
                  <input
                    checked={params.airLockVestibule}
                    onChange={(e) => setParams({ ...params, airLockVestibule: e.target.checked })}
                    className="accent-secondary w-4 h-4 cursor-pointer"
                    type="checkbox"
                  />
                </label>

                <label className="flex items-center justify-between bg-white px-2 py-1.5 rounded border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">roller_shades</span>
                    <span className="font-body-sm text-xs text-slate-800">R-10 Quilted Thermal Curtain</span>
                  </div>
                  <input
                    checked={params.quiltedCurtain}
                    onChange={(e) => setParams({ ...params, quiltedCurtain: e.target.checked })}
                    className="accent-secondary w-4 h-4 cursor-pointer"
                    type="checkbox"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* PANEL 2 (Center 44% ~ lg:col-span-5 or 6)  */}
        {/* ISOMETRIC 3D SIMULATION VIEWPORT           */}
        {/* ========================================== */}
        <div className="lg:col-span-8 xl:col-span-6 flex flex-col gap-3">
          <div className="bg-white rounded border border-slate-200/90 shadow-xs overflow-hidden flex flex-col">
            {/* Viewport Toolbar HUD */}
            <div className="bg-primary-container px-4 py-2 flex items-center justify-between text-white border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 font-label-data-sm text-xs">
                  <span className="material-symbols-outlined text-[16px] text-secondary-container">view_in_ar</span>
                  <span className="font-semibold tracking-wide uppercase text-white">
                    ISOMETRIC THERMAL MESH
                  </span>
                </div>
                <div className="flex items-center bg-slate-900 rounded p-0.5 border border-slate-700">
                  <button
                    onClick={() => setRenderMode('wireframe')}
                    className={`px-2 py-0.5 rounded text-[11px] font-label-data-sm transition-colors ${
                      renderMode === 'wireframe'
                        ? 'bg-slate-700 text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Wireframe
                  </button>
                  <button
                    onClick={() => setRenderMode('solid')}
                    className={`px-2 py-0.5 rounded text-[11px] font-label-data-sm transition-colors ${
                      renderMode === 'solid'
                        ? 'bg-slate-700 text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Solid Render
                  </button>
                  <button
                    onClick={() => setRenderMode('flux')}
                    className={`px-2 py-0.5 rounded text-[11px] font-label-data-sm transition-colors flex items-center gap-1 ${
                      renderMode === 'flux'
                        ? 'bg-secondary text-white font-semibold'
                        : 'text-secondary-container hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[12px]">local_fire_department</span>
                    <span>Flux Map</span>
                  </button>
                </div>
              </div>

              {/* Solar Radiation Live Vector HUD */}
              <div className="flex items-center gap-2.5 font-label-data-sm text-[11px]">
                <span className="flex items-center gap-1 text-secondary-container bg-white/10 px-2 py-0.5 rounded border border-white/15">
                  <span className="material-symbols-outlined text-[14px]">wb_sunny</span>
                  <span>820 W/m² Sol-Flux</span>
                </span>
                <span className="text-slate-300 hidden sm:inline">Alt: 34° (Dec Solstice)</span>
              </div>
            </div>

            {/* Render Stage SVG Graphic Canvas */}
            <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-3 select-none overflow-hidden">
              {/* Background Grid Matrix Lines */}
              <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern height="40" id="studioGrid" patternUnits="userSpaceOnUse" width="40">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#76777d" strokeWidth="0.5"></path>
                  </pattern>
                </defs>
                <rect fill="url(#studioGrid)" height="100%" width="100%"></rect>
              </svg>

              {/* Cardinal Orientation HUD Overlay */}
              <div className="absolute top-3 left-3 flex flex-col items-center bg-white/95 backdrop-blur px-2 py-1.5 rounded shadow-sm border border-slate-200">
                <span className="font-meta-caps text-[9px] text-secondary font-bold">N</span>
                <div className="relative w-7 h-7 flex items-center justify-center my-0.5">
                  <svg
                    className="w-full h-full transition-transform duration-300"
                    style={{ transform: `rotate(${params.azimuthDeg}deg)` }}
                    viewBox="0 0 32 32"
                  >
                    <circle cx="16" cy="16" fill="none" r="14" stroke="#94a3b8" strokeDasharray="2,2" strokeWidth="1"></circle>
                    <polygon fill="#fd651e" points="16,4 19,16 16,14 13,16"></polygon>
                    <polygon fill="#64748b" points="16,28 19,16 16,14 13,16"></polygon>
                  </svg>
                </div>
                <span className="font-label-data-sm text-[10px] text-slate-800 font-semibold font-mono">
                  {params.azimuthDeg}° S
                </span>
              </div>

              {/* Sun Position & Solar Flux Vector */}
              <div className="absolute top-3 right-3 flex flex-col items-end">
                <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur px-2.5 py-1 rounded shadow-sm border border-slate-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
                  <span className="font-label-data-sm text-[11px] font-semibold text-slate-800">
                    Ladakh Solar Noon (34.15° N)
                  </span>
                </div>
                <span className="font-meta-caps text-[9px] text-slate-500 mt-1">
                  Deep Winter Penetration Zone
                </span>
              </div>

              {/* Precision Isometric Schematic Graphic */}
              <div className="relative w-full max-w-[560px] aspect-[16/11] flex items-center justify-center">
                <svg className="w-full h-full drop-shadow-md overflow-visible" viewBox="0 0 680 480" xmlns="http://www.w3.org/2000/svg">
                  {/* Solar Rays Entering South Glazing */}
                  <g opacity="0.85" stroke="#fd651e" strokeDasharray="4,3" strokeWidth="2">
                    <line x1="520" x2="330" y1="40" y2="280"></line>
                    <line x1="570" x2="380" y1="50" y2="290"></line>
                    <line x1="620" x2="430" y1="60" y2="300"></line>
                    <circle cx="580" cy="45" fill="#fd651e" fillOpacity="0.2" r="16" stroke="#fd651e" strokeDasharray="0" strokeWidth="1.5"></circle>
                    <text fill="#a73a00" fontFamily="JetBrains Mono" fontSize="11" fontWeight="600" textAnchor="middle" x="580" y="24">
                      SOLAR NOON BEAM (34° INCIDENCE)
                    </text>
                  </g>

                  {/* Earth Berming Contour on North Side */}
                  <path
                    d="M 80,310 L 210,180 L 290,190 L 190,340 Z"
                    fill={renderMode === 'flux' ? '#0284c7' : '#e5eeff'}
                    fillOpacity={renderMode === 'wireframe' ? '0.2' : '0.8'}
                    stroke="#76777d"
                    strokeWidth="1.5"
                  ></path>
                  <text fill="#004b73" fontFamily="Inter" fontSize="10" fontWeight="700" x="130" y="250">
                    NORTH EARTH BERM (R-42)
                  </text>

                  {/* Main Isometric Base/Floor Slab */}
                  <polygon
                    fill={renderMode === 'flux' ? '#f59e0b' : '#bec6e0'}
                    fillOpacity={renderMode === 'wireframe' ? '0.2' : '1'}
                    points="170,330 420,380 540,290 290,240"
                    stroke="#76777d"
                    strokeWidth="2"
                  ></polygon>

                  {/* Ground Gravel Sub-Bed */}
                  <polygon
                    fill={renderMode === 'flux' ? '#ea580c' : '#76777d'}
                    opacity={renderMode === 'wireframe' ? '0.3' : '0.6'}
                    points="170,330 420,380 420,405 170,355"
                    stroke="#45464d"
                    strokeWidth="1"
                  ></polygon>
                  <polygon
                    fill={renderMode === 'flux' ? '#c2410c' : '#45464d'}
                    opacity={renderMode === 'wireframe' ? '0.3' : '0.7'}
                    points="420,380 540,290 540,315 420,405"
                    stroke="#45464d"
                    strokeWidth="1"
                  ></polygon>
                  <text fill="#131b2e" fontFamily="JetBrains Mono" fontSize="10" fontWeight="600" x="300" y="400">
                    HEAT SINK FOUNDATION (18.4 TON STONE BED)
                  </text>

                  {/* North Solid Infilled Wall */}
                  <polygon
                    fill={renderMode === 'flux' ? '#0369a1' : '#d3e4fe'}
                    fillOpacity={renderMode === 'wireframe' ? '0.2' : '1'}
                    points="170,330 170,210 290,130 290,240"
                    stroke="#004b73"
                    strokeWidth="1.5"
                  ></polygon>

                  {/* East Wall */}
                  <polygon
                    fill={renderMode === 'flux' ? '#0284c7' : '#eff4ff'}
                    fillOpacity={renderMode === 'wireframe' ? '0.2' : '1'}
                    points="290,240 290,130 540,175 540,290"
                    stroke="#76777d"
                    strokeWidth="1.5"
                  ></polygon>

                  {/* East Small Glazing */}
                  <polygon fill="#93ccff" points="390,230 430,238 430,195 390,187" stroke="#004b73" strokeWidth="1"></polygon>
                  <text fill="#45464d" fontFamily="Inter" fontSize="9" x="440" y="215">
                    Small East Port (1.8m²)
                  </text>

                  {/* Monopitch Sloping Roof */}
                  <polygon
                    fill={renderMode === 'flux' ? '#1e293b' : '#131b2e'}
                    fillOpacity={renderMode === 'wireframe' ? '0.3' : '1'}
                    points="150,205 305,120 565,165 410,250"
                    stroke="#000000"
                    strokeWidth="2"
                  ></polygon>

                  {/* Overhang Lip */}
                  <polygon fill="#fd651e" points="150,205 410,250 410,257 150,212"></polygon>
                  <text fill="#ffffff" fontFamily="Inter" fontSize="12" fontWeight="600" textAnchor="middle" x="320" y="180">
                    {params.pitchAngle}° MONOPITCH SOUTH ROOF
                  </text>

                  {/* SOUTH TROMBE WALL + HIGH-TRANSMITTANCE GLASSHOUSE FACADE */}
                  <polygon
                    fill={renderMode === 'flux' ? '#ea580c' : '#93ccff'}
                    fillOpacity={renderMode === 'flux' ? '0.5' : '0.35'}
                    points="170,330 170,210 420,255 420,380"
                    stroke="#004b73"
                    strokeWidth="2"
                  ></polygon>

                  {/* Trombe Wall Internal Heavy Masonry Absorber behind Glazing */}
                  <polygon
                    fill={renderMode === 'flux' ? '#b91c1c' : '#a73a00'}
                    fillOpacity={renderMode === 'flux' ? '0.75' : '0.55'}
                    points="190,315 190,225 395,260 395,355"
                    stroke="#a73a00"
                    strokeDasharray="3,2"
                    strokeWidth="1.5"
                  ></polygon>
                  <text fill="#ffffff" fontFamily="JetBrains Mono" fontSize="11" fontWeight="700" textAnchor="middle" x="290" y="295">
                    TROMBE WALL THERMAL MASS
                  </text>

                  {/* Glazing Grid Mullions */}
                  <line stroke="#004b73" strokeWidth="1.5" x1="250" x2="250" y1="225" y2="345"></line>
                  <line stroke="#004b73" strokeWidth="1.5" x1="330" x2="330" y1="240" y2="362"></line>
                  <line stroke="#004b73" strokeWidth="1.5" x1="170" x2="420" y1="270" y2="315"></line>

                  {/* Dimensional Engineering Annotation Markers */}
                  {/* Dimension X: Length */}
                  <g stroke="#000000" strokeWidth="1">
                    <line x1="160" x2="415" y1="340" y2="390"></line>
                    <circle cx="160" cy="340" fill="#000000" r="2.5"></circle>
                    <circle cx="415" cy="390" fill="#000000" r="2.5"></circle>
                  </g>
                  <rect fill="#ffffff" height="18" rx="2" width="80" x="250" y="375"></rect>
                  <text fill="#000000" fontFamily="JetBrains Mono" fontSize="11" fontWeight="700" textAnchor="middle" x="290" y="388">
                    {params.length.toFixed(2)} m
                  </text>

                  {/* Dimension Y: Width */}
                  <g stroke="#000000" strokeWidth="1">
                    <line x1="430" x2="550" y1="385" y2="295"></line>
                    <circle cx="430" cy="385" fill="#000000" r="2.5"></circle>
                    <circle cx="550" cy="295" fill="#000000" r="2.5"></circle>
                  </g>
                  <rect fill="#ffffff" height="18" rx="2" width="60" x="475" y="345"></rect>
                  <text fill="#000000" fontFamily="JetBrains Mono" fontSize="11" fontWeight="700" textAnchor="middle" x="505" y="358">
                    {params.width.toFixed(2)} m
                  </text>

                  {/* Dimension Z: Ridge Height */}
                  <g stroke="#000000" strokeWidth="1">
                    <line x1="140" x2="140" y1="205" y2="330"></line>
                    <line x1="135" x2="145" y1="205" y2="205"></line>
                    <line x1="135" x2="145" y1="330" y2="330"></line>
                  </g>
                  <rect fill="#ffffff" height="18" rx="2" width="50" x="85" y="260"></rect>
                  <text fill="#000000" fontFamily="JetBrains Mono" fontSize="11" fontWeight="700" textAnchor="middle" x="110" y="273">
                    {params.ridgeHeight.toFixed(2)} m
                  </text>
                </svg>
              </div>

              {/* Bottom Viewport Floating Legend */}
              <div className="absolute bottom-2 inset-x-3 flex items-center justify-between bg-white/95 backdrop-blur px-3 py-1 rounded shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 text-[11px] font-label-data-sm text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-xs bg-secondary inline-block"></span>
                    Trombe Mass Core
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-xs bg-sky-300 inline-block border border-sky-400"></span>
                    Argon Triple Glaze
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-2 rounded-xs bg-slate-200 inline-block border border-slate-300"></span>
                    Sub-grade Earth Berm
                  </span>
                </div>
                <div className="font-meta-caps text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                  SECTION RATIO 1:50 METRIC
                </div>
              </div>
            </div>

            {/* Envelope Technical Context Bar */}
            <div className="p-3 bg-slate-50 grid grid-cols-3 gap-2 border-t border-slate-200">
              <div className="flex items-center gap-2 bg-white p-2 rounded border border-slate-200">
                <span className="material-symbols-outlined text-secondary text-[20px]">wb_sunny</span>
                <div className="flex flex-col">
                  <span className="font-meta-caps text-[9px] text-slate-500 uppercase">Solar Shading Depth</span>
                  <span className="font-label-data-sm text-xs font-semibold text-slate-900 font-mono">
                    0.65m Eaves Overhang
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white p-2 rounded border border-slate-200">
                <span className="material-symbols-outlined text-[#188ace] text-[20px]">air</span>
                <div className="flex flex-col">
                  <span className="font-meta-caps text-[9px] text-slate-500 uppercase">Infiltration Target</span>
                  <span className="font-label-data-sm text-xs font-semibold text-slate-900 font-mono">
                    &lt; 0.60 ACH @ 50Pa
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white p-2 rounded border border-slate-200">
                <span className="material-symbols-outlined text-slate-700 text-[20px]">layers</span>
                <div className="flex flex-col">
                  <span className="font-meta-caps text-[9px] text-slate-500 uppercase">Wall Structure</span>
                  <span className="font-label-data-sm text-xs font-semibold text-slate-900">
                    Structural Insulated Panels
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-World Deployment Photographic Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded border border-slate-200/90 shadow-xs flex items-center gap-3">
              <img
                className="w-16 h-16 rounded object-cover shrink-0 bg-slate-100 border border-slate-200"
                alt="Architectural photo of an ultra-insulated modern passive solar military shelter deployed in the snow-covered mountainous terrain of Ladakh India"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvHquiLwyJHxGVNL3OCns4C1fpW92_gvrT8SzRMqJYLdcnbBRvVkfqctOcV2S-Bbse-SOXFHmjU5oqaze881JssskMCmDB56MepaV_hIc5xeUzFohwTTQg1i-dd6-rYx16nGah_9tJH3N__iV5A5qRdkC-4X0-T5PLn7NLyIUtddcpJSlzvelA3JXKVIASHSmEzRLdeVCvuOu7ZDlYL9mLBvJv5FZaffFBgKY2mwzBVKVNdt7gTsOg"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-meta-caps text-[9px] text-secondary font-bold uppercase">
                  Field Benchmark
                </span>
                <span className="font-headline-sm text-xs font-semibold text-slate-900 truncate">
                  Ladakh Pass Deployment
                </span>
                <span className="font-body-sm text-[11px] text-slate-500 line-clamp-1">
                  Operates down to -38°C without diesel genset
                </span>
              </div>
            </div>

            <div className="bg-white p-3 rounded border border-slate-200/90 shadow-xs flex items-center gap-3">
              <img
                className="w-16 h-16 rounded object-cover shrink-0 bg-slate-100 border border-slate-200"
                alt="Cutaway technical rendering showing high-density thermal storage trombe wall made of native dark stone storing heat during cold sunny day in Leh valley Himalayas"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl46xjtnMspXUgosg66qHtMYYTwi9IXyXi_zQpuA6V0C4jFNjf28qySFNOUll_OxdZW0KSvkRMyRChBfhL6U2lovW87Sdq9vBPRCWezN6g1pc-BRdetR4wzKqKih8m8QhgY7KT3Zr7yMgUTAPAfGiFHOeV247eWdFRNxgOJ1fJaJ9uthamQS7hZILonwjJBxg3dTB_dE6OntSqcCTl_KkuL9Z77MwkjQjaQoWe9WfIR9r_sbHEB_EG"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-meta-caps text-[9px] text-secondary font-bold uppercase">
                  Thermal Storage
                </span>
                <span className="font-headline-sm text-xs font-semibold text-slate-900 truncate">
                  Gravel Bed Regenerator
                </span>
                <span className="font-body-sm text-[11px] text-slate-500 line-clamp-1">
                  Phase change diurnal lag: 9.8 Hours
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* PANEL 3 (Right 28% ~ lg:col-span-3 or 4)   */}
        {/* CALCULATED REAL-TIME METRICS & COMPLIANCE  */}
        {/* ========================================== */}
        <div className="lg:col-span-12 xl:col-span-3 flex flex-col gap-3">
          {/* Instant Engineering Calculations Card */}
          <div className="bg-white p-3.5 rounded border border-slate-200/90 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px] text-secondary">calculate</span>
                <span className="font-headline-sm text-sm font-semibold text-slate-900">
                  Form Metrics
                </span>
              </div>
              <span className="font-label-data-sm text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Auto-Calc
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col bg-slate-50 p-2 rounded border border-slate-200">
                <span className="font-meta-caps text-[9px] text-slate-500 uppercase">Gross Floor Area</span>
                <span className="font-label-data-lg text-base font-bold text-slate-900 mt-1 font-mono">
                  {grossFloorArea.toFixed(1)} <span className="text-xs font-normal text-slate-500">m²</span>
                </span>
              </div>
              <div className="flex flex-col bg-slate-50 p-2 rounded border border-slate-200">
                <span className="font-meta-caps text-[9px] text-slate-500 uppercase">Net Volume</span>
                <span className="font-label-data-lg text-base font-bold text-slate-900 mt-1 font-mono">
                  {netVolume.toFixed(1)} <span className="text-xs font-normal text-slate-500">m³</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col bg-slate-50 p-2 rounded border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-meta-caps text-[9px] text-slate-500 uppercase">Envelope Surface (A)</span>
                <span className="font-label-data-md text-xs font-bold text-slate-900 font-mono">
                  {envelopeSurface.toFixed(1)} m²
                </span>
              </div>
            </div>

            {/* S/V Ratio Critical Gauge */}
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="font-headline-sm text-xs font-semibold text-slate-900">
                    S / V Compactness Ratio
                  </span>
                  <span
                    className="material-symbols-outlined text-[14px] text-slate-400 cursor-help"
                    title="Target for severe sub-zero cold climates is < 1.40 m⁻¹"
                  >
                    info
                  </span>
                </div>
                <span className="font-label-data-md text-xs font-bold text-orange-950 bg-orange-100 px-1.5 py-0.5 rounded font-mono border border-orange-200">
                  {svRatio.toFixed(2)} m⁻¹
                </span>
              </div>

              {/* Compactness Gauge Indicator */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                <div
                  className="bg-secondary h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(10, ((svRatio - 0.7) / (2.1 - 0.7)) * 100))}%` }}
                ></div>
              </div>
              <div className="flex justify-between font-label-data-sm text-[9px] text-slate-500">
                <span>0.9 (Optimum)</span>
                <span className="font-semibold text-secondary">Target &lt; 1.40</span>
                <span>2.1 (Poor)</span>
              </div>
            </div>

            {/* Solar Aperture & Thermal Mass Ratios */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 p-2 rounded border border-slate-200 flex flex-col">
                <span className="font-meta-caps text-[9px] text-slate-500 uppercase">Solar Aperture</span>
                <span className="font-label-data-md text-xs font-bold text-secondary mt-0.5 font-mono">
                  {(params.southGlazingArea / grossFloorArea).toFixed(2)}
                </span>
                <span className="text-[9px] text-slate-400 font-label-data-sm">Ladakh Optimum</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200 flex flex-col">
                <span className="font-meta-caps text-[9px] text-slate-500 uppercase">Mass:Glaze Ratio</span>
                <span className="font-label-data-md text-xs font-bold text-slate-900 mt-0.5 font-mono">
                  4.2 : 1
                </span>
                <span className="text-[9px] text-slate-400 font-label-data-sm">Direct Buffer</span>
              </div>
            </div>
          </div>

          {/* Structural & Weight Card */}
          <div className="bg-white p-3.5 rounded border border-slate-200/90 shadow-xs flex flex-col gap-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-slate-800">fitness_center</span>
                <span className="font-headline-sm text-sm font-semibold text-slate-900">
                  Tonnage & Logistics
                </span>
              </div>
              <span className="font-meta-caps text-[9px] text-[#004b73] bg-sky-50 px-1.5 py-0.5 rounded uppercase font-semibold border border-sky-200">
                Prefabricated
              </span>
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200">
              <div className="flex flex-col">
                <span className="font-body-sm text-xs text-slate-900 font-medium">Internal Thermal Mass</span>
                <span className="text-[9px] text-slate-500">Stone bed, Trombe masonry</span>
              </div>
              <span className="font-label-data-md text-xs font-bold text-slate-900 font-mono">
                {(14.2 + (grossFloorArea / 60) * 4.2).toFixed(1)} tons
              </span>
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200">
              <div className="flex flex-col">
                <span className="font-body-sm text-xs text-slate-900 font-medium">Estimated Assembly Time</span>
                <span className="text-[9px] text-slate-500">4-crew modular deployment</span>
              </div>
              <span className="font-label-data-md text-xs font-bold text-secondary font-mono">6.0 Days</span>
            </div>
          </div>

          {/* Live Engineering Compliance Status */}
          <div className="bg-white p-3.5 rounded border border-slate-200/90 shadow-xs flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-secondary">verified</span>
                <span className="font-headline-sm text-sm font-semibold text-slate-900">
                  Standard Compliance
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-950 font-label-data-sm text-[10px] font-bold border border-orange-200">
                98% PASS
              </span>
            </div>

            {/* Compliance List Items */}
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2 bg-slate-50 p-2 rounded border border-slate-200">
                <span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">check_circle</span>
                <div className="flex flex-col">
                  <span className="font-body-sm text-xs text-slate-900 font-semibold">
                    Himalayan Eco-Shelter Standard
                  </span>
                  <span className="text-[10px] text-slate-500">
                    IS:3792 Thermal Comfort Compliant for Zone V
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-slate-50 p-2 rounded border border-slate-200">
                <span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">check_circle</span>
                <div className="flex flex-col">
                  <span className="font-body-sm text-xs text-slate-900 font-semibold">
                    Internal Base Temp Stability
                  </span>
                  <span className="text-[10px] text-slate-500">
                    &gt; +15.2°C Min Temp without auxiliary heating fuel
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-slate-50 p-2 rounded border border-slate-200">
                <span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">check_circle</span>
                <div className="flex flex-col">
                  <span className="font-body-sm text-xs text-slate-900 font-semibold">
                    Carbon Neutral Lifecycle
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Zero kero/diesel combustion indoor emissions
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onSubmitSolver}
              className="w-full mt-1 py-2 px-3 rounded bg-primary text-white hover:bg-slate-800 transition-colors text-xs font-semibold flex items-center justify-center gap-2 shadow-xs"
            >
              <span className="material-symbols-outlined text-[17px] text-orange-300">play_circle</span>
              <span>Submit to Thermal Solver</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

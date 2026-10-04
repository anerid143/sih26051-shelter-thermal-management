import { ThermalProject, ThermalProjectData } from '../types';

export const STORAGE_KEY_PROJECTS = 'sheltertherm_projects';
export const STORAGE_KEY_ACTIVE_ID = 'sheltertherm_active_project_id';

export const DEFAULT_HIMALAYAN_PROJECT: ThermalProject = {
  id: 'leh-passive-v34',
  name: 'Himalayan Passive Shelter',
  location: 'Leh District, UT Ladakh',
  elevation: 3524,
  iteration: 'Iteration v3.4 [Passive Solar + Trombe Wall]',
  meshEngine: '1D Transient Thermal Network',
  status: 'Validated',
  createdAt: '2026-10-01',
  lastRun: 'Today, 14:32 IST',
  designCode: 'SIH26051',
  stationId: 'LEH-IND-4299',
  latitude: '34.1526° N, 77.5771° E',
  altitudeMeters: 3524,
  solverMesh: '1D Transient Thermal Network',
  data: {
    indoorTemperature: 18.4,
    outdoorTemperature: -16.4,
    solarGain: 42.8,
    heatLoss: 38.2,
    thermalStorage: 14.6,
    thermalAutonomy: 94.2,
    windSpeed: 6.8,
    nightMin: -24.2,
  },
};

export const INITIAL_PROJECTS_LIST: ThermalProject[] = [
  DEFAULT_HIMALAYAN_PROJECT,
  {
    id: 'siachen-post-54',
    name: 'Siachen Glacial Outpost Habitation Pod',
    location: 'Northern Glacier Sector, Ladakh',
    elevation: 5400,
    altitudeMeters: 5400,
    iteration: 'Iteration v2.1 [Vacuum Insulated + Phase Change Rock Bed]',
    meshEngine: '3D FEA Implicit Sol-Air Solver',
    solverMesh: '3D FEA Implicit Sol-Air Solver',
    status: 'Validated',
    createdAt: '2026-09-28',
    lastRun: 'Yesterday, 19:10 IST',
    designCode: 'SIH26051',
    stationId: 'SIA-IND-5400',
    latitude: '35.4210° N, 77.1090° E',
    data: {
      indoorTemperature: 17.2,
      outdoorTemperature: -23.8,
      solarGain: 49.5,
      heatLoss: 41.6,
      thermalStorage: 18.2,
      thermalAutonomy: 91.5,
      windSpeed: 10.4,
      nightMin: -28.6,
    },
  },
  {
    id: 'changtang-school-46',
    name: 'Changtang High-Altitude Nomadic Educational Pod',
    location: 'Nyoma Block, Eastern Ladakh',
    elevation: 4600,
    altitudeMeters: 4600,
    iteration: 'Iteration v1.8 [Direct Solar Gain + Heavy Rammed Earth]',
    meshEngine: '1D Transient Thermal Network',
    solverMesh: '1D Transient Thermal Network',
    status: 'Draft',
    createdAt: '2026-10-02',
    lastRun: 'Oct 01, 11:20 IST',
    designCode: 'SIH26051',
    stationId: 'NYM-IND-4600',
    latitude: '33.1900° N, 78.6500° E',
    data: {
      indoorTemperature: 19.1,
      outdoorTemperature: -14.8,
      solarGain: 38.6,
      heatLoss: 34.2,
      thermalStorage: 13.2,
      thermalAutonomy: 88.4,
      windSpeed: 5.6,
      nightMin: -21.4,
    },
  },
  {
    id: 'dras-cold-corridor-32',
    name: 'Dras Deep-Freeze Emergency Transit Shelter',
    location: 'Dras Sector, Kargil District',
    elevation: 3280,
    altitudeMeters: 3280,
    iteration: 'Iteration v4.0 [Dual-Wall Trombe + Aerogel Blanket]',
    meshEngine: '1D Transient Thermal Network',
    solverMesh: '1D Transient Thermal Network',
    status: 'Validated',
    createdAt: '2026-09-25',
    lastRun: 'Sep 28, 16:45 IST',
    designCode: 'SIH26051',
    stationId: 'DRAS-IND-3280',
    latitude: '34.4300° N, 75.7600° E',
    data: {
      indoorTemperature: 18.0,
      outdoorTemperature: -21.2,
      solarGain: 44.2,
      heatLoss: 39.8,
      thermalStorage: 16.0,
      thermalAutonomy: 92.8,
      windSpeed: 7.4,
      nightMin: -27.5,
    },
  },
];

/**
 * Resolves the meteorological station ID for a project.
 * Guaranteed to NEVER return SIH26051 or any hackathon/design code.
 */
export function getStationId(project?: Partial<ThermalProject>): string {
  if (
    project?.stationId &&
    !project.stationId.toUpperCase().includes('SIH') &&
    project.stationId.trim() !== ''
  ) {
    return project.stationId;
  }
  const loc = project?.location || 'Leh District';
  const elev = project?.elevation || project?.altitudeMeters || 3524;

  const locLower = loc.toLowerCase();
  if (locLower.includes('leh')) return 'LEH-IND-4299';
  if (locLower.includes('siachen')) return 'SIA-IND-5400';
  if (locLower.includes('nyoma') || locLower.includes('changtang')) return 'NYM-IND-4600';
  if (locLower.includes('dras') || locLower.includes('kargil')) return 'DRAS-IND-3280';

  const cleanLoc = loc.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'MET';
  return `${cleanLoc}-IND-${elev}`;
}

/**
 * Generates realistic and controlled thermal telemetry values for a new project.
 * Adheres strictly to:
 * - indoorTemperature: 16 to 22 °C
 * - outdoorTemperature: -25 to -5 °C
 * - solarGain: 30 to 55 kWh/d
 * - heatLoss: 25 to 45 kWh/d
 * - thermalStorage: 10 to 20 kWh
 * - thermalAutonomy: 75 to 98 %
 * - windSpeed: 3 to 12 m/s
 * - nightMin: -30 to -10 °C
 */
export function generateThermalData(name: string, elevation: number = 3200): ThermalProjectData {
  // Use a string hash to seed deterministic base variation, plus a slight entropy
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  // Pseudo-random normalized factors (0 to 1)
  const f1 = ((absHash % 100) + (Date.now() % 37)) % 100 / 100;
  const f2 = (((absHash >> 3) % 100) + (Date.now() % 53)) % 100 / 100;
  const f3 = (((absHash >> 6) % 100) + (Date.now() % 71)) % 100 / 100;
  const f4 = (((absHash >> 9) % 100) + (Date.now() % 89)) % 100 / 100;

  // Elevation correlation: higher altitude brings cooler baseline
  const elevationFactor = Math.min(1, Math.max(0, (elevation - 2000) / 4000));
  
  // Outdoor temperature: -25 to -5 °C
  const rawOutdoor = -5 - (15 * elevationFactor) - (5 * f1);
  const outdoorTemperature = Math.round(Math.max(-25, Math.min(-5, rawOutdoor)) * 10) / 10;

  // Night minimum: -30 to -10 °C (normally 5 to 9 °C lower than diurnal outdoor mean)
  const rawNightMin = outdoorTemperature - (5.2 + 3.4 * f2);
  const nightMin = Math.round(Math.max(-30, Math.min(-10, rawNightMin)) * 10) / 10;

  // Indoor operative: 16 to 22 °C (comfortable safe zone)
  const rawIndoor = 16.2 + 5.4 * f3;
  const indoorTemperature = Math.round(Math.max(16, Math.min(22, rawIndoor)) * 10) / 10;

  // Solar gain: 30 to 55 kWh/d
  const rawSolarGain = 32 + 21 * f4;
  const solarGain = Math.round(Math.max(30, Math.min(55, rawSolarGain)) * 10) / 10;

  // Heat loss: 25 to 45 kWh/d (balanced near solar gain with realistic offset)
  const rawHeatLoss = 26 + 18 * ((f1 + f2) / 2);
  const heatLoss = Math.round(Math.max(25, Math.min(45, rawHeatLoss)) * 10) / 10;

  // Thermal storage: 10 to 20 kWh
  const rawStorage = 10.5 + 9.0 * f3;
  const thermalStorage = Math.round(Math.max(10, Math.min(20, rawStorage)) * 10) / 10;

  // Thermal autonomy: 75 to 98 %
  const rawAutonomy = 78 + 19 * f2;
  const thermalAutonomy = Math.round(Math.max(75, Math.min(98, rawAutonomy)) * 10) / 10;

  // Wind speed: 3 to 12 m/s
  const rawWind = 3.5 + 8.0 * f1;
  const windSpeed = Math.round(Math.max(3, Math.min(12, rawWind)) * 10) / 10;

  return {
    indoorTemperature,
    outdoorTemperature,
    solarGain,
    heatLoss,
    thermalStorage,
    thermalAutonomy,
    windSpeed,
    nightMin,
  };
}

/**
 * Loads projects from localStorage or returns default presets.
 * Automatically sanitizes any legacy SIH26055 references to SIH26051.
 */
export function loadStoredProjects(): ThermalProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (raw) {
      // Migrate any raw text occurrences of SIH26055 or 26055
      const sanitizedRaw = raw.replace(/SIH26055/g, 'SIH26051').replace(/SIH-26055/g, 'SIH-26051');
      const parsed = JSON.parse(sanitizedRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let changed = raw !== sanitizedRaw;
        const result = parsed.map((p) => {
          if (!p.designCode || p.designCode === 'SIH26055' || p.designCode === 'SIH-26055' || p.designCode.includes('26055')) {
            p.designCode = 'SIH26051';
            changed = true;
          }
          if (typeof p.name === 'string' && p.name.includes('SIH26055')) {
            p.name = p.name.replace(/SIH26055/g, 'SIH26051');
            changed = true;
          }
          if (typeof p.iteration === 'string' && p.iteration.includes('SIH26055')) {
            p.iteration = p.iteration.replace(/SIH26055/g, 'SIH26051');
            changed = true;
          }
          if (!p.stationId || p.stationId.toUpperCase().includes('SIH')) {
            p.stationId = getStationId(p);
            changed = true;
          }
          if (!p.data) {
            p.data = generateThermalData(p.name, p.elevation || p.altitudeMeters || 3200);
            changed = true;
          }
          if (p.elevation === undefined) {
            p.elevation = p.altitudeMeters || 3524;
            changed = true;
          }
          return p;
        });

        if (changed) {
          try {
            localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(result));
          } catch {
            // ignore
          }
        }

        return result;
      }
    }
  } catch (err) {
    console.warn('Failed to load projects from localStorage:', err);
  }
  return INITIAL_PROJECTS_LIST;
}

/**
 * Persists projects to localStorage with SIH26051 normalization.
 */
export function saveStoredProjects(projects: ThermalProject[]): void {
  try {
    const sanitized = projects.map((p) => ({
      ...p,
      designCode:
        !p.designCode || p.designCode === 'SIH26055' || p.designCode === 'SIH-26055' || p.designCode.includes('26055')
          ? 'SIH26051'
          : p.designCode,
      stationId: getStationId(p),
      name: typeof p.name === 'string' ? p.name.replace(/SIH26055/g, 'SIH26051') : p.name,
      iteration: typeof p.iteration === 'string' ? p.iteration.replace(/SIH26055/g, 'SIH26051') : p.iteration,
    }));
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(sanitized));
  } catch (err) {
    console.warn('Failed to save projects to localStorage:', err);
  }
}

/**
 * Loads active project ID from localStorage.
 */
export function loadStoredActiveId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
  } catch {
    return null;
  }
}

/**
 * Persists active project ID to localStorage.
 */
export function saveStoredActiveId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
  } catch (err) {
    console.warn('Failed to save active project ID to localStorage:', err);
  }
}

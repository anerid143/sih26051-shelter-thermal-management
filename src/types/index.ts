export type NavModule = 
  | 'overview'
  | 'projects'
  | 'climate'
  | 'shelter-design'
  | 'materials'
  | 'simulation'
  | 'analysis'
  | 'compare-designs'
  | 'reports'
  | 'settings';

export type UnitSystem = 'SI' | 'Imperial';
export type TimeStep = '1h' | '15m';

export interface ThermalProjectData {
  indoorTemperature: number;
  outdoorTemperature: number;
  solarGain: number;
  heatLoss: number;
  thermalStorage: number;
  thermalAutonomy: number;
  windSpeed: number;
  nightMin: number;
}

export interface ThermalProject {
  id: string;
  name: string;
  location: string;
  elevation: number;
  iteration: string;
  meshEngine: string;
  status: 'Validated' | 'Draft';
  createdAt: string;

  data: ThermalProjectData;

  // Additional fields for compatibility across existing components
  altitudeMeters?: number;
  latitude?: string;
  designCode?: string;
  stationId?: string;
  solverMesh?: string;
  lastRun?: string;
}

// For seamless backwards compatibility
export type ProjectInfo = ThermalProject;

export interface ShelterGeometryParams {
  length: number; // m
  width: number; // m
  ridgeHeight: number; // m
  eavesHeight: number; // m
  floorScheme: string;
  envelopeForm: string;
  pitchAngle: number; // deg
  azimuthDeg: number; // -45 to +45 deg
  southGlazingArea: number; // m2
  airLockVestibule: boolean;
  quiltedCurtain: boolean;
  northBermed: boolean;
  eastWestWindowArea: number; // m2
}

export interface ThermalCalculations {
  grossFloorArea: number;
  netVolume: number;
  envelopeSurface: number;
  svRatio: number;
  solarApertureRatio: number;
  massGlazeRatio: number;
  internalThermalMassTons: number;
  assemblyDays: number;
  predictedIndoorOperative: number;
  complianceRate: number;
}

export interface HeatLossComponent {
  assembly: string;
  details: string;
  uValue: string;
  lossKwhDay: number;
  lossWK: number;
  sharePercent: number;
  isCritical?: boolean;
}

export interface DayDataPoint {
  day: string;
  dayIndex: number;
  tIndoor: number;
  tAmbient: number;
  solarFlux: number;
  label: string;
  peakHour: string;
}

import { HeatLossComponent, DayDataPoint, ShelterGeometryParams } from '../types';
import { DEFAULT_HIMALAYAN_PROJECT, INITIAL_PROJECTS_LIST } from '../utils/projectHelpers';

export const INITIAL_PROJECT = DEFAULT_HIMALAYAN_PROJECT;
export const PROJECTS_LIST = INITIAL_PROJECTS_LIST;

export const INITIAL_GEOMETRY: ShelterGeometryParams = {
  length: 10.0,
  width: 6.0,
  ridgeHeight: 3.4,
  eavesHeight: 2.4,
  floorScheme: 'Single Story + Loft Mass',
  envelopeForm: 'Compact Monolithic Box (Min A/V)',
  pitchAngle: 32,
  azimuthDeg: 0,
  southGlazingArea: 18.2,
  airLockVestibule: true,
  quiltedCurtain: true,
  northBermed: true,
  eastWestWindowArea: 1.8,
};

export const HEAT_LOSS_COMPONENTS: HeatLossComponent[] = [
  {
    assembly: 'High-Altitude Cold Roof (R-50 Rockwool)',
    details: 'Triple-layer membrane + timber truss air cavity',
    uValue: '0.09 W/m²K',
    lossKwhDay: 9.2,
    lossWK: 14.8,
    sharePercent: 24.1,
  },
  {
    assembly: 'South Double Low-E Glazing (Argon 16mm)',
    details: 'Aperture 22.4 m² with night insulated shutter down',
    uValue: '1.10 W/m²K',
    lossKwhDay: 8.4,
    lossWK: 13.5,
    sharePercent: 22.0,
  },
  {
    assembly: 'Controlled Infiltration / HRV System',
    details: 'Air leakage rate 0.35 ACH @ 50Pa + 82% sensible recovery',
    uValue: '0.35 ACH',
    lossKwhDay: 10.2,
    lossWK: 16.4,
    sharePercent: 26.7,
    isCritical: true,
  },
  {
    assembly: 'Perimeter & Sub-Floor Foamglas',
    details: '250mm cellular glass perimeter frost skirt',
    uValue: '0.14 W/m²K',
    lossKwhDay: 5.6,
    lossWK: 9.0,
    sharePercent: 14.7,
  },
  {
    assembly: 'North Earth-Bermed Trombe Backup Wall',
    details: '380mm rammed earth with exterior vacuum insulation',
    uValue: '0.12 W/m²K',
    lossKwhDay: 4.8,
    lossWK: 7.7,
    sharePercent: 12.5,
  }
];

export const SEVEN_DAY_DATA: DayDataPoint[] = [
  { day: 'Jan 15 (Day 1)', dayIndex: 0, tIndoor: 17.8, tAmbient: -18.2, solarFlux: 780, label: 'Jan 15', peakHour: '12:30' },
  { day: 'Jan 16 (Day 2)', dayIndex: 1, tIndoor: 18.2, tAmbient: -20.5, solarFlux: 840, label: 'Jan 16', peakHour: '12:45' },
  { day: 'Jan 17 (Day 3)', dayIndex: 2, tIndoor: 18.0, tAmbient: -23.8, solarFlux: 810, label: 'Jan 17', peakHour: '13:00' },
  { day: 'Jan 18 (Day 4)', dayIndex: 3, tIndoor: 20.8, tAmbient: -9.4, solarFlux: 890, label: 'Jan 18', peakHour: '13:00 Peak' },
  { day: 'Jan 19 (Day 5)', dayIndex: 4, tIndoor: 18.9, tAmbient: -24.2, solarFlux: 860, label: 'Jan 19', peakHour: '12:50' },
  { day: 'Jan 20 (Day 6)', dayIndex: 5, tIndoor: 18.1, tAmbient: -19.4, solarFlux: 820, label: 'Jan 20', peakHour: '13:10' },
  { day: 'Jan 21 (Day 7)', dayIndex: 6, tIndoor: 18.6, tAmbient: -16.4, solarFlux: 850, label: 'Jan 21', peakHour: '13:00' },
];

export const HOURLY_TIMESTEP_DATA = [
  { hour: '00:00', tIndoor: 17.2, tAmbient: -24.0, solarFlux: 0 },
  { hour: '03:00', tIndoor: 16.8, tAmbient: -24.2, solarFlux: 0 },
  { hour: '06:00', tIndoor: 16.5, tAmbient: -22.5, solarFlux: 15 },
  { hour: '09:00', tIndoor: 17.4, tAmbient: -18.1, solarFlux: 420 },
  { hour: '12:00', tIndoor: 19.8, tAmbient: -10.5, solarFlux: 850 },
  { hour: '13:00', tIndoor: 20.8, tAmbient: -9.4, solarFlux: 890 },
  { hour: '15:00', tIndoor: 20.2, tAmbient: -11.2, solarFlux: 620 },
  { hour: '18:00', tIndoor: 19.1, tAmbient: -16.8, solarFlux: 80 },
  { hour: '21:00', tIndoor: 18.3, tAmbient: -21.4, solarFlux: 0 },
];

export const MATERIAL_LAYERS = [
  {
    name: 'Vacuum Insulation Panels (VIP)',
    category: 'Advanced Insulation',
    thicknessMm: 50,
    conductivityK: 0.007,
    densityKgM3: 180,
    heatCapacityJ: 800,
    rValueMetric: 7.14,
    embodiedCarbon: 'Moderate',
    localAvailability: 'Imported to Leh depot',
  },
  {
    name: 'High-Density Rammed Earth / Adobe',
    category: 'Thermal Storage Core',
    thicknessMm: 380,
    conductivityK: 0.95,
    densityKgM3: 2050,
    heatCapacityJ: 1260,
    rValueMetric: 0.40,
    embodiedCarbon: 'Near Zero (Local silt & gravel)',
    localAvailability: '100% On-site Indus basin quarry',
  },
  {
    name: 'Cellular Glass (Foamglas T4+)',
    category: 'Sub-Grade Frost Skirt',
    thicknessMm: 250,
    conductivityK: 0.041,
    densityKgM3: 115,
    heatCapacityJ: 1000,
    rValueMetric: 6.10,
    embodiedCarbon: 'Low',
    localAvailability: 'Regional supply Chandigarh-Leh',
  },
  {
    name: 'Rockwool High-Density Batt (R-50)',
    category: 'Roof & Truss Insulation',
    thicknessMm: 280,
    conductivityK: 0.034,
    densityKgM3: 120,
    heatCapacityJ: 840,
    rValueMetric: 8.24,
    embodiedCarbon: 'Low-Medium',
    localAvailability: 'Stocked in BRO / Army engineering depots',
  },
  {
    name: 'Triple Low-E Argon 90% Glazing',
    category: 'Solar Aperture',
    thicknessMm: 36,
    conductivityK: 0.80,
    densityKgM3: 2500,
    heatCapacityJ: 840,
    rValueMetric: 1.25,
    embodiedCarbon: 'Medium',
    localAvailability: 'Prefabs transported via Manali-Leh axis',
  },
  {
    name: 'Washed Riverbed Granite Gravel Bed',
    category: 'Sub-Floor Regenerative Heat Sink',
    thicknessMm: 600,
    conductivityK: 2.20,
    densityKgM3: 2400,
    heatCapacityJ: 880,
    rValueMetric: 0.27,
    embodiedCarbon: 'Zero',
    localAvailability: 'Abundant in Leh Valley',
  },
];

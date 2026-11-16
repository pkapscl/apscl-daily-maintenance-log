// js/mock-data.js
// Master Data for Ashuganj Power Station Company Limited (APSCL)
// Division: ST & Aux.), North, Zone-B

export const DEFAULT_EQUIPMENT = [
  { id: '1', equipment_name: 'Coalescer Filter', kks_code: '20MBL30AT003', plant_area: 'GT Intake Air Filter', category: 'Filtration' },
  { id: '2', equipment_name: 'CALC ALARM COALESCER', kks_code: '20MBL10EU003', plant_area: 'GT Intake Air Filter', category: 'Instrumentation' },
  { id: '3', equipment_name: 'Filter Separator 02 DP', kks_code: '20EKE22AT001', plant_area: 'RMS', category: 'Gas System' },
  { id: '4', equipment_name: 'Pass #03 SSV', kks_code: '20EKD73AA073', plant_area: 'RMS', category: 'Valves' },
  { id: '5', equipment_name: 'Pass #01 Monitor Valve', kks_code: '20EKD71AA071', plant_area: 'RMS', category: 'Valves' },
  { id: '6', equipment_name: 'Pressure Regulator Valve', kks_code: '20EKD52AA072', plant_area: 'RMS', category: 'Valves' },
  { id: '7', equipment_name: 'Water Bath Heater 2', kks_code: '20EKC02AH001', plant_area: 'Water Bath Heater', category: 'Heater' },
  { id: '8', equipment_name: 'BFWP MIN RECR VLV', kks_code: '20LAB11AA081', plant_area: 'BFP 1', category: 'Pumps & Piping' },
  { id: '9', equipment_name: 'After cooler', kks_code: '20EKH12AC301', plant_area: 'GBC #02', category: 'Gas Booster' },
  { id: '10', equipment_name: 'NG PREM POSN CTRL', kks_code: '20MBP22DG151', plant_area: 'GT', category: 'Gas Turbine Fuel' },
  { id: '11', equipment_name: 'CCWP Heat Exchanger 02', kks_code: '20PGB10AC002', plant_area: 'CCW #02', category: 'Cooling System' },
  { id: '12', equipment_name: 'Cooling Water Heat Exchanger#1', kks_code: '20PGB10AC001', plant_area: 'CCW #01', category: 'Cooling System' },
  { id: '13', equipment_name: 'GT Rotor', kks_code: 'MBK22AE001', plant_area: 'GT', category: 'Turbine Core' },
  { id: '14', equipment_name: 'IP Economiser Drain MOV', kks_code: '20HAN20AA491', plant_area: 'HRSG', category: 'Boiler / HRSG' },
  { id: '15', equipment_name: 'Sampling Room Valve', kks_code: '20QUC30AA604', plant_area: 'Sampling Room', category: 'Sampling System' }
];

// All previous records removed as requested; starts with clean slate
export const DEFAULT_RECORDS = [];

export const DEFAULT_DOCUMENTS = [
  { id: '1', title: 'All Equipment List', category: 'Equipment list', feed_field: 'Equipment name', suggest_in_log: true, notes: 'Master list for ST & Aux., North Zone-B units.' },
  { id: '2', title: 'KKS List', category: 'KKS numbers', feed_field: 'KKS (auto-fill)', suggest_in_log: true, notes: 'Standard DIN Kraftwerk-Kennzeichensystem plant tagging index.' },
  { id: '3', title: 'Equipment + KKS List', category: 'Equipment + KKS', feed_field: 'Equipment name and KKS together', suggest_in_log: true, notes: 'Cross-mapping table for plant assets.' },
  { id: '4', title: 'Maintenance General Tools', category: 'Maintenance general tools', feed_field: 'Description of work', suggest_in_log: true, notes: 'Specialized hydraulic tensioners, magnetic drill, torque multipliers.' },
  { id: '5', title: 'TR Register', category: 'TR register', feed_field: 'Schedule / TR No.', suggest_in_log: true, notes: 'Technical Request (TR) issuance history and scheduled preventive orders.' },
  { id: '6', title: 'Permit To Work (PTW) Protocols', category: 'Other documents', feed_field: 'Remarks', suggest_in_log: false, notes: 'Lockout/Tagout (LOTO) isolation requirements for North Zone-B.' }
];

export const PLANT_AREAS = [
  'All areas',
  'ST',
  'ST Aux.',
  'GT',
  'GT Intake Air Filter',
  'HRSG',
  'RMS',
  'BFP 1',
  'GBC #02',
  'Sampling Room',
  'CCW #01',
  'CCW #02',
  'Water Bath Heater',
  'Water Intake'
];

// Three Authorized User Accounts
export const AUTH_USERS = [
  {
    userId: 'admin',
    password: 'apscl@admin123',
    name: 'Executive Engineer',
    role: 'Administrator'
  },
  {
    userId: 'engineer1',
    password: 'st@zoneB123',
    name: 'Shift In-Charge',
    role: 'Maintenance Engineer'
  },
  {
    userId: 'engineer2',
    password: 'north@apscl2026',
    name: 'Site Engineer',
    role: 'Mechanical Engineer'
  }
];

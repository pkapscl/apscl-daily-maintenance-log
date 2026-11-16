// api/_supabase.js
// Supabase serverless helper with embedded fallback for Vercel Serverless Functions

let supabaseClient = null;

// Initialize Supabase client if environment variables and library are available
export async function getSupabase() {
    if (supabaseClient) return supabaseClient;
    
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (url && key) {
        try {
            const { createClient } = await import('@supabase/supabase-js');
            supabaseClient = createClient(url, key);
            return supabaseClient;
        } catch (err) {
            console.warn('[Supabase Helper] @supabase/supabase-js not installed or failed to initialize, using memory fallback:', err.message);
        }
    }
    return null;
}

// In-memory mock database populated with the mockups seed data as fallback
export const mockData = {
    equipment: [
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
    ],
    documents: [
        { id: '1', title: 'All Equipment List', category: 'Equipment list', feed_field: 'Equipment name', suggest_in_log: true },
        { id: '2', title: 'KKS List', category: 'KKS numbers', feed_field: 'KKS (auto-fill)', suggest_in_log: true },
        { id: '3', title: 'Equipment + KKS List', category: 'Equipment + KKS', feed_field: 'Equipment name and KKS together', suggest_in_log: true },
        { id: '4', title: 'Maintenance General Tools', category: 'Tools', feed_field: 'Description of work', suggest_in_log: true },
        { id: '5', title: 'TR Register', category: 'TR register', feed_field: 'Schedule / TR No.', suggest_in_log: true }
    ],
    records: []
};

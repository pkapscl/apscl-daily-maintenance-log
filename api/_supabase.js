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
    records: [
        { id: 'rec-1', record_date: '2026-11-02', plant_area: 'GT Intake Air Filter', tr_no: '', equipment_name: 'Coalescer Filter', kks_code: '20MBL30AT003', work_description: 'Coalescer filter has been changed by washed filter.', remarks: '', status: 'completed' },
        { id: 'rec-2', record_date: '2026-10-04', plant_area: 'RMS', tr_no: 'TSFTN-1331', equipment_name: 'Filter Separator 02 DP', kks_code: '20EKE22AT001', work_description: 'Filter has been dismantled. New filter has been installed.', remarks: '', status: 'completed' },
        { id: 'rec-3', record_date: '2026-10-03', plant_area: 'RMS', tr_no: '', equipment_name: 'Pass #03 SSV', kks_code: '20EKD73AA073', work_description: 'Valve dismantled, cleaned, assembled with greasing. Opens and closes easily.', remarks: '', status: 'completed' },
        { id: 'rec-4', record_date: '2026-10-02', plant_area: 'RMS', tr_no: '', equipment_name: 'Pass #03 SSV', kks_code: '20EKD73AA073', work_description: 'Valve checked, found trouble. SSV does not play up and down; needs dismantling.', remarks: '', status: 'completed' },
        { id: 'rec-5', record_date: '2026-09-30', plant_area: 'GT Intake Air Filter', tr_no: 'TSFTN-1326', equipment_name: 'Coalescer Filter', kks_code: '20MBL30AT003', work_description: 'CALC ALARM COALESCER ">MAX" alarm on DCS. All Coalescer filters changed by new filters.', remarks: '', status: 'completed' },
        { id: 'rec-6', record_date: '2026-09-28', plant_area: 'BFP 1', tr_no: 'TSFTN-1315', equipment_name: 'BFWP MIN RECR VLV', kks_code: '20LAB11AA081', work_description: 'Valve repair works going on. Magnetic drill machine brought from water intake south ST division.', remarks: '', status: 'in_progress' },
        { id: 'rec-7', record_date: '2026-09-27', plant_area: 'BFP 1', tr_no: 'TSFTN-1315', equipment_name: 'BFWP MIN RECR VLV', kks_code: '20LAB11AA081', work_description: 'Valve dismantled; damage found in the valve body portion.', remarks: '', status: 'in_progress' },
        { id: 'rec-8', record_date: '2026-08-12', plant_area: 'GBC #02', tr_no: 'Schedule', equipment_name: 'After cooler', kks_code: '20EKH12AC301', work_description: 'Clearance taken from Control room. Site preparatory works going on for dismantling.', remarks: '', status: 'in_progress' },
        { id: 'rec-9', record_date: '2026-08-09', plant_area: 'Sampling Room', tr_no: '', equipment_name: 'Sampling Room Valve', kks_code: '20QUC30AA604', work_description: 'Valve blocked by solid particle. Line flushed and pipeline cleared.', remarks: '', status: 'completed' },
        { id: 'rec-10', record_date: '2026-07-10', plant_area: 'RMS', tr_no: 'Schedule', equipment_name: 'Pass #01 Monitor Valve', kks_code: '20EKD71AA071', work_description: 'Feeder and pilot valves checked. Minor diaphragm damage in 2nd pilot. SSV sleeve jammed; cleaned.', remarks: '', status: 'completed' },
        { id: 'rec-11', record_date: '2026-07-07', plant_area: 'GT Intake Air Filter', tr_no: 'TSFTN-1286', equipment_name: 'CALC ALARM COALESCER', kks_code: '20MBL10EU003', work_description: 'Filter replaced by one cleaned set.', remarks: '', status: 'completed' },
        { id: 'rec-12', record_date: '2026-06-24', plant_area: 'GT', tr_no: 'TSFTN-1268', equipment_name: 'NG PREM POSN CTRL', kks_code: '20MBP22DG151', work_description: 'Location confirmed with new machine. PPM 75 found at union socket of NG drainage pipeline.', remarks: '', status: 'completed' },
        { id: 'rec-13', record_date: '2026-06-23', plant_area: 'GT', tr_no: 'TSFTN-1268', equipment_name: 'NG PREM POSN CTRL', kks_code: '20MBP22DG151', work_description: 'Gas leakage found under valve in GT enclosure area.', remarks: '', status: 'in_progress' },
        { id: 'rec-14', record_date: '2026-06-15', plant_area: 'CCW #02', tr_no: 'TSFTN-1245', equipment_name: 'CCWP Heat Exchanger 02', kks_code: '20PGB10AC002', work_description: 'Minor leakage found; re-tightened. Plate gap now 1160mm.', remarks: '', status: 'completed' },
        { id: 'rec-15', record_date: '2026-06-14', plant_area: 'CCW #02', tr_no: 'TSFTN-1245', equipment_name: 'CCWP Heat Exchanger 02', kks_code: '20PGB10AC002', work_description: 'HEX assembly works. Blind flange removed and plates assembled by tightening tie rods.', remarks: '', status: 'completed' },
        { id: 'rec-16', record_date: '2026-06-11', plant_area: 'CCW #02', tr_no: 'TSFTN-1245', equipment_name: 'CCWP Heat Exchanger 02', kks_code: '20PGB10AC002', work_description: 'Plate cleaning works.', remarks: '', status: 'completed' },
        { id: 'rec-17', record_date: '2026-06-02', plant_area: 'RMS', tr_no: 'TSFTN-1252', equipment_name: 'Water Bath Heater 2', kks_code: '20EKC02AH001', work_description: 'Air Fuel Ratio adjusted slightly.', remarks: '', status: 'completed' },
        { id: 'rec-18', record_date: '2026-05-12', plant_area: 'RMS', tr_no: 'TSFTN-1227', equipment_name: 'Pressure Regulator Valve', kks_code: '20EKD52AA072', work_description: 'Valve assembled again. Regulator set point 10.5 Bar, monitor valve 11.3 Bar.', remarks: '', status: 'completed' },
        { id: 'rec-19', record_date: '2026-05-11', plant_area: 'RMS', tr_no: 'TSFTN-1227', equipment_name: 'Pressure Regulator Valve', kks_code: '20EKD52AA072', work_description: 'Valve dismantled; deposit on sleeve and plug. Deep cleaning done.', remarks: '', status: 'completed' },
        { id: 'rec-20', record_date: '2026-04-30', plant_area: 'GT Intake Air Filter', tr_no: 'TSFTN-1219', equipment_name: 'Coalescer Filter', kks_code: '20MBL30AT003', work_description: 'Filter changed by old cleaned one.', remarks: '', status: 'completed' },
        { id: 'rec-21', record_date: '2026-04-20', plant_area: 'BFP 1', tr_no: 'TSFTN-1107', equipment_name: 'BFWP MIN RECR VLV', kks_code: '20LAB11AA081', work_description: 'Valve assembled and checked. Normal in operation.', remarks: '', status: 'completed' },
        { id: 'rec-22', record_date: '2026-04-15', plant_area: 'GT Intake Air Filter', tr_no: 'TSFTN-1212', equipment_name: 'Coalescer Filter', kks_code: '20MBL30AT003', work_description: 'Replacement of Coalescer filter by new one.', remarks: '', status: 'completed' },
        { id: 'rec-23', record_date: '2026-04-14', plant_area: 'GT', tr_no: 'TSFTN-1136', equipment_name: 'GT Rotor', kks_code: 'MBK22AE001', work_description: 'GT balancing works by SIEMENS. 12 weights installed at compressor 10th stage.', remarks: '', status: 'completed' },
        { id: 'rec-24', record_date: '2026-03-29', plant_area: 'CCW #01', tr_no: 'TSFTN-1189', equipment_name: 'Cooling Water Heat Exchanger#1', kks_code: '20PGB10AC001', work_description: 'HEX dismantled but isolation valve passing heavily; re-assembled urgently to avoid plant trip.', remarks: '', status: 'completed' },
        { id: 'rec-25', record_date: '2026-03-20', plant_area: 'HRSG', tr_no: '', equipment_name: 'IP Economiser Drain MOV', kks_code: '20HAN20AA491', work_description: 'Valve replaced by modified new valve.', remarks: '', status: 'completed' },
        { id: 'rec-26', record_date: '2026-03-09', plant_area: 'GT Intake Air Filter', tr_no: 'TSFTN-1193', equipment_name: 'Coalescer Filter', kks_code: '20MBL30AT003', work_description: 'Coalescer filter changed with cleaned filter.', remarks: '', status: 'completed' },
        { id: 'rec-27', record_date: '2026-03-04', plant_area: 'Water Bath Heater', tr_no: 'TSFTN-1177', equipment_name: 'Water Bath Heater 2', kks_code: '20EKC02AH001', work_description: 'Burner air-fuel ratio adjusted to minimize CO% in exhaust flue gas.', remarks: '', status: 'completed' }
    ]
};

-- ==============================================================================
-- Ashuganj Power Station Company Limited (APSCL)
-- Seed Data for Daily Maintenance Log Database
-- ==============================================================================

-- 1. Populate Equipment Master
INSERT INTO public.equipment_master (equipment_name, kks_code, plant_area, category, description)
VALUES
    ('Coalescer Filter', '20MBL30AT003', 'GT Intake Air Filter', 'Filtration', 'Gas Turbine intake air coalescing filtration element'),
    ('CALC ALARM COALESCER', '20MBL10EU003', 'GT Intake Air Filter', 'Instrumentation', 'Coalescer differential pressure calculation alarm unit'),
    ('Filter Separator 02 DP', '20EKE22AT001', 'RMS', 'Gas System', 'Fuel gas RMS filter separator differential pressure transmitter/filter'),
    ('Pass #03 SSV', '20EKD73AA073', 'RMS', 'Valves', 'Gas regulating station slam shut valve pass #3'),
    ('Pass #01 Monitor Valve', '20EKD71AA071', 'RMS', 'Valves', 'Gas pressure regulating stream #1 monitor valve and pilot diaphragm'),
    ('Pressure Regulator Valve', '20EKD52AA072', 'RMS', 'Valves', 'Active pressure regulating valve stream 2'),
    ('Water Bath Heater 2', '20EKC02AH001', 'Water Bath Heater', 'Heater', 'RMS Fuel gas water bath heater #2 burner & air-fuel control'),
    ('BFWP MIN RECR VLV', '20LAB11AA081', 'BFP 1', 'Pumps & Piping', 'Boiler Feed Water Pump #1 minimum flow recirculation control valve'),
    ('After cooler', '20EKH12AC301', 'GBC #02', 'Gas Booster', 'Gas Booster Compressor #02 heat exchanger aftercooler'),
    ('NG PREM POSN CTRL', '20MBP22DG151', 'GT', 'Gas Turbine Fuel', 'Natural gas premix position control valve & union socket drainage pipeline'),
    ('CCWP Heat Exchanger 02', '20PGB10AC002', 'CCW #02', 'Cooling System', 'Closed Cooling Water Pump heat exchanger plate pack #02'),
    ('Cooling Water Heat Exchanger#1', '20PGB10AC001', 'CCW #01', 'Cooling System', 'Closed Cooling Water heat exchanger plate pack #01'),
    ('GT Rotor', 'MBK22AE001', 'GT', 'Turbine Core', 'Gas turbine rotor assembly & compressor 10th stage balancing weights'),
    ('IP Economiser Drain MOV', '20HAN20AA491', 'HRSG', 'Boiler / HRSG', 'Heat Recovery Steam Generator intermediate pressure economizer motorized drain valve'),
    ('Sampling Room Valve', '20QUC30AA604', 'Sampling Room', 'Sampling System', 'Water-steam sampling cycle isolation & blowdown valve')
ON CONFLICT (equipment_name, kks_code) DO NOTHING;

-- 2. Populate Maintenance Documents (Document Center)
INSERT INTO public.maintenance_documents (title, category, feed_field, suggest_in_log, notes)
VALUES
    ('All Equipment List', 'Equipment list', 'Equipment name', true, 'Master directory of all registered mechanical, electrical, and I&C equipment'),
    ('KKS List', 'KKS numbers', 'KKS (auto-fill)', true, 'Standard Kraftwerk-Kennzeichensystem plant coding reference sheet'),
    ('Equipment + KKS List', 'Equipment + KKS', 'Equipment name and KKS together', true, 'Cross-referenced equipment name to KKS code lookup table'),
    ('Maintenance General Tools', 'Tools', 'Description of work', true, 'Inventory of torque wrenches, hydraulic pullers, magnetic drills, alignment kits'),
    ('TR Register', 'TR register', 'Schedule / TR No.', true, 'Technical request log and scheduled outage job tracking register'),
    ('Standard Operating Procedures (SOP)', 'Other documents', 'Remarks', false, 'Guidelines for GT, HRSG, and RMS safety clearances and permit to work (PTW)')
ON CONFLICT DO NOTHING;

-- 3. Populate Historical Maintenance Records (from APSCL log mockup)
INSERT INTO public.maintenance_records (record_date, plant_area, tr_no, equipment_name, kks_code, work_description, remarks, status)
VALUES
    ('2026-11-02', 'GT Intake Air Filter', NULL, 'Coalescer Filter', '20MBL30AT003', 'Coalescer filter has been changed by washed filter.', 'Routine swap', 'completed'),
    ('2026-10-04', 'RMS', 'TSFTN-1331', 'Filter Separator 02 DP', '20EKE22AT001', 'Filter has been dismantled. New filter has been installed.', 'DP returned to 0.12 bar normal', 'completed'),
    ('2026-10-03', 'RMS', NULL, 'Pass #03 SSV', '20EKD73AA073', 'Valve dismantled, cleaned, assembled with greasing. Opens and closes easily.', 'Trouble resolved', 'completed'),
    ('2026-10-02', 'RMS', NULL, 'Pass #03 SSV', '20EKD73AA073', 'Valve checked, found trouble. SSV does not play up and down; needs dismantling.', 'Dismantling planned for next shift', 'completed'),
    ('2026-09-30', 'GT Intake Air Filter', 'TSFTN-1326', 'Coalescer Filter', '20MBL30AT003', 'CALC ALARM COALESCER ">MAX" alarm on DCS. All Coalescer filters changed by new filters.', 'DCS alarm cleared', 'completed'),
    ('2026-09-28', 'BFP 1', 'TSFTN-1315', 'BFWP MIN RECR VLV', '20LAB11AA081', 'Valve repair works going on. Magnetic drill machine brought from water intake south ST division.', 'In progress', 'in_progress'),
    ('2026-09-27', 'BFP 1', 'TSFTN-1315', 'BFWP MIN RECR VLV', '20LAB11AA081', 'Valve dismantled; damage found in the valve body portion.', 'Severe cavitation marks noticed', 'in_progress'),
    ('2026-08-12', 'GBC #02', 'Schedule', 'After cooler', '20EKH12AC301', 'Clearance taken from Control room. Site preparatory works going on for dismantling.', 'PTW valid for 3 days', 'in_progress'),
    ('2026-08-09', 'Sampling Room', NULL, 'Sampling Room Valve', '20QUC30AA604', 'Valve blocked by solid particle. Line flushed and pipeline cleared.', 'Flow restored', 'completed'),
    ('2026-07-10', 'RMS', 'Schedule', 'Pass #01 Monitor Valve', '20EKD71AA071', 'Feeder and pilot valves checked. Minor diaphragm damage in 2nd pilot. SSV sleeve jammed; cleaned.', 'Pilot kit replaced', 'completed'),
    ('2026-07-07', 'GT Intake Air Filter', 'TSFTN-1286', 'CALC ALARM COALESCER', '20MBL10EU003', 'Filter replaced by one cleaned set.', 'Normal operation', 'completed'),
    ('2026-06-24', 'GT', 'TSFTN-1268', 'NG PREM POSN CTRL', '20MBP22DG151', 'Location confirmed with new machine. PPM 75 found at union socket of NG drainage pipeline.', 'Leakage sealed with backup seal', 'completed'),
    ('2026-06-23', 'GT', 'TSFTN-1268', 'NG PREM POSN CTRL', '20MBP22DG151', 'Gas leakage found under valve in GT enclosure area.', 'Sniffer test ongoing', 'in_progress'),
    ('2026-06-15', 'CCW #02', 'TSFTN-1245', 'CCWP Heat Exchanger 02', '20PGB10AC002', 'Minor leakage found; re-tightened. Plate gap now 1160mm.', 'Still minor droplet seen', 'completed'),
    ('2026-06-14', 'CCW #02', 'TSFTN-1245', 'CCWP Heat Exchanger 02', '20PGB10AC002', 'HEX assembly works. Blind flange removed and plates assembled by tightening tie rods.', 'Torque wrench used', 'completed'),
    ('2026-06-11', 'CCW #02', 'TSFTN-1245', 'CCWP Heat Exchanger 02', '20PGB10AC002', 'Plate cleaning works.', 'Chemical cleaning applied', 'completed'),
    ('2026-06-02', 'RMS', 'TSFTN-1252', 'Water Bath Heater 2', '20EKC02AH001', 'Air Fuel Ratio adjusted slightly.', 'CO level in spec', 'completed'),
    ('2026-05-12', 'RMS', 'TSFTN-1227', 'Pressure Regulator Valve', '20EKD52AA072', 'Valve assembled again. Regulator set point 10.5 Bar, monitor valve 11.3 Bar.', 'Test run successful', 'completed'),
    ('2026-05-11', 'RMS', 'TSFTN-1227', 'Pressure Regulator Valve', '20EKD52AA072', 'Valve dismantled; deposit on sleeve and plug. Deep cleaning done.', 'Cleaned with ultrasonic bath', 'completed'),
    ('2026-04-30', 'GT Intake Air Filter', 'TSFTN-1219', 'Coalescer Filter', '20MBL30AT003', 'Filter changed by old cleaned one.', 'Washed filter installed', 'completed'),
    ('2026-04-20', 'BFP 1', 'TSFTN-1107', 'BFWP MIN RECR VLV', '20LAB11AA081', 'Valve assembled and checked. Normal in operation.', 'Vibration test passed', 'completed'),
    ('2026-04-15', 'GT Intake Air Filter', 'TSFTN-1212', 'Coalescer Filter', '20MBL30AT003', 'Replacement of Coalescer filter by new one.', 'Brand new filter set', 'completed'),
    ('2026-04-14', 'GT', 'TSFTN-1136', 'GT Rotor', 'MBK22AE001', 'GT balancing works by SIEMENS. 12 weights installed at compressor 10th stage.', 'SIEMENS engineer supervised', 'completed'),
    ('2026-03-29', 'CCW #01', 'TSFTN-1189', 'Cooling Water Heat Exchanger#1', '20PGB10AC001', 'HEX dismantled but isolation valve passing heavily; re-assembled urgently to avoid plant trip.', 'Emergency reassembly', 'completed'),
    ('2026-03-20', 'HRSG', NULL, 'IP Economiser Drain MOV', '20HAN20AA491', 'Valve replaced by modified new valve.', 'Commissioning complete', 'completed'),
    ('2026-03-09', 'GT Intake Air Filter', 'TSFTN-1193', 'Coalescer Filter', '20MBL30AT003', 'Coalescer filter changed with cleaned filter.', 'Cleaned set', 'completed'),
    ('2026-03-04', 'Water Bath Heater', 'TSFTN-1177', 'Water Bath Heater 2', '20EKC02AH001', 'Burner air-fuel ratio adjusted to minimize CO% in exhaust flue gas.', 'Flue gas analysis done', 'completed');

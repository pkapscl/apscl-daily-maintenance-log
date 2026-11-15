-- ==============================================================================
-- Ashuganj Power Station Company Limited (APSCL)
-- Division: Mechanical (GT, HRSG & Aux.), North, Zone-B
-- Daily Maintenance Record Database Schema for Supabase / PostgreSQL
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if recreating (optional safeguard)
-- DROP TABLE IF EXISTS public.maintenance_records CASCADE;
-- DROP TABLE IF EXISTS public.equipment_master CASCADE;
-- DROP TABLE IF EXISTS public.maintenance_documents CASCADE;

-- ==============================================================================
-- Table: maintenance_records
-- Description: Stores daily maintenance log entries, work done, and status
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.maintenance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_date DATE NOT NULL DEFAULT CURRENT_DATE,
    plant_area TEXT NOT NULL,
    tr_no TEXT,
    equipment_name TEXT NOT NULL,
    kks_code TEXT,
    work_description TEXT NOT NULL,
    work_time_from TEXT,
    work_time_to TEXT,
    remarks TEXT,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'in_progress', 'draft')),
    engineer_name TEXT DEFAULT 'Site Engineer',
    shift TEXT DEFAULT 'General',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Comments on table columns
COMMENT ON TABLE public.maintenance_records IS 'Daily maintenance records for APSCL DMW North Zone-B';
COMMENT ON COLUMN public.maintenance_records.record_date IS 'Date of maintenance work';
COMMENT ON COLUMN public.maintenance_records.plant_area IS 'Plant section/area (e.g., GT, HRSG, RMS, BFP 1, CCW #02)';
COMMENT ON COLUMN public.maintenance_records.tr_no IS 'Technical Request or Schedule No (e.g. TSFTN-1212 or Schedule)';
COMMENT ON COLUMN public.maintenance_records.equipment_name IS 'Common name of equipment';
COMMENT ON COLUMN public.maintenance_records.kks_code IS 'Kraftwerk-Kennzeichensystem (KKS) standard identification code';
COMMENT ON COLUMN public.maintenance_records.work_description IS 'Detailed description of maintenance activity performed';
COMMENT ON COLUMN public.maintenance_records.status IS 'Status: completed, in_progress, or draft';

-- ==============================================================================
-- Table: equipment_master
-- Description: Master catalog of plant equipment, KKS codes, and area mappings
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.equipment_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_name TEXT NOT NULL,
    kks_code TEXT NOT NULL,
    plant_area TEXT NOT NULL,
    category TEXT DEFAULT 'Mechanical',
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_equipment_kks UNIQUE (equipment_name, kks_code)
);

COMMENT ON TABLE public.equipment_master IS 'Master registry of equipment and KKS codes for auto-completion';

-- ==============================================================================
-- Table: maintenance_documents
-- Description: Document center registry (TR registers, KKS lists, tool catalogs)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.maintenance_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    feed_field TEXT,
    suggest_in_log BOOLEAN NOT NULL DEFAULT true,
    file_url TEXT,
    file_size TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.maintenance_documents IS 'Reference documents feeding log suggestion engines';

-- ==============================================================================
-- Trigger: Automatic updated_at timestamp management
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_maintenance_records_updated_at ON public.maintenance_records;
CREATE TRIGGER trg_maintenance_records_updated_at
BEFORE UPDATE ON public.maintenance_records
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- ==============================================================================
-- Performance Indexes
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_maint_records_date ON public.maintenance_records (record_date DESC);
CREATE INDEX IF NOT EXISTS idx_maint_records_area ON public.maintenance_records (plant_area);
CREATE INDEX IF NOT EXISTS idx_maint_records_status ON public.maintenance_records (status);
CREATE INDEX IF NOT EXISTS idx_maint_records_equip ON public.maintenance_records (equipment_name);
CREATE INDEX IF NOT EXISTS idx_maint_records_kks ON public.maintenance_records (kks_code);
CREATE INDEX IF NOT EXISTS idx_equip_master_name ON public.equipment_master (equipment_name);
CREATE INDEX IF NOT EXISTS idx_equip_master_kks ON public.equipment_master (kks_code);
CREATE INDEX IF NOT EXISTS idx_equip_master_area ON public.equipment_master (plant_area);

-- ==============================================================================
-- Row Level Security (RLS) Setup
-- ==============================================================================
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_documents ENABLE ROW LEVEL SECURITY;

-- Allow anonymous and authenticated users access for the operational intranet
DROP POLICY IF EXISTS "Allow public read access to maintenance_records" ON public.maintenance_records;
CREATE POLICY "Allow public read access to maintenance_records"
    ON public.maintenance_records FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow public insert to maintenance_records" ON public.maintenance_records;
CREATE POLICY "Allow public insert to maintenance_records"
    ON public.maintenance_records FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update to maintenance_records" ON public.maintenance_records;
CREATE POLICY "Allow public update to maintenance_records"
    ON public.maintenance_records FOR UPDATE TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete to maintenance_records" ON public.maintenance_records;
CREATE POLICY "Allow public delete to maintenance_records"
    ON public.maintenance_records FOR DELETE TO public USING (true);

-- Equipment Master policies
DROP POLICY IF EXISTS "Allow public read equipment_master" ON public.equipment_master;
CREATE POLICY "Allow public read equipment_master"
    ON public.equipment_master FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow public insert equipment_master" ON public.equipment_master;
CREATE POLICY "Allow public insert equipment_master"
    ON public.equipment_master FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update equipment_master" ON public.equipment_master;
CREATE POLICY "Allow public update equipment_master"
    ON public.equipment_master FOR UPDATE TO public USING (true) WITH CHECK (true);

-- Maintenance Documents policies
DROP POLICY IF EXISTS "Allow public read maintenance_documents" ON public.maintenance_documents;
CREATE POLICY "Allow public read maintenance_documents"
    ON public.maintenance_documents FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow public insert maintenance_documents" ON public.maintenance_documents;
CREATE POLICY "Allow public insert maintenance_documents"
    ON public.maintenance_documents FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update maintenance_documents" ON public.maintenance_documents;
CREATE POLICY "Allow public update maintenance_documents"
    ON public.maintenance_documents FOR UPDATE TO public USING (true) WITH CHECK (true);

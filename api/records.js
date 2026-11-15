// api/records.js
// Vercel Serverless Function: CRUD endpoints for Maintenance Records
import { getSupabase, mockData } from './_supabase.js';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const supabase = await getSupabase();

    try {
        // GET: Fetch records with search and filters
        if (req.method === 'GET') {
            const { search, area, status, from_date, to_date, limit = 100 } = req.query;

            if (supabase) {
                let query = supabase
                    .from('maintenance_records')
                    .select('*')
                    .order('record_date', { ascending: false })
                    .limit(parseInt(limit, 10));

                if (area && area !== 'All areas') {
                    query = query.eq('plant_area', area);
                }
                if (status && status !== 'all') {
                    query = query.eq('status', status);
                }
                if (from_date) {
                    query = query.gte('record_date', from_date);
                }
                if (to_date) {
                    query = query.lte('record_date', to_date);
                }
                if (search && search.trim()) {
                    const s = `%${search.trim()}%`;
                    query = query.or(`equipment_name.ilike.${s},work_description.ilike.${s},kks_code.ilike.${s},tr_no.ilike.${s},plant_area.ilike.${s}`);
                }

                const { data, error } = await query;
                if (error) throw error;
                return res.status(200).json({ success: true, count: data.length, data });
            }

            // Fallback to memory store
            let filtered = [...mockData.records];
            if (area && area !== 'All areas') {
                filtered = filtered.filter(r => r.plant_area === area);
            }
            if (status && status !== 'all') {
                filtered = filtered.filter(r => r.status === status);
            }
            if (from_date) {
                filtered = filtered.filter(r => r.record_date >= from_date);
            }
            if (to_date) {
                filtered = filtered.filter(r => r.record_date <= to_date);
            }
            if (search && search.trim()) {
                const s = search.toLowerCase().trim();
                filtered = filtered.filter(r =>
                    (r.equipment_name && r.equipment_name.toLowerCase().includes(s)) ||
                    (r.work_description && r.work_description.toLowerCase().includes(s)) ||
                    (r.kks_code && r.kks_code.toLowerCase().includes(s)) ||
                    (r.tr_no && r.tr_no.toLowerCase().includes(s)) ||
                    (r.plant_area && r.plant_area.toLowerCase().includes(s))
                );
            }

            // Sort newest first
            filtered.sort((a, b) => new Date(b.record_date) - new Date(a.record_date));
            return res.status(200).json({ success: true, count: filtered.length, data: filtered.slice(0, parseInt(limit, 10)) });
        }

        // POST: Create a new maintenance record
        if (req.method === 'POST') {
            const body = req.body || {};
            const { record_date, plant_area, tr_no, equipment_name, kks_code, work_description, work_time_from, work_time_to, remarks, status = 'completed' } = body;

            if (!record_date || !plant_area || !equipment_name || !work_description) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields: record_date, plant_area, equipment_name, and work_description are mandatory.'
                });
            }

            const recordPayload = {
                record_date,
                plant_area,
                tr_no: tr_no || '',
                equipment_name,
                kks_code: kks_code || '',
                work_description,
                work_time_from: work_time_from || null,
                work_time_to: work_time_to || null,
                remarks: remarks || '',
                status: status || 'completed'
            };

            if (supabase) {
                const { data, error } = await supabase
                    .from('maintenance_records')
                    .insert([recordPayload])
                    .select()
                    .single();
                if (error) throw error;
                return res.status(201).json({ success: true, data });
            }

            // Fallback memory insertion
            const newRecord = {
                id: 'rec-' + Date.now(),
                ...recordPayload,
                created_at: new Date().toISOString()
            };
            mockData.records.unshift(newRecord);
            return res.status(201).json({ success: true, data: newRecord });
        }

        // PUT: Update an existing maintenance record
        if (req.method === 'PUT') {
            const { id, ...updates } = req.body || {};
            if (!id) {
                return res.status(400).json({ success: false, error: 'Record id is required for update.' });
            }

            if (supabase) {
                const { data, error } = await supabase
                    .from('maintenance_records')
                    .update(updates)
                    .eq('id', id)
                    .select()
                    .single();
                if (error) throw error;
                return res.status(200).json({ success: true, data });
            }

            // Fallback memory update
            const index = mockData.records.findIndex(r => r.id === id);
            if (index === -1) {
                return res.status(404).json({ success: false, error: 'Record not found' });
            }
            mockData.records[index] = { ...mockData.records[index], ...updates };
            return res.status(200).json({ success: true, data: mockData.records[index] });
        }

        // DELETE: Remove record
        if (req.method === 'DELETE') {
            const id = req.query.id || (req.body && req.body.id);
            if (!id) {
                return res.status(400).json({ success: false, error: 'Record id is required for deletion.' });
            }

            if (supabase) {
                const { error } = await supabase
                    .from('maintenance_records')
                    .delete()
                    .eq('id', id);
                if (error) throw error;
                return res.status(200).json({ success: true, message: 'Record deleted successfully' });
            }

            // Fallback memory delete
            const initialLen = mockData.records.length;
            mockData.records = mockData.records.filter(r => r.id !== id);
            if (mockData.records.length === initialLen) {
                return res.status(404).json({ success: false, error: 'Record not found' });
            }
            return res.status(200).json({ success: true, message: 'Record deleted successfully' });
        }

        return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
    } catch (err) {
        console.error('API Error in records.js:', err);
        return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
    }
}

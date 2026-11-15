// api/equipment.js
// Vercel Serverless Function: Equipment & KKS Autocomplete and Master Catalog
import { getSupabase, mockData } from './_supabase.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const supabase = await getSupabase();

    try {
        if (req.method === 'GET') {
            const { q, area } = req.query;

            if (supabase) {
                let query = supabase.from('equipment_master').select('*').order('equipment_name');
                if (area && area !== 'All areas') {
                    query = query.eq('plant_area', area);
                }
                if (q && q.trim()) {
                    const search = `%${q.trim()}%`;
                    query = query.or(`equipment_name.ilike.${search},kks_code.ilike.${search}`);
                }
                const { data, error } = await query.limit(50);
                if (error) throw error;
                return res.status(200).json({ success: true, count: data.length, data });
            }

            // Fallback memory search
            let results = [...mockData.equipment];
            if (area && area !== 'All areas') {
                results = results.filter(e => e.plant_area === area);
            }
            if (q && q.trim()) {
                const term = q.toLowerCase().trim();
                results = results.filter(e =>
                    e.equipment_name.toLowerCase().includes(term) ||
                    e.kks_code.toLowerCase().includes(term)
                );
            }
            return res.status(200).json({ success: true, count: results.length, data: results });
        }

        if (req.method === 'POST') {
            const { equipment_name, kks_code, plant_area, category = 'Mechanical', description = '' } = req.body || {};
            if (!equipment_name || !kks_code || !plant_area) {
                return res.status(400).json({ success: false, error: 'equipment_name, kks_code, and plant_area are required.' });
            }

            const item = { equipment_name, kks_code, plant_area, category, description };

            if (supabase) {
                const { data, error } = await supabase.from('equipment_master').insert([item]).select().single();
                if (error) throw error;
                return res.status(201).json({ success: true, data });
            }

            const newItem = { id: 'eq-' + Date.now(), ...item };
            mockData.equipment.push(newItem);
            return res.status(201).json({ success: true, data: newItem });
        }

        return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}

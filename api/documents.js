// api/documents.js
// Vercel Serverless Function: Maintenance Documents and Catalogs
import { getSupabase, mockData } from './_supabase.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const supabase = await getSupabase();

    try {
        if (req.method === 'GET') {
            const { category, search } = req.query;

            if (supabase) {
                let query = supabase.from('maintenance_documents').select('*').order('title');
                if (category && category !== 'All documents') {
                    query = query.eq('category', category);
                }
                if (search) {
                    query = query.ilike('title', `%${search.trim()}%`);
                }
                const { data, error } = await query;
                if (error) throw error;
                return res.status(200).json({ success: true, count: data.length, data });
            }

            let results = [...mockData.documents];
            if (category && category !== 'All documents') {
                results = results.filter(d => d.category.toLowerCase() === category.toLowerCase());
            }
            if (search) {
                const s = search.toLowerCase();
                results = results.filter(d => d.title.toLowerCase().includes(s));
            }
            return res.status(200).json({ success: true, count: results.length, data: results });
        }

        if (req.method === 'POST') {
            const { title, category, feed_field, suggest_in_log = true, notes = '' } = req.body || {};
            if (!title || !category) {
                return res.status(400).json({ success: false, error: 'Title and category are required' });
            }

            const doc = { title, category, feed_field, suggest_in_log, notes };

            if (supabase) {
                const { data, error } = await supabase.from('maintenance_documents').insert([doc]).select().single();
                if (error) throw error;
                return res.status(201).json({ success: true, data });
            }

            const newDoc = { id: 'doc-' + Date.now(), ...doc };
            mockData.documents.push(newDoc);
            return res.status(201).json({ success: true, data: newDoc });
        }

        return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}

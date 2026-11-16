// api/weekly-report.js
// Vercel Serverless Function: Aggregated APSCL Weekly Maintenance Record
import { getSupabase, mockData } from './_supabase.js';

function getDateRangeForWeek(weekNo, year) {
    const d = new Date(Date.UTC(year, 0, 1 + (weekNo - 1) * 7));
    const dayOfWeek = d.getUTCDay();
    const ISOweekStart = d;
    if (dayOfWeek <= 4) {
        ISOweekStart.setUTCDate(d.getUTCDate() - d.getUTCDay() + 1);
    } else {
        ISOweekStart.setUTCDate(d.getUTCDate() + 8 - d.getUTCDay());
    }
    const ISOweekEnd = new Date(ISOweekStart);
    ISOweekEnd.setUTCDate(ISOweekStart.getUTCDate() + 6);

    const format = (dt) => dt.toISOString().split('T')[0];
    return {
        startDate: format(ISOweekStart),
        endDate: format(ISOweekEnd)
    };
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { week = 14, year = 2026, from, to } = req.query;

    let startDate = from;
    let endDate = to;

    if (!startDate || !endDate) {
        const range = getDateRangeForWeek(parseInt(week, 10), parseInt(year, 10));
        startDate = range.startDate;
        endDate = range.endDate;
    }

    const supabase = await getSupabase();

    try {
        let records = [];

        if (supabase) {
            const { data, error } = await supabase
                .from('maintenance_records')
                .select('*')
                .gte('record_date', startDate)
                .lte('record_date', endDate)
                .order('record_date', { ascending: false });
            if (error) throw error;
            records = data;
        } else {
            records = mockData.records
                .filter(r => r.record_date >= startDate && r.record_date <= endDate)
                .sort((a, b) => new Date(b.record_date) - new Date(a.record_date));
        }

        return res.status(200).json({
            success: true,
            meta: {
                organization: 'Ashuganj Power Station Company Limited (APSCL)',
                division: 'Mechanical (ST & Aux.), North, Zone-B',
                location: 'Ashuganj, Brahmanbaria-3402',
                weekNumber: parseInt(week, 10),
                year: parseInt(year, 10),
                startDate,
                endDate,
                totalRecords: records.length
            },
            data: records
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}

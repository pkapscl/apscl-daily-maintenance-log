// js/supabase.js
// Supabase Client Wrapper and Storage Abstraction Layer
import { DEFAULT_RECORDS, DEFAULT_EQUIPMENT, DEFAULT_DOCUMENTS } from './mock-data.js';

const STORAGE_KEYS = {
  SUPABASE_URL: 'apscl_supabase_url',
  SUPABASE_KEY: 'apscl_supabase_key',
  LOCAL_RECORDS: 'apscl_local_records',
  LOCAL_EQUIPMENT: 'apscl_local_equipment',
  LOCAL_DOCS: 'apscl_local_documents'
};

// Default project configuration for APSCL (from workspace environment)
const DEFAULT_URL = 'https://jiaatesuerjgdnhajswl.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppYWF0ZXN1ZXJqZ2RuaGFqc3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQyMTA0MDEsImV4cCI6MjEwOTc4NjQwMX0.ZKqhwyEDlN_6enNnD7QGFJhwJEf49HpucBXX3w_U89o';

let supabaseClient = null;
let isConnected = false;

// Initialize Supabase Client
export function initSupabase() {
  const url = localStorage.getItem(STORAGE_KEYS.SUPABASE_URL) || (window.ENV && window.ENV.SUPABASE_URL) || DEFAULT_URL;
  const key = localStorage.getItem(STORAGE_KEYS.SUPABASE_KEY) || (window.ENV && window.ENV.SUPABASE_ANON_KEY) || DEFAULT_KEY;

  if (window.supabase && url && key) {
    try {
      supabaseClient = window.supabase.createClient(url, key);
      isConnected = true;
      console.log('[APSCL DB] Initialized Supabase client with endpoint:', url);
    } catch (e) {
      console.warn('[APSCL DB] Failed to initialize Supabase, fallback to local storage:', e);
      supabaseClient = null;
      isConnected = false;
    }
  } else {
    isConnected = false;
  }

  // Initialize local storage seeds if empty
  if (!localStorage.getItem(STORAGE_KEYS.LOCAL_RECORDS)) {
    localStorage.setItem(STORAGE_KEYS.LOCAL_RECORDS, JSON.stringify(DEFAULT_RECORDS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LOCAL_EQUIPMENT)) {
    localStorage.setItem(STORAGE_KEYS.LOCAL_EQUIPMENT, JSON.stringify(DEFAULT_EQUIPMENT));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LOCAL_DOCS)) {
    localStorage.setItem(STORAGE_KEYS.LOCAL_DOCS, JSON.stringify(DEFAULT_DOCUMENTS));
  }

  return { isConnected, url, key };
}

export function getClientConfig() {
  return {
    url: localStorage.getItem(STORAGE_KEYS.SUPABASE_URL) || DEFAULT_URL,
    key: localStorage.getItem(STORAGE_KEYS.SUPABASE_KEY) || DEFAULT_KEY,
    isConnected
  };
}

export function updateClientConfig(url, key) {
  if (url) localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, url.trim());
  if (key) localStorage.setItem(STORAGE_KEYS.SUPABASE_KEY, key.trim());
  return initSupabase();
}

// ======================== Maintenance Records API ========================

export async function getRecords(options = {}) {
  const { search = '', area = 'All areas', status = 'all', fromDate = '', toDate = '', limit = 100 } = options;

  if (supabaseClient) {
    try {
      let query = supabaseClient
        .from('maintenance_records')
        .select('*')
        .order('record_date', { ascending: false })
        .limit(limit);

      if (area && area !== 'All areas') query = query.eq('plant_area', area);
      if (status && status !== 'all') query = query.eq('status', status);
      if (fromDate) query = query.gte('record_date', fromDate);
      if (toDate) query = query.lte('record_date', toDate);

      if (search && search.trim()) {
        const term = `%${search.trim()}%`;
        query = query.or(`equipment_name.ilike.${term},work_description.ilike.${term},kks_code.ilike.${term},tr_no.ilike.${term},plant_area.ilike.${term}`);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data;
      }
      if (error) {
        console.warn('[Supabase API] Failed to fetch from database, reading local cache:', error.message);
      }
    } catch (err) {
      console.warn('[Supabase API] Query exception, falling back to local storage:', err);
    }
  }

  // Fallback: Query from Local Storage
  let records = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCAL_RECORDS) || '[]');
  if (area && area !== 'All areas') {
    records = records.filter(r => r.plant_area === area);
  }
  if (status && status !== 'all') {
    records = records.filter(r => r.status === status);
  }
  if (fromDate) {
    records = records.filter(r => r.record_date >= fromDate);
  }
  if (toDate) {
    records = records.filter(r => r.record_date <= toDate);
  }
  if (search && search.trim()) {
    const s = search.toLowerCase().trim();
    records = records.filter(r =>
      (r.equipment_name && r.equipment_name.toLowerCase().includes(s)) ||
      (r.work_description && r.work_description.toLowerCase().includes(s)) ||
      (r.kks_code && r.kks_code.toLowerCase().includes(s)) ||
      (r.tr_no && r.tr_no.toLowerCase().includes(s)) ||
      (r.plant_area && r.plant_area.toLowerCase().includes(s))
    );
  }

  return records.sort((a, b) => new Date(b.record_date) - new Date(a.record_date)).slice(0, limit);
}

export async function addRecord(record) {
  const newRecord = {
    ...record,
    status: record.status || 'completed',
    created_at: new Date().toISOString()
  };

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('maintenance_records')
        .insert([newRecord])
        .select()
        .single();
      if (!error && data) {
        // Also update local storage cache
        const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCAL_RECORDS) || '[]');
        local.unshift(data);
        localStorage.setItem(STORAGE_KEYS.LOCAL_RECORDS, JSON.stringify(local));
        return data;
      }
    } catch (err) {
      console.warn('[Supabase API] Failed insert, saving locally:', err);
    }
  }

  // Local fallback
  const localRecord = { ...newRecord, id: 'local-' + Date.now() };
  const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCAL_RECORDS) || '[]');
  local.unshift(localRecord);
  localStorage.setItem(STORAGE_KEYS.LOCAL_RECORDS, JSON.stringify(local));
  return localRecord;
}

export async function updateRecord(id, updates) {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('maintenance_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCAL_RECORDS) || '[]');
        const idx = local.findIndex(r => r.id === id);
        if (idx !== -1) local[idx] = data;
        localStorage.setItem(STORAGE_KEYS.LOCAL_RECORDS, JSON.stringify(local));
        return data;
      }
    } catch (err) {
      console.warn('[Supabase API] Update failed, updating local copy:', err);
    }
  }

  // Local fallback
  const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCAL_RECORDS) || '[]');
  const idx = local.findIndex(r => r.id === id);
  if (idx !== -1) {
    local[idx] = { ...local[idx], ...updates, updated_at: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.LOCAL_RECORDS, JSON.stringify(local));
    return local[idx];
  }
  throw new Error('Record not found');
}

export async function deleteRecord(id) {
  if (supabaseClient) {
    try {
      await supabaseClient.from('maintenance_records').delete().eq('id', id);
    } catch (err) {
      console.warn('[Supabase API] Delete failed on cloud, removing locally:', err);
    }
  }
  const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCAL_RECORDS) || '[]');
  const filtered = local.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.LOCAL_RECORDS, JSON.stringify(filtered));
  return true;
}

// ======================== Equipment Master API ========================

export async function searchEquipment(term = '', area = 'All areas') {
  if (supabaseClient) {
    try {
      let query = supabaseClient.from('equipment_master').select('*').order('equipment_name');
      if (area && area !== 'All areas') query = query.eq('plant_area', area);
      if (term && term.trim()) {
        const t = `%${term.trim()}%`;
        query = query.or(`equipment_name.ilike.${t},kks_code.ilike.${t}`);
      }
      const { data, error } = await query.limit(20);
      if (!error && data && data.length > 0) return data;
    } catch (err) {
      console.warn('[Supabase API] Equipment search failed, using local list:', err);
    }
  }

  // Local fallback
  const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCAL_EQUIPMENT) || '[]');
  let filtered = list;
  if (area && area !== 'All areas') {
    filtered = filtered.filter(e => e.plant_area === area);
  }
  if (term && term.trim()) {
    const q = term.toLowerCase().trim();
    filtered = filtered.filter(e =>
      e.equipment_name.toLowerCase().includes(q) ||
      e.kks_code.toLowerCase().includes(q)
    );
  }
  return filtered;
}

export async function addEquipment(equip) {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('equipment_master').insert([equip]).select().single();
      if (!error && data) return data;
    } catch (err) {
      console.warn('[Supabase API] Add equipment error:', err);
    }
  }

  const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCAL_EQUIPMENT) || '[]');
  const newItem = { id: 'eq-' + Date.now(), ...equip };
  list.push(newItem);
  localStorage.setItem(STORAGE_KEYS.LOCAL_EQUIPMENT, JSON.stringify(list));
  return newItem;
}

// ======================== Document Center API ========================

export async function getDocuments(category = 'All documents', search = '') {
  if (supabaseClient) {
    try {
      let query = supabaseClient.from('maintenance_documents').select('*').order('title');
      if (category && category !== 'All documents') query = query.eq('category', category);
      if (search) query = query.ilike('title', `%${search.trim()}%`);
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch (err) {
      console.warn('[Supabase API] Documents fetch error:', err);
    }
  }

  let docs = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCAL_DOCS) || '[]');
  if (category && category !== 'All documents') {
    docs = docs.filter(d => d.category.toLowerCase() === category.toLowerCase());
  }
  if (search && search.trim()) {
    const s = search.toLowerCase();
    docs = docs.filter(d => d.title.toLowerCase().includes(s));
  }
  return docs;
}

export async function addDocument(doc) {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('maintenance_documents').insert([doc]).select().single();
      if (!error && data) return data;
    } catch (err) {
      console.warn('[Supabase API] Add document error:', err);
    }
  }

  const docs = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCAL_DOCS) || '[]');
  const newDoc = { id: 'doc-' + Date.now(), ...doc, created_at: new Date().toISOString() };
  docs.push(newDoc);
  localStorage.setItem(STORAGE_KEYS.LOCAL_DOCS, JSON.stringify(docs));
  return newDoc;
}

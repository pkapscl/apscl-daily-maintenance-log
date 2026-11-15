// js/daily-log.js
// Daily Log Entry Form, Real-Time Autocomplete & Suggestions, and Records Table
import { getRecords, addRecord, updateRecord, deleteRecord, searchEquipment } from './supabase.js';
import { PLANT_AREAS } from './mock-data.js';

let editingRecordId = null;
let allRecordsCache = [];

export function initDailyLog() {
  setupForm();
  setupAutocomplete();
  setupSuggestions();
  setupFilterBar();
  loadRecords();
}

function formatDateDisplay(isoDate) {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return isoDate;
  const day = String(d.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

function setupForm() {
  const dateInput = document.getElementById('log-date');
  if (dateInput && !dateInput.value) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  }

  // Populate area dropdown
  const areaSelect = document.getElementById('log-area');
  if (areaSelect) {
    areaSelect.innerHTML = '';
    PLANT_AREAS.filter(a => a !== 'All areas').forEach(area => {
      const opt = document.createElement('option');
      opt.value = area;
      opt.textContent = area;
      areaSelect.appendChild(opt);
    });
  }

  // Save entry button
  const saveBtn = document.getElementById('save-entry-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => handleSave('completed'));
  }

  // Save draft button
  const draftBtn = document.getElementById('save-draft-btn');
  if (draftBtn) {
    draftBtn.addEventListener('click', () => handleSave('draft'));
  }

  // Clear / Reset button
  const resetBtn = document.getElementById('reset-form-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetForm);
  }
}

function setupAutocomplete() {
  const equipInput = document.getElementById('log-equipment');
  const kksInput = document.getElementById('log-kks');
  const dropdown = document.getElementById('equipment-autocomplete');
  const areaSelect = document.getElementById('log-area');

  if (!equipInput || !dropdown) return;

  let debounceTimer = null;

  equipInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      const query = equipInput.value.trim();
      if (query.length < 1) {
        dropdown.classList.remove('show');
        dropdown.innerHTML = '';
        return;
      }

      const area = areaSelect ? areaSelect.value : 'All areas';
      const results = await searchEquipment(query, area);

      if (results.length === 0) {
        dropdown.classList.remove('show');
        dropdown.innerHTML = '';
        return;
      }

      dropdown.innerHTML = results.map(item => `
        <div class="autocomplete-item" data-name="${item.equipment_name}" data-kks="${item.kks_code}" data-area="${item.plant_area}">
          <strong>${item.equipment_name}</strong>
          <span class="autocomplete-kks">${item.kks_code}</span>
        </div>
      `).join('');

      dropdown.classList.add('show');

      dropdown.querySelectorAll('.autocomplete-item').forEach(el => {
        el.addEventListener('click', () => {
          equipInput.value = el.getAttribute('data-name');
          if (kksInput) kksInput.value = el.getAttribute('data-kks');
          if (areaSelect && el.getAttribute('data-area')) {
            areaSelect.value = el.getAttribute('data-area');
          }
          dropdown.classList.remove('show');
          triggerSuggestionsUpdate();
        });
      });
    }, 150);
  });

  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!equipInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });
}

function setupSuggestions() {
  const equipInput = document.getElementById('log-equipment');
  const descInput = document.getElementById('log-work');

  if (equipInput) equipInput.addEventListener('input', triggerSuggestionsUpdate);
  if (descInput) descInput.addEventListener('input', triggerSuggestionsUpdate);
}

async function triggerSuggestionsUpdate() {
  const equipInput = document.getElementById('log-equipment');
  const descInput = document.getElementById('log-work');
  const container = document.getElementById('suggestions-container');
  if (!container) return;

  const equipVal = equipInput ? equipInput.value.trim().toLowerCase() : '';
  const descVal = descInput ? descInput.value.trim().toLowerCase() : '';

  if (!equipVal && !descVal) {
    container.innerHTML = `
      <div style="color: var(--text-muted); font-size: 13px; text-align: center; padding: 20px 0;">
        Start typing equipment name or work description to see matching records and suggestions.
      </div>
    `;
    return;
  }

  // Filter existing records for matching suggestions
  const matches = allRecordsCache.filter(r => {
    const equipMatch = equipVal && r.equipment_name.toLowerCase().includes(equipVal);
    const descMatch = descVal && r.work_description.toLowerCase().includes(descVal);
    const kksMatch = equipVal && r.kks_code && r.kks_code.toLowerCase().includes(equipVal);
    return equipMatch || descMatch || kksMatch;
  }).slice(0, 3);

  let html = '';

  if (matches.length > 0) {
    matches.forEach(m => {
      html += `
        <div class="suggestion-box">
          <div class="suggestion-tag">PREVIOUS RECORD · ${formatDateDisplay(m.record_date)} · ${m.tr_no || 'Routine'}</div>
          <div>${m.work_description}</div>
          <button type="button" class="use-text-btn" data-text="${encodeURIComponent(m.work_description)}">Use this text</button>
        </div>
      `;
    });
  }

  // Document Center cross-reference match
  if (equipVal) {
    html += `
      <div class="suggestion-box">
        <div class="suggestion-tag doc-tag">DOCUMENT CENTER</div>
        <div>Equipment + KKS List: <strong>${equipInput.value}</strong></div>
        <div style="color: var(--text-muted); font-size: 12px; margin-top: 4px;">Also found in: Master KKS Register · Plant Assets Database</div>
      </div>
    `;
  }

  if (!html) {
    container.innerHTML = `
      <div style="color: var(--text-muted); font-size: 13px; padding: 12px 0;">
        No prior records matched "${equipInput.value || descInput.value}". A new historical record will be created.
      </div>
    `;
    return;
  }

  container.innerHTML = html;

  // Bind 'Use this text' buttons
  container.querySelectorAll('.use-text-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = decodeURIComponent(btn.getAttribute('data-text'));
      if (descInput) {
        descInput.value = text;
        descInput.focus();
        window.showToast('Copied description into work entry!', 'info');
      }
    });
  });
}

async function handleSave(status = 'completed') {
  const dateInput = document.getElementById('log-date');
  const areaSelect = document.getElementById('log-area');
  const trInput = document.getElementById('log-tr');
  const equipInput = document.getElementById('log-equipment');
  const kksInput = document.getElementById('log-kks');
  const workInput = document.getElementById('log-work');
  const timeFromInput = document.getElementById('log-time-from');
  const timeToInput = document.getElementById('log-time-to');
  const remarksInput = document.getElementById('log-remarks');

  if (!dateInput.value || !areaSelect.value || !equipInput.value.trim() || !workInput.value.trim()) {
    window.showToast('Please fill in Date, Plant Area, Equipment Name, and Description', 'error');
    return;
  }

  const payload = {
    record_date: dateInput.value,
    plant_area: areaSelect.value,
    tr_no: trInput ? trInput.value.trim() : '',
    equipment_name: equipInput.value.trim(),
    kks_code: kksInput ? kksInput.value.trim() : '',
    work_description: workInput.value.trim(),
    work_time_from: timeFromInput ? timeFromInput.value : '',
    work_time_to: timeToInput ? timeToInput.value : '',
    remarks: remarksInput ? remarksInput.value.trim() : '',
    status: status
  };

  try {
    if (editingRecordId) {
      await updateRecord(editingRecordId, payload);
      window.showToast('Record updated successfully!', 'success');
      editingRecordId = null;
    } else {
      await addRecord(payload);
      window.showToast(`Record ${status === 'draft' ? 'saved as draft' : 'logged successfully'}!`, 'success');
    }

    resetForm();
    await loadRecords();
  } catch (err) {
    window.showToast('Error saving record: ' + err.message, 'error');
  }
}

function resetForm() {
  editingRecordId = null;
  const form = document.getElementById('work-entry-form');
  if (form) form.reset();

  const dateInput = document.getElementById('log-date');
  if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

  const saveBtn = document.getElementById('save-entry-btn');
  if (saveBtn) saveBtn.textContent = 'Save entry';

  const formTitle = document.getElementById('form-card-title');
  if (formTitle) formTitle.textContent = 'New work entry';

  triggerSuggestionsUpdate();
}

function setupFilterBar() {
  const searchInput = document.getElementById('records-search');
  const areaFilter = document.getElementById('records-area-filter');
  const dateFilter = document.getElementById('records-date-filter');

  // Populate area filter
  if (areaFilter) {
    areaFilter.innerHTML = PLANT_AREAS.map(a => `<option value="${a}">${a}</option>`).join('');
    areaFilter.addEventListener('change', () => loadRecords());
  }

  if (searchInput) {
    let timer;
    searchInput.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => loadRecords(), 200);
    });
  }

  if (dateFilter) {
    dateFilter.addEventListener('change', () => loadRecords());
  }
}

export async function loadRecords() {
  const tableBody = document.getElementById('records-table-body');
  if (!tableBody) return;

  const searchInput = document.getElementById('records-search');
  const areaFilter = document.getElementById('records-area-filter');
  const dateFilter = document.getElementById('records-date-filter');

  const search = searchInput ? searchInput.value : '';
  const area = areaFilter ? areaFilter.value : 'All areas';
  const dateVal = dateFilter ? dateFilter.value : '';

  tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 24px; color: var(--text-muted);">Loading maintenance records...</td></tr>`;

  try {
    const records = await getRecords({ search, area, fromDate: dateVal });
    allRecordsCache = records;

    if (!records || records.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 32px; color: var(--text-muted);">No records found matching your filters.</td></tr>`;
      return;
    }

    tableBody.innerHTML = records.map(r => `
      <tr data-id="${r.id}">
        <td style="white-space: nowrap; font-weight: 500;">${formatDateDisplay(r.record_date)}</td>
        <td><span style="font-size: 12.5px; font-weight: 600; color: #1e293b;">${r.plant_area}</span></td>
        <td style="color: var(--text-muted);">${r.tr_no || '—'}</td>
        <td><strong>${r.equipment_name}</strong></td>
        <td><code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 11.5px; font-family: monospace;">${r.kks_code || '—'}</code></td>
        <td style="max-width: 360px; line-height: 1.45;">
          ${r.work_description}
          ${r.remarks ? `<div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;"><em>Remarks: ${r.remarks}</em></div>` : ''}
        </td>
        <td style="white-space: nowrap; text-align: right;">
          <button class="btn btn-icon edit-rec-btn" data-id="${r.id}" title="Edit Record">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="btn btn-icon delete-rec-btn" data-id="${r.id}" title="Delete Record" style="color: #dc2626;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </td>
      </tr>
    `).join('');

    // Attach actions
    tableBody.querySelectorAll('.edit-rec-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = allRecordsCache.find(x => x.id === id);
        if (item) populateFormForEdit(item);
      });
    });

    tableBody.querySelectorAll('.delete-rec-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this maintenance record?')) {
          await deleteRecord(id);
          window.showToast('Record deleted.', 'info');
          loadRecords();
        }
      });
    });

  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #dc2626; padding: 24px;">Failed to load records: ${err.message}</td></tr>`;
  }
}

function populateFormForEdit(record) {
  editingRecordId = record.id;
  document.getElementById('log-date').value = record.record_date;
  document.getElementById('log-area').value = record.plant_area;
  document.getElementById('log-tr').value = record.tr_no || '';
  document.getElementById('log-equipment').value = record.equipment_name;
  document.getElementById('log-kks').value = record.kks_code || '';
  document.getElementById('log-work').value = record.work_description;
  if (document.getElementById('log-time-from')) document.getElementById('log-time-from').value = record.work_time_from || '';
  if (document.getElementById('log-time-to')) document.getElementById('log-time-to').value = record.work_time_to || '';
  if (document.getElementById('log-remarks')) document.getElementById('log-remarks').value = record.remarks || '';

  const formTitle = document.getElementById('form-card-title');
  if (formTitle) formTitle.textContent = 'Edit maintenance record';

  const saveBtn = document.getElementById('save-entry-btn');
  if (saveBtn) saveBtn.textContent = 'Update entry';

  window.scrollTo({ top: 0, behavior: 'smooth' });
  triggerSuggestionsUpdate();
}

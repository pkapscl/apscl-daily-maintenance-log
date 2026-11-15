// js/pending.js
// Pending Works tracker for ongoing maintenance and trouble resolution
import { getRecords, updateRecord } from './supabase.js';

export async function initPendingWorks() {
  await loadPendingWorks();

  const filterSelect = document.getElementById('pending-status-filter');
  if (filterSelect) {
    filterSelect.addEventListener('change', loadPendingWorks);
  }
}

export async function loadPendingWorks() {
  const container = document.getElementById('pending-works-list');
  if (!container) return;

  container.innerHTML = `<div style="text-align:center; padding: 40px; color: var(--text-muted);">Loading active maintenance jobs...</div>`;

  try {
    const filterSelect = document.getElementById('pending-status-filter');
    const selectedStatus = filterSelect ? filterSelect.value : 'active';

    const records = await getRecords({ limit: 100 });
    let pending = records.filter(r => r.status === 'in_progress' || r.status === 'draft');

    if (selectedStatus === 'in_progress') pending = pending.filter(r => r.status === 'in_progress');
    if (selectedStatus === 'draft') pending = pending.filter(r => r.status === 'draft');

    const countBadge = document.getElementById('pending-count-badge');
    if (countBadge) countBadge.textContent = pending.length;

    if (pending.length === 0) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 48px; color: var(--text-muted);">
          <div style="font-size: 32px; margin-bottom: 8px;">✅</div>
          <h3 style="font-size: 16px; color: var(--text-main); margin-bottom: 4px;">No Pending Works</h3>
          <p style="font-size: 13.5px;">All mechanical maintenance tasks in North Zone-B are currently marked completed.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = pending.map(r => `
      <div class="card" style="margin-bottom: 16px; border-left: 4px solid ${r.status === 'in_progress' ? '#f59e0b' : '#64748b'};">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
          <div>
            <span class="badge ${r.status === 'in_progress' ? 'badge-in_progress' : 'badge-draft'}">${r.status.replace('_', ' ')}</span>
            <strong style="font-size: 16px; margin-left: 10px; color: var(--text-main);">${r.equipment_name}</strong>
            <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 12px; margin-left: 6px;">${r.kks_code || 'No KKS'}</code>
          </div>
          <div style="font-size: 13px; color: var(--text-muted);">
            Logged: <strong>${r.record_date}</strong> · Area: <strong>${r.plant_area}</strong> ${r.tr_no ? `· TR: <strong>${r.tr_no}</strong>` : ''}
          </div>
        </div>

        <div style="font-size: 14px; line-height: 1.5; color: var(--text-main); margin-bottom: 12px;">
          ${r.work_description}
        </div>

        ${r.remarks ? `<div style="background: #f8fafc; padding: 8px 12px; border-radius: 6px; font-size: 12.5px; color: var(--text-muted); margin-bottom: 14px;"><strong>Remarks:</strong> ${r.remarks}</div>` : ''}

        <div style="display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid var(--border-card); padding-top: 14px;">
          <button class="btn btn-secondary btn-sm edit-from-pending" data-id="${r.id}">Update Details</button>
          <button class="btn btn-primary btn-sm mark-completed-btn" data-id="${r.id}">Mark Completed</button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.mark-completed-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        try {
          await updateRecord(id, { status: 'completed' });
          window.showToast('Job marked completed and moved to daily archive!', 'success');
          loadPendingWorks();
        } catch (err) {
          window.showToast('Failed to update status: ' + err.message, 'error');
        }
      });
    });

    container.querySelectorAll('.edit-from-pending').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        window.switchView('daily-log');
        // Find record and populate form
        const rec = pending.find(p => p.id === id);
        if (rec) {
          const editBtn = document.querySelector(`.edit-rec-btn[data-id="${id}"]`);
          if (editBtn) editBtn.click();
        }
      });
    });

  } catch (err) {
    container.innerHTML = `<div style="color: #dc2626; padding: 20px;">Failed to load pending works: ${err.message}</div>`;
  }
}

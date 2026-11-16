// js/weekly.js
// APSCL Official Weekly Maintenance Report Generator
import { getRecords } from './supabase.js';

function getWeekRange(weekNo, year) {
  // ISO-8601 week calculation
  const simple = new Date(Date.UTC(year, 0, 1 + (weekNo - 1) * 7));
  const dow = simple.getUTCDay();
  const ISOweekStart = simple;
  if (dow <= 4) {
    ISOweekStart.setUTCDate(simple.getUTCDate() - simple.getUTCDay() + 1);
  } else {
    ISOweekStart.setUTCDate(simple.getUTCDate() + 8 - simple.getUTCDay());
  }
  const ISOweekEnd = new Date(ISOweekStart);
  ISOweekEnd.setUTCDate(ISOweekStart.getUTCDate() + 6);

  const fmt = (d) => {
    const day = String(d.getUTCDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day}-${months[d.getUTCMonth()]}-${d.getUTCFullYear()}`;
  };

  const toISO = (d) => d.toISOString().split('T')[0];

  return {
    displayStart: fmt(ISOweekStart),
    displayEnd: fmt(ISOweekEnd),
    isoStart: toISO(ISOweekStart),
    isoEnd: toISO(ISOweekEnd)
  };
}

export function initWeeklyReport() {
  const weekInput = document.getElementById('report-week-no');
  const yearInput = document.getElementById('report-year');
  const printBtn = document.getElementById('print-weekly-btn');
  const exportCsvBtn = document.getElementById('export-weekly-csv-btn');

  if (weekInput) {
    weekInput.addEventListener('change', generateWeeklyReport);
    weekInput.addEventListener('input', generateWeeklyReport);
  }
  if (yearInput) {
    yearInput.addEventListener('change', generateWeeklyReport);
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', exportWeeklyCsv);
  }

  generateWeeklyReport();
}

let currentWeeklyRecords = [];

export async function generateWeeklyReport() {
  const weekInput = document.getElementById('report-week-no');
  const yearInput = document.getElementById('report-year');
  const dateSubtext = document.getElementById('report-date-subtext');
  const metaWeekNo = document.getElementById('meta-week-no');
  const metaStartDate = document.getElementById('meta-start-date');
  const metaEndDate = document.getElementById('meta-end-date');
  const tableBody = document.getElementById('weekly-report-table-body');

  const weekNo = parseInt(weekInput ? weekInput.value : 14, 10) || 14;
  const year = parseInt(yearInput ? yearInput.value : 2026, 10) || 2026;

  const range = getWeekRange(weekNo, year);

  if (dateSubtext) dateSubtext.textContent = `${range.displayStart} to ${range.displayEnd} · filled from the daily log`;
  if (metaWeekNo) metaWeekNo.textContent = weekNo;
  if (metaStartDate) metaStartDate.textContent = range.displayStart;
  if (metaEndDate) metaEndDate.textContent = range.displayEnd;

  if (!tableBody) return;

  tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 24px; color: var(--text-muted);">Generating weekly maintenance record...</td></tr>`;

  try {
    const allRecords = await getRecords({ limit: 300 });
    // Filter records within week range
    const weekRecords = allRecords.filter(r => r.record_date >= range.isoStart && r.record_date <= range.isoEnd);
    currentWeeklyRecords = weekRecords;

    if (weekRecords.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 32px; color: var(--text-muted);">No maintenance work logged between ${range.displayStart} and ${range.displayEnd}.</td></tr>`;
      return;
    }

    tableBody.innerHTML = weekRecords.map(r => `
      <tr>
        <td style="white-space: nowrap; font-weight: 500;">${r.record_date}</td>
        <td><strong>${r.plant_area}</strong></td>
        <td>${r.tr_no || '—'}</td>
        <td>${r.equipment_name}</td>
        <td><code style="font-family: monospace; font-size: 11.5px;">${r.kks_code || '—'}</code></td>
        <td style="line-height: 1.45;">${r.work_description}</td>
        <td>${r.remarks || '—'}</td>
      </tr>
    `).join('');

  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #dc2626; padding: 20px;">Failed to generate report: ${err.message}</td></tr>`;
  }
}

function exportWeeklyCsv() {
  if (currentWeeklyRecords.length === 0) {
    window.showToast('No records in current week to export.', 'info');
    return;
  }

  const headers = ['Date', 'Plant Area', 'TR / Schedule No', 'Equipment Name', 'KKS Code', 'Description of Maintenance Work', 'Remarks', 'Status'];
  const rows = currentWeeklyRecords.map(r => [
    `"${r.record_date}"`,
    `"${r.plant_area}"`,
    `"${r.tr_no || ''}"`,
    `"${r.equipment_name.replace(/"/g, '""')}"`,
    `"${r.kks_code || ''}"`,
    `"${r.work_description.replace(/"/g, '""')}"`,
    `"${(r.remarks || '').replace(/"/g, '""')}"`,
    `"${r.status}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `APSCL_Weekly_Maintenance_Week_${document.getElementById('report-week-no').value}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.showToast('Weekly report downloaded as CSV!', 'success');
}

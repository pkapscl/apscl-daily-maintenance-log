// js/documents.js
// Document Center & Plant Reference Directory
import { getDocuments, addDocument, searchEquipment } from './supabase.js';

let currentCategory = 'All documents';

export function initDocumentCenter() {
  setupCategoryNav();
  setupSearch();
  setupDocUpload();
  loadDocumentList();
  loadPreviewMatches('Coalescer');
}

function setupCategoryNav() {
  const navContainer = document.getElementById('doc-categories-nav');
  if (!navContainer) return;

  navContainer.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', () => {
      navContainer.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      currentCategory = item.getAttribute('data-cat') || 'All documents';
      loadDocumentList();
    });
  });
}

function setupSearch() {
  const searchInput = document.getElementById('doc-search-input');
  if (!searchInput) return;

  let timer;
  searchInput.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const q = searchInput.value.trim();
      loadDocumentList(q);
      if (q) loadPreviewMatches(q);
    }, 200);
  });
}

export async function loadDocumentList(query = '') {
  const tableBody = document.getElementById('documents-table-body');
  if (!tableBody) return;

  tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px; color: var(--text-muted);">Loading documents...</td></tr>`;

  try {
    const docs = await getDocuments(currentCategory, query);

    if (docs.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 24px; color: var(--text-muted);">No documents found in this category.</td></tr>`;
      return;
    }

    tableBody.innerHTML = docs.map(d => `
      <tr>
        <td><strong>${d.title}</strong></td>
        <td><span style="font-size: 12px; color: var(--text-muted);">${d.category}</span></td>
        <td><code>${d.feed_field || 'Reference'}</code></td>
        <td>
          <span style="display: inline-flex; align-items: center; gap: 6px; color: ${d.suggest_in_log ? '#16a34a' : '#64748b'}; font-weight: 600; font-size: 12px;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${d.suggest_in_log ? '#16a34a' : '#94a3b8'};"></span>
            ${d.suggest_in_log ? 'On' : 'Off'}
          </span>
        </td>
      </tr>
    `).join('');

  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #dc2626; padding: 20px;">Failed to load documents: ${err.message}</td></tr>`;
  }
}

async function loadPreviewMatches(term) {
  const previewContainer = document.getElementById('doc-preview-container');
  const previewTitle = document.getElementById('doc-preview-term');
  if (!previewContainer) return;

  if (previewTitle) previewTitle.textContent = `Matches for "${term}"`;

  try {
    const equipment = await searchEquipment(term);

    if (equipment.length === 0) {
      previewContainer.innerHTML = `
        <div style="color: var(--text-muted); font-size: 13px; padding: 12px 0;">
          No direct asset matches found for "${term}".
        </div>
      `;
      return;
    }

    previewContainer.innerHTML = equipment.slice(0, 4).map(eq => `
      <div style="border: 1px solid var(--border-card); border-radius: var(--radius-md); padding: 12px; font-size: 13px; line-height: 1.5; margin-bottom: 10px; background: #fff;">
        <strong style="color: var(--primary-blue); font-size: 12px; text-transform: uppercase;">Equipment + KKS Match</strong><br>
        <div style="font-weight: 600; font-size: 14px; margin: 2px 0;">${eq.equipment_name}</div>
        <div style="color: var(--text-muted); font-size: 12px;">KKS: <code style="background: #f1f5f9; padding: 2px 4px; border-radius: 4px;">${eq.kks_code}</code> · Area: ${eq.plant_area}</div>
      </div>
    `).join('');

  } catch (err) {
    previewContainer.innerHTML = `<div style="color: #dc2626; font-size: 12px;">Preview error: ${err.message}</div>`;
  }
}

function setupDocUpload() {
  const uploadBtn = document.getElementById('upload-doc-btn');
  const modal = document.getElementById('upload-doc-modal');
  const saveBtn = document.getElementById('save-new-doc-btn');

  if (uploadBtn && modal) {
    uploadBtn.addEventListener('click', () => {
      modal.classList.add('open');
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const titleInput = document.getElementById('new-doc-title');
      const catInput = document.getElementById('new-doc-category');
      const fieldInput = document.getElementById('new-doc-field');

      if (!titleInput.value.trim()) {
        window.showToast('Please enter document title', 'error');
        return;
      }

      await addDocument({
        title: titleInput.value.trim(),
        category: catInput ? catInput.value : 'General',
        feed_field: fieldInput ? fieldInput.value : 'Reference',
        suggest_in_log: true
      });

      window.showToast('Reference document registered!', 'success');
      modal.classList.remove('open');
      titleInput.value = '';
      loadDocumentList();
    });
  }
}

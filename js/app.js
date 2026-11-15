// js/app.js
// Main Application Orchestrator for APSCL Daily Maintenance Log
import { initSupabase, getClientConfig, updateClientConfig } from './supabase.js';
import { initDailyLog, loadRecords } from './daily-log.js';
import { initPendingWorks, loadPendingWorks } from './pending.js';
import { initWeeklyReport, generateWeeklyReport } from './weekly.js';
import { initDocumentCenter, loadDocumentList } from './documents.js';

// Global Toast Notification Helper
window.showToast = function(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 0.2s';
    setTimeout(() => toast.remove(), 200);
  }, 3500);
};

// Global View Switcher
window.switchView = function(viewName) {
  // Update header nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('data-view') === viewName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Toggle view containers
  document.querySelectorAll('.view-section').forEach(section => {
    if (section.id === `view-${viewName}`) {
      section.classList.add('active');
    } else {
      section.classList.remove('active');
    }
  });

  // Trigger data refreshes on view activation
  if (viewName === 'daily-log') loadRecords();
  if (viewName === 'pending-works') loadPendingWorks();
  if (viewName === 'weekly-report') generateWeeklyReport();
  if (viewName === 'document-center') loadDocumentList();
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Supabase
  const config = initSupabase();
  updateDbStatusUI(config.isConnected);

  // 2. Setup Header Navigation Links
  document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const view = link.getAttribute('data-view');
      if (view) window.switchView(view);
    });
  });

  // 3. Setup Database Config Modal
  setupDbModal();

  // 4. Initialize Each Component Module
  initDailyLog();
  initPendingWorks();
  initWeeklyReport();
  initDocumentCenter();

  // 5. Default view
  window.switchView('daily-log');
});

function updateDbStatusUI(connected) {
  const dot = document.getElementById('db-status-dot');
  const text = document.getElementById('db-status-text');
  if (dot && text) {
    if (connected) {
      dot.className = 'status-dot';
      text.textContent = 'Supabase Connected';
    } else {
      dot.className = 'status-dot disconnected';
      text.textContent = 'Local Mode';
    }
  }
}

function setupDbModal() {
  const btn = document.getElementById('db-settings-btn');
  const modal = document.getElementById('db-settings-modal');
  const closeBtns = document.querySelectorAll('.close-db-modal');
  const saveBtn = document.getElementById('save-db-config-btn');
  const urlInput = document.getElementById('db-config-url');
  const keyInput = document.getElementById('db-config-key');

  if (btn && modal) {
    btn.addEventListener('click', () => {
      const cfg = getClientConfig();
      if (urlInput) urlInput.value = cfg.url;
      if (keyInput) keyInput.value = cfg.key;
      modal.classList.add('open');
    });
  }

  closeBtns.forEach(b => {
    b.addEventListener('click', () => {
      if (modal) modal.classList.remove('open');
    });
  });

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const url = urlInput ? urlInput.value : '';
      const key = keyInput ? keyInput.value : '';
      const result = updateClientConfig(url, key);
      updateDbStatusUI(result.isConnected);
      window.showToast(result.isConnected ? 'Connected to Supabase Cloud!' : 'Switched to Local Cache mode.', 'success');
      if (modal) modal.classList.remove('open');
      loadRecords();
    });
  }

  // Modal backdrop click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });
}

// js/app.js
// Main Application Orchestrator for APSCL Daily Maintenance Log
import { initSupabase, getClientConfig, updateClientConfig } from './supabase.js';
import { initDailyLog, loadRecords } from './daily-log.js';
import { initPendingWorks, loadPendingWorks } from './pending.js';
import { initWeeklyReport, generateWeeklyReport } from './weekly.js';
import { initDocumentCenter, loadDocumentList } from './documents.js';
import { AUTH_USERS } from './mock-data.js';

const AUTH_STORAGE_KEY = 'apscl_auth_session';

// Global Toast Notification Helper
window.showToast = function(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;

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
  // 1. Initialize Supabase Client
  const config = initSupabase();
  updateDbStatusUI(config.isConnected);

  // 2. Setup Authentication System
  setupAuth();

  // 3. Setup Header Navigation Links
  document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const view = link.getAttribute('data-view');
      if (view) window.switchView(view);
    });
  });

  // 4. Setup Database Config Modal
  setupDbModal();

  // 5. Initialize View Modules
  initDailyLog();
  initPendingWorks();
  initWeeklyReport();
  initDocumentCenter();

  // 6. Default view
  window.switchView('daily-log');
});

// ======================== Authentication Management ========================

function getActiveSession() {
  const localSession = localStorage.getItem(AUTH_STORAGE_KEY);
  if (localSession) {
    try { return JSON.parse(localSession); } catch (e) {}
  }
  const sessionSession = sessionStorage.getItem(AUTH_STORAGE_KEY);
  if (sessionSession) {
    try { return JSON.parse(sessionSession); } catch (e) {}
  }
  return null;
}

function setupAuth() {
  const loginOverlay = document.getElementById('login-modal-overlay');
  const loginForm = document.getElementById('login-form');
  const userIdInput = document.getElementById('login-username');
  const passwordInput = document.getElementById('login-password');
  const rememberCheckbox = document.getElementById('login-remember');
  const logoutBtn = document.getElementById('logout-btn');
  const userDisplay = document.getElementById('logged-in-user-tag');

  const currentSession = getActiveSession();

  if (currentSession) {
    if (loginOverlay) loginOverlay.style.display = 'none';
    if (userDisplay) {
      userDisplay.textContent = `👤 ${currentSession.name} (${currentSession.role})`;
      userDisplay.style.display = 'inline-flex';
    }
    if (logoutBtn) logoutBtn.style.display = 'inline-flex';
  } else {
    if (loginOverlay) loginOverlay.style.display = 'flex';
    if (userDisplay) userDisplay.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }

  // Handle Login Submit
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = userIdInput.value.trim();
      const p = passwordInput.value.trim();
      const remember = rememberCheckbox ? rememberCheckbox.checked : true;

      const foundUser = AUTH_USERS.find(user => user.userId.toLowerCase() === u.toLowerCase() && user.password === p);

      if (foundUser) {
        const sessionData = {
          userId: foundUser.userId,
          name: foundUser.name,
          role: foundUser.role,
          loginTime: new Date().toISOString()
        };

        if (remember) {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
          sessionStorage.removeItem(AUTH_STORAGE_KEY);
        } else {
          sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }

        loginOverlay.style.display = 'none';
        if (userDisplay) {
          userDisplay.textContent = `👤 ${foundUser.name} (${foundUser.role})`;
          userDisplay.style.display = 'inline-flex';
        }
        if (logoutBtn) logoutBtn.style.display = 'inline-flex';

        window.showToast(`Welcome, ${foundUser.name}!`, 'success');
        loadRecords();
      } else {
        window.showToast('Invalid User ID or Password. Check credentials below.', 'error');
      }
    });
  }

  // Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      if (userDisplay) userDisplay.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'none';
      if (loginOverlay) {
        loginOverlay.style.display = 'flex';
        if (userIdInput) userIdInput.value = '';
        if (passwordInput) passwordInput.value = '';
      }
      window.showToast('Logged out successfully.', 'info');
    });
  }

  // Quick credentials filler helper buttons
  document.querySelectorAll('.quick-fill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const u = btn.getAttribute('data-u');
      const p = btn.getAttribute('data-p');
      if (userIdInput) userIdInput.value = u;
      if (passwordInput) passwordInput.value = p;
    });
  });
}

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

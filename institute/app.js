/* ============================================================
   ELEVATE PORTAL — Application Logic & Single Source of Truth HQ
   Complete SPA Router, Command Palette, Dynamic Eligibility, 
   LMS Publishing, Student Lifecycle Tracker & Enterprise CRM
   ============================================================ */

'use strict';

// ──────────────────────────────────────────────────────────────
// STATE MANAGEMENT
// ──────────────────────────────────────────────────────────────
const state = {
  currentPage: 'college-dashboard',
  currentResourceTab: 'courses',
  courseWizardStep: 1,
  selectedStudent: null,
  selectedCompany: null,
  selectedStartup: null,
  filters: {
    academicYear: '2024-2025',
    branch: 'ALL',
    year: 'ALL',
    division: 'ALL',
    semester: 'ALL'
  },
  charts: {}
};

// ──────────────────────────────────────────────────────────────
// INITIALIZATION
// ──────────────────────────────────────────────────────────────
// ──────────────────────────────────────────────────────────────
// INITIALIZATION
// ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await window.db.initPromise;
  checkAccess();
  setupEventListeners();
  setupKeyboardShortcuts();
  populateClassDropdowns();
  navigateTo(state.currentPage || 'college-dashboard');
});

function decodeTokenPayload(token) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    }
  } catch (err) {
    console.warn('[Auth] Token decode error:', err);
  }

  try {
    const userStr = sessionStorage.getItem('elevate_user');
    const roleStr = sessionStorage.getItem('elevate_role');
    if (userStr && roleStr) {
      const user = JSON.parse(userStr);
      return {
        userId: user.id || user.prn,
        role: roleStr,
        name: user.name,
        email: user.email,
        yearOfStudy: user.yearOfStudy || sessionStorage.getItem('elevate_yearOfStudy') || 'Final'
      };
    }
  } catch (err) {
    console.warn('[Auth] Session fallback error:', err);
  }

  return null;
}

function checkAccess() {
  const token = sessionStorage.getItem('elevate_token');
  if (!token) {
    window.location.href = '/login.html';
    return null;
  }

  const payload = decodeTokenPayload(token);
  if (!payload) {
    window.location.href = '/login.html';
    return null;
  }

  if (payload.role === 'STUDENT' || payload.role === 'student') {
    window.location.href = '/student/index.html';
    return null;
  }
  if (payload.role === 'COMPANY' || payload.role === 'company') {
    window.location.href = '/industry/index.html';
    return null;
  }

  state.currentUser = payload;
  state.role = payload.role;

  const roleTitleMap = {
    'SUPER_ADMIN':      'Super Administrator',
    'TNP_ADMIN':        'Head T&P Officer',
    'TNP':              'Head T&P Officer',
    'INCUBATION_ADMIN': 'Incubation Cell Lead',
    'FACULTY':          'HOD / Faculty Member'
  };

  const nameEl = document.getElementById('tnpOfficerName');
  const initEl = document.getElementById('tnpOfficerInitials');
  const roleEl = document.getElementById('tnpOfficerRoleText');
  if (nameEl) nameEl.textContent = payload.name || 'Staff User';
  if (roleEl) roleEl.textContent = roleTitleMap[payload.role] || payload.role;
  if (initEl) {
    const parts = (payload.name || 'Staff User').split(' ');
    initEl.textContent = (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  }

  renderNavForRole(payload.role);
  return payload;
}

function renderNavForRole(role) {
  const roleUpper = (role || '').toUpperCase();

  // Reset all nav items & section boxes
  document.querySelectorAll('.nav-item, .sb-section-box').forEach(el => el.classList.remove('nav-hidden'));

  let allowedPages = [];

  if (roleUpper === 'SUPER_ADMIN') {
    allowedPages = [
      'college-dashboard', 'institute-details', 'resource-management', 'learning-materials',
      'placement-drives', 'applications', 'company-management',
      'startup-showcase', 'mentor-management', 'startup-analytics', 'hackathon-analytics', 'hackathon-dashboard',
      'announcements', 'settings'
    ];
  } else if (roleUpper === 'TNP_ADMIN' || roleUpper === 'TNP') {
    allowedPages = [
      'college-dashboard', 'institute-details', 'resource-management', 'learning-materials',
      'placement-drives', 'applications', 'company-management', 'hackathon-dashboard',
      'startup-analytics', 'announcements', 'settings'
    ];
  } else if (roleUpper === 'INCUBATION_ADMIN') {
    allowedPages = [
      'college-dashboard', 'startup-showcase', 'mentor-management', 'startup-analytics',
      'hackathon-analytics', 'hackathon-dashboard', 'announcements', 'settings'
    ];
  } else if (roleUpper === 'FACULTY') {
    allowedPages = [
      'college-dashboard', 'institute-details', 'learning-materials', 'startup-showcase', 'mentor-management',
      'startup-analytics', 'hackathon-dashboard', 'announcements', 'settings'
    ];
    setTimeout(() => {
      document.querySelectorAll('#studentDirectoryTableBody button, #studentRecordsTableWrap button').forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
      });
    }, 300);
  } else {
    allowedPages = ['college-dashboard', 'institute-details', 'announcements', 'settings'];
  }

  state.allowedPages = allowedPages;

  // Hide disallowed nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    const page = item.getAttribute('data-page');
    if (page && !allowedPages.includes(page)) {
      item.classList.add('nav-hidden');
    }
  });

  // Hide section boxes if all child nav items are hidden
  document.querySelectorAll('.sb-section-box').forEach(box => {
    const items = box.querySelectorAll('.nav-item');
    if (items.length > 0) {
      const visibleItems = Array.from(items).filter(it => !it.classList.contains('nav-hidden'));
      if (visibleItems.length === 0) {
        box.classList.add('nav-hidden');
      }
    }
  });

  // Redirect if current page is disallowed
  if (state.currentPage && !allowedPages.includes(state.currentPage)) {
    navigateTo('college-dashboard');
  }
}

function handleLogout() {
  sessionStorage.removeItem('elevate_token');
  sessionStorage.removeItem('elevate_user');
  sessionStorage.removeItem('elevate_role');
  window.location.href = '/login.html';
}

function setupEventListeners() {
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openCommandPalette();
    } else if (e.key === 'Escape') {
      closeCommandPalette();
      closeStudentProfileModal();
      closeCreateClassModal();
      closeImportStudentModal();
      closeCreateCourseModal();
      closeCreateDriveModal();
      closeStartupReviewModal();
      closeCreateHackathonModal();
    }
  });
}

function setupKeyboardShortcuts() {
  console.log('[App] Elevate Institute HQ Initialized with Single Source of Truth.');
}

// ──────────────────────────────────────────────────────────────
// SIDEBAR SECTION ACCORDION
// ──────────────────────────────────────────────────────────────

const INST_PAGE_SECTION_MAP = {
  'college-dashboard':    'main',
  'institute-details':    'students',
  'learning-materials':   'students',
  'resource-management':  'students',
  'placement-drives':     'placement',
  'applications':         'placement',
  'company-management':   'placement',
  'startup-showcase':     'innovation',
  'hackathon-dashboard':  'innovation',
  'mentor-management':    'innovation',
  'startup-analytics':    'innovation',
  'hackathon-analytics':  'innovation',
  'announcements':        'system',
  'settings':             'system'
};

const INST_ALL_SECTION_IDS = ['main', 'students', 'placement', 'innovation', 'system'];

let isSidebarPinned = false;

function toggleSidebarPin() {
  isSidebarPinned = !isSidebarPinned;
  const sidebar = document.getElementById('appSidebar');
  if (!sidebar) return;
  
  if (isSidebarPinned) {
    sidebar.classList.remove('collapsed');
  } else {
    sidebar.classList.add('collapsed');
  }
}

function expandSidebar() {
  const sidebar = document.getElementById('appSidebar');
  if (sidebar) sidebar.classList.remove('collapsed');
}

function collapseSidebar() {
  if (isSidebarPinned) return;
  const sidebar = document.getElementById('appSidebar');
  if (sidebar) sidebar.classList.add('collapsed');
}

function hoverExpandSectionBox(sectionId) {
  expandSidebar();
  toggleSectionBox(sectionId);
}

function toggleSectionBox(sectionId) {
  const box = document.getElementById(`sectionBox-${sectionId}`);
  if (!box) return;
  const sidebar = document.getElementById('appSidebar');
  if (sidebar && sidebar.classList.contains('collapsed')) return;
  box.classList.toggle('collapsed');
}

function openSectionForPage(page) {
  const targetSection = INST_PAGE_SECTION_MAP[page];
  if (!targetSection) return;
  INST_ALL_SECTION_IDS.forEach(id => {
    const box = document.getElementById(`sectionBox-${id}`);
    if (!box) return;
    if (id === targetSection) {
      box.classList.remove('collapsed');
    } else {
      box.classList.add('collapsed');
    }
  });
}

// ──────────────────────────────────────────────────────────────
// NAVIGATION & SPA ROUTER
// ──────────────────────────────────────────────────────────────
function navigateTo(pageId) {
  if (state.allowedPages && !state.allowedPages.includes(pageId)) {
    pageId = 'college-dashboard';
  }

  openSectionForPage(pageId);
  state.currentPage = pageId;

  document.querySelectorAll('.page-content').forEach(el => {
    el.style.display = 'none';
  });

  const targetPage = document.getElementById(`page-${pageId}`);
  if (targetPage) {
    targetPage.style.display = 'block';
  }

  document.querySelectorAll('.nav-item, .nav-sub-item').forEach(el => {
    if (el.getAttribute('data-page') === pageId) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  if (pageId === 'college-dashboard') {
    renderDashboard();
  } else if (pageId === 'institute-details') {
    renderStudentDirectory();
  } else if (pageId === 'learning-materials') {
    renderLearningMaterials();
  } else if (pageId === 'hackathon-dashboard') {
    renderInstituteHackathons();
  } else if (pageId === 'resource-management') {
    renderResourceManagement();
  } else if (pageId === 'placement-drives') {
    renderPlacementDrives();
  } else if (pageId === 'applications') {
    renderApplicationsPipeline();
  } else if (pageId === 'company-management') {
    renderCompanyCrm();
  } else if (pageId === 'startup-showcase') {
    renderStartupsAdmin();
  } else if (pageId === 'mentor-management') {
    renderMentorsAdmin();
  } else if (pageId === 'startup-analytics') {
    renderStartupAnalytics();
  } else if (pageId === 'hackathon-analytics') {
    renderHackathonAnalytics();
  } else if (pageId === 'recruiter-network') {
    renderRecruiterNetwork();
  } else if (pageId === 'partnership-requests') {
    renderPartnershipRequests();
  } else if (pageId === 'mentorship-programs') {
    renderMentorshipPrograms();
  } else if (pageId === 'announcements') {
    renderAnnouncements();
  }
}

function toggleAccordion(headerElem) {
  const isOpen = headerElem.classList.contains('open');
  
  // Close all headers
  document.querySelectorAll('.nav-accordion-header').forEach(h => {
    h.classList.remove('open');
    const content = document.getElementById(`acc-${h.getAttribute('data-acc')}`);
    if (content) content.style.display = 'none';
  });

  // Toggle clicked header
  if (!isOpen) {
    headerElem.classList.add('open');
    const targetContent = document.getElementById(`acc-${headerElem.getAttribute('data-acc')}`);
    if (targetContent) targetContent.style.display = 'flex';
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById('appSidebar');
  const icon = document.getElementById('sidebarArrowIcon');
  if (sidebar.style.width === '80px') {
    sidebar.style.width = '270px';
    sidebar.classList.remove('collapsed');
    if (icon) icon.className = 'ph ph-caret-left';
  } else {
    sidebar.style.width = '80px';
    sidebar.classList.add('collapsed');
    if (icon) icon.className = 'ph ph-caret-right';
  }
}

function toggleNotifications() {
  const panel = document.getElementById('notifPanel');
  if (panel) {
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  
  const toast = document.createElement('div');
  const bg = type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#6366f1';
  toast.style.cssText = `background: ${bg}; color: #fff; padding: 12px 18px; border-radius: 12px; font-size: 13px; font-weight: 600; box-shadow: 0 10px 25px rgba(0,0,0,0.15); animation: cmdSlideDown 0.2s ease; display: flex; align-items: center; gap: 8px;`;
  toast.innerHTML = `<i class="ph ph-check-circle" style="font-size:18px;"></i> ${message}`;
  
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3500);
}

function handleLogout() {
  if (confirm('Are you sure you want to log out of Elevate Institute HQ?')) {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = '/login';
  }
}

// ──────────────────────────────────────────────────────────────
// GLOBAL COMMAND PALETTE SEARCH (Ctrl + K)
// ──────────────────────────────────────────────────────────────
function openCommandPalette() {
  const modal = document.getElementById('commandPaletteModal');
  const input = document.getElementById('cmdSearchInput');
  if (modal) {
    modal.style.display = 'flex';
    if (input) {
      input.value = '';
      input.focus();
    }
  }
}

function closeCommandPalette(e) {
  if (e && e.target !== document.getElementById('commandPaletteModal')) return;
  const modal = document.getElementById('commandPaletteModal');
  if (modal) modal.style.display = 'none';
}

async function handleGlobalSearch(query) {
  const resultsContainer = document.getElementById('cmdSearchResults');
  if (!resultsContainer) return;
  if (!query || query.trim() === '') {
    resultsContainer.innerHTML = `
      <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--text-3); margin-bottom: 8px;">Quick Shortcuts</div>
      <div class="cmd-item" onclick="navigateTo('college-dashboard'); closeCommandPalette();" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 10px; cursor: pointer;">
        <div style="display: flex; align-items: center; gap: 10px;"><i class="ph ph-squares-four" style="color: #6366f1;"></i> <span>Go to Dashboard</span></div>
      </div>
      <div class="cmd-item" onclick="navigateTo('institute-details'); closeCommandPalette();" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 10px; cursor: pointer;">
        <div style="display: flex; align-items: center; gap: 10px;"><i class="ph ph-users-three" style="color: #6366f1;"></i> <span>Open Student Monitoring</span></div>
      </div>
    `;
    return;
  }

  const q = query.toLowerCase().trim();
  const students = await window.db.getStudents();
  const companies = await window.db.getCompanies();
  const jobs = await window.db.getJobs();
  const courses = await window.db.getCourses();
  const mockTests = await window.db.getMockTests();
  const startups = await window.db.getStartups();

  const matchStudents = students.filter(s => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.branch.toLowerCase().includes(q));
  const matchCompanies = companies.filter(c => c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q));
  const matchJobs = jobs.filter(j => j.company.toLowerCase().includes(q) || j.role.toLowerCase().includes(q));
  const matchCourses = courses.filter(crs => crs.title.toLowerCase().includes(q) || crs.category.toLowerCase().includes(q));

  let html = '';

  if (matchStudents.length > 0) {
    html += `<div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #6366f1; margin: 10px 0 4px;">Students (${matchStudents.length})</div>`;
    matchStudents.slice(0, 3).forEach(s => {
      html += `
        <div onclick="openStudentProfileModal('${s.id}'); closeCommandPalette();" style="padding: 8px 12px; background: var(--surface-2); border-radius: 8px; margin-bottom: 6px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
          <div><strong style="font-size: 13px;">${s.name}</strong> <span style="font-size: 11px; color: var(--text-2);">(${s.id}) • ${s.branch}</span></div>
          <span style="font-size: 11px; background: rgba(99,102,241,0.1); color:#6366f1; padding: 2px 8px; border-radius: 99px;">${s.stage}</span>
        </div>
      `;
    });
  }

  if (matchCompanies.length > 0) {
    html += `<div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #22c55e; margin: 10px 0 4px;">Companies (${matchCompanies.length})</div>`;
    matchCompanies.slice(0, 3).forEach(c => {
      html += `
        <div onclick="navigateTo('company-management'); closeCommandPalette();" style="padding: 8px 12px; background: var(--surface-2); border-radius: 8px; margin-bottom: 6px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
          <div><strong style="font-size: 13px;">${c.name}</strong> <span style="font-size: 11px; color: var(--text-2);">${c.industry}</span></div>
          <span style="font-size: 11px; color: var(--success); font-weight: 700;">Score: ${c.relationshipScore}%</span>
        </div>
      `;
    });
  }

  if (matchCourses.length > 0) {
    html += `<div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #eab308; margin: 10px 0 4px;">Courses (${matchCourses.length})</div>`;
    matchCourses.slice(0, 3).forEach(crs => {
      html += `
        <div onclick="navigateTo('resource-management'); closeCommandPalette();" style="padding: 8px 12px; background: var(--surface-2); border-radius: 8px; margin-bottom: 6px; cursor: pointer;">
          <strong style="font-size: 13px;">${crs.title}</strong> - <span style="font-size: 11px; color: var(--text-2);">${crs.category}</span>
        </div>
      `;
    });
  }

  if (!html) {
    html = `<div style="text-align: center; padding: 24px; color: var(--text-3); font-size: 13px;">No matching student, company, drive, or course found for "${query}".</div>`;
  }

  resultsContainer.innerHTML = html;
}

// ──────────────────────────────────────────────────────────────
// DASHBOARD MODULE
// ──────────────────────────────────────────────────────────────
async function renderDashboard() {
  const students = await window.db.getStudents();
  const jobs = await window.db.getJobs();
  const applications = await window.db.getApplications();
  const companies = await window.db.getCompanies();
  const startups = await window.db.getStartups();
  const courses = await window.db.getCourses();
  const mockTests = await window.db.getMockTests();

  const totalStudents = students.length;
  const readyStudents = students.filter(s => s.stage === 'Placement Ready' || s.stage === 'Placed' || (s.readiness || 0) >= 70).length;
  const activeDrives = jobs.filter(j => j.status === 'Active').length;
  const totalApps = applications.length;
  const connectedCompanies = companies.length;
  const startupTeams = startups.length;
  const pubCourses = courses.length;
  const activeTests = mockTests.length;

  const kpiGrid = document.getElementById('dashboardKpiGrid');
  if (kpiGrid) {
    kpiGrid.innerHTML = `
      <div onclick="navigateTo('institute-details')" style="background: #FFFFFF; border: 1.5px solid #E2E2EC; border-radius: 20px; padding: 22px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 16px rgba(0,0,0,0.04);" onmouseover="this.style.transform='translateY(-4px)'; this.style.borderColor='#5B2D90';" onmouseout="this.style.transform='none'; this.style.borderColor='#E2E2EC';">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <span style="font-family: 'Rajdhani', sans-serif; font-size: 13px; font-weight: 800; color: #5B2D90; text-transform: uppercase; letter-spacing: 0.05em;">Total Students</span>
          <div style="width: 42px; height: 42px; border-radius: 12px; background: rgba(91,45,144,0.1); color: #5B2D90; display: flex; align-items: center; justify-content: center;"><i class="ph ph-users" style="font-size: 22px;"></i></div>
        </div>
        <div style="font-family: 'Rajdhani', sans-serif; font-size: 38px; font-weight: 900; color: #1E1B4B; line-height: 1;">${totalStudents}</div>
        <div style="font-size: 11px; color: #15803D; font-weight: 700; background: #DCFCE7; padding: 3px 8px; border-radius: 99px; display: inline-block; margin-top: 10px;">↑ 100% Synced Ecosystem</div>
      </div>

      <div onclick="navigateTo('institute-details')" style="background: #FFFFFF; border: 1.5px solid #E2E2EC; border-radius: 20px; padding: 22px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 16px rgba(0,0,0,0.04);" onmouseover="this.style.transform='translateY(-4px)'; this.style.borderColor='#5B2D90';" onmouseout="this.style.transform='none'; this.style.borderColor='#E2E2EC';">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <span style="font-family: 'Rajdhani', sans-serif; font-size: 13px; font-weight: 800; color: #5B2D90; text-transform: uppercase; letter-spacing: 0.05em;">Placement Ready</span>
          <div style="width: 42px; height: 42px; border-radius: 12px; background: rgba(34,197,94,0.12); color: #22c55e; display: flex; align-items: center; justify-content: center;"><i class="ph ph-check-circle" style="font-size: 22px;"></i></div>
        </div>
        <div style="font-family: 'Rajdhani', sans-serif; font-size: 38px; font-weight: 900; color: #1E1B4B; line-height: 1;">${readyStudents}</div>
        <div style="font-size: 11px; color: #15803D; font-weight: 700; background: #DCFCE7; padding: 3px 8px; border-radius: 99px; display: inline-block; margin-top: 10px;">↑ ${Math.round((readyStudents / (totalStudents || 1)) * 100)}% of total batch</div>
      </div>

      <div onclick="navigateTo('placement-drives')" style="background: #FFFFFF; border: 1.5px solid #E2E2EC; border-radius: 20px; padding: 22px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 16px rgba(0,0,0,0.04);" onmouseover="this.style.transform='translateY(-4px)'; this.style.borderColor='#5B2D90';" onmouseout="this.style.transform='none'; this.style.borderColor='#E2E2EC';">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <span style="font-family: 'Rajdhani', sans-serif; font-size: 13px; font-weight: 800; color: #5B2D90; text-transform: uppercase; letter-spacing: 0.05em;">Active Drives</span>
          <div style="width: 42px; height: 42px; border-radius: 12px; background: rgba(234,179,8,0.12); color: #ca8a04; display: flex; align-items: center; justify-content: center;"><i class="ph ph-briefcase" style="font-size: 22px;"></i></div>
        </div>
        <div style="font-family: 'Rajdhani', sans-serif; font-size: 38px; font-weight: 900; color: #1E1B4B; line-height: 1;">${activeDrives}</div>
        <div style="font-size: 11px; color: #854d0e; font-weight: 700; background: #fef9c3; padding: 3px 8px; border-radius: 99px; display: inline-block; margin-top: 10px;">⚡ Live hiring windows</div>
      </div>

      <div onclick="navigateTo('applications')" style="background: #FFFFFF; border: 1.5px solid #E2E2EC; border-radius: 20px; padding: 22px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 16px rgba(0,0,0,0.04);" onmouseover="this.style.transform='translateY(-4px)'; this.style.borderColor='#5B2D90';" onmouseout="this.style.transform='none'; this.style.borderColor='#E2E2EC';">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <span style="font-family: 'Rajdhani', sans-serif; font-size: 13px; font-weight: 800; color: #5B2D90; text-transform: uppercase; letter-spacing: 0.05em;">Total Applications</span>
          <div style="width: 42px; height: 42px; border-radius: 12px; background: rgba(168,85,247,0.12); color: #a855f7; display: flex; align-items: center; justify-content: center;"><i class="ph ph-paper-plane" style="font-size: 22px;"></i></div>
        </div>
        <div style="font-family: 'Rajdhani', sans-serif; font-size: 38px; font-weight: 900; color: #1E1B4B; line-height: 1;">${totalApps}</div>
        <div style="font-size: 11px; color: #5B2D90; font-weight: 700; background: #F3E8FF; padding: 3px 8px; border-radius: 99px; display: inline-block; margin-top: 10px;">🔄 Pipeline synchronized</div>
      </div>

      <div onclick="navigateTo('company-management')" style="background: #FFFFFF; border: 1.5px solid #E2E2EC; border-radius: 20px; padding: 22px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 16px rgba(0,0,0,0.04);" onmouseover="this.style.transform='translateY(-4px)'; this.style.borderColor='#5B2D90';" onmouseout="this.style.transform='none'; this.style.borderColor='#E2E2EC';">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <span style="font-family: 'Rajdhani', sans-serif; font-size: 13px; font-weight: 800; color: #5B2D90; text-transform: uppercase; letter-spacing: 0.05em;">Companies CRM</span>
          <div style="width: 42px; height: 42px; border-radius: 12px; background: rgba(14,165,233,0.12); color: #0ea5e9; display: flex; align-items: center; justify-content: center;"><i class="ph ph-buildings" style="font-size: 22px;"></i></div>
        </div>
        <div style="font-family: 'Rajdhani', sans-serif; font-size: 38px; font-weight: 900; color: #1E1B4B; line-height: 1;">${connectedCompanies}</div>
        <div style="font-size: 11px; color: #15803D; font-weight: 700; background: #DCFCE7; padding: 3px 8px; border-radius: 99px; display: inline-block; margin-top: 10px;">⭐ Relationship Score Active</div>
      </div>

      <div onclick="navigateTo('startup-showcase')" style="background: #FFFFFF; border: 1.5px solid #E2E2EC; border-radius: 20px; padding: 22px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 16px rgba(0,0,0,0.04);" onmouseover="this.style.transform='translateY(-4px)'; this.style.borderColor='#5B2D90';" onmouseout="this.style.transform='none'; this.style.borderColor='#E2E2EC';">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <span style="font-family: 'Rajdhani', sans-serif; font-size: 13px; font-weight: 800; color: #5B2D90; text-transform: uppercase; letter-spacing: 0.05em;">Startup Teams</span>
          <div style="width: 42px; height: 42px; border-radius: 12px; background: rgba(236,72,153,0.12); color: #ec4899; display: flex; align-items: center; justify-content: center;"><i class="ph ph-rocket-launch" style="font-size: 22px;"></i></div>
        </div>
        <div style="font-family: 'Rajdhani', sans-serif; font-size: 38px; font-weight: 900; color: #1E1B4B; line-height: 1;">${startupTeams}</div>
        <div style="font-size: 11px; color: #831843; font-weight: 700; background: #fce7f3; padding: 3px 8px; border-radius: 99px; display: inline-block; margin-top: 10px;">🚀 Incubation Hub Synced</div>
      </div>

      <div onclick="navigateTo('resource-management')" style="background: #FFFFFF; border: 1.5px solid #E2E2EC; border-radius: 20px; padding: 22px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 16px rgba(0,0,0,0.04);" onmouseover="this.style.transform='translateY(-4px)'; this.style.borderColor='#5B2D90';" onmouseout="this.style.transform='none'; this.style.borderColor='#E2E2EC';">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <span style="font-family: 'Rajdhani', sans-serif; font-size: 13px; font-weight: 800; color: #5B2D90; text-transform: uppercase; letter-spacing: 0.05em;">Published Courses</span>
          <div style="width: 42px; height: 42px; border-radius: 12px; background: rgba(91,45,144,0.1); color: #5B2D90; display: flex; align-items: center; justify-content: center;"><i class="ph ph-book-open" style="font-size: 22px;"></i></div>
        </div>
        <div style="font-family: 'Rajdhani', sans-serif; font-size: 38px; font-weight: 900; color: #1E1B4B; line-height: 1;">${pubCourses}</div>
        <div style="font-size: 11px; color: #5B2D90; font-weight: 700; background: #EDE9F7; padding: 3px 8px; border-radius: 99px; display: inline-block; margin-top: 10px;">📚 LMS Hub Active</div>
      </div>

      <div onclick="navigateTo('resource-management')" style="background: #FFFFFF; border: 1.5px solid #E2E2EC; border-radius: 20px; padding: 22px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 16px rgba(0,0,0,0.04);" onmouseover="this.style.transform='translateY(-4px)'; this.style.borderColor='#5B2D90';" onmouseout="this.style.transform='none'; this.style.borderColor='#E2E2EC';">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <span style="font-family: 'Rajdhani', sans-serif; font-size: 13px; font-weight: 800; color: #5B2D90; text-transform: uppercase; letter-spacing: 0.05em;">Active Mock Tests</span>
          <div style="width: 42px; height: 42px; border-radius: 12px; background: rgba(34,197,94,0.12); color: #22c55e; display: flex; align-items: center; justify-content: center;"><i class="ph ph-exam" style="font-size: 22px;"></i></div>
        </div>
        <div style="font-family: 'Rajdhani', sans-serif; font-size: 38px; font-weight: 900; color: #1E1B4B; line-height: 1;">${activeTests}</div>
        <div style="font-size: 11px; color: #15803D; font-weight: 700; background: #DCFCE7; padding: 3px 8px; border-radius: 99px; display: inline-block; margin-top: 10px;">🎯 Auto Score Analytics</div>
      </div>
    `;
  }

  // Render Dashboard Charts
  renderDashboardCharts(applications);

  // Render Recent HQ Activity Timeline
  const timelineBox = document.getElementById('dashRecentActivityTimeline');
  if (timelineBox) {
    timelineBox.innerHTML = `
      <div class="crm-timeline-item">
        <strong style="font-size: 13px; display: block;">Microsoft Placement Drive Published</strong>
        <span style="font-size: 11px; color: var(--text-2);">Calculated 132 eligible students based on CGPA >= 7.5</span>
      </div>
      <div class="crm-timeline-item">
        <strong style="font-size: 13px; display: block;">Full-Stack Web Dev Bootcamp Course Live</strong>
        <span style="font-size: 11px; color: var(--text-2);">Published to Student Portal Learning Hub</span>
      </div>
      <div class="crm-timeline-item">
        <strong style="font-size: 13px; display: block;">Synthetix Cloud Relationship Score Updated to 92%</strong>
        <span style="font-size: 11px; color: var(--text-2);">Marked as Excellent Recruiting Partner</span>
      </div>
    `;
  }
}

function renderDashboardCharts(applications) {
  // Placement Trend Chart
  const trendCtx = document.getElementById('placementTrendChart')?.getContext('2d');
  if (trendCtx) {
    if (state.charts.trend) state.charts.trend.destroy();
    state.charts.trend = new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          { label: 'Campus Offers Released', data: [12, 28, 45, 80, 110, 145, 185], borderColor: '#6366f1', backgroundColor: 'rgba(99, 102, 241, 0.1)', fill: true, tension: 0.4 },
          { label: 'Placement Ready Students', data: [40, 65, 90, 130, 160, 190, 220], borderColor: '#22c55e', borderDash: [5, 5], fill: false }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }
    });
  }

  // Application Funnel Chart
  const funnelCtx = document.getElementById('appFunnelChart')?.getContext('2d');
  if (funnelCtx) {
    if (state.charts.funnel) state.charts.funnel.destroy();
    state.charts.funnel = new Chart(funnelCtx, {
      type: 'bar',
      data: {
        labels: ['Applied', 'Review', 'Shortlist', 'Interview', 'Selected'],
        datasets: [{
          label: 'Candidates',
          data: [150, 95, 62, 38, 24],
          backgroundColor: ['#6366f1', '#0ea5e9', '#eab308', '#a855f7', '#22c55e'],
          borderRadius: 8
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
  }
}

// ──────────────────────────────────────────────────────────────
// STUDENT MONITORING MODULE
// ──────────────────────────────────────────────────────────────
async function renderStudentDirectory() {
  const students = await window.db.getStudents();
  
  // Filter logic based on mandatory hierarchy
  const selYear = document.getElementById('filterAcademicYear')?.value || '2024-2025';
  const selBranch = document.getElementById('filterBranch')?.value || 'ALL';
  const selY = document.getElementById('filterYear')?.value || 'ALL';
  const selDiv = document.getElementById('filterDivision')?.value || 'ALL';

  const filtered = students.filter(s => {
    const bOk = selBranch === 'ALL' || s.branch === selBranch;
    const yOk = selY === 'ALL' || (s.year || 'TY') === selY;
    const dOk = selDiv === 'ALL' || (s.division || 'A') === selDiv;
    return bOk && yOk && dOk;
  });

  // Render Summary Row Metrics
  const summaryRow = document.getElementById('studentSummaryRow');
  if (summaryRow) {
    const total = filtered.length;
    const ready = filtered.filter(s => s.stage === 'Placement Ready' || s.stage === 'Placed' || s.readiness >= 70).length;
    const avgScore = Math.round(filtered.reduce((acc, curr) => acc + (curr.readiness || 0), 0) / (total || 1));
    const placed = filtered.filter(s => s.stage === 'Placed').length;

    summaryRow.innerHTML = `
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 14px; border-radius: 14px;">
        <span style="font-size: 11px; font-weight: 700; color: var(--text-2);">FILTERED STUDENTS</span>
        <div style="font-family: 'Rajdhani', sans-serif; font-size: 24px; font-weight: 800;">${total}</div>
      </div>
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 14px; border-radius: 14px;">
        <span style="font-size: 11px; font-weight: 700; color: var(--text-2);">PLACEMENT READY</span>
        <div style="font-family: 'Rajdhani', sans-serif; font-size: 24px; font-weight: 800; color: var(--success);">${ready}</div>
      </div>
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 14px; border-radius: 14px;">
        <span style="font-size: 11px; font-weight: 700; color: var(--text-2);">AVG READINESS</span>
        <div style="font-family: 'Rajdhani', sans-serif; font-size: 24px; font-weight: 800; color: #6366f1;">${avgScore}%</div>
      </div>
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 14px; border-radius: 14px;">
        <span style="font-size: 11px; font-weight: 700; color: var(--text-2);">PLACED ALUMNI</span>
        <div style="font-family: 'Rajdhani', sans-serif; font-size: 24px; font-weight: 800; color: #0ea5e9;">${placed}</div>
      </div>
    `;
  }

  // Render Table Rows
  const tbody = document.getElementById('studentDirectoryTableBody');
  if (tbody) {
    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 28px; color: var(--text-3);">No student records found matching selected academic filters.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(s => `
      <tr style="border-bottom: 1px solid var(--border); transition: background 0.15s;" onmouseover="this.style.background='var(--surface-2)'" onmouseout="this.style.background='transparent'">
        <td style="padding: 12px 20px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: #6366f1; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px;">${s.name.substring(0, 2).toUpperCase()}</div>
            <div>
              <strong style="font-size: 13px; display: block; color: var(--text);">${s.name}</strong>
              <span style="font-size: 11px; color: var(--text-2);">${s.email}</span>
            </div>
          </div>
        </td>
        <td style="padding: 12px 16px; font-family: monospace; font-size: 12px; font-weight: 600;">${s.id}</td>
        <td style="padding: 12px 16px;"><span style="font-weight: 600;">${s.branch}</span> <span style="font-size: 11px; color: var(--text-3);">(${s.year || 'TY'}-${s.division || 'A'})</span></td>
        <td style="padding: 12px 16px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="flex: 1; height: 6px; background: var(--border); border-radius: 99px; overflow: hidden; width: 60px;">
              <div style="width: ${s.readiness || 50}%; height: 100%; background: ${s.readiness >= 75 ? '#22c55e' : s.readiness >= 50 ? '#6366f1' : '#f59e0b'};"></div>
            </div>
            <strong style="font-size: 12px;">${s.readiness || 50}%</strong>
          </div>
        </td>
        <td style="padding: 12px 16px; font-weight: 600;">${(s.appliedJobs || []).length} Jobs</td>
        <td style="padding: 12px 16px;">
          <span style="font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 99px; background: rgba(99, 102, 241, 0.12); color: #6366f1;">${s.stage || 'Imported'}</span>
        </td>
        <td style="padding: 12px 20px; text-align: right;">
          <button onclick="openStudentProfileModal('${s.id}')" style="background: var(--surface-2); border: 1px solid var(--border); padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; color: #6366f1;">
            View Profile & Journey
          </button>
        </td>
      </tr>
    `).join('');
  }
}

function handleStudentFilterChange() {
  renderStudentDirectory();
}

// ──────────────────────────────────────────────────────────────
// STUDENT PROFILE MODAL & 12-STAGE VERTICAL JOURNEY TIMELINE
// ──────────────────────────────────────────────────────────────
async function openStudentProfileModal(studentId) {
  const student = await window.db.getStudentById(studentId);
  if (!student) return;

  state.selectedStudent = student;
  const modal = document.getElementById('studentProfileModal');
  const content = document.getElementById('studentProfileModalContent');
  if (!modal || !content) return;

  const stagesList = [
    'Imported', 'Profile Completed', 'Skill Assessment Completed',
    'Courses Started', 'Courses Completed', 'Mock Tests Attempted',
    'Placement Ready', 'Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Placed'
  ];

  const currentStageIndex = stagesList.indexOf(student.stage || 'Imported');

  content.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 1px solid var(--border); margin-bottom: 20px;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <div style="width: 50px; height: 50px; border-radius: 50%; background: #6366f1; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px;">${student.name.substring(0, 2).toUpperCase()}</div>
        <div>
          <h2 style="font-family: 'Rajdhani', sans-serif; font-size: 24px; font-weight: 800; margin: 0; color: var(--text);">${student.name}</h2>
          <span style="font-size: 12px; color: var(--text-2); font-family: monospace;">Registration ID: ${student.id} • ${student.branch} (${student.year || 'TY'})</span>
        </div>
      </div>
      <button onclick="closeStudentProfileModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-3);">&times;</button>
    </div>

    <!-- Modal Two Column Grid -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      
      <!-- Left Column: Student Details -->
      <div>
        <h4 style="font-family: 'Rajdhani', sans-serif; font-size: 16px; font-weight: 700; margin-top: 0; margin-bottom: 12px; color: #6366f1;">Academic & Personal Profile</h4>
        <div style="background: var(--surface-2); border: 1px solid var(--border); border-radius: 16px; padding: 16px; font-size: 13px; display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
          <div><strong>Email:</strong> ${student.email}</div>
          <div><strong>Branch:</strong> ${student.branch}</div>
          <div><strong>CGPA:</strong> ${student.cgpa}</div>
          <div><strong>Target Companies:</strong> ${student.targetCompany || 'TCS'}</div>
          <div><strong>Resume Verification:</strong> <span style="color: var(--success); font-weight: 700;">${student.resumeVerified}</span></div>
          <div><strong>Courses Completed:</strong> ${student.coursesCompleted || 0}</div>
          <div><strong>Mock Tests Completed:</strong> ${student.mockTestsCompleted || 0}</div>
        </div>

        <h4 style="font-family: 'Rajdhani', sans-serif; font-size: 16px; font-weight: 700; margin-top: 0; margin-bottom: 12px; color: #6366f1;">Placement Readiness Score</h4>
        <div style="display: flex; align-items: center; gap: 16px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 16px; padding: 16px;">
          <div style="font-family: 'Rajdhani', sans-serif; font-size: 42px; font-weight: 800; color: #6366f1;">${student.readiness || 50}%</div>
          <div style="font-size: 12px; color: var(--text-2);">
            Calculated automatically based on Skill Assessment, Mock Tests, Course Completion, and Resume verification status.
          </div>
        </div>
      </div>

      <!-- Right Column: 12-Stage Placement Journey Vertical Timeline -->
      <div>
        <h4 style="font-family: 'Rajdhani', sans-serif; font-size: 16px; font-weight: 700; margin-top: 0; margin-bottom: 12px; color: #6366f1;">Automatic 12-Stage Placement Journey</h4>
        <div class="student-journey-timeline">
          ${stagesList.map((stageName, index) => {
            let nodeClass = '';
            let statusBadge = '<span style="font-size:10px; color:var(--text-3);">Upcoming</span>';
            if (index < currentStageIndex) {
              nodeClass = 'completed';
              statusBadge = '<span style="font-size:10px; color:var(--success); font-weight:700;">Completed ✓</span>';
            } else if (index === currentStageIndex) {
              nodeClass = 'current';
              statusBadge = '<span style="font-size:10px; color:#6366f1; font-weight:700;">Current Stage ●</span>';
            }
            return `
              <div class="journey-node ${nodeClass}">
                <span style="font-size: 12px; font-weight: 600; color: var(--text);">${stageName}</span>
                ${statusBadge}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
}

function closeStudentProfileModal(e) {
  if (e && e.target !== document.getElementById('studentProfileModal')) return;
  const modal = document.getElementById('studentProfileModal');
  if (modal) modal.style.display = 'none';
}

// ──────────────────────────────────────────────────────────────
// CLASS CREATION & STUDENT BATCH IMPORT
// ──────────────────────────────────────────────────────────────
function openCreateClassModal() {
  const modal = document.getElementById('createClassModal');
  if (modal) modal.style.display = 'flex';
}
function closeCreateClassModal(e) {
  if (e && e.target !== document.getElementById('createClassModal')) return;
  const modal = document.getElementById('createClassModal');
  if (modal) modal.style.display = 'none';
}

async function handleCreateClassSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('clsInputName')?.value;
  const branch = document.getElementById('clsInputBranch')?.value;
  const year = document.getElementById('clsInputYear')?.value;

  if (name && branch) {
    await window.db.createClass({ name, branch, year, division: 'A' });
    showToast(`Academic Class "${name}" created successfully!`, 'success');
    closeCreateClassModal();
    populateClassDropdowns();
  }
}

async function populateClassDropdowns() {
  const classes = await window.db.getClasses();
  const importSelect = document.getElementById('importClassSelect');
  if (importSelect) {
    importSelect.innerHTML = classes.map(c => `<option value="${c.id}">${c.name} (${c.branch} - ${c.year})</option>`).join('');
  }
}

function openImportStudentModal() {
  populateClassDropdowns();
  const modal = document.getElementById('importStudentModal');
  if (modal) modal.style.display = 'flex';
}
function closeImportStudentModal(e) {
  if (e && e.target !== document.getElementById('importStudentModal')) return;
  const modal = document.getElementById('importStudentModal');
  if (modal) modal.style.display = 'none';
}

async function handleBatchImportSubmit(e) {
  e.preventDefault();
  const rawText = document.getElementById('importRawData')?.value || '';
  const lines = rawText.split('\n').filter(l => l.trim().length > 0);

  const studentsList = [];
  lines.forEach((line, idx) => {
    const parts = line.split(',').map(p => p.trim());
    if (parts.length >= 2) {
      studentsList.push({
        id: parts[0] || `GHRCE2024${100 + idx}`,
        name: parts[1] || 'Imported Student',
        email: parts[2] || `${parts[0]}@ghrce.ac.in`,
        cgpa: parseFloat(parts[3]) || 7.5,
        branch: 'Computer Science',
        year: 'TY',
        division: 'A',
        stage: 'Imported'
      });
    }
  });

  if (studentsList.length > 0) {
    const res = await window.db.importStudentsBatch(studentsList);
    showToast(`Batch Import Complete! Imported ${res.importedCount} new accounts, updated ${res.updatedCount} existing records.`, 'success');
    closeImportStudentModal();
    renderStudentDirectory();
    renderDashboard();
  } else {
    showToast('Invalid data format. Provide RegNo, Name, Email, CGPA.', 'error');
  }
}

// ──────────────────────────────────────────────────────────────
// RESOURCE MANAGEMENT MODULE (LMS ADMINISTRATOR HQ)
// ──────────────────────────────────────────────────────────────
function renderResourceManagement() {
  if (state.currentResourceTab === 'courses') {
    renderCoursesLms();
  } else {
    renderMockTestsLms();
  }
}

function switchResourceSubTab(tab) {
  state.currentResourceTab = tab;
  const btnCrs = document.getElementById('tabBtnCourses');
  const btnTests = document.getElementById('tabBtnMockTests');
  const vCrs = document.getElementById('viewCoursesContainer');
  const vTests = document.getElementById('viewMockTestsContainer');
  const fCrs = document.getElementById('floatingCreateCourseBtn');
  const fTests = document.getElementById('floatingCreateTestBtn');

  if (tab === 'courses') {
    if (btnCrs) { btnCrs.style.background = '#6366f1'; btnCrs.style.color = '#fff'; }
    if (btnTests) { btnTests.style.background = 'transparent'; btnTests.style.color = 'var(--text-2)'; }
    if (vCrs) vCrs.style.display = 'block';
    if (vTests) vTests.style.display = 'none';
    if (fCrs) fCrs.style.display = 'inline-flex';
    if (fTests) fTests.style.display = 'none';
    renderCoursesLms();
  } else {
    if (btnTests) { btnTests.style.background = '#6366f1'; btnTests.style.color = '#fff'; }
    if (btnCrs) { btnCrs.style.background = 'transparent'; btnCrs.style.color = 'var(--text-2)'; }
    if (vTests) vTests.style.display = 'block';
    if (vCrs) vCrs.style.display = 'none';
    if (fTests) fTests.style.display = 'inline-flex';
    if (fCrs) fCrs.style.display = 'none';
    renderMockTestsLms();
  }
}

async function renderCoursesLms() {
  const courses = await window.db.getCourses();
  const grid = document.getElementById('coursesCardGrid');
  if (grid) {
    grid.innerHTML = courses.map(c => `
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; box-shadow: var(--shadow-sm); transition: all 0.2s;" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='none'">
        <div style="height: 140px; background: url('${c.thumbnail}') center/cover no-repeat; position: relative;">
          <span style="position: absolute; top: 12px; right: 12px; background: #22c55e; color: #fff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 99px;">${c.status}</span>
        </div>
        <div style="padding: 18px;">
          <span style="font-size: 11px; font-weight: 700; color: #6366f1; text-transform: uppercase;">${c.category}</span>
          <h3 style="font-family: 'Rajdhani', sans-serif; font-size: 18px; font-weight: 700; margin: 4px 0 8px; color: var(--text);">${c.title}</h3>
          <p style="font-size: 12px; color: var(--text-2); margin-bottom: 14px; line-height: 1.5;">${c.description}</p>
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-3); padding-top: 12px; border-top: 1px solid var(--border);">
            <span>👨‍🏫 ${c.instructor}</span>
            <span>⏱️ ${c.duration}</span>
          </div>
        </div>
      </div>
    `).join('');
  }
}

async function renderMockTestsLms() {
  const mockTests = await window.db.getMockTests();
  const grid = document.getElementById('mockTestsCardGrid');
  if (grid) {
    grid.innerHTML = mockTests.map(t => `
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 20px; box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <span style="font-size: 11px; font-weight: 700; background: rgba(99,102,241,0.12); color: #6366f1; padding: 4px 10px; border-radius: 99px;">${t.category}</span>
          <span style="font-size: 11px; color: var(--success); font-weight: 700;">${t.status}</span>
        </div>
        <h3 style="font-family: 'Rajdhani', sans-serif; font-size: 18px; font-weight: 700; margin: 0 0 6px;">${t.title}</h3>
        <p style="font-size: 12px; color: var(--text-2); margin-bottom: 14px;">Company: <strong>${t.company || 'General'}</strong> • Duration: ${t.duration} mins</p>
        <div style="font-size: 11px; color: var(--text-3);">Deadline: ${t.deadline}</div>
      </div>
    `).join('');
  }
}

// ──────────────────────────────────────────────────────────────
// COURSE PUBLISHING WIZARD (4 STEPS)
// ──────────────────────────────────────────────────────────────
function openCreateCourseModal() {
  state.courseWizardStep = 1;
  updateCourseWizardView();
  const modal = document.getElementById('createCourseModal');
  if (modal) modal.style.display = 'flex';
}
function closeCreateCourseModal(e) {
  if (e && e.target !== document.getElementById('createCourseModal')) return;
  const modal = document.getElementById('createCourseModal');
  if (modal) modal.style.display = 'none';
}

function navigateCourseWizard(delta) {
  state.courseWizardStep = Math.max(1, Math.min(4, state.courseWizardStep + delta));
  updateCourseWizardView();
}

function updateCourseWizardView() {
  const step = state.courseWizardStep;
  [1, 2, 3, 4].forEach(i => {
    const el = document.getElementById(`crsWizardStep${i}`);
    const pill = document.getElementById(`crsStepPill${i}`);
    if (el) el.style.display = i === step ? 'block' : 'none';
    if (pill) {
      if (i === step) { pill.className = 'wizard-step-pill active'; }
      else if (i < step) { pill.className = 'wizard-step-pill completed'; }
      else { pill.className = 'wizard-step-pill'; }
    }
  });

  const backBtn = document.getElementById('crsWizardBackBtn');
  const nextBtn = document.getElementById('crsWizardNextBtn');
  const submitBtn = document.getElementById('crsWizardSubmitBtn');

  if (backBtn) backBtn.style.display = step > 1 ? 'inline-block' : 'none';
  if (nextBtn) nextBtn.style.display = step < 4 ? 'inline-block' : 'none';
  if (submitBtn) submitBtn.style.display = step === 4 ? 'inline-block' : 'none';

  if (step === 4) {
    const title = document.getElementById('crsInputTitle')?.value || 'New Course';
    const desc = document.getElementById('crsInputDesc')?.value || 'Course Description';
    const inst = document.getElementById('crsInputInstructor')?.value || 'T&P Officer';
    const box = document.getElementById('crsLivePreviewBox');
    if (box) {
      box.innerHTML = `
        <div style="font-size: 11px; font-weight: 700; color: var(--success); margin-bottom: 6px;">LIVE STUDENT PORTAL PREVIEW</div>
        <h3 style="font-family: 'Rajdhani', sans-serif; font-size: 20px; font-weight: 700; margin: 0 0 6px;">${title}</h3>
        <p style="font-size: 12px; color: var(--text-2);">${desc}</p>
        <span style="font-size: 11px; color: #6366f1;">Instructor: ${inst}</span>
      `;
    }
  }
}

async function handlePublishCourseSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('crsInputTitle')?.value;
  const description = document.getElementById('crsInputDesc')?.value;
  const instructor = document.getElementById('crsInputInstructor')?.value;
  const category = document.getElementById('crsInputCategory')?.value;

  if (title && description) {
    await window.db.publishCourse({
      title, description, instructor, category,
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
      duration: '30 Hours'
    });
    showToast(`Course "${title}" published live to Student Portal!`, 'success');
    closeCreateCourseModal();
    renderCoursesLms();
    renderDashboard();
  }
}

// ──────────────────────────────────────────────────────────────
// MOCK TEST WIZARD & PUBLISHING
// ──────────────────────────────────────────────────────────────
function openCreateMockTestModal() {
  showToast('Mock Test Creator ready. Complete parameters and publish.', 'info');
}

// ──────────────────────────────────────────────────────────────
// PLACEMENT DRIVES MODULE & DYNAMIC ELIGIBILITY CALCULATOR
// ──────────────────────────────────────────────────────────────
async function renderPlacementDrives() {
  const jobs = await window.db.getJobs();
  const grid = document.getElementById('drivesCardGrid');
  if (grid) {
    grid.innerHTML = jobs.map(j => `
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 22px; box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #6366f1; color: #fff; font-weight: 800; display: flex; align-items: center; justify-content: center;">${j.logo || 'CMP'}</div>
          <span style="font-size: 11px; font-weight: 700; background: rgba(34,197,94,0.12); color: #22c55e; padding: 4px 10px; border-radius: 99px;">${j.status || 'Active'}</span>
        </div>
        <h3 style="font-family: 'Rajdhani', sans-serif; font-size: 20px; font-weight: 800; margin: 0 0 4px;">${j.role}</h3>
        <div style="font-size: 14px; font-weight: 700; color: #6366f1; margin-bottom: 10px;">${j.company} • ${j.ctc}</div>
        <p style="font-size: 12px; color: var(--text-2); margin-bottom: 14px;">${j.desc}</p>
        <div style="font-size: 11px; color: var(--text-3); padding-top: 10px; border-top: 1px solid var(--border);">
          Min CGPA: <strong>${j.eligibility?.cgpa || 7.0}</strong> • Backlogs: <strong>${j.eligibility?.backlogs || 0}</strong>
        </div>
      </div>
    `).join('');
  }
}

function openCreateDriveModal() {
  updateDriveEligibilityCalculation();
  const modal = document.getElementById('createDriveModal');
  if (modal) modal.style.display = 'flex';
}
function closeCreateDriveModal(e) {
  if (e && e.target !== document.getElementById('createDriveModal')) return;
  const modal = document.getElementById('createDriveModal');
  if (modal) modal.style.display = 'none';
}

async function updateDriveEligibilityCalculation() {
  const minCgpa = parseFloat(document.getElementById('drvMinCgpa')?.value) || 7.0;
  const maxBacklogs = parseInt(document.getElementById('drvMaxBacklogs')?.value, 10) || 0;

  const eligible = await window.db.calculateEligibleStudents({ cgpa: minCgpa, backlogs: maxBacklogs });
  const countBadge = document.getElementById('driveEligibleCountBadge');
  const text = document.getElementById('driveEligibilityCounterText');

  if (countBadge) countBadge.innerText = eligible.length;
  if (text) text.innerText = `${eligible.length} students currently meet Min CGPA ${minCgpa} & Backlogs <= ${maxBacklogs}`;
}

async function handleCreateDriveSubmit(e) {
  e.preventDefault();
  const company = document.getElementById('drvCompany')?.value;
  const role = document.getElementById('drvRole')?.value;
  const ctc = document.getElementById('drvCtc')?.value;
  const desc = document.getElementById('drvDesc')?.value;
  const minCgpa = parseFloat(document.getElementById('drvMinCgpa')?.value) || 7.0;
  const maxBacklogs = parseInt(document.getElementById('drvMaxBacklogs')?.value, 10) || 0;

  if (company && role) {
    await window.db.createPlacementDrive({
      company, role, ctc, desc,
      eligibility: { cgpa: minCgpa, backlogs: maxBacklogs }
    });
    showToast(`Placement Drive for ${company} launched successfully!`, 'success');
    closeCreateDriveModal();
    renderPlacementDrives();
    renderDashboard();
  }
}

// ──────────────────────────────────────────────────────────────
// APPLICATIONS RECRUITMENT PIPELINE
// ──────────────────────────────────────────────────────────────
async function renderApplicationsPipeline() {
  const applications = await window.db.getApplications();
  const tbody = document.getElementById('applicationsTableBody');
  if (tbody) {
    tbody.innerHTML = applications.map(a => `
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px 20px; font-weight: 700;">${a.studentName}</td>
        <td style="padding: 12px 16px;">${a.branch}</td>
        <td style="padding: 12px 16px;">${a.company}</td>
        <td style="padding: 12px 16px;">${a.role}</td>
        <td style="padding: 12px 16px; font-weight: 700; color: #6366f1;">${a.readinessScore || 70}%</td>
        <td style="padding: 12px 16px;">
          <span style="font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 99px; background: rgba(99,102,241,0.12); color: #6366f1;">${a.status}</span>
        </td>
        <td style="padding: 12px 20px; text-align: right;">
          <select onchange="handleUpdateAppStatus('${a.id}', this.value)" style="border: 1px solid var(--border); padding: 4px 8px; border-radius: 6px; font-size: 12px;">
            <option value="Applied" ${a.status === 'Applied' ? 'selected' : ''}>Applied</option>
            <option value="Under Review" ${a.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
            <option value="Shortlisted" ${a.status === 'Shortlisted' ? 'selected' : ''}>Shortlisted</option>
            <option value="Interview Scheduled" ${a.status === 'Interview Scheduled' ? 'selected' : ''}>Interview Scheduled</option>
            <option value="Selected" ${a.status === 'Selected' ? 'selected' : ''}>Selected</option>
            <option value="Rejected" ${a.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
          </select>
        </td>
      </tr>
    `).join('');
  }
}

async function handleUpdateAppStatus(appId, newStatus) {
  await window.db.updateApplicationStatus(appId, newStatus);
  showToast(`Application stage updated to "${newStatus}"`, 'success');
  renderApplicationsPipeline();
  renderDashboard();
}

// ──────────────────────────────────────────────────────────────
// COMPANY CRM MODULE
// ──────────────────────────────────────────────────────────────
async function renderCompanyCrm() {
  const companies = await window.db.getCompanies();
  const grid = document.getElementById('companiesCrmGrid');
  if (grid) {
    grid.innerHTML = companies.map(c => {
      const score = c.relationshipScore || 85;
      const tierColor = score >= 80 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444';
      const tierLabel = score >= 80 ? 'Excellent Partner' : score >= 50 ? 'Regular Partner' : 'Needs Follow-up';

      return `
        <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 22px; box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #6366f1; color: #fff; font-weight: 800; display: flex; align-items: center; justify-content: center;">${c.avatar || 'CP'}</div>
            <span style="font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 99px; background: rgba(34,197,94,0.12); color: ${tierColor};">${tierLabel}</span>
          </div>
          <h3 style="font-family: 'Rajdhani', sans-serif; font-size: 20px; font-weight: 800; margin: 0 0 4px;">${c.name}</h3>
          <div style="font-size: 12px; color: var(--text-2); margin-bottom: 14px;">${c.industry}</div>
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--surface-2); border-radius: 12px;">
            <div>
              <span style="font-size: 11px; color: var(--text-3); display: block;">Relationship Score</span>
              <strong style="font-family: 'Rajdhani', sans-serif; font-size: 22px; font-weight: 800; color: ${tierColor};">${score}%</strong>
            </div>
            <div style="font-size: 12px; text-align: right;">
              <div>Hired: <strong>${c.studentsHired || 0}</strong></div>
              <div>Visits: <strong>${c.previousVisits || 0}</strong></div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
}

// ──────────────────────────────────────────────────────────────
// INNOVATION HUB (STARTUPS & MENTORS)
// ──────────────────────────────────────────────────────────────
async function renderStartupsAdmin() {
  const startups = await window.db.getStartups();
  const grid = document.getElementById('startupsAdminGrid');
  if (grid) {
    grid.innerHTML = startups.map(st => `
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 22px; box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <span style="font-size: 11px; font-weight: 700; background: rgba(99,102,241,0.12); color: #6366f1; padding: 4px 10px; border-radius: 99px;">${st.category}</span>
          <span style="font-size: 11px; font-weight: 700; color: ${st.approvalStatus === 'Approved' ? '#22c55e' : '#eab308'};">${st.approvalStatus || 'Under Review'}</span>
        </div>
        <h3 style="font-family: 'Rajdhani', sans-serif; font-size: 20px; font-weight: 800; margin: 0 0 4px;">${st.name}</h3>
        <p style="font-size: 12px; color: var(--text-2); margin-bottom: 12px;">${st.tagline}</p>
        <div style="font-size: 11px; color: var(--text-3); margin-bottom: 14px;">Leader: <strong>${st.leaderName}</strong> • Mentor: <strong>${st.assignedMentorName || 'Unassigned'}</strong></div>
        <button onclick="openStartupReviewModal('${st.id}')" style="width: 100%; background: var(--surface-2); border: 1px solid var(--border); padding: 8px; border-radius: 10px; font-size: 12px; font-weight: 600; cursor: pointer; color: #6366f1;">
          Review Pitch & YouTube Comments
        </button>
      </div>
    `).join('');
  }
}

async function openStartupReviewModal(startupId) {
  const startups = await window.db.getStartups();
  const st = startups.find(s => s.id === startupId);
  if (!st) return;

  state.selectedStartup = st;
  const modal = document.getElementById('startupReviewModal');
  const content = document.getElementById('startupReviewModalContent');
  if (!modal || !content) return;

  const mentors = await window.db.getMentors();

  content.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 1px solid var(--border); margin-bottom: 20px;">
      <div>
        <h2 style="font-family: 'Rajdhani', sans-serif; font-size: 24px; font-weight: 800; margin: 0; color: var(--text);">${st.name}</h2>
        <span style="font-size: 12px; color: var(--text-2);">${st.category} • Stage: ${st.stage}</span>
      </div>
      <button onclick="closeStartupReviewModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-3);">&times;</button>
    </div>

    <div style="margin-bottom: 20px;">
      <h4 style="font-family: 'Rajdhani', sans-serif; font-size: 16px; font-weight: 700; margin-top: 0; margin-bottom: 6px;">Problem & Solution</h4>
      <p style="font-size: 13px; color: var(--text-2); margin-bottom: 14px;">${st.problem}</p>
      
      <div style="display: flex; gap: 12px; margin-bottom: 20px;">
        <button onclick="handleStartupStatusChange('${st.id}', 'Approved')" style="background: #22c55e; color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer;">Approve Startup</button>
        <button onclick="handleStartupStatusChange('${st.id}', 'Rejected')" style="background: #ef4444; color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer;">Reject Startup</button>
      </div>

      <div style="margin-bottom: 20px;">
        <label style="font-size: 12px; font-weight: 600; display: block; margin-bottom: 4px;">Assign Industry Mentor</label>
        <select onchange="handleAssignStartupMentor('${st.id}', this.value)" style="width: 100%; border: 1px solid var(--border); padding: 10px; border-radius: 10px; background: var(--surface-2);">
          <option value="">-- Select Mentor --</option>
          ${mentors.map(m => `<option value="${m.id}" ${st.assignedMentorId === m.id ? 'selected' : ''}>${m.name} (${m.organization})</option>`).join('')}
        </select>
      </div>

      <h4 style="font-family: 'Rajdhani', sans-serif; font-size: 16px; font-weight: 700; margin-top: 0; margin-bottom: 12px;">YouTube-Style Threaded Incubation Comments</h4>
      <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px;">
        ${(st.comments || []).map(c => `
          <div style="background: var(--surface-2); border: 1px solid var(--border); padding: 12px; border-radius: 12px; font-size: 12px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <strong>${c.author} <span class="admin-badge">${c.role}</span></strong>
              <span style="font-size: 10px; color: var(--text-3);">${c.date}</span>
            </div>
            <p style="margin: 0; color: var(--text);">${c.text}</p>
          </div>
        `).join('')}
      </div>

      <form onsubmit="handlePostStartupComment(event, '${st.id}')" style="display: flex; gap: 10px;">
        <input type="text" id="inputStartupComment" placeholder="Write feedback as Institute T&P Cell..." required style="flex: 1; border: 1px solid var(--border); padding: 10px; border-radius: 10px; background: var(--surface-2);" />
        <button type="submit" style="background: #6366f1; color: #fff; border: none; padding: 10px 18px; border-radius: 10px; font-weight: 700; cursor: pointer;">Post</button>
      </form>
    </div>
  `;

  modal.style.display = 'flex';
}

function closeStartupReviewModal(e) {
  if (e && e.target !== document.getElementById('startupReviewModal')) return;
  const modal = document.getElementById('startupReviewModal');
  if (modal) modal.style.display = 'none';
}

async function handleStartupStatusChange(id, status) {
  await window.db.updateStartupStatus(id, status, `Approval status updated to ${status}`);
  showToast(`Startup status updated to ${status}`, 'success');
  openStartupReviewModal(id);
  renderStartupsAdmin();
}

async function handleAssignStartupMentor(startupId, mentorId) {
  await window.db.updateStartupStatus(startupId, null, null, mentorId);
  showToast('Industry mentor assigned successfully!', 'success');
  renderStartupsAdmin();
}

async function handlePostStartupComment(e, startupId) {
  e.preventDefault();
  const text = document.getElementById('inputStartupComment')?.value;
  if (text) {
    await window.db.updateStartupStatus(startupId, null, text);
    showToast('Institute feedback comment posted!', 'success');
    openStartupReviewModal(startupId);
  }
}

async function renderMentorsAdmin() {
  const mentors = await window.db.getMentors();
  const grid = document.getElementById('mentorsGrid');
  if (grid) {
    grid.innerHTML = mentors.map(m => `
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 20px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <img src="${m.photo}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover;" />
          <div>
            <strong style="font-size: 14px; display: block;">${m.name}</strong>
            <span style="font-size: 11px; color: var(--text-2);">${m.designation} • ${m.organization}</span>
          </div>
        </div>
        <div style="font-size: 11px; color: var(--text-3);">Expertise: ${m.expertise}</div>
      </div>
    `).join('');
  }
}

async function renderStartupAnalytics() {
  const ctx = document.getElementById('startupAnalyticsChart')?.getContext('2d');
  if (ctx) {
    if (state.charts.startup) state.charts.startup.destroy();
    state.charts.startup = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Sustainability', 'EduTech', 'AI & ML', 'FinTech'],
        datasets: [{ data: [35, 25, 25, 15], backgroundColor: ['#22c55e', '#6366f1', '#a855f7', '#eab308'] }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
}

// ──────────────────────────────────────────────────────────────
// COMPANY RELATIONS, ANNOUNCEMENTS & SETTINGS
// ──────────────────────────────────────────────────────────────
async function renderRecruiterNetwork() {
  const recruiters = await window.db.getRecruiters();
  const grid = document.getElementById('recruitersGrid');
  if (grid) {
    grid.innerHTML = recruiters.map(r => `
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 16px;">
        <strong style="font-size: 14px; display: block;">${r.name}</strong>
        <span style="font-size: 12px; color: #6366f1;">${r.company} • ${r.designation}</span>
      </div>
    `).join('');
  }
}

async function renderPartnershipRequests() {
  const requests = await window.db.getPartnerships();
  const grid = document.getElementById('partnershipsGrid');
  if (grid) {
    grid.innerHTML = requests.map(p => `
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 18px;">
        <strong style="font-size: 14px; display: block;">${p.company}</strong>
        <p style="font-size: 12px; color: var(--text-2); margin: 4px 0 10px;">${p.requestType}</p>
        <span style="font-size: 11px; background: rgba(34,197,94,0.12); color: #22c55e; padding: 3px 8px; border-radius: 99px;">${p.status}</span>
      </div>
    `).join('');
  }
}

async function renderMentorshipPrograms() {
  const programs = await window.db.getMentorshipPrograms();
  const grid = document.getElementById('mentorshipProgramsGrid');
  if (grid) {
    grid.innerHTML = programs.map(mp => `
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 18px;">
        <strong style="font-size: 14px; display: block;">${mp.company}</strong>
        <div style="font-size: 12px; color: var(--text-2); margin-top: 4px;">Mentor: ${mp.mentor} • Students: ${mp.studentCount}</div>
      </div>
    `).join('');
  }
}

async function renderAnnouncements() {
  const list = await window.db.getAnnouncements();
  const container = document.getElementById('announcementsList');
  if (container) {
    container.innerHTML = list.map(a => `
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 18px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
          <h3 style="font-family: 'Rajdhani', sans-serif; font-size: 18px; font-weight: 700; margin: 0;">${a.title}</h3>
          <span style="font-size: 11px; font-weight: 700; background: rgba(239,68,68,0.12); color: #ef4444; padding: 3px 8px; border-radius: 99px;">${a.priority || 'Urgent'}</span>
        </div>
        <p style="font-size: 13px; color: var(--text-2); margin-bottom: 8px;">${a.content}</p>
        <div style="font-size: 11px; color: var(--text-3);">Target: ${a.audience} • Published: ${a.publishedDate}</div>
      </div>
    `).join('');
  }
}

function openCreateAnnouncementModal() {
  const title = prompt('Enter Announcement Title:');
  const content = prompt('Enter Announcement Content:');
  if (title && content) {
    window.db.publishAnnouncement({ title, content, category: 'General', priority: 'Urgent', audience: 'Entire Institute' });
    showToast('Announcement published live to Student Portal!', 'success');
    renderAnnouncements();
  }
}

/* ============================================================
   TEACHER / INSTITUTE HACKATHON ANALYTICS & VERIFICATION HQ
   ============================================================ */

async function renderHackathonAnalytics() {
  const students = await window.db.getStudents();

  let totalParticipated = 0;
  let totalEntries = 0;
  let totalWinners = 0;
  let totalFinalists = 0;
  let pendingVerifications = 0;

  const allHackathonRows = [];
  const techMap = {};

  students.forEach(s => {
    const list = s.hackathons || [];
    if (list.length > 0) totalParticipated++;
    totalEntries += list.length;

    list.forEach(h => {
      if (h.position === 'Winner') totalWinners++;
      if (['Finalist', 'Runner Up', 'Top 20', 'Top 50', 'Top 100', 'National Qualified'].includes(h.position)) totalFinalists++;
      if (!h.verified) pendingVerifications++;

      allHackathonRows.push({
        studentId: s.id,
        studentName: s.name,
        branch: s.branch || s.dept,
        ...h
      });

      if (h.technologies) {
        h.technologies.split(',').forEach(t => {
          const key = t.trim();
          if (key) techMap[key] = (techMap[key] || 0) + 1;
        });
      }
    });
  });

  // Update summary stats
  const statStudents = document.getElementById('haStatTotalStudents');
  if (statStudents) statStudents.textContent = `${totalParticipated}`;

  const statEntries = document.getElementById('haStatTotalEntries');
  if (statEntries) statEntries.textContent = `${totalEntries}`;

  const statWinners = document.getElementById('haStatTotalWinners');
  if (statWinners) statWinners.textContent = `${totalWinners}`;

  const statPending = document.getElementById('haStatPendingVerifications');
  if (statPending) statPending.textContent = `${pendingVerifications}`;

  // Render Verification Table
  const tableBody = document.getElementById('haVerificationTableBody');
  if (tableBody) {
    // Sort pending first
    allHackathonRows.sort((a, b) => (a.verified === b.verified) ? 0 : a.verified ? 1 : -1);

    if (allHackathonRows.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7" style="padding: 20px; text-align: center; color: var(--text-2);">No hackathon entries submitted yet.</td></tr>';
    } else {
      tableBody.innerHTML = allHackathonRows.map(row => `
        <tr style="border-bottom: 1px solid var(--border); ${!row.verified ? 'background: rgba(245, 158, 11, 0.05);' : ''}">
          <td style="padding: 12px 14px;">
            <div style="font-weight: 700; color: var(--text);">${row.studentName}</div>
            <div style="font-size: 11px; color: var(--text-2);">${row.branch} (${row.studentId})</div>
          </td>
          <td style="padding: 12px 14px;">
            <div style="font-weight: 700; color: var(--text);">${row.name}</div>
            <div style="font-size: 11px; color: var(--text-2);">🚀 ${row.projectName}</div>
          </td>
          <td style="padding: 12px 14px;">
            <span style="font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 99px; background: rgba(147, 51, 234, 0.12); color: #9333ea;">
              ${row.position}
            </span>
          </td>
          <td style="padding: 12px 14px; font-size: 12px; color: var(--text-2);">${row.date} • ${row.mode}</td>
          <td style="padding: 12px 14px;">
            ${row.certificateUrl ? `<a href="${row.certificateUrl}" target="_blank" style="color: var(--primary); font-weight: 700; text-decoration: none; font-size: 12px;">📜 View Certificate</a>` : '<span style="color: var(--text-3); font-size: 11px;">No link</span>'}
          </td>
          <td style="padding: 12px 14px;">
            ${row.verified ? '<span style="color: #16a34a; font-weight: 800; font-size: 11px; background: rgba(34,197,94,0.12); padding: 3px 8px; border-radius: 99px;">✔ Verified</span>' : '<span style="color: #d97706; font-weight: 800; font-size: 11px; background: rgba(245,158,11,0.15); padding: 3px 8px; border-radius: 99px;">⏳ Pending</span>'}
          </td>
          <td style="padding: 12px 14px; text-align: right;">
            ${!row.verified ? `<button onclick="verifyStudentHackathon('${row.studentId}', '${row.id}')" style="background: #16a34a; color: #fff; border: none; padding: 6px 14px; border-radius: 8px; font-weight: 700; font-size: 11px; cursor: pointer; box-shadow: 0 2px 6px rgba(22,163,74,0.3);">✔ Verify Entry (+50 XP)</button>` : `<span style="font-size: 11px; color: var(--text-3);">Verified by ${row.verifiedBy || 'T&P Officer'}</span>`}
          </td>
        </tr>
      `).join('');
    }
  }

  // Render Top Ranked Students
  const topRankedContainer = document.getElementById('haTopRankedList');
  if (topRankedContainer) {
    const studentXpList = students.map(s => ({
      ...s,
      xp: window.db.calculateStudentHackathonXP(s),
      wins: (s.hackathons || []).filter(h => h.position === 'Winner').length
    })).sort((a, b) => b.xp - a.xp);

    topRankedContainer.innerHTML = studentXpList.slice(0, 4).map((s, idx) => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #F8F7FC; border-radius: 12px; border: 1px solid var(--border);">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="font-weight: 900; font-size: 14px; color: #5B2D90; width: 24px;">#${idx + 1}</div>
          <div>
            <div style="font-weight: 700; font-size: 13px; color: var(--text);">${s.name}</div>
            <div style="font-size: 11px; color: var(--text-2);">${s.branch || s.dept}</div>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-family: 'Rajdhani', sans-serif; font-size: 16px; font-weight: 900; color: #d97706;">${s.xp} XP</div>
          <div style="font-size: 10px; color: var(--success); font-weight: 700;">🥇 ${s.wins} Wins</div>
        </div>
      </div>
    `).join('');
  }

  // Render Most Active Students
  const mostActiveContainer = document.getElementById('haMostActiveList');
  if (mostActiveContainer) {
    const activeList = students.map(s => ({
      ...s,
      count: (s.hackathons || []).length
    })).sort((a, b) => b.count - a.count);

    mostActiveContainer.innerHTML = activeList.slice(0, 4).map((s, idx) => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #F8F7FC; border-radius: 12px; border: 1px solid var(--border);">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="font-weight: 900; font-size: 14px; color: #0284c7; width: 24px;">#${idx + 1}</div>
          <div>
            <div style="font-weight: 700; font-size: 13px; color: var(--text);">${s.name}</div>
            <div style="font-size: 11px; color: var(--text-2);">${s.branch || s.dept}</div>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-family: 'Rajdhani', sans-serif; font-size: 16px; font-weight: 900; color: #0284c7;">${s.count} Hackathons</div>
          <div style="font-size: 10px; color: var(--text-2);">Active Competitor</div>
        </div>
      </div>
    `).join('');
  }

  // Render Tech Trends
  const techTrendsContainer = document.getElementById('haTechTrendsList');
  if (techTrendsContainer) {
    const sortedTech = Object.entries(techMap).sort((a, b) => b[1] - a[1]);
    techTrendsContainer.innerHTML = sortedTech.slice(0, 6).map(([tech, count]) => `
      <div style="padding: 12px; background: #F8F7FC; border-radius: 12px; border: 1px solid var(--border); text-align: center;">
        <div style="font-size: 11px; font-weight: 800; color: #5B2D90; text-transform: uppercase;">${tech}</div>
        <div style="font-family: 'Rajdhani', sans-serif; font-size: 22px; font-weight: 900; color: var(--text); margin: 2px 0;">${count} Projects</div>
        <div style="font-size: 10px; color: var(--success); font-weight: 700;">🔥 Trending Tech</div>
      </div>
    `).join('');
  }

  // Render Students Needing Encouragement
  const encouragementContainer = document.getElementById('haEncouragementList');
  if (encouragementContainer) {
    const needEncouragement = students.filter(s => (s.hackathons || []).length <= 1);
    encouragementContainer.innerHTML = needEncouragement.slice(0, 3).map(s => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #FFFBEB; border-radius: 12px; border: 1px solid rgba(245, 158, 11, 0.3);">
        <div>
          <div style="font-weight: 700; font-size: 13px; color: var(--text);">${s.name}</div>
          <div style="font-size: 11px; color: var(--text-2);">CGPA: ${s.cgpa || 7.5} • ${s.branch || s.dept}</div>
        </div>
        <button onclick="showToast('Encouragement invite sent to ${s.name}!','success')" style="background: #f59e0b; color: #000; font-size: 11px; font-weight: 800; padding: 6px 12px; border: none; border-radius: 8px; cursor: pointer;">
          ⚡ Send Hackathon Invite
        </button>
      </div>
    `).join('');
  }
}

async function verifyStudentHackathon(studentId, hackathonId) {
  const res = await window.db.verifyHackathon(studentId, hackathonId, 'Saurabhi Sharma (Head T&P)');
  if (res.success) {
    showToast('Certificate Verified! Entry updated with ✔ Verified status and +50 Bonus XP awarded.', 'success');
    renderHackathonAnalytics();
  } else {
    showToast('Verification failed: ' + (res.message || 'Error'), 'error');
  }
}

/* ============================================================
   LEARNING MATERIALS & HACKATHON DASHBOARD & INTERNSHIP REPORTS
   ============================================================ */

async function renderLearningMaterials() {
  const container = document.getElementById('materialsListGrid');
  if (!container) return;

  try {
    const token = sessionStorage.getItem('elevate_token');
    const res = await fetch('/api/learning-materials', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    const materials = data.materials || [];

    if (materials.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-2);">No learning materials posted yet.</div>`;
      return;
    }

    const canDelete = ['SUPER_ADMIN', 'TNP_ADMIN', 'FACULTY'].includes((state.role || '').toUpperCase());

    container.innerHTML = materials.map(m => `
      <div style="background: #F8F7FC; border: 1px solid var(--border); border-radius: 16px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; gap: 6px; margin-bottom: 8px; flex-wrap: wrap;">
            <span style="font-size: 10px; font-weight: 800; background: #EDE9F7; color: #5B2D90; padding: 3px 8px; border-radius: 99px;">Branch: ${m.targetBranch || 'ALL'}</span>
            <span style="font-size: 10px; font-weight: 800; background: #DCFCE7; color: #16a34a; padding: 3px 8px; border-radius: 99px;">Year: ${m.targetYear || 'ALL'}</span>
          </div>
          <h4 style="font-family: 'Rajdhani', sans-serif; font-size: 18px; font-weight: 800; color: var(--text); margin: 0 0 6px;">${m.title}</h4>
          <p style="font-size: 12px; color: var(--text-2); margin: 0 0 14px; line-height: 1.4;">${m.description}</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 12px; margin-top: 8px;">
          <a href="${m.link}" target="_blank" style="font-size: 12px; font-weight: 700; color: #5B2D90; text-decoration: none; display: flex; align-items: center; gap: 4px;">
            Open Resource <i class="ph ph-arrow-square-out"></i>
          </a>
          ${canDelete ? `
            <button onclick="handleDeleteLearningMaterial('${m.id}')" style="background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; border-radius: 8px; padding: 4px 10px; font-size: 11px; font-weight: 700; cursor: pointer;">
              Delete
            </button>
          ` : ''}
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error rendering learning materials:', err);
  }
}

async function handleUploadLearningMaterial(e) {
  e.preventDefault();
  const title = document.getElementById('matTitle').value;
  const targetBranch = document.getElementById('matTargetBranch').value;
  const targetYear = document.getElementById('matTargetYear').value;
  const link = document.getElementById('matLink').value;
  const description = document.getElementById('matDescription').value;

  try {
    const token = sessionStorage.getItem('elevate_token');
    const res = await fetch('/api/learning-materials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, description, link, targetBranch, targetYear })
    });
    const data = await res.json();
    if (data.success) {
      if (typeof showToast === 'function') showToast('Learning resource posted successfully!', 'success');
      document.getElementById('matTitle').value = '';
      document.getElementById('matLink').value = '';
      document.getElementById('matDescription').value = '';
      renderLearningMaterials();
    } else {
      if (typeof showToast === 'function') showToast(data.message || 'Failed to post material', 'error');
    }
  } catch (err) {
    console.error('Error uploading material:', err);
  }
}

async function handleDeleteLearningMaterial(id) {
  if (!confirm('Are you sure you want to delete this resource?')) return;
  try {
    const token = sessionStorage.getItem('elevate_token');
    const res = await fetch(`/api/learning-materials/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      if (typeof showToast === 'function') showToast('Learning resource deleted.', 'success');
      renderLearningMaterials();
    }
  } catch (err) {
    console.error('Error deleting material:', err);
  }
}

async function renderInstituteHackathons() {
  const container = document.getElementById('instituteHackathonsList');
  const lbContainer = document.getElementById('instituteHackathonsLeaderboard');
  if (!container) return;

  try {
    const token = sessionStorage.getItem('elevate_token');
    const res = await fetch('/api/hackathons', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    const hackathons = data.hackathons || [];

    const addBtn = document.getElementById('addHackathonBtn');
    if (addBtn) {
      const canManage = ['SUPER_ADMIN', 'TNP_ADMIN'].includes((state.role || '').toUpperCase());
      addBtn.style.display = canManage ? 'flex' : 'none';
    }

    const activeCount = hackathons.filter(h => h.status === 'Active').length;
    const totalParticipants = hackathons.reduce((sum, h) => sum + (h.registeredCount || 0), 0);
    const topPerformersCount = hackathons.reduce((sum, h) => sum + ((h.topPerformers || []).length), 0);

    const elActive = document.getElementById('instActiveHackathonsCount');
    const elPart = document.getElementById('instTotalHackathonParticipants');
    const elTop = document.getElementById('instTopPerformersCount');
    if (elActive) elActive.textContent = activeCount;
    if (elPart) elPart.textContent = totalParticipants;
    if (elTop) elTop.textContent = topPerformersCount;

    container.innerHTML = hackathons.map(h => `
      <div style="background: #F8F7FC; border: 1.5px solid var(--border); border-radius: 18px; padding: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <span style="font-size: 10px; font-weight: 800; background: ${h.status === 'Active' ? '#DCFCE7' : '#E2E8F0'}; color: ${h.status === 'Active' ? '#16a34a' : '#64748b'}; padding: 3px 10px; border-radius: 99px; text-transform: uppercase;">
            ${h.status || 'Active'}
          </span>
          <span style="font-size: 11px; color: var(--text-2); font-weight: 600;"><i class="ph ph-calendar"></i> ${h.date}</span>
        </div>
        <h4 style="font-family: 'Rajdhani', sans-serif; font-size: 19px; font-weight: 800; color: var(--text); margin: 0 0 6px;">${h.title}</h4>
        <p style="font-size: 12px; color: var(--text-2); margin: 0 0 12px;">Organizer: <strong>${h.organizer}</strong> &bull; Mode: ${h.mode || 'Offline'}</p>
        <div style="background: #FFFFFF; border: 1px solid var(--border); border-radius: 12px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 12px; font-weight: 600; color: var(--text-2);">Registered Students</span>
          <span style="font-family: 'Rajdhani', sans-serif; font-size: 20px; font-weight: 800; color: #5B2D90;">${h.registeredCount || 0}</span>
        </div>
      </div>
    `).join('');

    if (lbContainer) {
      const allPerformers = [];
      hackathons.forEach(h => {
        (h.topPerformers || []).forEach(tp => {
          allPerformers.push({ ...tp, hackathon: h.title });
        });
      });
      allPerformers.sort((a, b) => (a.rank - b.rank) || (b.score - a.score));

      if (allPerformers.length === 0) {
        lbContainer.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px; color: var(--text-2);">No top performers recorded yet.</td></tr>`;
      } else {
        lbContainer.innerHTML = allPerformers.map(tp => `
          <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 12px 16px; font-weight: 800; color: #5B2D90;">#${tp.rank}</td>
            <td style="padding: 12px 16px; font-weight: 700; color: var(--text);">${tp.name}</td>
            <td style="padding: 12px 16px; color: var(--text-2);">${tp.team || 'Solo'}</td>
            <td style="padding: 12px 16px; font-weight: 800; color: #16a34a;">${tp.score} XP</td>
          </tr>
        `).join('');
      }
    }
  } catch (err) {
    console.error('Error rendering institute hackathons:', err);
  }
}

function openCreateHackathonModal() {
  const m = document.getElementById('createHackathonModal');
  if (m) m.style.display = 'flex';
}

function closeCreateHackathonModal() {
  const m = document.getElementById('createHackathonModal');
  if (m) m.style.display = 'none';
}

async function handleCreateHackathonSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('hkTitle').value;
  const organizer = document.getElementById('hkOrganizer').value;
  const date = document.getElementById('hkDate').value;
  const mode = document.getElementById('hkMode').value;
  const theme = document.getElementById('hkTheme').value;

  try {
    const token = sessionStorage.getItem('elevate_token');
    const res = await fetch('/api/hackathons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, organizer, date, mode, theme })
    });
    const data = await res.json();
    if (data.success) {
      if (typeof showToast === 'function') showToast('Hackathon entry added!', 'success');
      closeCreateHackathonModal();
      renderInstituteHackathons();
    }
  } catch (err) {
    console.error('Error creating hackathon:', err);
  }
}

function switchStudentMonitoringSubTab(tab) {
  const recWrap = document.getElementById('studentRecordsTableWrap');
  const repWrap = document.getElementById('internshipReportsWrap');
  const btnRec = document.getElementById('tabBtnStudentRecords');
  const btnRep = document.getElementById('tabBtnInternshipReports');

  if (tab === 'records') {
    if (recWrap) recWrap.style.display = 'block';
    if (repWrap) repWrap.style.display = 'none';
    if (btnRec) { btnRec.style.background = '#5B2D90'; btnRec.style.color = '#fff'; btnRec.style.borderColor = '#5B2D90'; }
    if (btnRep) { btnRep.style.background = '#FFFFFF'; btnRep.style.color = 'var(--text)'; btnRep.style.borderColor = 'var(--border)'; }
  } else {
    if (recWrap) recWrap.style.display = 'none';
    if (repWrap) repWrap.style.display = 'block';
    if (btnRep) { btnRep.style.background = '#5B2D90'; btnRep.style.color = '#fff'; btnRep.style.borderColor = '#5B2D90'; }
    if (btnRec) { btnRec.style.background = '#FFFFFF'; btnRec.style.color = 'var(--text)'; btnRec.style.borderColor = 'var(--border)'; }
    renderInternshipReports();
  }
}

async function renderInternshipReports() {
  const container = document.getElementById('internshipReportsTableBody');
  if (!container) return;

  try {
    const token = sessionStorage.getItem('elevate_token');
    const res = await fetch('/api/internship-reports', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    const reports = data.reports || [];

    if (reports.length === 0) {
      container.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 24px; color: var(--text-2);">No internship reports submitted yet.</td></tr>`;
      return;
    }

    const canVerify = ['SUPER_ADMIN', 'TNP_ADMIN'].includes((state.role || '').toUpperCase());

    container.innerHTML = reports.map(r => `
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 12px 16px; font-weight: 700; color: var(--text);">${r.studentName || 'Priya Sharma'}</td>
        <td style="padding: 12px 16px; color: var(--text-2); font-family: monospace;">${r.prn || 'GHRCE2024047'}</td>
        <td style="padding: 12px 16px;">
          <strong style="color: #5B2D90; display: block;">${r.companyName}</strong>
          <span style="font-size: 11px; color: var(--text-2);">${r.role}</span>
        </td>
        <td style="padding: 12px 16px; font-size: 12px;">
          <div>${r.startDate} to ${r.endDate}</div>
          <span style="font-size: 10px; font-weight: 700; background: #EDE9F7; color: #5B2D90; padding: 2px 6px; border-radius: 4px;">${r.type || 'In-Person'}</span>
        </td>
        <td style="padding: 12px 16px; font-weight: 700; color: #16a34a;">${r.stipend || 'N/A'}</td>
        <td style="padding: 12px 16px; font-size: 12px; color: var(--text-2); max-width: 200px;">${r.keyLearnings || '-'}</td>
        <td style="padding: 12px 16px;">
          <div style="display: flex; flex-direction: column; gap: 4px; font-size: 11px;">
            ${r.offerLetter ? `<a href="#" onclick="showToast('Viewing Offer Letter...','info'); return false;" style="color: #2563eb; text-decoration: none;">📄 Offer Letter</a>` : ''}
            ${r.completionCertificate ? `<a href="#" onclick="showToast('Viewing Certificate...','info'); return false;" style="color: #16a34a; text-decoration: none;">📜 Certificate</a>` : ''}
          </div>
        </td>
        <td style="padding: 12px 16px;">
          <span style="font-size: 11px; font-weight: 800; background: ${r.status === 'Verified by T&P' ? '#DCFCE7' : '#FEF3C7'}; color: ${r.status === 'Verified by T&P' ? '#16a34a' : '#d97706'}; padding: 4px 10px; border-radius: 99px;">
            ${r.status || 'Submitted'}
          </span>
        </td>
        <td style="padding: 12px 16px; text-align: right;">
          ${r.status !== 'Verified by T&P' && canVerify ? `
            <button onclick="handleVerifyInternshipReport('${r.id}')" style="background: #5B2D90; color: #fff; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer;">
              Verify Report
            </button>
          ` : '<span style="font-size: 11px; color: var(--text-3);">Verified</span>'}
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Error rendering internship reports:', err);
  }
}

async function handleVerifyInternshipReport(id) {
  try {
    const token = sessionStorage.getItem('elevate_token');
    const res = await fetch(`/api/internship-reports/${id}/verify`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      if (typeof showToast === 'function') showToast('Internship report verified by T&P!', 'success');
      renderInternshipReports();
    }
  } catch (err) {
    console.error('Error verifying internship report:', err);
  }
}

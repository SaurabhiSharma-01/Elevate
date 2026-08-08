/* ============================================================
   ELEVATE INDUSTRY PORTAL — Complete Enterprise Application Logic
   GH Raisoni College & Enterprise Placement Ecosystem
   ============================================================ */

'use strict';

// ─── Global State ───
const state = {
  currentPage: 'dashboard',
  company: {
    name: 'Microsoft Corporation India',
    email: 'recruiter@microsoft.com',
    logo: 'MS',
    recruiterName: 'Recruiter Workspace',
    industry: 'Software, Cloud & AI',
    website: 'https://careers.microsoft.com',
    location: 'Bangalore, Hyderabad, Noida, Remote',
    about: 'Microsoft is empowering every person and organization on the planet to achieve more. We hire top student talent for software engineering, cloud, and AI roles.'
  },
  filters: {
    college: 'All',
    branch: 'All',
    passYear: 'All',
    minCgpa: 6.0,
    minReadiness: 50,
    skills: new Set(),
    exp: 'All'
  },
  students: [],
  jobs: [],
  drives: [],
  interviews: [
    {
      id: 'int_101',
      candidateId: 'GHRCE2024047',
      candidateName: 'Priya Sharma',
      role: 'Software Engineer Intern',
      type: 'Technical Round',
      mode: 'Online Video Call',
      dateTime: '2026-07-26T10:00',
      panel: 'Lead Cloud Architect',
      link: 'https://teams.microsoft.com/meet/987123',
      status: 'Scheduled',
      rating: 4.5,
      notes: 'Strong DSA knowledge and clear architectural thinking.'
    },
    {
      id: 'int_102',
      candidateId: 'GHRCE2024089',
      candidateName: 'Sneha Patil',
      role: 'Software Engineer Intern',
      type: 'HR Round',
      mode: 'On-Campus Room 204',
      dateTime: '2026-07-27T14:30',
      panel: 'Senior HR Manager',
      link: 'Campus Room 204',
      status: 'Scheduled',
      rating: 4.8,
      notes: 'Exceptional communication skills and cultural alignment.'
    }
  ],
  startups: [
    {
      id: 'stp_001',
      name: 'NeuralVision AI',
      banner: 'linear-gradient(135deg, #5B2D90 0%, #8B5FBF 100%)',
      logo: 'NV',
      founder: 'Aarav Gupta (CSE 7th Sem)',
      category: 'AI & Computer Vision',
      desc: 'Real-time industrial defect detection using low-latency edge AI camera vision.',
      techStack: ['Python', 'PyTorch', 'OpenCV', 'TensorRT'],
      funding: 'Pre-Seed (₹15 Lakhs Grant)',
      problem: 'Automating quality assurance in high-speed manufacturing lines.',
      comments: [
        { author: 'T&P Admin', text: 'Verified student venture under GHRCE Incubator.', badge: 'T&P Cell' },
        { author: 'Microsoft Recruiter', text: 'Impressed by the PyTorch edge deployment pipeline! Interested in exploring internship offers.', badge: 'Company' }
      ]
    },
    {
      id: 'stp_002',
      name: 'EcoLogistics Tech',
      banner: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      logo: 'EL',
      founder: 'Rohan Mehta & Ananya Sen (IT)',
      category: 'CleanTech & Supply Chain',
      desc: 'AI-driven EV fleet route optimization for last-mile delivery reduction of carbon footprint.',
      techStack: ['React', 'Node.js', 'PostgreSQL', 'Google Maps API'],
      funding: 'Bootstrapped',
      problem: 'High fuel costs and inefficient routing for urban delivery micro-fleets.',
      comments: [
        { author: 'T&P Admin', text: 'Selected for National Innovation Contest 2026.', badge: 'T&P Cell' }
      ]
    }
  ],
  mentors: [
    {
      id: 'mnt_001',
      name: 'Vikramaditya Rao',
      role: 'Principal Software Engineer',
      company: 'Microsoft',
      expertise: ['System Design', 'Cloud Architecture', 'Distributed Systems'],
      experience: '12+ Years',
      availability: 'Saturdays (2 PM - 5 PM)',
      avatar: 'VR'
    },
    {
      id: 'mnt_002',
      name: 'Divya Suryavanshi',
      role: 'Engineering Lead & AI Researcher',
      company: 'Microsoft',
      expertise: ['Machine Learning', 'NLP', 'Python'],
      experience: '8 Years',
      availability: 'Wednesdays (6 PM - 8 PM)',
      avatar: 'DS'
    }
  ],
  activeDriveTab: 'active',
  pipelineJob: 'All',
  selectedStudentId: null,
  activeProfTab: 'overview',
  charts: {}
};

// ─── INIT APPLICATION ───
document.addEventListener('DOMContentLoaded', async () => {
  await loadDatabaseData();
  renderCurrentPage();
  setupEventListeners();
});

// ─── LOAD DATA FROM DB ───
async function loadDatabaseData() {
  try {
    if (window.db) {
      state.students = await window.db.getStudents();
      state.jobs = await window.db.getJobs();
      state.drives = await window.db.getDrives();
    }
  } catch (err) {
    console.warn('[Industry App] DB load warning, using fallback cache.', err);
  }

  // Ensure default candidate data if list is short
  if (!state.students || state.students.length === 0) {
    state.students = [
      {
        id: 'GHRCE2024047',
        name: 'Priya Sharma',
        email: 'priya.sharma@ghrce.ac.in',
        dept: 'Engineering',
        branch: 'Computer Science',
        semester: '6th Semester',
        cgpa: 8.8,
        readiness: 88,
        rank: 14,
        targetCompany: 'Microsoft',
        resumeVerified: 'Verified',
        resumeText: 'Priya Sharma. B.Tech Computer Science student. Core Skills: Python, Java, DSA, SQL, System Design. Projects: E-Commerce Cloud Platform, AI Fraud Detection.',
        coursesCompleted: 12,
        todayHours: 3.5,
        mockTestsCompleted: 16,
        weakSkills: ['Computer Networks'],
        appliedJobs: [{ jobId: 'job_001', status: 'Technical Round', date: '2026-07-20' }]
      },
      {
        id: 'GHRCE2024089',
        name: 'Sneha Patil',
        email: 'sneha.patil@ghrce.ac.in',
        dept: 'Engineering',
        branch: 'Electronics',
        semester: '6th Semester',
        cgpa: 9.1,
        readiness: 92,
        rank: 3,
        targetCompany: 'Microsoft',
        resumeVerified: 'Verified',
        resumeText: 'Sneha Patil. B.Tech Electronics. Strong programming in C++, Python, Embedded ML. LeetCode Knight.',
        coursesCompleted: 15,
        todayHours: 4.0,
        mockTestsCompleted: 22,
        weakSkills: ['SQL Tuning'],
        appliedJobs: [{ jobId: 'job_001', status: 'HR Round', date: '2026-07-18' }]
      },
      {
        id: 'GHRCE2024012',
        name: 'Rohan Mehta',
        email: 'rohan.mehta@ghrce.ac.in',
        dept: 'Engineering',
        branch: 'Information Technology',
        semester: '6th Semester',
        cgpa: 7.9,
        readiness: 74,
        rank: 42,
        targetCompany: 'TCS / Wipro',
        resumeVerified: 'Pending',
        resumeText: 'Rohan Mehta. B.Tech IT. Web Dev, HTML, CSS, JavaScript, React.',
        coursesCompleted: 6,
        todayHours: 1.8,
        mockTestsCompleted: 8,
        weakSkills: ['Quantitative Aptitude'],
        appliedJobs: [{ jobId: 'job_002', status: 'Shortlisted', date: '2026-07-21' }]
      },
      {
        id: 'GHRCE24M002',
        name: 'Aditya Sen',
        email: 'aditya.sen@ghrce.ac.in',
        dept: 'Management',
        branch: 'MBA Finance',
        semester: '3rd Semester',
        cgpa: 8.2,
        readiness: 65,
        rank: 28,
        targetCompany: 'Deloitte',
        resumeVerified: 'Verified',
        resumeText: 'Aditya Sen. MBA Finance. Financial modeling, Excel, Valuation.',
        coursesCompleted: 7,
        todayHours: 2.0,
        mockTestsCompleted: 6,
        weakSkills: ['Python Basics'],
        appliedJobs: []
      }
    ];
  }
}

// ─── SIDEBAR SECTION ACCORDION ───
const IND_PAGE_SECTION_MAP = {
  'dashboard':            'recruitment',
  'talent-search':        'recruitment',
  'placement-drives':     'recruitment',
  'candidate-pipeline':   'recruitment',
  'interviews':           'recruitment',
  'startup-collaboration':'ecosystem',
  'mentorship':           'ecosystem',
  'analytics':            'ecosystem',
  'company-profile':      'account'
};

const IND_ALL_SECTION_IDS = ['recruitment', 'ecosystem', 'account'];

function expandSidebar() {
  const sidebar = document.getElementById('appSidebar');
  if (sidebar) sidebar.classList.remove('collapsed');
}

function collapseSidebar() {
  const sidebar = document.getElementById('appSidebar');
  if (sidebar) sidebar.classList.add('collapsed');
}

function toggleSectionBox(sectionId) {
  const box = document.getElementById(`sectionBox-${sectionId}`);
  if (!box) return;
  const sidebar = document.getElementById('appSidebar');
  if (sidebar && sidebar.classList.contains('collapsed')) return;
  box.classList.toggle('collapsed');
}

function openSectionForPage(page) {
  const targetSection = IND_PAGE_SECTION_MAP[page];
  if (!targetSection) return;
  IND_ALL_SECTION_IDS.forEach(id => {
    const box = document.getElementById(`sectionBox-${id}`);
    if (!box) return;
    if (id === targetSection) {
      box.classList.remove('collapsed');
    } else {
      box.classList.add('collapsed');
    }
  });
}

// ─── ROUTING & PAGE NAVIGATION ───
function navigateTo(pageId) {
  // Auto-expand the section containing this page
  openSectionForPage(pageId);
  state.currentPage = pageId;

  // Update Nav Active State
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    if (item.getAttribute('data-page') === pageId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Switch Page View
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.remove('active');
  });

  const targetView = document.getElementById(`page-${pageId}`);
  if (targetView) {
    targetView.classList.add('active');
  }

  renderCurrentPage();
}

function renderCurrentPage() {
  switch (state.currentPage) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'talent-search':
      renderTalentSearch();
      break;
    case 'placement-drives':
      renderPlacementDrives();
      break;
    case 'candidate-pipeline':
      renderCandidatePipeline();
      break;
    case 'interviews':
      renderInterviews();
      break;
    case 'startup-collaboration':
      renderStartupCollaboration();
      break;
    case 'mentorship':
      renderMentorship();
      break;
    case 'analytics':
      renderAnalytics();
      break;
    case 'company-profile':
      renderCompanyProfile();
      break;
  }
}

// ─── PAGE 1: DASHBOARD RENDERER ───
function renderDashboard() {
  // Update Executive KPIs
  const totalApps = state.students.reduce((acc, s) => acc + (s.appliedJobs ? s.appliedJobs.length : 0), 0) + 1480;
  const shortlisted = state.students.filter(s => s.appliedJobs && s.appliedJobs.some(a => a.status === 'Shortlisted' || a.status === 'Technical Round')).length + 340;
  
  document.getElementById('kpiTotalApps').textContent = totalApps.toLocaleString();
  document.getElementById('kpiActiveDrives').textContent = state.drives ? state.drives.length + 5 : 8;
  document.getElementById('kpiShortlisted').textContent = shortlisted;
  document.getElementById('kpiInterviews').textContent = state.interviews.length + 87;

  // Recent Applications Table
  const tbody = document.getElementById('recentAppsTbody');
  if (tbody) {
    tbody.innerHTML = state.students.map(s => {
      const matchScore = calculateCompanyMatch(s);
      const app = (s.appliedJobs && s.appliedJobs[0]) ? s.appliedJobs[0] : { status: 'Applied' };
      return `
        <tr>
          <td>
            <div class="cand-flex">
              <div class="cand-avatar">${getInitials(s.name)}</div>
              <div>
                <div class="cand-name">${escapeHtml(s.name)}</div>
                <div class="cand-sub">${escapeHtml(s.id)}</div>
              </div>
            </div>
          </td>
          <td>
            <div style="font-weight:600;">${escapeHtml(s.dept || 'Engineering')}</div>
            <div class="cand-sub">${escapeHtml(s.branch || 'CSE')}</div>
          </td>
          <td><strong>${s.cgpa || 8.0}</strong></td>
          <td>
            <span class="badge badge-purple">${s.readiness || 75}% Readiness</span>
          </td>
          <td>
            <span class="badge ${getStatusBadgeClass(app.status)}">${app.status}</span>
          </td>
          <td>
            <button class="btn-secondary btn-sm" onclick="openStudentProfile('${s.id}')">View Profile</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Upcoming Interviews List
  const intList = document.getElementById('upcomingInterviewsList');
  if (intList) {
    intList.innerHTML = state.interviews.map(i => `
      <div style="padding:12px;background:var(--surface-2);border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-weight:700;color:var(--text);">${escapeHtml(i.candidateName)}</div>
          <div style="font-size:12px;color:var(--text-2);">${i.type} • ${i.mode}</div>
          <div style="font-size:11px;color:var(--primary);font-weight:600;margin-top:2px;">📅 ${formatDate(i.dateTime)}</div>
        </div>
        <button class="btn-outline btn-sm" onclick="openInterviewFeedback('${i.id}')">Feedback</button>
      </div>
    `).join('');
  }

  // Active Drive Timeline
  const driveList = document.getElementById('driveTimelineList');
  if (driveList) {
    driveList.innerHTML = (state.drives || []).map(d => `
      <div style="padding:12px;background:var(--surface-2);border-radius:var(--radius-sm);border-left:4px solid var(--primary);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div style="font-weight:700;color:var(--text);">${escapeHtml(d.role || d.company)}</div>
          <span class="badge badge-green">${d.status || 'Active'}</span>
        </div>
        <div style="font-size:12px;color:var(--text-2);margin-top:4px;">Date: ${d.date || '2026-07-28'} • Department: ${d.dept || 'Engineering'}</div>
      </div>
    `).join('');
  }

  // Recommended Candidates Grid
  const recList = document.getElementById('recommendedCandidatesList');
  if (recList) {
    const sorted = [...state.students].sort((a, b) => (b.readiness || 0) - (a.readiness || 0));
    recList.innerHTML = sorted.slice(0, 3).map(s => `
      <div style="padding:12px;background:var(--surface-2);border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:space-between;">
        <div class="cand-flex">
          <div class="cand-avatar">${getInitials(s.name)}</div>
          <div>
            <div style="font-weight:700;color:var(--text);">${escapeHtml(s.name)}</div>
            <div style="font-size:11px;color:var(--text-2);">${s.branch} • CGPA ${s.cgpa}</div>
          </div>
        </div>
        <div style="text-align:right;">
          <span class="badge badge-green" style="font-weight:700;">${calculateCompanyMatch(s)}% Match</span>
          <div style="margin-top:4px;">
            <button class="btn-primary btn-sm" onclick="openStudentProfile('${s.id}')">View</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Company Activity List
  const actList = document.getElementById('companyActivityList');
  if (actList) {
    actList.innerHTML = `
      <div style="font-size:12px;padding:8px 0;border-bottom:1px solid var(--border-light);">
        <strong style="color:var(--primary);">Priya Sharma</strong> was moved to <em>Technical Round</em> for Software Engineer Intern.
      </div>
      <div style="font-size:12px;padding:8px 0;border-bottom:1px solid var(--border-light);">
        Published new drive <strong>Software Engineer Intern (₹15 LPA)</strong> to GH Raisoni Campus.
      </div>
      <div style="font-size:12px;padding:8px 0;">
        Commented on student startup <strong>NeuralVision AI</strong> showcase.
      </div>
    `;
  }
}

// ─── PAGE 2: TALENT SEARCH RENDERER ───
function renderTalentSearch() {
  const grid = document.getElementById('candidateCardsGrid');
  if (!grid) return;

  const filtered = state.students.filter(s => {
    if (state.filters.branch !== 'All' && s.branch !== state.filters.branch) return false;
    if (s.cgpa < state.filters.minCgpa) return false;
    if (s.readiness < state.filters.minReadiness) return false;
    if (state.filters.skills.size > 0) {
      const sSkills = (s.resumeText || '').toUpperCase();
      for (let skill of state.filters.skills) {
        if (!sSkills.includes(skill.toUpperCase())) return false;
      }
    }
    return true;
  });

  document.getElementById('searchResultCount').textContent = `Showing ${filtered.length} Candidate(s)`;

  grid.innerHTML = filtered.map(s => {
    const match = calculateCompanyMatch(s);
    return `
      <div class="candidate-card">
        <span class="match-badge">${match}% Match</span>
        <div class="cand-card-top">
          <div class="cand-avatar" style="width:58px;height:58px;font-size:20px;">${getInitials(s.name)}</div>
          <div class="cand-meta">
            <h4 class="font-heading">${escapeHtml(s.name)}</h4>
            <p>${escapeHtml(s.dept || 'Engineering')} • ${escapeHtml(s.branch)}</p>
            <p style="font-weight:600;color:var(--primary);margin-top:2px;">CGPA: ${s.cgpa} • ${s.semester || '6th Sem'}</p>
          </div>
        </div>

        <div class="cand-scores">
          <div class="score-pill">
            <div class="s-lbl">Readiness</div>
            <div class="s-val">${s.readiness}%</div>
          </div>
          <div class="score-pill">
            <div class="s-lbl">Tech Score</div>
            <div class="s-val">${Math.min(98, s.readiness + 5)}%</div>
          </div>
          <div class="score-pill">
            <div class="s-lbl">Coding</div>
            <div class="s-val">${Math.min(99, s.readiness + 8)}%</div>
          </div>
        </div>

        <div class="skill-tags">
          <span class="skill-tag">Python</span>
          <span class="skill-tag">DSA</span>
          <span class="skill-tag">SQL</span>
          <span class="skill-tag">System Design</span>
        </div>

        <div class="cand-actions">
          <button class="btn-outline btn-sm" onclick="openStudentProfile('${s.id}')">View Profile</button>
          <button class="btn-primary btn-sm" onclick="shortlistCandidate('${s.id}')">Shortlist</button>
        </div>
      </div>
    `;
  }).join('');
}

function calculateCompanyMatch(s) {
  let score = Math.round((s.readiness || 70) * 0.6 + (s.cgpa || 8.0) * 4);
  return Math.min(98, Math.max(65, score));
}

function updateCgpaLabel(val) {
  document.getElementById('cgpaValLabel').textContent = `${val}+`;
  state.filters.minCgpa = parseFloat(val);
}

function updateReadinessLabel(val) {
  document.getElementById('readinessValLabel').textContent = `${val}%+`;
  state.filters.minReadiness = parseInt(val);
}

function toggleSkillFilter(el, skill) {
  el.classList.toggle('active');
  if (state.filters.skills.has(skill)) {
    state.filters.skills.delete(skill);
  } else {
    state.filters.skills.add(skill);
  }
  applyTalentFilters();
}

function applyTalentFilters() {
  state.filters.branch = document.getElementById('filterBranch').value;
  renderTalentSearch();
}

function resetSearchFilters() {
  state.filters.branch = 'All';
  state.filters.minCgpa = 6.0;
  state.filters.minReadiness = 50;
  state.filters.skills.clear();

  document.getElementById('filterBranch').value = 'All';
  document.getElementById('filterCgpa').value = 6.0;
  document.getElementById('filterReadiness').value = 50;
  document.getElementById('cgpaValLabel').textContent = '6.0+';
  document.getElementById('readinessValLabel').textContent = '50%+';

  document.querySelectorAll('#skillFilterCloud .tag-chip').forEach(c => c.classList.remove('active'));
  renderTalentSearch();
}

// ─── PAGE 3: PLACEMENT DRIVES RENDERER ───
function renderPlacementDrives() {
  const grid = document.getElementById('drivesGrid');
  if (!grid) return;

  const drives = state.jobs && state.jobs.length > 0 ? state.jobs : [
    {
      id: 'job_001',
      company: 'Microsoft',
      role: 'Software Engineer Intern',
      ctc: '₹15 LPA',
      location: 'Bangalore / Remote',
      eligibility: { cgpa: 7.5, branches: ['Computer Science', 'IT'] },
      desc: 'Hiring Software Engineer Interns for Cloud & AI team.'
    },
    {
      id: 'job_002',
      company: 'Microsoft',
      role: 'Data Analyst & BI Specialist',
      ctc: '₹12 LPA',
      location: 'Hyderabad',
      eligibility: { cgpa: 7.0, branches: ['CS', 'IT', 'ECE', 'MBA'] },
      desc: 'Looking for data driven individuals with strong SQL, PowerBI, and Python skills.'
    }
  ];

  grid.innerHTML = drives.map(d => `
    <div class="card" style="margin-bottom:0;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
        <div>
          <span class="badge badge-purple">${escapeHtml(d.company || 'Microsoft')}</span>
          <h3 class="font-heading" style="font-size:20px;margin-top:6px;">${escapeHtml(d.role)}</h3>
        </div>
        <span class="badge badge-green" style="font-size:13px;font-weight:700;">${escapeHtml(d.ctc)}</span>
      </div>

      <p style="font-size:13px;color:var(--text-2);margin-bottom:14px;">${escapeHtml(d.desc)}</p>

      <div style="background:var(--surface-2);padding:10px;border-radius:var(--radius-sm);margin-bottom:16px;font-size:12px;">
        <div>📍 <strong>Location:</strong> ${escapeHtml(d.location)}</div>
        <div style="margin-top:4px;">🎓 <strong>Eligibility:</strong> CGPA ${d.eligibility ? d.eligibility.cgpa : 7.0}+ • ${d.eligibility && d.eligibility.branches ? d.eligibility.branches.join(', ') : 'CS / IT'}</div>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:12px;color:var(--text-3);font-weight:600;">Active Applicants: ${(d.applicants ? d.applicants.length : 0) + 24}</span>
        <button class="btn-primary btn-sm" onclick="filterPipelineByJob('${d.id}');navigateTo('candidate-pipeline');">Manage Applicants</button>
      </div>
    </div>
  `).join('');
}

function switchDriveTab(tab, el) {
  state.activeDriveTab = tab;
  document.querySelectorAll('#page-placement-drives .profile-tab-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  renderPlacementDrives();
}

// ─── PAGE 4: CANDIDATE PIPELINE (KANBAN BOARD) ───
const KANBAN_STAGES = [
  'Applied',
  'Eligible',
  'Shortlisted',
  'Technical Round',
  'HR Round',
  'Selected',
  'Offer Released',
  'Joined'
];

function renderCandidatePipeline() {
  const board = document.getElementById('kanbanBoard');
  if (!board) return;

  board.innerHTML = KANBAN_STAGES.map(stage => {
    // Filter candidates in this stage
    const candidates = state.students.filter(s => {
      const app = s.appliedJobs && s.appliedJobs[0];
      const sStage = app ? app.status : 'Applied';
      return sStage === stage;
    });

    return `
      <div class="kanban-column" ondragover="handleDragOver(event)" ondrop="handleDrop(event, '${stage}')">
        <div class="column-header">
          <h4 class="font-heading">
            ${stage}
          </h4>
          <span class="column-count">${candidates.length}</span>
        </div>
        <div class="column-body">
          ${candidates.map(s => `
            <div class="kanban-card" draggable="true" ondragstart="handleDragStart(event, '${s.id}')">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                <div class="cand-flex">
                  <div class="cand-avatar" style="width:32px;height:32px;font-size:12px;">${getInitials(s.name)}</div>
                  <div>
                    <div style="font-size:13px;font-weight:700;color:var(--text);">${escapeHtml(s.name)}</div>
                    <div style="font-size:11px;color:var(--text-2);">${s.branch}</div>
                  </div>
                </div>
              </div>

              <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;">
                <span class="badge badge-purple" style="font-size:10px;">CGPA ${s.cgpa}</span>
                <button class="btn-outline btn-sm" style="padding:2px 8px;font-size:11px;" onclick="openStudentProfile('${s.id}')">View</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

let draggedCandidateId = null;
function handleDragStart(e, studentId) {
  draggedCandidateId = studentId;
  e.dataTransfer.setData('text/plain', studentId);
}

function handleDragOver(e) {
  e.preventDefault();
}

async function handleDrop(e, newStage) {
  e.preventDefault();
  if (!draggedCandidateId) return;

  // Update in local state
  const student = state.students.find(s => s.id === draggedCandidateId);
  if (student) {
    if (!student.appliedJobs) student.appliedJobs = [];
    if (student.appliedJobs.length === 0) {
      student.appliedJobs.push({ jobId: 'job_001', status: newStage, date: new Date().toISOString().split('T')[0] });
    } else {
      student.appliedJobs[0].status = newStage;
    }

    if (window.db) {
      await window.db.updateApplicantStatus('job_001', draggedCandidateId, newStage);
    }
    showToast(`Updated ${student.name} stage to: ${newStage}`);
    renderCandidatePipeline();
  }
}

function filterPipelineByJob(jobId) {
  state.pipelineJob = jobId;
  renderCandidatePipeline();
}

// ─── PAGE 5: INTERVIEWS RENDERER ───
function renderInterviews() {
  const tbody = document.getElementById('interviewsTbody');
  if (!tbody) return;

  tbody.innerHTML = state.interviews.map(i => `
    <tr>
      <td>
        <div class="cand-name">${escapeHtml(i.candidateName)}</div>
        <div class="cand-sub">${escapeHtml(i.candidateId)}</div>
      </td>
      <td><strong>${escapeHtml(i.role)}</strong></td>
      <td>
        <span class="badge badge-purple">${escapeHtml(i.type)}</span>
        <div class="cand-sub" style="margin-top:2px;">${escapeHtml(i.mode)}</div>
      </td>
      <td>${formatDate(i.dateTime)}</td>
      <td>${escapeHtml(i.panel)}</td>
      <td>
        <span class="badge badge-green">★ ${i.rating || '4.5'}</span>
        <div class="cand-sub" style="margin-top:2px;">${escapeHtml(i.notes || 'Good candidate')}</div>
      </td>
      <td>
        <button class="btn-secondary btn-sm" onclick="openInterviewFeedback('${i.id}')">Evaluate</button>
      </td>
    </tr>
  `).join('');

  // Populate candidate dropdown in schedule interview modal
  const candSelect = document.getElementById('schedCandidate');
  if (candSelect) {
    candSelect.innerHTML = state.students.map(s => `<option value="${s.id}">${s.name} (${s.branch})</option>`).join('');
  }
}

// ─── PAGE 6: STARTUP COLLABORATION ───
function renderStartupCollaboration() {
  const grid = document.getElementById('startupGrid');
  if (!grid) return;

  grid.innerHTML = state.startups.map(stp => `
    <div class="startup-card">
      <div class="startup-banner" style="background:${stp.banner};">
        <div class="startup-logo">${stp.logo}</div>
      </div>
      <div class="startup-body">
        <span class="badge badge-purple">${stp.category}</span>
        <h3 class="font-heading" style="font-size:20px;margin:8px 0 4px;">${escapeHtml(stp.name)}</h3>
        <p style="font-size:12px;color:var(--text-2);font-weight:600;margin-bottom:10px;">Founder: ${escapeHtml(stp.founder)}</p>
        <p style="font-size:13px;color:var(--text);margin-bottom:14px;">${escapeHtml(stp.desc)}</p>

        <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:14px;">
          ${stp.techStack.map(t => `<span class="skill-tag">${t}</span>`).join('')}
        </div>

        <div style="font-size:12px;color:var(--primary);font-weight:700;margin-bottom:14px;">
          Funding: ${stp.funding}
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <button class="btn-outline btn-sm" onclick="viewStartupDetails('${stp.id}')">View Pitch</button>
          <button class="btn-primary btn-sm" onclick="connectWithStartup('${stp.id}')">Connect / Mentor</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ─── PAGE 7: MENTORSHIP RENDERER ───
function renderMentorship() {
  const grid = document.getElementById('mentorGrid');
  if (!grid) return;

  grid.innerHTML = state.mentors.map(m => `
    <div class="card">
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;">
        <div class="cand-avatar" style="width:52px;height:52px;font-size:18px;">${m.avatar}</div>
        <div>
          <h3 class="font-heading" style="font-size:18px;">${escapeHtml(m.name)}</h3>
          <p style="font-size:12px;color:var(--text-2);">${escapeHtml(m.role)} • <strong>${escapeHtml(m.company)}</strong></p>
        </div>
      </div>

      <div style="font-size:12px;color:var(--text);margin-bottom:12px;">
        <strong>Experience:</strong> ${m.experience} | <strong>Schedule:</strong> ${m.availability}
      </div>

      <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:16px;">
        ${m.expertise.map(e => `<span class="skill-tag">${e}</span>`).join('')}
      </div>

      <button class="btn-secondary btn-sm" style="width:100%;justify-content:center;" onclick="assignMentorToStartup('${m.id}')">Assign to Student Startup</button>
    </div>
  `).join('');
}

// ─── PAGE 8: ANALYTICS DASHBOARD ───
function renderAnalytics() {
  setTimeout(() => {
    // 1. Hiring Funnel Chart
    const ctxFunnel = document.getElementById('chartHiringFunnel');
    if (ctxFunnel) {
      if (state.charts.funnel) state.charts.funnel.destroy();
      state.charts.funnel = new Chart(ctxFunnel, {
        type: 'bar',
        data: {
          labels: KANBAN_STAGES,
          datasets: [{
            label: 'Candidates in Funnel',
            data: [1480, 920, 342, 140, 89, 52, 45, 38],
            backgroundColor: '#5B2D90'
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }

    // 2. Branch Comparison Chart
    const ctxBranch = document.getElementById('chartBranchComp');
    if (ctxBranch) {
      if (state.charts.branch) state.charts.branch.destroy();
      state.charts.branch = new Chart(ctxBranch, {
        type: 'bar',
        data: {
          labels: ['Computer Science', 'IT', 'Electronics', 'Mechanical', 'MBA'],
          datasets: [{
            label: 'Avg Readiness Score %',
            data: [88, 82, 79, 72, 80],
            backgroundColor: '#8B5FBF'
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }

    // 3. Skill Distribution
    const ctxSkill = document.getElementById('chartSkillDist');
    if (ctxSkill) {
      if (state.charts.skill) state.charts.skill.destroy();
      state.charts.skill = new Chart(ctxSkill, {
        type: 'doughnut',
        data: {
          labels: ['Python & AI', 'Java & DSA', 'Web Tech (React)', 'SQL & Databases', 'System Design'],
          datasets: [{
            data: [42, 28, 15, 10, 5],
            backgroundColor: ['#5B2D90', '#8B5FBF', '#10B981', '#F59E0B', '#3B82F6']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }

    // 4. Offer Trends
    const ctxTrends = document.getElementById('chartOfferTrends');
    if (ctxTrends) {
      if (state.charts.trends) state.charts.trends.destroy();
      state.charts.trends = new Chart(ctxTrends, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [{
            label: 'Campus Offers Released',
            data: [12, 18, 25, 30, 38, 42, 45],
            borderColor: '#5B2D90',
            tension: 0.3,
            fill: false
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
  }, 100);
}

// ─── PAGE 9: COMPANY PROFILE ───
function renderCompanyProfile() {
  document.getElementById('profCompName').value = state.company.name;
  document.getElementById('profCompIndustry').value = state.company.industry;
  document.getElementById('profCompWebsite').value = state.company.website;
  document.getElementById('profCompLocation').value = state.company.location;
  document.getElementById('profCompAbout').value = state.company.about;
}

function saveCompanyProfile() {
  state.company.name = document.getElementById('profCompName').value;
  state.company.industry = document.getElementById('profCompIndustry').value;
  state.company.website = document.getElementById('profCompWebsite').value;
  state.company.location = document.getElementById('profCompLocation').value;
  state.company.about = document.getElementById('profCompAbout').value;

  showToast('Company profile updated successfully!');
}

// ─── STUDENT PROFILE MODAL ───
function openStudentProfile(studentId) {
  state.selectedStudentId = studentId;
  const s = state.students.find(x => x.id === studentId);
  if (!s) return;

  document.getElementById('modalProfAvatar').textContent = getInitials(s.name);
  document.getElementById('modalProfName').textContent = s.name;
  document.getElementById('modalProfCollege').textContent = `${s.dept || 'Engineering'} • ${s.branch} • CGPA ${s.cgpa}`;

  switchProfTab('overview');
  document.getElementById('studentProfileModal').classList.add('active');
}

function closeStudentProfileModal() {
  document.getElementById('studentProfileModal').classList.remove('active');
}

function switchProfTab(tab, el) {
  state.activeProfTab = tab;
  if (el) {
    document.querySelectorAll('.profile-nav-tabs .profile-tab-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
  }

  const s = state.students.find(x => x.id === state.selectedStudentId);
  if (!s) return;

  const container = document.getElementById('profTabContent');
  if (!container) return;

  if (tab === 'overview') {
    container.innerHTML = `
      <div style="display:grid;grid-template-columns:2fr 1fr;gap:20px;">
        <div>
          <h4 class="font-heading" style="color:var(--primary);margin-bottom:8px;">AI Candidate Executive Summary</h4>
          <p style="font-size:13px;line-height:1.6;color:var(--text);">${escapeHtml(s.resumeText || 'High-performing student with strong algorithmic foundation.')}</p>

          <h4 class="font-heading" style="color:var(--primary);margin-top:20px;margin-bottom:8px;">Company Compatibility Breakdown</h4>
          <div style="background:var(--surface-2);padding:14px;border-radius:var(--radius-sm);">
            <div style="display:flex;justify-size:space-between;margin-bottom:6px;">
              <span style="font-size:13px;font-weight:600;">Overall Match: ${calculateCompanyMatch(s)}%</span>
            </div>
            <ul style="font-size:12px;color:var(--text-2);padding-left:18px;list-style-type:disc;">
              <li>Strong Python and Data Structures proficiency.</li>
              <li>Consistently high performance in college AI & Coding assessments.</li>
              <li>Completed mandatory Skill Gap roadmap.</li>
            </ul>
          </div>
        </div>

        <div style="background:var(--primary-lighter);padding:16px;border-radius:var(--radius);height:fit-content;">
          <h4 class="font-heading" style="color:var(--primary);margin-bottom:12px;">Candidate Highlights</h4>
          <div style="font-size:12px;margin-bottom:8px;">🎯 <strong>Target Role:</strong> ${escapeHtml(s.targetCompany || 'Software Engineer')}</div>
          <div style="font-size:12px;margin-bottom:8px;">🏆 <strong>Rank:</strong> #${s.rank || 14} in Dept</div>
          <div style="font-size:12px;margin-bottom:8px;">📚 <strong>Courses Completed:</strong> ${s.coursesCompleted || 10}</div>
          <div style="font-size:12px;">⚠️ <strong>Focus Area:</strong> ${(s.weakSkills || ['Networking']).join(', ')}</div>
        </div>
      </div>
    `;
  } else if (tab === 'scores') {
    container.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:12px;margin-bottom:20px;">
        <div class="score-pill" style="background:var(--surface-2);padding:14px;border-radius:var(--radius-sm);">
          <div class="s-lbl">Readiness</div>
          <div class="s-val" style="font-size:22px;">${s.readiness}%</div>
        </div>
        <div class="score-pill" style="background:var(--surface-2);padding:14px;border-radius:var(--radius-sm);">
          <div class="s-lbl">Technical</div>
          <div class="s-val" style="font-size:22px;">${Math.min(98, s.readiness + 5)}%</div>
        </div>
        <div class="score-pill" style="background:var(--surface-2);padding:14px;border-radius:var(--radius-sm);">
          <div class="s-lbl">Communication</div>
          <div class="s-val" style="font-size:22px;">86%</div>
        </div>
        <div class="score-pill" style="background:var(--surface-2);padding:14px;border-radius:var(--radius-sm);">
          <div class="s-lbl">Coding Assessment</div>
          <div class="s-val" style="font-size:22px;">94%</div>
        </div>
      </div>
    `;
  } else if (tab === 'resume') {
    container.innerHTML = `
      <div style="background:var(--surface-2);padding:18px;border-radius:var(--radius-sm);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <h4 class="font-heading">Parsed Resume Text</h4>
          <span class="badge badge-green">ATS Score: 92%</span>
        </div>
        <pre style="font-family:inherit;font-size:13px;white-space:pre-wrap;color:var(--text);">${escapeHtml(s.resumeText || 'Resume content available.')}</pre>
      </div>
    `;
  } else if (tab === 'projects') {
    container.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div style="padding:14px;background:var(--surface-2);border-radius:var(--radius-sm);">
          <h4 class="font-heading" style="font-size:16px;color:var(--primary);">AI Defect Detection System</h4>
          <p style="font-size:12px;color:var(--text-2);margin-top:4px;">Built computer vision model with 98.4% precision for manufacturing inspection.</p>
        </div>
      </div>
    `;
  }
}

function downloadStudentResume() {
  showToast('Downloading verified student resume PDF...');
}

async function actionStudent(action) {
  const s = state.students.find(x => x.id === state.selectedStudentId);
  if (!s) return;

  if (action === 'shortlist') {
    await handleShortlistCandidate(s.id);
  } else if (action === 'invite') {
    closeStudentProfileModal();
    openScheduleInterviewModal();
  } else if (action === 'reject') {
    showToast(`Rejected candidate: ${s.name}`);
    closeStudentProfileModal();
  }
}

async function shortlistCandidate(studentId) {
  await handleShortlistCandidate(studentId);
}

async function handleShortlistCandidate(studentId) {
  const s = state.students.find(x => x.id === studentId);
  if (s) {
    if (!s.appliedJobs) s.appliedJobs = [];
    s.appliedJobs.unshift({ jobId: 'job_001', status: 'Shortlisted', date: new Date().toISOString().split('T')[0] });
    if (window.db) {
      await window.db.updateApplicantStatus('job_001', studentId, 'Shortlisted');
    }
    showToast(`Shortlisted ${s.name}! Synced with Student Portal.`);
    renderCurrentPage();
  }
}

// ─── MODAL CONTROLLERS ───
function openPublishDriveModal() {
  document.getElementById('publishDriveModal').classList.add('active');
}
function closePublishDriveModal() {
  document.getElementById('publishDriveModal').classList.remove('active');
}

async function handlePublishDrive(e) {
  e.preventDefault();
  const role = document.getElementById('driveRole').value;
  const ctc = document.getElementById('driveCtc').value;
  const location = document.getElementById('driveLocation').value;
  const cgpa = parseFloat(document.getElementById('driveCgpa').value);
  const skills = document.getElementById('driveSkills').value.split(',').map(s => s.trim());
  const desc = document.getElementById('driveDesc').value;

  const newJob = {
    company: state.company.name,
    role,
    ctc,
    location,
    desc,
    eligibility: { cgpa, branches: ['Computer Science', 'IT', 'ECE'] }
  };

  if (window.db) {
    await window.db.postJob(newJob);
    await window.db.scheduleDrive({ company: state.company.name, date: '2026-08-01', role });
  }

  state.jobs.push(newJob);
  closePublishDriveModal();
  showToast(`Published placement drive for "${role}" (${ctc})! Notifications dispatched to eligible students.`);
  renderCurrentPage();
}

function openScheduleInterviewModal() {
  renderInterviews();
  document.getElementById('scheduleInterviewModal').classList.add('active');
}
function closeScheduleInterviewModal() {
  document.getElementById('scheduleInterviewModal').classList.remove('active');
}

function handleScheduleInterview(e) {
  e.preventDefault();
  const candId = document.getElementById('schedCandidate').value;
  const s = state.students.find(x => x.id === candId);
  const type = document.getElementById('schedType').value;
  const mode = document.getElementById('schedMode').value;
  const dateTime = document.getElementById('schedDateTime').value;
  const panel = document.getElementById('schedPanel').value || 'Technical Panel';

  state.interviews.unshift({
    id: 'int_' + Date.now(),
    candidateId: candId,
    candidateName: s ? s.name : 'Candidate',
    role: 'Software Engineer Intern',
    type,
    mode,
    dateTime,
    panel,
    status: 'Scheduled',
    rating: 4.5,
    notes: 'Scheduled'
  });

  closeScheduleInterviewModal();
  showToast(`Interview scheduled for ${s ? s.name : 'Candidate'}. Notification sent!`);
  renderCurrentPage();
}

function openCompanyRegisterModal() {
  document.getElementById('companyRegisterModal').classList.add('active');
}
function closeCompanyRegisterModal() {
  document.getElementById('companyRegisterModal').classList.remove('active');
}

function handleCompanyRegister(e) {
  e.preventDefault();
  closeCompanyRegisterModal();
  showToast('Company registration submitted! Pending T&P Cell approval.');
}

// ─── FLOATING AI ASSISTANT ───
function toggleAIAssistant() {
  document.getElementById('aiAssistantDrawer').classList.toggle('active');
}

function sendAiPreset(query) {
  document.getElementById('aiInput').value = query;
  sendAiQuery();
}

function sendAiQuery() {
  const input = document.getElementById('aiInput');
  const query = input.value.trim();
  if (!query) return;

  const msgContainer = document.getElementById('aiDrawerMessages');

  // User msg
  const uMsg = document.createElement('div');
  uMsg.className = 'ai-msg user';
  uMsg.textContent = query;
  msgContainer.appendChild(uMsg);

  input.value = '';

  // Bot response simulation
  setTimeout(() => {
    const bMsg = document.createElement('div');
    bMsg.className = 'ai-msg bot';

    if (query.toLowerCase().includes('top ai') || query.toLowerCase().includes('python')) {
      const candidates = state.students.slice(0, 2);
      bMsg.innerHTML = `
        Here are the top candidates matching <strong>Python & AI</strong>:
        <br/><br/>
        ${candidates.map(c => `• <strong>${c.name}</strong> (${c.branch}, CGPA ${c.cgpa}) - ${c.readiness}% Readiness`).join('<br/>')}
      `;
    } else {
      bMsg.innerHTML = `I analyzed campus assessment records. <strong>${state.students.length} candidates</strong> match your criteria with average candidate readiness score of <strong>78.4%</strong>.`;
    }

    msgContainer.appendChild(bMsg);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }, 400);
}

// ─── UTILITIES & EVENT LISTENERS ───
function setupEventListeners() {
  // Mobile search or hotkeys if needed
}

function handleLogin(e) {
  e.preventDefault();
  document.getElementById('screen-login').classList.remove('active');
  document.getElementById('screen-app').classList.add('active');
  navigateTo('dashboard');
  showToast('Welcome to Elevate Industry Recruiter Workspace!');
}

function toggleSidebar() {
  const sidebar = document.getElementById('appSidebar');
  if (sidebar) {
    sidebar.classList.toggle('collapsed');
  }
}

function handleLogout() {
  sessionStorage.removeItem('elevate_token');
  sessionStorage.removeItem('elevate_user');
  sessionStorage.removeItem('elevate_role');
  showToast('Logged out of Recruiter Workspace. Redirecting to sign in...');
  setTimeout(() => {
    window.location.href = '/login.html';
  }, 600);
}

function getInitials(name) {
  if (!name) return 'ST';
  const parts = name.split(' ');
  return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatDate(dtStr) {
  if (!dtStr) return '2026-07-28';
  try {
    const d = new Date(dtStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return dtStr;
  }
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'Shortlisted':
    case 'Selected':
    case 'Offered':
      return 'badge-green';
    case 'Technical Round':
    case 'HR Round':
      return 'badge-purple';
    case 'Applied':
    case 'Eligible':
      return 'badge-blue';
    default:
      return 'badge-grey';
  }
}

function showToast(msg) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

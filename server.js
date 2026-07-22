// Load environment variables
require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');
const fs         = require('fs');
const path       = require('path');

const authRoutes = require('./backend/auth/auth-routes');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname, { index: false })); // never auto-serve any index.html


// ─── Auth Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ─── Login Page ───────────────────────────────────────────────────────────────
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// ─── Portal Pages ──────────────────────────────────────────────────────────────
app.get('/student/', (req, res) => {
  res.sendFile(path.join(__dirname, 'student', 'index.html'));
});
app.get('/student', (req, res) => {
  res.redirect('/student/');
});

app.get('/institute/', (req, res) => {
  res.sendFile(path.join(__dirname, 'institute', 'index.html'));
});
app.get('/institute', (req, res) => {
  res.redirect('/institute/');
});

app.get('/industry/', (req, res) => {
  res.sendFile(path.join(__dirname, 'industry', 'index.html'));
});
app.get('/industry', (req, res) => {
  res.redirect('/industry/');
});

// Redirect root to login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Default Mock Data for the startup database
const DEFAULT_DB = {
  students: [
    {
      id: 'GHRCE2024047',
      name: 'Saurabhi Sharma',
      email: 'saurabhi.sharma@ghrce.ac.in',
      dept: 'Engineering',
      branch: 'TY COE',
      semester: '5th Semester',
      passingYear: 2028,
      cgpa: 7.0,
      readiness: 0,
      rank: '--',
      targetCompany: '--',
      resumeVerified: 'Pending',
      resumeText: '',
      coursesCompleted: 0,
      todayHours: 0,
      mockTestsCompleted: 0,
      weakSkills: [],
      appliedJobs: [],
      interviewHistory: []
    },
    {
      id: 'GHRCE2024012',
      name: 'Rohan Mehta',
      email: 'rohan.mehta@ghrce.ac.in',
      dept: 'Engineering',
      branch: 'Information Technology',
      semester: '6th Semester',
      cgpa: 7.9,
      readiness: 65,
      rank: 112,
      targetCompany: 'Wipro',
      resumeVerified: 'Pending',
      resumeText: 'Rohan Mehta. B.Tech IT. Core skills: C++, Web Development, HTML, CSS. Projects: Portfolio page.',
      coursesCompleted: 5,
      todayHours: 1.5,
      mockTestsCompleted: 9,
      weakSkills: ['Quantitative Aptitude', 'DBMS'],
      appliedJobs: [],
      interviewHistory: []
    },
    {
      id: 'GHRCE2024089',
      name: 'Sneha Patil',
      email: 'sneha.patil@ghrce.ac.in',
      dept: 'Engineering',
      branch: 'Electronics',
      semester: '6th Semester',
      cgpa: 9.1,
      readiness: 85,
      rank: 12,
      targetCompany: 'Amazon / Microsoft',
      resumeVerified: 'Verified',
      resumeText: 'Sneha Patil. B.Tech Electronics. Strong programming in Python, C, and Embedded Systems. 3 stars on LeetCode.',
      coursesCompleted: 12,
      todayHours: 3.2,
      mockTestsCompleted: 18,
      weakSkills: ['System Design'],
      appliedJobs: [],
      interviewHistory: [
        {
          company: 'Amazon',
          type: 'Technical',
          date: '2026-07-12',
          score: 92,
          reportId: 'rep_002',
          feedback: 'Excellent DSA and logical reasoning capabilities. Fast problem-solving.'
        }
      ]
    },
    {
      id: 'GHRCE24M002',
      name: 'Aditya Sen',
      email: 'aditya.sen@ghrce.ac.in',
      dept: 'Management',
      branch: 'MBA Finance',
      semester: '3rd Semester',
      cgpa: 8.2,
      readiness: 58,
      rank: 35,
      targetCompany: 'Deloitte',
      resumeVerified: 'Pending',
      resumeText: 'Aditya Sen. MBA Finance. Core skills: Financial modeling, valuation, Excel, Accounting.',
      coursesCompleted: 4,
      todayHours: 1.0,
      mockTestsCompleted: 5,
      weakSkills: ['Technical Aptitude', 'Logical Reasoning'],
      appliedJobs: [],
      interviewHistory: []
    }
  ],
  jobs: [
    {
      id: 'job_001',
      company: 'Microsoft',
      logo: 'MSFT',
      role: 'Software Engineer Intern',
      type: 'Full Time',
      ctc: '₹15 LPA',
      location: 'Bangalore / Remote',
      desc: 'Looking for a passionate Software Engineer Intern with strong DSA, OOPs, and problem-solving skills.',
      eligibility: {
        cgpa: 7.5,
        branches: ['Computer Science', 'Information Technology'],
        backlogs: 0
      },
      applicants: []
    },
    {
      id: 'job_002',
      company: 'TCS',
      logo: 'TCS',
      role: 'System Engineer (NQT Digital)',
      type: 'Full Time',
      ctc: '₹7.0 LPA',
      location: 'PAN India',
      desc: 'Hiring through TCS NQT Digital. Focus on advanced technical aptitude, programming, and system skills.',
      eligibility: {
        cgpa: 6.0,
        branches: ['Any Engineering Branch'],
        backlogs: 0
      },
      applicants: []
    },
    {
      id: 'job_003',
      company: 'Infosys',
      logo: 'INF',
      role: 'Systems Engineer',
      type: 'Full Time',
      ctc: '₹3.6 LPA',
      location: 'PAN India',
      desc: 'Hiring for Systems Engineer role. Logical reasoning, verbal ability, and pseudocode assessment is mandatory.',
      eligibility: {
        cgpa: 6.5,
        branches: ['Any Graduate'],
        backlogs: 1
      },
      applicants: []
    }
  ],
  drives: [
    { id: 'drv_001', company: 'TCS', date: '2026-07-25', status: 'Scheduled', dept: 'Engineering' },
    { id: 'drv_002', company: 'Infosys', date: '2026-07-28', status: 'Scheduled', dept: 'Engineering' },
    { id: 'drv_003', company: 'Microsoft', date: '2026-08-05', status: 'Proposed', dept: 'Engineering' }
  ],
  assessments: [
    { id: 'asm_001', name: 'TCS Comprehensive', questions: 30, duration: 90, createdBy: 'College T&P' },
    { id: 'asm_002', name: 'General Aptitude Drill', questions: 20, duration: 45, createdBy: 'College T&P' }
  ],
  companies: [
    { id: 'comp_001', name: 'Synthetix Cloud', industry: 'Enterprise SaaS • Cloud Tech', contact: 'Sarah Jenkins', status: 'Connected', avatar: 'SC', previousVisits: 2, connectionDate: '2026-06-01' },
    { id: 'comp_002', name: 'Apex Financials', industry: 'Investment Banking • FinTech', contact: 'Michael Chen', status: 'Pending', avatar: 'AF', previousVisits: 0, connectionDate: null },
    { id: 'comp_003', name: 'Velocity Motors', industry: 'Auto-Tech • EV Systems', contact: 'Robert Walton', status: 'Connected', avatar: 'VM', previousVisits: 1, connectionDate: '2026-05-15' },
    { id: 'comp_004', name: 'EcoSystemic Ltd', industry: 'Green Tech • Sustainability', contact: 'Anna Sokolov', status: 'Connected', avatar: 'ES', previousVisits: 3, connectionDate: '2026-03-20' },
    { id: 'comp_005', name: 'Infosys HR', industry: 'IT Services • Consulting', contact: 'Rajesh Gupta', status: 'Requested', avatar: 'IN', previousVisits: 5, connectionDate: '2026-07-10' },
    { id: 'comp_006', name: 'Cognizant Genc', industry: 'IT Services • Digital', contact: 'Priya Nair', status: 'Requested', avatar: 'CG', previousVisits: 4, connectionDate: '2026-07-12' },
    { id: 'comp_007', name: 'Amazon AWS', industry: 'Cloud • E-Commerce', contact: 'David Kim', status: 'Connected', avatar: 'AA', previousVisits: 2, connectionDate: '2026-04-10' },
    { id: 'comp_008', name: 'Deloitte India', industry: 'Consulting • Analytics', contact: 'Meera Shah', status: 'Pending', avatar: 'DI', previousVisits: 1, connectionDate: null }
  ],
  startups: [
    { id: 'st_001', name: 'EcoSync Systems', tagline: 'Smart AI-driven irrigation for institutional vertical gardens.', category: 'Sustainability', problem: 'Traditional irrigation wastes 40% of water in institutional buildings.', solution: 'AI-based sensors with real-time moisture analytics optimize watering schedules.', upvotes: 1200, comments: 48, team: ['JD', 'AS', 'RK'], gradient: 'linear-gradient(135deg, #1a472a 0%, #2d6a4f 50%, #40916c 100%)', trending: true },
    { id: 'st_002', name: 'EduPulse AI', tagline: 'Personalized learning paths using large language models for STEM students.', category: 'EduTech', problem: 'One-size-fits-all curriculum leaves 60% of students behind.', solution: 'LLM-powered adaptive learning that adjusts content difficulty in real time.', upvotes: 856, comments: 32, team: ['MK', 'RL'], gradient: 'linear-gradient(135deg, #0f3460 0%, #16213e 50%, #533483 100%)', trending: false },
    { id: 'st_003', name: 'QuantumFlow', tagline: 'Quantum-inspired optimization for logistics supply chains.', category: 'AI & ML', problem: 'Supply chain inefficiencies cost SMEs ₹2.3 crore annually on average.', solution: 'Quantum annealing algorithms reduce route optimization time by 78%.', upvotes: 8200, comments: 124, team: ['SK', 'PB', 'AM', 'VR'], gradient: 'linear-gradient(135deg, #2c0735 0%, #4a0e5e 50%, #7b2d8b 100%)', trending: false },
    { id: 'st_004', name: 'BioBreeze', tagline: 'Biodegradable air purifiers for low-income urban households.', category: 'Sustainability', problem: 'Air purifiers are expensive and use non-recyclable HEPA filters.', solution: 'Plant-based biochar filters that cost 80% less and last 3x longer.', upvotes: 5400, comments: 89, team: ['NS', 'GK'], gradient: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #52b788 100%)', trending: false },
    { id: 'st_005', name: 'SwiftLift Drones', tagline: 'Last-mile medical supply delivery using autonomous swarm drones.', category: 'AI & ML', problem: 'Rural medical facilities wait 4-6 hours for critical supplies.', solution: 'AI-coordinated drone swarms deliver under 30 minutes within 50km radius.', upvotes: 4900, comments: 67, team: ['AR', 'ST', 'DM'], gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', trending: false },
    { id: 'st_006', name: 'PayEase FinTech', tagline: 'UPI-based micro-lending platform for student entrepreneurs.', category: 'FinTech', problem: 'Student entrepreneurs lack collateral for traditional loans.', solution: 'AI credit scoring using academic records enables collateral-free micro-loans.', upvotes: 2100, comments: 41, team: ['PK', 'SS'], gradient: 'linear-gradient(135deg, #614385 0%, #516395 100%)', trending: false }
  ],
  meetings: [
    { id: 'mtg_001', company: 'Google Online Meet', companyId: 'comp_007', type: 'Tech Talk', date: '2026-07-18', time: '10:30', mode: 'online', link: 'https://meet.google.com/abc-def', description: 'Discussing intern hiring process for final year CSE students.' },
    { id: 'mtg_002', company: 'Deloitte', companyId: 'comp_008', type: 'Campus Visit', date: '2026-07-18', time: '14:00', mode: 'offline', venue: 'Seminar Hall A', description: 'Pre-placement talk for MBA and CSE batch 2026.' },
    { id: 'mtg_003', company: 'Synthetix Cloud', companyId: 'comp_001', type: 'Follow-up', date: '2026-07-25', time: '11:00', mode: 'online', link: 'https://zoom.us/j/123456', description: 'Follow-up on candidate shortlist submission.' },
    { id: 'mtg_004', company: 'Amazon AWS', companyId: 'comp_007', type: 'Recruitment Drive', date: '2026-08-05', time: '09:00', mode: 'offline', venue: 'Main Auditorium', description: 'AWS campus recruitment for SDE and cloud engineer roles.' }
  ],
  tnpOfficers: [
    {
      id: "76a6e1e3-6400-497d-97fe-38e5b9763ef4",
      name: "Saurabhi sharma",
      email: "saurabhi.sharma.cse.ghrcemp@raisoni.net",
      passwordHash: "$2b$10$FtZjz.UOKCmSg5S.t8o7.O2dSHGv7CnoY0JTDJ2GHfpdOZc7Y45QK",
      college: "Raisoni College",
      role: "tnp",
      createdAt: "2026-07-19T08:00:57.552Z"
    }
  ],
  studentAccounts: [
    {
      prn: "GHRCE2024047",
      name: "Saurabhi Sharma",
      email: "saurabhi.sharma@ghrce.ac.in",
      dob: "2006-01-01",
      passingYear: 2028,
      passwordHash: "$2b$10$MFtogeWWWzPDz8jeOvmtjeYmHqkSLYGGCUPEjMsVxpJctghl7rANy",
      role: "student",
      firstLogin: true,
      importedBy: "system",
      createdAt: "2026-07-22T08:00:00.000Z",
      lastLogin: null
    }
  ],
  companyAccounts: []
};

// Helper: Read DB
function readDatabase() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf8');
      return DEFAULT_DB;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return DEFAULT_DB;
  }
}

// Helper: Write DB
function writeDatabase(db) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
}

// REST APIs
app.get('/api/db', (req, res) => {
  res.json(readDatabase());
});

app.post('/api/db/save', (req, res) => {
  const db = req.body;
  if (writeDatabase(db)) {
    res.json({ success: true, message: 'Database saved successfully!' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to write to database file.' });
  }
});

app.post('/api/db/reset', (req, res) => {
  if (writeDatabase(DEFAULT_DB)) {
    res.json({ success: true, message: 'Database reset to default mock data successfully!' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to reset database.' });
  }
});

// Single API routes for easier CRUD from client
app.get('/api/students', (req, res) => {
  const db = readDatabase();
  res.json(db.students);
});

app.put('/api/students/:id', (req, res) => {
  const db = readDatabase();
  const index = db.students.findIndex(s => s.id === req.params.id);
  if (index !== -1) {
    db.students[index] = { ...db.students[index], ...req.body };
    writeDatabase(db);
    res.json({ success: true, student: db.students[index] });
  } else {
    res.status(404).json({ success: false, message: 'Student not found' });
  }
});

app.post('/api/students', (req, res) => {
  const db = readDatabase();
  const student = req.body;
  db.students.push(student);
  writeDatabase(db);
  res.json({ success: true, student });
});

app.get('/api/jobs', (req, res) => {
  const db = readDatabase();
  res.json(db.jobs);
});

app.post('/api/jobs', (req, res) => {
  const db = readDatabase();
  const job = req.body;
  db.jobs.push(job);
  writeDatabase(db);
  res.json({ success: true, job });
});

app.post('/api/jobs/:id/apply', (req, res) => {
  const db = readDatabase();
  const jobId = req.params.id;
  const { studentId } = req.body;
  const jobIndex = db.jobs.findIndex(j => j.id === jobId);
  const studentIndex = db.students.findIndex(s => s.id === studentId);

  if (jobIndex !== -1 && studentIndex !== -1) {
    // Add student to job applicants if not already present
    if (!db.jobs[jobIndex].applicants.includes(studentId)) {
      db.jobs[jobIndex].applicants.push(studentId);
    }
    // Add job to student's appliedJobs if not already present
    const appliedObj = { jobId, status: 'Applied', date: new Date().toISOString().split('T')[0] };
    const alreadyApplied = db.students[studentIndex].appliedJobs.some(a => a.jobId === jobId);
    if (!alreadyApplied) {
      db.students[studentIndex].appliedJobs.push(appliedObj);
    }

    writeDatabase(db);
    res.json({ success: true, student: db.students[studentIndex], job: db.jobs[jobIndex] });
  } else {
    res.status(404).json({ success: false, message: 'Job or Student not found' });
  }
});

app.get('/api/drives', (req, res) => {
  const db = readDatabase();
  res.json(db.drives);
});

app.post('/api/drives', (req, res) => {
  const db = readDatabase();
  const drive = req.body;
  db.drives.push(drive);
  writeDatabase(db);
  res.json({ success: true, drive });
});

// College Portal — Companies API
app.get('/api/companies', (req, res) => {
  const db = readDatabase();
  res.json(db.companies || []);
});

app.post('/api/companies', (req, res) => {
  const db = readDatabase();
  const company = req.body;
  if (!db.companies) db.companies = [];
  db.companies.push(company);
  writeDatabase(db);
  res.json({ success: true, company });
});

app.put('/api/companies/:id', (req, res) => {
  const db = readDatabase();
  const index = (db.companies || []).findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    db.companies[index] = { ...db.companies[index], ...req.body };
    writeDatabase(db);
    res.json({ success: true, company: db.companies[index] });
  } else {
    res.status(404).json({ success: false, message: 'Company not found' });
  }
});

// College Portal — Startups API
app.get('/api/startups', (req, res) => {
  const db = readDatabase();
  res.json(db.startups || []);
});

app.post('/api/startups', (req, res) => {
  const db = readDatabase();
  const startup = req.body;
  if (!db.startups) db.startups = [];
  db.startups.push(startup);
  writeDatabase(db);
  res.json({ success: true, startup });
});

app.post('/api/startups/:id/upvote', (req, res) => {
  const db = readDatabase();
  const index = (db.startups || []).findIndex(s => s.id === req.params.id);
  if (index !== -1) {
    db.startups[index].upvotes = (db.startups[index].upvotes || 0) + 1;
    writeDatabase(db);
    res.json({ success: true, upvotes: db.startups[index].upvotes });
  } else {
    res.status(404).json({ success: false, message: 'Startup not found' });
  }
});

// College Portal — Meetings API
app.get('/api/meetings', (req, res) => {
  const db = readDatabase();
  res.json(db.meetings || []);
});

app.post('/api/meetings', (req, res) => {
  const db = readDatabase();
  const meeting = req.body;
  if (!db.meetings) db.meetings = [];
  db.meetings.push(meeting);
  writeDatabase(db);
  res.json({ success: true, meeting });
});

// Catch-all: only serve index.html for portal sub-paths (not /login or /api/*)
app.get(/^\/(index\.html)?$/, (req, res) => {
  res.redirect('/login');
});


app.listen(PORT, () => {
  console.log(`============================================================`);
  console.log(`  ELEVATE PORTAL SERVER RUNNING AT http://localhost:${PORT}`);
  console.log(`  File-based Database Path: ${DB_FILE}`);
  console.log(`============================================================`);
});

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

const { initMySQL, isMySQLConnected, getFullDB, query } = require('./backend/db/mysql');

// Initialize MySQL pool asynchronously
initMySQL().then(connected => {
  if (connected) {
    console.log('[Server] Active storage engine: MySQL Database');
  } else {
    console.log('[Server] Active storage engine: Local database.json File (Fallback)');
  }
});

// Helper: Read DB (MySQL with file fallback)
async function readDatabaseAsync() {
  if (isMySQLConnected()) {
    const db = await getFullDB();
    if (db) return db;
  }
  return readDatabase();
}

// REST APIs
app.get('/api/db', async (req, res) => {
  const db = await readDatabaseAsync();
  res.json(db);
});

app.post('/api/db/save', async (req, res) => {
  const db = req.body;
  if (isMySQLConnected()) {
    writeDatabase(db);
    res.json({ success: true, message: 'Database saved to MySQL and local file!' });
  } else {
    if (writeDatabase(db)) {
      res.json({ success: true, message: 'Database saved successfully!' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to write to database file.' });
    }
  }
});

app.post('/api/db/reset', async (req, res) => {
  if (writeDatabase(DEFAULT_DB)) {
    res.json({ success: true, message: 'Database reset to default mock data successfully!' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to reset database.' });
  }
});

// Single API routes for easier CRUD from client
app.get('/api/students', async (req, res) => {
  if (isMySQLConnected()) {
    const rows = await query('SELECT * FROM students');
    if (rows) {
      const parsed = rows.map(s => ({
        ...s,
        rank: s.rank_val || s.rank || '--',
        weakSkills: typeof s.weakSkills === 'string' ? JSON.parse(s.weakSkills) : s.weakSkills || [],
        appliedJobs: typeof s.appliedJobs === 'string' ? JSON.parse(s.appliedJobs) : s.appliedJobs || [],
        interviewHistory: typeof s.interviewHistory === 'string' ? JSON.parse(s.interviewHistory) : s.interviewHistory || []
      }));
      return res.json(parsed);
    }
  }
  const db = readDatabase();
  res.json(db.students);
});

app.put('/api/students/:id', async (req, res) => {
  if (isMySQLConnected()) {
    const id = req.params.id;
    const body = req.body;
    const existing = await query('SELECT * FROM students WHERE id = ?', [id]);
    if (existing && existing.length > 0) {
      const curr = existing[0];
      const name = body.name ?? curr.name;
      const email = body.email ?? curr.email;
      const dept = body.dept ?? curr.dept;
      const branch = body.branch ?? curr.branch;
      const semester = body.semester ?? curr.semester;
      const passingYear = body.passingYear ?? curr.passingYear;
      const cgpa = body.cgpa ?? curr.cgpa;
      const readiness = body.readiness ?? curr.readiness;
      const rankVal = body.rank ?? curr.rank_val ?? '--';
      const targetCompany = body.targetCompany ?? curr.targetCompany;
      const resumeVerified = body.resumeVerified ?? curr.resumeVerified;
      const resumeText = body.resumeText ?? curr.resumeText;
      const coursesCompleted = body.coursesCompleted ?? curr.coursesCompleted;
      const todayHours = body.todayHours ?? curr.todayHours;
      const mockTestsCompleted = body.mockTestsCompleted ?? curr.mockTestsCompleted;
      const weakSkills = JSON.stringify(body.weakSkills ?? (typeof curr.weakSkills === 'string' ? JSON.parse(curr.weakSkills) : curr.weakSkills || []));
      const appliedJobs = JSON.stringify(body.appliedJobs ?? (typeof curr.appliedJobs === 'string' ? JSON.parse(curr.appliedJobs) : curr.appliedJobs || []));
      const interviewHistory = JSON.stringify(body.interviewHistory ?? (typeof curr.interviewHistory === 'string' ? JSON.parse(curr.interviewHistory) : curr.interviewHistory || []));

      await query(
        `UPDATE students SET name=?, email=?, dept=?, branch=?, semester=?, passingYear=?, cgpa=?, readiness=?, rank_val=?, targetCompany=?, resumeVerified=?, resumeText=?, coursesCompleted=?, todayHours=?, mockTestsCompleted=?, weakSkills=?, appliedJobs=?, interviewHistory=? WHERE id=?`,
        [name, email, dept, branch, semester, passingYear, cgpa, readiness, rankVal, targetCompany, resumeVerified, resumeText, coursesCompleted, todayHours, mockTestsCompleted, weakSkills, appliedJobs, interviewHistory, id]
      );
      
      const [updated] = await query('SELECT * FROM students WHERE id = ?', [id]);
      const result = {
        ...updated,
        rank: updated.rank_val || '--',
        weakSkills: typeof updated.weakSkills === 'string' ? JSON.parse(updated.weakSkills) : updated.weakSkills || [],
        appliedJobs: typeof updated.appliedJobs === 'string' ? JSON.parse(updated.appliedJobs) : updated.appliedJobs || [],
        interviewHistory: typeof updated.interviewHistory === 'string' ? JSON.parse(updated.interviewHistory) : updated.interviewHistory || []
      };

      const db = readDatabase();
      const idx = db.students.findIndex(s => s.id === id);
      if (idx !== -1) db.students[idx] = result;
      writeDatabase(db);

      return res.json({ success: true, student: result });
    }
  }

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

app.post('/api/students', async (req, res) => {
  const student = req.body;
  if (isMySQLConnected()) {
    await query(
      `INSERT INTO students (id, name, email, dept, branch, semester, passingYear, cgpa, readiness, rank_val, targetCompany, resumeVerified, resumeText, coursesCompleted, todayHours, mockTestsCompleted, weakSkills, appliedJobs, interviewHistory) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        student.id, student.name, student.email, student.dept || '', student.branch || '', student.semester || '',
        student.passingYear || 2028, student.cgpa || 0, student.readiness || 0, student.rank || '--',
        student.targetCompany || '--', student.resumeVerified || 'Pending', student.resumeText || '',
        student.coursesCompleted || 0, student.todayHours || 0, student.mockTestsCompleted || 0,
        JSON.stringify(student.weakSkills || []), JSON.stringify(student.appliedJobs || []), JSON.stringify(student.interviewHistory || [])
      ]
    );
  }

  const db = readDatabase();
  db.students.push(student);
  writeDatabase(db);
  res.json({ success: true, student });
});

app.get('/api/jobs', async (req, res) => {
  if (isMySQLConnected()) {
    const rows = await query('SELECT * FROM jobs');
    if (rows) {
      const parsed = rows.map(j => ({
        ...j,
        desc: j.description || j.desc || '',
        eligibility: typeof j.eligibility === 'string' ? JSON.parse(j.eligibility) : j.eligibility || {},
        applicants: typeof j.applicants === 'string' ? JSON.parse(j.applicants) : j.applicants || []
      }));
      return res.json(parsed);
    }
  }
  const db = readDatabase();
  res.json(db.jobs);
});

app.post('/api/jobs', async (req, res) => {
  const job = req.body;
  if (isMySQLConnected()) {
    await query(
      `INSERT INTO jobs (id, company, logo, role, type, ctc, location, description, eligibility, applicants) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        job.id || `job_${Date.now()}`, job.company, job.logo || 'COMP', job.role, job.type || 'Full Time',
        job.ctc, job.location || '', job.desc || job.description || '', JSON.stringify(job.eligibility || {}), JSON.stringify(job.applicants || [])
      ]
    );
  }

  const db = readDatabase();
  db.jobs.push(job);
  writeDatabase(db);
  res.json({ success: true, job });
});

app.post('/api/jobs/:id/apply', async (req, res) => {
  const jobId = req.params.id;
  const { studentId } = req.body;

  if (isMySQLConnected()) {
    const jobs = await query('SELECT * FROM jobs WHERE id = ?', [jobId]);
    const students = await query('SELECT * FROM students WHERE id = ?', [studentId]);

    if (jobs && jobs.length > 0 && students && students.length > 0) {
      const job = jobs[0];
      const student = students[0];

      let applicants = typeof job.applicants === 'string' ? JSON.parse(job.applicants) : job.applicants || [];
      if (!applicants.includes(studentId)) {
        applicants.push(studentId);
        await query('UPDATE jobs SET applicants = ? WHERE id = ?', [JSON.stringify(applicants), jobId]);
      }

      let appliedJobs = typeof student.appliedJobs === 'string' ? JSON.parse(student.appliedJobs) : student.appliedJobs || [];
      const alreadyApplied = appliedJobs.some(a => a.jobId === jobId);
      if (!alreadyApplied) {
        appliedJobs.push({ jobId, status: 'Applied', date: new Date().toISOString().split('T')[0] });
        await query('UPDATE students SET appliedJobs = ? WHERE id = ?', [JSON.stringify(appliedJobs), studentId]);
      }

      const db = readDatabase();
      const jIdx = db.jobs.findIndex(j => j.id === jobId);
      const sIdx = db.students.findIndex(s => s.id === studentId);
      if (jIdx !== -1 && !db.jobs[jIdx].applicants.includes(studentId)) db.jobs[jIdx].applicants.push(studentId);
      if (sIdx !== -1 && !db.students[sIdx].appliedJobs.some(a => a.jobId === jobId)) {
        db.students[sIdx].appliedJobs.push({ jobId, status: 'Applied', date: new Date().toISOString().split('T')[0] });
      }
      writeDatabase(db);

      return res.json({ success: true, student, job });
    }
  }

  const db = readDatabase();
  const jobIndex = db.jobs.findIndex(j => j.id === jobId);
  const studentIndex = db.students.findIndex(s => s.id === studentId);

  if (jobIndex !== -1 && studentIndex !== -1) {
    if (!db.jobs[jobIndex].applicants.includes(studentId)) {
      db.jobs[jobIndex].applicants.push(studentId);
    }
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

app.get('/api/drives', async (req, res) => {
  if (isMySQLConnected()) {
    const rows = await query('SELECT * FROM drives');
    if (rows) return res.json(rows);
  }
  const db = readDatabase();
  res.json(db.drives);
});

app.post('/api/drives', async (req, res) => {
  const drive = req.body;
  if (isMySQLConnected()) {
    await query(
      `INSERT INTO drives (id, company, date, status, dept, minCgpa, role, ctc, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        drive.id || `drv_${Date.now()}`, drive.company, drive.date, drive.status || 'Scheduled',
        drive.dept || 'Engineering', drive.minCgpa || 6.0, drive.role || '', drive.ctc || '', drive.description || ''
      ]
    );
  }

  const db = readDatabase();
  db.drives.push(drive);
  writeDatabase(db);
  res.json({ success: true, drive });
});

// College Portal — Companies API
app.get('/api/companies', async (req, res) => {
  if (isMySQLConnected()) {
    const rows = await query('SELECT * FROM companies');
    if (rows) return res.json(rows);
  }
  const db = readDatabase();
  res.json(db.companies || []);
});

app.post('/api/companies', async (req, res) => {
  const company = req.body;
  if (isMySQLConnected()) {
    await query(
      `INSERT INTO companies (id, name, industry, contact, status, avatar, previousVisits, connectionDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        company.id || `comp_${Date.now()}`, company.name, company.industry || '', company.contact || '',
        company.status || 'Pending', company.avatar || 'CO', company.previousVisits || 0, company.connectionDate || null
      ]
    );
  }

  const db = readDatabase();
  if (!db.companies) db.companies = [];
  db.companies.push(company);
  writeDatabase(db);
  res.json({ success: true, company });
});

app.put('/api/companies/:id', async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  if (isMySQLConnected()) {
    const existing = await query('SELECT * FROM companies WHERE id = ?', [id]);
    if (existing && existing.length > 0) {
      const curr = existing[0];
      const name = body.name ?? curr.name;
      const industry = body.industry ?? curr.industry;
      const contact = body.contact ?? curr.contact;
      const status = body.status ?? curr.status;
      const avatar = body.avatar ?? curr.avatar;
      const previousVisits = body.previousVisits ?? curr.previousVisits;
      const connectionDate = body.connectionDate ?? curr.connectionDate;

      await query(
        `UPDATE companies SET name=?, industry=?, contact=?, status=?, avatar=?, previousVisits=?, connectionDate=? WHERE id=?`,
        [name, industry, contact, status, avatar, previousVisits, connectionDate, id]
      );
      const [updated] = await query('SELECT * FROM companies WHERE id = ?', [id]);
      
      const db = readDatabase();
      const idx = (db.companies || []).findIndex(c => c.id === id);
      if (idx !== -1) db.companies[idx] = updated;
      writeDatabase(db);

      return res.json({ success: true, company: updated });
    }
  }

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
app.get('/api/startups', async (req, res) => {
  if (isMySQLConnected()) {
    const rows = await query('SELECT * FROM startups');
    if (rows) {
      const parsed = rows.map(st => ({
        ...st,
        team: typeof st.team === 'string' ? JSON.parse(st.team) : st.team || [],
        trending: Boolean(st.trending)
      }));
      return res.json(parsed);
    }
  }
  const db = readDatabase();
  res.json(db.startups || []);
});

app.post('/api/startups', async (req, res) => {
  const startup = req.body;
  if (isMySQLConnected()) {
    await query(
      `INSERT INTO startups (id, name, tagline, category, problem, solution, upvotes, comments, team, gradient, trending) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        startup.id || `st_${Date.now()}`, startup.name, startup.tagline || '', startup.category || 'General',
        startup.problem || '', startup.solution || '', startup.upvotes || 0, startup.comments || 0,
        JSON.stringify(startup.team || []), startup.gradient || '', startup.trending || false
      ]
    );
  }

  const db = readDatabase();
  if (!db.startups) db.startups = [];
  db.startups.push(startup);
  writeDatabase(db);
  res.json({ success: true, startup });
});

app.post('/api/startups/:id/upvote', async (req, res) => {
  const id = req.params.id;
  if (isMySQLConnected()) {
    await query('UPDATE startups SET upvotes = upvotes + 1 WHERE id = ?', [id]);
    const rows = await query('SELECT upvotes FROM startups WHERE id = ?', [id]);
    if (rows && rows.length > 0) {
      const upvotes = rows[0].upvotes;
      const db = readDatabase();
      const idx = (db.startups || []).findIndex(s => s.id === id);
      if (idx !== -1) db.startups[idx].upvotes = upvotes;
      writeDatabase(db);
      return res.json({ success: true, upvotes });
    }
  }

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
app.get('/api/meetings', async (req, res) => {
  if (isMySQLConnected()) {
    const rows = await query('SELECT * FROM meetings');
    if (rows) return res.json(rows);
  }
  const db = readDatabase();
  res.json(db.meetings || []);
});

app.post('/api/meetings', async (req, res) => {
  const meeting = req.body;
  if (isMySQLConnected()) {
    await query(
      `INSERT INTO meetings (id, company, companyId, type, date, time, mode, link, venue, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        meeting.id || `mtg_${Date.now()}`, meeting.company, meeting.companyId || null, meeting.type || 'Meeting',
        meeting.date, meeting.time || '10:00', meeting.mode || 'online', meeting.link || '', meeting.venue || '', meeting.description || ''
      ]
    );
  }

  const db = readDatabase();
  if (!db.meetings) db.meetings = [];
  db.meetings.push(meeting);
  writeDatabase(db);
  res.json({ success: true, meeting });
});

// Catch-all: serve index.html for portal sub-paths
app.get(/^\/(index\.html)?$/, (req, res) => {
  res.redirect('/login');
});

app.listen(PORT, () => {
  console.log(`============================================================`);
  console.log(`  ELEVATE PORTAL SERVER RUNNING AT http://localhost:${PORT}`);
  console.log(`  Storage Mode: ${isMySQLConnected() ? 'MySQL Database' : 'File-based (' + DB_FILE + ')'}`);
  console.log(`============================================================`);
});

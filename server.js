const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Default Mock Data for the startup database
const DEFAULT_DB = {
  students: [
    {
      id: 'GHRCE2024047',
      name: 'Priya Sharma',
      email: 'priya.sharma@ghrce.ac.in',
      dept: 'Engineering',
      branch: 'Computer Science',
      semester: '6th Semester',
      cgpa: 8.4,
      readiness: 72,
      rank: 47,
      targetCompany: 'TCS / Infosys',
      resumeVerified: 'Verified',
      resumeText: 'Priya Sharma. B.Tech Computer Science student. Skills: Java, Python, SQL, DSA. Projects: E-Commerce site optimization.',
      coursesCompleted: 8,
      todayHours: 2.4,
      mockTestsCompleted: 14,
      weakSkills: ['Operating Systems', 'Computer Networks', 'Verbal Communication'],
      appliedJobs: [],
      interviewHistory: [
        {
          company: 'Microsoft',
          type: 'HR',
          date: '2026-07-10',
          score: 80,
          reportId: 'rep_001',
          feedback: 'Strong answers, good confidence, needs minor alignment with company cloud strategy.'
        }
      ]
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
  ]
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

// Wildcard route to serve index.html for SPA router on client side
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`============================================================`);
  console.log(`  ELEVATE PORTAL SERVER RUNNING AT http://localhost:${PORT}`);
  console.log(`  File-based Database Path: ${DB_FILE}`);
  console.log(`============================================================`);
});

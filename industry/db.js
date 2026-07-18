/* ============================================================
   ELEVATE PORTAL — Database Engine
   Hybrid client-server persistent database manager
   ============================================================ */

'use strict';

const DB_KEY = 'elevate_local_db';

// Fallback seed data in case API is not reachable
const DEFAULT_MOCK_DATA = {
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

class ElevateDatabase {
  constructor() {
    this.useServer = window.location.protocol.startsWith('http');
    this.localCache = null;
    this.initPromise = this.init();
  }

  async init() {
    if (this.useServer) {
      try {
        const res = await fetch('/api/db');
        if (res.ok) {
          this.localCache = await res.json();
          console.log('[DB] Connected to Express Backend Server database.');
          return;
        }
      } catch (err) {
        console.warn('[DB] Express server connection failed, falling back to LocalStorage.', err);
      }
    }
    
    // LocalStorage fallback
    const saved = localStorage.getItem(DB_KEY);
    if (saved) {
      try {
        this.localCache = JSON.parse(saved);
        console.log('[DB] Connected to local browser storage.');
      } catch (e) {
        this.localCache = { ...DEFAULT_MOCK_DATA };
        this.saveLocally();
      }
    } else {
      this.localCache = { ...DEFAULT_MOCK_DATA };
      this.saveLocally();
    }
  }

  async save() {
    if (this.useServer) {
      try {
        const res = await fetch('/api/db/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.localCache)
        });
        if (res.ok) {
          console.log('[DB] Successfully synced data to Backend Server.');
          return;
        }
      } catch (err) {
        console.error('[DB] Failed to sync data to Backend Server. Saving locally instead.', err);
      }
    }
    
    // LocalStorage fallback
    this.saveLocally();
  }

  saveLocally() {
    localStorage.setItem(DB_KEY, JSON.stringify(this.localCache));
    console.log('[DB] Saved data to LocalStorage.');
  }

  async reset() {
    if (this.useServer) {
      try {
        const res = await fetch('/api/db/reset', { method: 'POST' });
        if (res.ok) {
          this.localCache = await res.json();
          console.log('[DB] Database reset on Express backend.');
          return;
        }
      } catch (e) {
        console.error('[DB] Backend reset request failed.', e);
      }
    }

    this.localCache = JSON.parse(JSON.stringify(DEFAULT_MOCK_DATA));
    this.saveLocally();
    console.log('[DB] Database reset locally.');
  }

  // --- Student operations ---
  async getStudents() {
    await this.initPromise;
    return this.localCache.students;
  }

  async getStudentById(id) {
    await this.initPromise;
    return this.localCache.students.find(s => s.id === id) || null;
  }

  async registerStudent(student) {
    await this.initPromise;
    const exists = this.localCache.students.some(s => s.id === student.id);
    if (exists) return { success: false, message: 'Student ID already registered.' };
    
    // Add default values
    const newStudent = {
      cgpa: 7.0,
      readiness: 50,
      rank: this.localCache.students.length + 1,
      targetCompany: 'TCS',
      resumeVerified: 'Pending',
      resumeText: '',
      coursesCompleted: 0,
      todayHours: 0,
      mockTestsCompleted: 0,
      weakSkills: ['Aptitude', 'DSA'],
      appliedJobs: [],
      interviewHistory: [],
      ...student
    };
    
    this.localCache.students.push(newStudent);
    await this.save();
    return { success: true, student: newStudent };
  }

  async updateStudent(id, data) {
    await this.initPromise;
    const index = this.localCache.students.findIndex(s => s.id === id);
    if (index !== -1) {
      this.localCache.students[index] = { ...this.localCache.students[index], ...data };
      await this.save();
      return this.localCache.students[index];
    }
    return null;
  }

  // --- Job operations ---
  async getJobs() {
    await this.initPromise;
    return this.localCache.jobs;
  }

  async postJob(job) {
    await this.initPromise;
    const newJob = {
      id: 'job_' + Date.now(),
      logo: job.company.substring(0, 3).toUpperCase(),
      applicants: [],
      ...job
    };
    this.localCache.jobs.push(newJob);
    await this.save();
    return newJob;
  }

  async applyToJob(jobId, studentId) {
    await this.initPromise;
    const jobIndex = this.localCache.jobs.findIndex(j => j.id === jobId);
    const studentIndex = this.localCache.students.findIndex(s => s.id === studentId);

    if (jobIndex !== -1 && studentIndex !== -1) {
      // Add student to applicants if not already present
      if (!this.localCache.jobs[jobIndex].applicants.includes(studentId)) {
        this.localCache.jobs[jobIndex].applicants.push(studentId);
      }
      // Add job to student's appliedJobs
      const alreadyApplied = this.localCache.students[studentIndex].appliedJobs.some(a => a.jobId === jobId);
      if (!alreadyApplied) {
        this.localCache.students[studentIndex].appliedJobs.push({
          jobId,
          status: 'Applied',
          date: new Date().toISOString().split('T')[0]
        });
      }
      await this.save();
      return { success: true, student: this.localCache.students[studentIndex] };
    }
    return { success: false, message: 'Job or Student not found.' };
  }

  async updateApplicantStatus(jobId, studentId, status) {
    await this.initPromise;
    // Update student's applied jobs list
    const studentIndex = this.localCache.students.findIndex(s => s.id === studentId);
    if (studentIndex !== -1) {
      const appIndex = this.localCache.students[studentIndex].appliedJobs.findIndex(a => a.jobId === jobId);
      if (appIndex !== -1) {
        this.localCache.students[studentIndex].appliedJobs[appIndex].status = status;
      } else {
        this.localCache.students[studentIndex].appliedJobs.push({ jobId, status, date: new Date().toISOString().split('T')[0] });
      }
      await this.save();
      return true;
    }
    return false;
  }

  // --- Drive operations ---
  async getDrives() {
    await this.initPromise;
    return this.localCache.drives;
  }

  async scheduleDrive(drive) {
    await this.initPromise;
    const newDrive = {
      id: 'drv_' + Date.now(),
      status: 'Scheduled',
      ...drive
    };
    this.localCache.drives.push(newDrive);
    await this.save();
    return newDrive;
  }

  // --- Assessment operations ---
  async getAssessments() {
    await this.initPromise;
    return this.localCache.assessments;
  }

  async createAssessment(assessment) {
    await this.initPromise;
    const newAsm = {
      id: 'asm_' + Date.now(),
      createdBy: 'College T&P',
      ...assessment
    };
    this.localCache.assessments.push(newAsm);
    await this.save();
    return newAsm;
  }
}

// Instantiate global db manager
const db = new ElevateDatabase();
window.db = db; // Export to window for global access

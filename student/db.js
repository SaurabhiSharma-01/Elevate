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
      ],
      hackathons: [
        {
          id: 'h_101',
          name: "FinSpark'26",
          organizer: 'National Fintech Innovation Forum',
          date: '2026-03-15',
          mode: 'Offline',
          theme: 'FinTech & AI Solutions',
          teamName: 'CodeCrafters',
          teamMembers: 'Priya Sharma, Rohan Mehta, Sneha Patil',
          projectName: 'SmartPay AI Risk Engine',
          problemStatement: 'Building a real-time fraudulent transaction detection model for UPI payments using graph AI.',
          technologies: 'Python, PyTorch, Node.js, MongoDB, React, REST APIs',
          githubUrl: 'https://github.com/priyasharma/smartpay-ai',
          demoUrl: 'https://smartpay-demo.vercel.app',
          videoUrl: 'https://youtube.com/watch?v=demo123',
          pptUrl: 'https://slideshare.net/smartpay-pitch',
          isOpenSource: true,
          certificateUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80',
          position: 'Top 20',
          verified: true,
          verifiedBy: 'Dr. Rajesh Kumar (Head T&P)'
        },
        {
          id: 'h_102',
          name: 'SIH Internal Hackathon 2026',
          organizer: 'GH Raisoni College T&P Cell',
          date: '2026-01-20',
          mode: 'Offline',
          theme: 'Smart Education & Campus AI',
          teamName: 'ByteBusters',
          teamMembers: 'Priya Sharma, Aditya Sen',
          projectName: 'Elevate AI Proctoring Hub',
          problemStatement: 'Automated gaze detection and tab switching prevention for high-stakes online campus assessments.',
          technologies: 'Python, OpenCV, Express, React, WebSockets',
          githubUrl: 'https://github.com/priyasharma/proctor-ai',
          demoUrl: 'https://proctor-demo.vercel.app',
          videoUrl: 'https://youtube.com/watch?v=proctor456',
          pptUrl: '',
          isOpenSource: true,
          certificateUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80',
          position: 'College Qualified',
          verified: true,
          verifiedBy: 'Saurabhi Sharma (Head T&P)'
        },
        {
          id: 'h_103',
          name: 'HackFest Pune 2025',
          organizer: 'Pune Tech Foundation',
          date: '2025-11-10',
          mode: 'Online',
          theme: 'Healthcare & Smart Diagnosis',
          teamName: 'HealthNexus',
          teamMembers: 'Priya Sharma, Sneha Patil',
          projectName: 'MediScan AI',
          problemStatement: 'Rapid X-Ray diagnostic analyzer using deep neural networks to assist rural clinics.',
          technologies: 'Python, TensorFlow, Flask, Flutter, Firebase',
          githubUrl: 'https://github.com/priyasharma/mediscan-ai',
          demoUrl: 'https://mediscan.dev',
          videoUrl: 'https://youtube.com/watch?v=medi789',
          pptUrl: 'https://slideshare.net/mediscan-pitch',
          isOpenSource: false,
          certificateUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80',
          position: 'Winner',
          verified: true,
          verifiedBy: 'Saurabhi Sharma (Head T&P)'
        },
        {
          id: 'h_104',
          name: 'CyberShield National Hackathon',
          organizer: 'IIT Bombay Techfest',
          date: '2025-08-05',
          mode: 'Offline',
          theme: 'Cybersecurity & Zero Trust',
          teamName: 'SentinelPriya',
          teamMembers: 'Priya Sharma',
          projectName: 'ZeroTrust Auth Vault',
          problemStatement: 'Biometric authentication and multi-factor hardware security key interface.',
          technologies: 'Node.js, Cryptography, OAuth, Security, PostgreSQL',
          githubUrl: 'https://github.com/priyasharma/zerotrust-vault',
          demoUrl: 'https://zerotrust-vault.io',
          videoUrl: '',
          pptUrl: '',
          isOpenSource: true,
          certificateUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80',
          position: 'Finalist',
          verified: false,
          verifiedBy: ''
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
      interviewHistory: [],
      hackathons: [
        {
          id: 'h_301',
          name: "FinSpark'26",
          organizer: 'National Fintech Innovation Forum',
          date: '2026-03-15',
          mode: 'Offline',
          theme: 'FinTech',
          teamName: 'CodeCrafters',
          teamMembers: 'Priya Sharma, Rohan Mehta, Sneha Patil',
          projectName: 'SmartPay AI Risk Engine',
          problemStatement: 'Building real-time transaction risk scoring.',
          technologies: 'Node.js, Express, React, HTML, CSS',
          githubUrl: 'https://github.com/rohanmehta/smartpay',
          demoUrl: 'https://smartpay-demo.com',
          videoUrl: '',
          pptUrl: '',
          isOpenSource: true,
          certificateUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80',
          position: 'Top 20',
          verified: true,
          verifiedBy: 'Saurabhi Sharma (Head T&P)'
        },
        {
          id: 'h_302',
          name: 'WebDev Sprint 2025',
          organizer: 'Nagpur Developers Club',
          date: '2025-09-12',
          mode: 'Online',
          theme: 'Web Development',
          teamName: 'DevCraft',
          teamMembers: 'Rohan Mehta',
          projectName: 'EduPortal Lite',
          problemStatement: 'Lightweight student management portal for regional schools.',
          technologies: 'JavaScript, Tailwind, React, Node.js',
          githubUrl: 'https://github.com/rohanmehta/eduportal',
          demoUrl: 'https://eduportal-lite.dev',
          videoUrl: 'https://youtube.com/watch?v=rohan123',
          pptUrl: '',
          isOpenSource: true,
          certificateUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80',
          position: 'Runner Up',
          verified: true,
          verifiedBy: 'Saurabhi Sharma (Head T&P)'
        }
      ]
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
      ],
      hackathons: [
        {
          id: 'h_201',
          name: 'National AI Challenge 2026',
          organizer: 'NITI Aayog Tech Grand Challenge',
          date: '2026-02-28',
          mode: 'Offline',
          theme: 'AI & Healthcare',
          teamName: 'BioPulp Tech',
          teamMembers: 'Sneha Patil, Priya Sharma',
          projectName: 'NeuroDiagnostics AI',
          problemStatement: 'EEG Signal classifier for early onset seizure detection.',
          technologies: 'Python, PyTorch, TensorFlow, OpenCV, IoT, Sensors',
          githubUrl: 'https://github.com/snehapatil/neuro-ai',
          demoUrl: 'https://neuro-ai.org',
          videoUrl: 'https://youtube.com/watch?v=sneha456',
          pptUrl: 'https://slideshare.net/sneha-neuro',
          isOpenSource: true,
          certificateUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80',
          position: 'Winner',
          verified: true,
          verifiedBy: 'Dr. Rajesh Kumar (Head T&P)'
        },
        {
          id: 'h_202',
          name: 'HackFest Pune 2025',
          organizer: 'Pune Tech Foundation',
          date: '2025-11-10',
          mode: 'Online',
          theme: 'Healthcare & Smart Diagnosis',
          teamName: 'HealthNexus',
          teamMembers: 'Sneha Patil, Priya Sharma',
          projectName: 'MediScan AI',
          problemStatement: 'Rapid X-Ray diagnostic analyzer.',
          technologies: 'Python, TensorFlow, Flask',
          githubUrl: 'https://github.com/snehapatil/mediscan',
          demoUrl: 'https://mediscan.dev',
          videoUrl: '',
          pptUrl: '',
          isOpenSource: true,
          certificateUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80',
          position: 'Winner',
          verified: true,
          verifiedBy: 'Saurabhi Sharma (Head T&P)'
        },
        {
          id: 'h_203',
          name: 'IoT World Hackathon',
          organizer: 'IEEE India Council',
          date: '2025-06-18',
          mode: 'Offline',
          theme: 'IoT & Smart Grid',
          teamName: 'SolarSense',
          teamMembers: 'Sneha Patil',
          projectName: 'SolarGrid Smart Controller',
          problemStatement: 'Automated solar grid load distribution controller.',
          technologies: 'Arduino, Embedded Systems, IoT, C++',
          githubUrl: 'https://github.com/snehapatil/solargrid',
          demoUrl: 'https://solargrid.dev',
          videoUrl: 'https://youtube.com/watch?v=solar789',
          pptUrl: '',
          isOpenSource: false,
          certificateUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80',
          position: 'Top 20',
          verified: true,
          verifiedBy: 'Saurabhi Sharma (Head T&P)'
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
      interviewHistory: [],
      hackathons: [
        {
          id: 'h_401',
          name: 'Fintech Leap 2026',
          organizer: 'Bombay Management Association',
          date: '2026-04-01',
          mode: 'Online',
          theme: 'Financial Strategy',
          teamName: 'FinAdvisors',
          teamMembers: 'Aditya Sen',
          projectName: 'Micro-SIP Advisory Model',
          problemStatement: 'Algorithmic micro-investment allocation for rural demographics.',
          technologies: 'Excel, Python, Financial Modeling',
          githubUrl: '',
          demoUrl: '',
          videoUrl: '',
          pptUrl: 'https://slideshare.net/aditya-microsip',
          isOpenSource: false,
          certificateUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80',
          position: 'Participant',
          verified: true,
          verifiedBy: 'Saurabhi Sharma (Head T&P)'
        }
      ]
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

  // --- Hackathon operations & calculation engine ---
  calculateHackathonXP(h) {
    if (!h) return 0;
    const positionScores = {
      'Participant': 20,
      'College Qualified': 40,
      'State Qualified': 70,
      'National Qualified': 120,
      'Top 100': 180,
      'Top 50': 220,
      'Top 20': 250,
      'Finalist': 300,
      'Runner Up': 400,
      'Winner': 500
    };
    let xp = positionScores[h.position] || 20;

    if (h.githubUrl && h.githubUrl.trim()) xp += 20;
    if (h.demoUrl && h.demoUrl.trim()) xp += 30; // Working prototype
    if (h.videoUrl && h.videoUrl.trim()) xp += 20; // Demo Video
    if (h.pptUrl && h.pptUrl.trim()) xp += 15; // Presentation
    if (h.isOpenSource) xp += 25; // Open source project
    if (h.verified) xp += 50; // Verified achievement bonus

    return xp;
  }

  calculateStudentHackathonXP(student) {
    if (!student || !student.hackathons || !student.hackathons.length) return 0;
    return student.hackathons.reduce((sum, h) => sum + this.calculateHackathonXP(h), 0);
  }

  extractSkillsFromTech(techString) {
    if (!techString) return [];
    const tech = techString.toLowerCase();
    const skills = new Set();

    if (tech.includes('node') || tech.includes('express') || tech.includes('django') || tech.includes('spring') || tech.includes('flask') || tech.includes('java') || tech.includes('php') || tech.includes('backend')) {
      skills.add('Backend Development');
    }
    if (tech.includes('mongo') || tech.includes('postgres') || tech.includes('mysql') || tech.includes('redis') || tech.includes('firebase') || tech.includes('database') || tech.includes('sql')) {
      skills.add('Cloud Database');
    }
    if (tech.includes('react') || tech.includes('vue') || tech.includes('angular') || tech.includes('html') || tech.includes('css') || tech.includes('tailwind') || tech.includes('frontend') || tech.includes('javascript') || tech.includes('typescript')) {
      skills.add('Frontend Development');
    }
    if (tech.includes('flutter') || tech.includes('react native') || tech.includes('swift') || tech.includes('kotlin') || tech.includes('android') || tech.includes('ios') || tech.includes('mobile')) {
      skills.add('Mobile Development');
    }
    if (tech.includes('python') || tech.includes('pytorch') || tech.includes('tensorflow') || tech.includes('opencv') || tech.includes('ai') || tech.includes('machine learning') || tech.includes('llm') || tech.includes('genai')) {
      skills.add('Artificial Intelligence');
    }
    if (tech.includes('blockchain') || tech.includes('solidity') || tech.includes('web3') || tech.includes('crypto')) {
      skills.add('Blockchain Development');
    }
    if (tech.includes('aws') || tech.includes('azure') || tech.includes('gcp') || tech.includes('docker') || tech.includes('kubernetes') || tech.includes('devops')) {
      skills.add('Cloud Computing');
    }
    if (tech.includes('cyber') || tech.includes('security') || tech.includes('oauth') || tech.includes('cryptography')) {
      skills.add('Cybersecurity & Privacy');
    }
    if (tech.includes('iot') || tech.includes('arduino') || tech.includes('raspberry') || tech.includes('embedded') || tech.includes('sensors')) {
      skills.add('Internet of Things (IoT)');
    }
    if (tech.includes('rest') || tech.includes('graphql') || tech.includes('api') || tech.includes('websocket')) {
      skills.add('REST APIs');
    }

    if (skills.size === 0) {
      skills.add('Software Engineering');
    }

    return Array.from(skills);
  }

  getEarnedBadges(student) {
    if (!student) return [];
    const list = student.hackathons || [];
    const badges = [];

    const hasNational = list.some(h => ['National Qualified', 'Top 100', 'Top 50', 'Top 20', 'Finalist', 'Runner Up', 'Winner'].includes(h.position));
    const winnerCount = list.filter(h => h.position === 'Winner').length;
    const totalCount = list.length;
    const allTech = list.map(h => `${h.technologies} ${h.theme}`).join(' ').toLowerCase();

    if (hasNational) {
      badges.push({ title: 'National Finalist', desc: 'Achieved National level qualification or placement in hackathons', category: 'Achievement' });
    }
    if (winnerCount > 0) {
      badges.push({ title: 'Winner', desc: `First Place Winner in ${winnerCount} hackathon(s)`, category: 'Top Honor' });
    }
    if (totalCount >= 10) {
      badges.push({ title: '10 Hackathons Completed', desc: 'Elite hackathon veteran with 10+ hackathons completed', category: 'Milestone' });
    } else if (totalCount >= 5) {
      badges.push({ title: '5 Hackathons Milestone', desc: 'Active competitor with 5+ hackathons completed', category: 'Milestone' });
    }
    if (allTech.includes('ai') || allTech.includes('pytorch') || allTech.includes('tensorflow') || allTech.includes('python') || allTech.includes('llm')) {
      badges.push({ title: 'AI Innovator', desc: 'Built cutting-edge Artificial Intelligence & Machine Learning prototypes', category: 'Domain Mastery' });
    }
    if (allTech.includes('cyber') || allTech.includes('security') || allTech.includes('crypto') || allTech.includes('oauth')) {
      badges.push({ title: 'Cybersecurity Specialist', desc: 'Demonstrated security, vault & privacy architecture in hackathons', category: 'Domain Mastery' });
    }

    const teamPlayerCount = list.filter(h => h.teamMembers && h.teamMembers.split(',').length > 1).length;
    if (teamPlayerCount >= 1) {
      badges.push({ title: 'Team Player', desc: 'Successfully collaborated in multi-disciplinary hackathon teams', category: 'Leadership' });
    }

    if (totalCount >= 3) {
      badges.push({ title: 'Consistent Participant', desc: 'Consistently participating in hackathons to level up skills', category: 'Dedication' });
    }

    return badges;
  }

  calculateInnovationScore(student) {
    if (!student) return 0;
    const hackathons = student.hackathons || [];
    const totalXp = this.calculateStudentHackathonXP(student);
    
    // 40% Hackathon Performance (max 40 pts, full score at 1000 XP)
    const perfScore = Math.min(40, (totalXp / 1000) * 40);

    // 25% Projects (max 25 pts, full score at 4 projects)
    const projScore = Math.min(25, (hackathons.length / 4) * 25);

    // 15% Certifications (max 15 pts, verified certificates count)
    const verifiedCerts = hackathons.filter(h => h.verified).length;
    const certScore = Math.min(15, (verifiedCerts / 2) * 15);

    // 10% Open Source Contributions (max 10 pts)
    const openSourceCount = hackathons.filter(h => h.isOpenSource || (h.githubUrl && h.githubUrl.trim())).length;
    const openSourceScore = Math.min(10, (openSourceCount / 2) * 10);

    // 10% Communication & Leadership (max 10 pts)
    const teamLeads = hackathons.filter(h => h.teamMembers && h.teamMembers.split(',').length > 1).length;
    const commScore = Math.min(10, (teamLeads / 2) * 10);

    return Math.round(perfScore + projScore + certScore + openSourceScore + commScore);
  }

  async getStudentHackathons(studentId) {
    await this.initPromise;
    const student = this.localCache.students.find(s => s.id === studentId);
    return student ? (student.hackathons || []) : [];
  }

  async addHackathon(studentId, entry) {
    await this.initPromise;
    const studentIndex = this.localCache.students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) return { success: false, message: 'Student not found.' };

    const newEntry = {
      id: 'h_' + Date.now(),
      verified: false,
      verifiedBy: '',
      githubUrl: '',
      demoUrl: '',
      videoUrl: '',
      pptUrl: '',
      isOpenSource: false,
      certificateUrl: '',
      ...entry
    };

    if (!this.localCache.students[studentIndex].hackathons) {
      this.localCache.students[studentIndex].hackathons = [];
    }

    this.localCache.students[studentIndex].hackathons.unshift(newEntry);
    await this.save();
    return { success: true, hackathon: newEntry, student: this.localCache.students[studentIndex] };
  }

  async updateHackathon(studentId, hackathonId, updatedData) {
    await this.initPromise;
    const studentIndex = this.localCache.students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) return { success: false, message: 'Student not found.' };

    const hackathons = this.localCache.students[studentIndex].hackathons || [];
    const hIndex = hackathons.findIndex(h => h.id === hackathonId);
    if (hIndex === -1) return { success: false, message: 'Hackathon entry not found.' };

    this.localCache.students[studentIndex].hackathons[hIndex] = {
      ...hackathons[hIndex],
      ...updatedData
    };

    await this.save();
    return { success: true, hackathon: this.localCache.students[studentIndex].hackathons[hIndex] };
  }

  async deleteHackathon(studentId, hackathonId) {
    await this.initPromise;
    const studentIndex = this.localCache.students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) return { success: false, message: 'Student not found.' };

    if (this.localCache.students[studentIndex].hackathons) {
      this.localCache.students[studentIndex].hackathons = this.localCache.students[studentIndex].hackathons.filter(h => h.id !== hackathonId);
      await this.save();
    }
    return { success: true };
  }

  async verifyHackathon(studentId, hackathonId, verifiedBy = 'Saurabhi Sharma (Head T&P)') {
    await this.initPromise;
    const studentIndex = this.localCache.students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) return { success: false, message: 'Student not found.' };

    const hackathons = this.localCache.students[studentIndex].hackathons || [];
    const hIndex = hackathons.findIndex(h => h.id === hackathonId);
    if (hIndex === -1) return { success: false, message: 'Hackathon not found.' };

    this.localCache.students[studentIndex].hackathons[hIndex].verified = true;
    this.localCache.students[studentIndex].hackathons[hIndex].verifiedBy = verifiedBy;

    await this.save();
    return { success: true, hackathon: this.localCache.students[studentIndex].hackathons[hIndex] };
  }
}

// Instantiate global db manager
const db = new ElevateDatabase();
window.db = db; // Export to window for global access

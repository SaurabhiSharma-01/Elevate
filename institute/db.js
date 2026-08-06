/* ============================================================
   ELEVATE PORTAL — Single Source of Truth Database Engine
   Hybrid client-server persistent database manager for Institute HQ
   ============================================================ */

'use strict';

const DB_KEY = 'elevate_local_db';

const DEFAULT_MOCK_DATA = {
  academicSetup: {
    currentAcademicYear: "2024-2025",
    academicYears: ["2023-2024", "2024-2025", "2025-2026"],
    departments: ["Engineering", "Information Technology", "Computer Science & Engineering", "Management", "Electronics"],
    branches: ["Computer Science", "Information Technology", "AIML", "TY COE", "Electronics", "MBA Finance"],
    years: ["FE", "SE", "TY", "BE"],
    divisions: ["A", "B", "C"],
    semesters: ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester"]
  },
  classes: [
    { id: "cls_001", name: "TY AIML A", branch: "AIML", year: "TY", division: "A", academicYear: "2024-2025", totalStudents: 64, coursesAssigned: 6, mockTestsAssigned: 4, placementReadiness: 78, placementPercentage: 45 },
    { id: "cls_002", name: "TY CSE A", branch: "Computer Science", year: "TY", division: "A", academicYear: "2024-2025", totalStudents: 72, coursesAssigned: 8, mockTestsAssigned: 6, placementReadiness: 82, placementPercentage: 52 },
    { id: "cls_003", name: "SY IT A", branch: "Information Technology", year: "SE", division: "A", academicYear: "2024-2025", totalStudents: 68, coursesAssigned: 5, mockTestsAssigned: 3, placementReadiness: 65, placementPercentage: 28 },
    { id: "cls_004", name: "TY COE A", branch: "TY COE", year: "TY", division: "A", academicYear: "2024-2025", totalStudents: 60, coursesAssigned: 7, mockTestsAssigned: 5, placementReadiness: 74, placementPercentage: 40 }
  ],
  students: [
    {
      id: 'GHRCE2024047',
      name: 'Saurabhi Sharma',
      email: 'saurabhi.sharma@ghrce.ac.in',
      dept: 'Engineering',
      branch: 'TY COE',
      year: 'TY',
      division: 'A',
      academicYear: '2024-2025',
      semester: '5th Semester',
      passingYear: 2028,
      cgpa: 7.0,
      backlogs: 0,
      readiness: 72,
      stage: 'Placement Ready',
      rank: 47,
      targetCompany: 'Microsoft / TCS',
      resumeVerified: 'Verified',
      resumeText: 'Saurabhi Sharma. B.Tech Computer Engineering student. Skills: Java, DSA, Web Dev.',
      coursesCompleted: 3,
      todayHours: 2.4,
      mockTestsCompleted: 4,
      appliedJobs: [{ jobId: 'job_001', status: 'Shortlisted', date: '2026-07-20' }],
      interviewHistory: [{ company: 'Microsoft', type: 'Technical', date: '2026-07-22', score: 85, feedback: 'Great DSA fundamentals.' }],
      hackathons: [
        {
          id: 'h_101',
          name: "FinSpark'26",
          organizer: 'National Fintech Innovation Forum',
          date: '2026-03-15',
          mode: 'Offline',
          theme: 'FinTech & AI Solutions',
          teamName: 'CodeCrafters',
          teamMembers: 'Saurabhi Sharma, Rohan Mehta, Sneha Patil',
          projectName: 'SmartPay AI Risk Engine',
          problemStatement: 'Building a real-time fraudulent transaction detection model for UPI payments using graph AI.',
          technologies: 'Python, PyTorch, Node.js, MongoDB, React, REST APIs',
          githubUrl: 'https://github.com/saurabhi/smartpay-ai',
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
          teamMembers: 'Saurabhi Sharma, Aditya Sen',
          projectName: 'Elevate AI Proctoring Hub',
          problemStatement: 'Automated gaze detection and tab switching prevention for high-stakes online campus assessments.',
          technologies: 'Python, OpenCV, Express, React, WebSockets',
          githubUrl: 'https://github.com/saurabhi/proctor-ai',
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
          teamMembers: 'Saurabhi Sharma, Sneha Patil',
          projectName: 'MediScan AI',
          problemStatement: 'Rapid X-Ray diagnostic analyzer using deep neural networks to assist rural clinics.',
          technologies: 'Python, TensorFlow, Flask, Flutter, Firebase',
          githubUrl: 'https://github.com/saurabhi/mediscan-ai',
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
          teamName: 'SentinelSaurabhi',
          teamMembers: 'Saurabhi Sharma',
          projectName: 'ZeroTrust Auth Vault',
          problemStatement: 'Biometric authentication and multi-factor hardware security key interface.',
          technologies: 'Node.js, Cryptography, OAuth, Security, PostgreSQL',
          githubUrl: 'https://github.com/saurabhi/zerotrust-vault',
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
      year: 'TY',
      division: 'A',
      academicYear: '2024-2025',
      semester: '6th Semester',
      passingYear: 2026,
      cgpa: 7.9,
      backlogs: 0,
      readiness: 65,
      stage: 'Mock Tests Attempted',
      rank: 112,
      targetCompany: 'Wipro',
      resumeVerified: 'Pending',
      resumeText: 'Rohan Mehta. B.Tech IT. Core skills: C++, Web Dev.',
      coursesCompleted: 5,
      todayHours: 1.5,
      mockTestsCompleted: 9,
      weakSkills: ['Quantitative Aptitude', 'DBMS'],
      appliedJobs: [{ jobId: 'job_002', status: 'Under Review', date: '2026-07-21' }],
      interviewHistory: []
    },
    {
      id: 'GHRCE2024089',
      name: 'Sneha Patil',
      email: 'sneha.patil@ghrce.ac.in',
      dept: 'Engineering',
      branch: 'Electronics',
      year: 'BE',
      division: 'B',
      academicYear: '2024-2025',
      semester: '6th Semester',
      passingYear: 2025,
      cgpa: 9.1,
      backlogs: 0,
      readiness: 85,
      stage: 'Placed',
      rank: 12,
      targetCompany: 'Amazon / Microsoft',
      resumeVerified: 'Verified',
      resumeText: 'Sneha Patil. B.Tech Electronics.',
      coursesCompleted: 12,
      todayHours: 3.2,
      mockTestsCompleted: 18,
      weakSkills: ['System Design'],
      appliedJobs: [{ jobId: 'job_001', status: 'Selected', date: '2026-07-15' }],
      interviewHistory: [{ company: 'Amazon', type: 'Technical', date: '2026-07-12', score: 92, feedback: 'Excellent DSA.' }]
    },
    {
      id: 'GHRCE24M002',
      name: 'Aditya Sen',
      email: 'aditya.sen@ghrce.ac.in',
      dept: 'Management',
      branch: 'MBA Finance',
      year: 'SE',
      division: 'A',
      academicYear: '2024-2025',
      semester: '3rd Semester',
      passingYear: 2026,
      cgpa: 8.2,
      backlogs: 0,
      readiness: 58,
      stage: 'Courses Started',
      rank: 35,
      targetCompany: 'Deloitte',
      resumeVerified: 'Pending',
      resumeText: 'Aditya Sen. MBA Finance.',
      coursesCompleted: 4,
      todayHours: 1.0,
      mockTestsCompleted: 5,
      weakSkills: ['Technical Aptitude'],
      appliedJobs: [],
      interviewHistory: []
    }
  ],
  courses: [
    {
      id: 'crs_001',
      title: 'Full-Stack Web Development Bootcamp',
      description: 'Master HTML, CSS, JavaScript, React, Node.js, and database design with real-world industry capstone projects.',
      instructor: 'Prof. Aniket Verma',
      category: 'Full Stack Development',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
      duration: '35 Hours',
      tags: ['React', 'NodeJS', 'JavaScript', 'FullStack'],
      status: 'Published',
      audience: { type: 'Entire Institute' },
      resources: [
        { name: 'HTML5 & CSS3 Master Guide.pdf', type: 'PDF', link: '#' },
        { name: 'React Hooks & State Architecture.mp4', type: 'Video', link: '#' }
      ],
      assignedStudents: 240,
      completionPercentage: 68,
      createdAt: '2026-06-10'
    },
    {
      id: 'crs_002',
      title: 'Data Structures & Algorithms in Java',
      description: 'Comprehensive DSA training covering Arrays, Trees, Graphs, Dynamic Programming, and LeetCode top 150 questions.',
      instructor: 'Dr. Ramesh Patil',
      category: 'Data Structures & Algorithms',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
      duration: '48 Hours',
      tags: ['Java', 'DSA', 'Algorithms', 'Interview Prep'],
      status: 'Published',
      audience: { type: 'Branch', values: ['Computer Science', 'Information Technology', 'AIML', 'TY COE'] },
      resources: [
        { name: 'Data Structures Cheat Sheet.pdf', type: 'PDF', link: '#' }
      ],
      assignedStudents: 180,
      completionPercentage: 74,
      createdAt: '2026-06-15'
    }
  ],
  mockTests: [
    {
      id: 'mkt_001',
      title: 'TCS NQT National Qualifier Mock Test',
      category: 'Company Specific',
      company: 'TCS',
      duration: 90,
      totalQuestions: 40,
      passingMarks: 65,
      difficulty: 'Medium',
      instructions: 'Attempt all sections within 90 minutes. Scientific calculators not permitted.',
      deadline: '2026-08-10',
      status: 'Active',
      audience: { type: 'Entire Institute' },
      questions: [
        { q: 'What is the output of 2**10 in Python?', opts: ['20', '100', '1024', '512'], ans: 2, section: 'Technical' }
      ],
      attemptsCount: 185,
      avgScore: 72,
      createdAt: '2026-07-01'
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
      eligibility: { cgpa: 7.5, branches: ['Computer Science', 'Information Technology', 'AIML', 'TY COE'], backlogs: 0, passingYear: 2026 },
      applicants: ['GHRCE2024047', 'GHRCE2024089'],
      status: 'Active',
      createdAt: '2026-07-10'
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
      eligibility: { cgpa: 6.0, branches: ['Computer Science', 'Information Technology', 'Electronics', 'AIML', 'TY COE'], backlogs: 0, passingYear: 2026 },
      applicants: ['GHRCE2024012'],
      status: 'Active',
      createdAt: '2026-07-12'
    }
  ],
  applications: [
    { id: 'app_101', jobId: 'job_001', studentId: 'GHRCE2024047', studentName: 'Saurabhi Sharma', branch: 'TY COE', company: 'Microsoft', role: 'Software Engineer Intern', readinessScore: 72, status: 'Shortlisted', appliedDate: '2026-07-20' },
    { id: 'app_102', jobId: 'job_001', studentId: 'GHRCE2024089', studentName: 'Sneha Patil', branch: 'Electronics', company: 'Microsoft', role: 'Software Engineer Intern', readinessScore: 85, status: 'Selected', appliedDate: '2026-07-15' },
    { id: 'app_103', jobId: 'job_002', studentId: 'GHRCE2024012', studentName: 'Rohan Mehta', branch: 'Information Technology', company: 'TCS', role: 'System Engineer (NQT Digital)', readinessScore: 65, status: 'Under Review', appliedDate: '2026-07-21' }
  ],
  drives: [
    { id: 'drv_001', company: 'TCS', date: '2026-07-25', status: 'Scheduled', dept: 'Engineering', role: 'System Engineer', package: '₹7.0 LPA' },
    { id: 'drv_002', company: 'Infosys', date: '2026-07-28', status: 'Scheduled', dept: 'Engineering', role: 'Systems Engineer', package: '₹3.6 LPA' }
  ],
  companies: [
    {
      id: 'comp_001',
      name: 'Synthetix Cloud',
      industry: 'Enterprise SaaS • Cloud Tech',
      contact: 'Sarah Jenkins',
      status: 'Connected',
      avatar: 'SC',
      website: 'https://synthetixcloud.com',
      headquarters: 'Bangalore, India',
      size: '500-1000 employees',
      previousVisits: 2,
      connectionDate: '2026-06-01',
      relationshipScore: 92,
      scoreTier: 'Green',
      tierLabel: 'Excellent Partner',
      drivesConducted: 3,
      studentsHired: 24,
      avgPackage: '₹12.5 LPA',
      lastCampusVisit: '2026-05-10',
      hrContacts: [{ name: 'Sarah Jenkins', designation: 'Head of Campus Talent', email: 'sarah.j@synthetix.com', phone: '+91 98765 43210', linkedin: 'linkedin.com/in/sarahjenkins' }],
      recruitmentHistory: [{ year: '2025', role: 'Cloud Engineer', package: '₹12 LPA', selectedCount: 18, status: 'Completed' }],
      timeline: [{ title: 'Campus Drive Completed', date: '2026-05-10', type: 'drive', note: 'Recruited 6 students for SaaS engineering.' }]
    }
  ],
  startups: [
    {
      id: 'st_001',
      name: 'EcoSync Systems',
      tagline: 'Smart AI-driven irrigation for institutional vertical gardens.',
      category: 'Sustainability',
      stage: 'Prototype / MVP',
      studentId: 'GHRCE2024047',
      leaderName: 'Saurabhi Sharma',
      fundingStatus: 'Bootstrapped',
      approvalStatus: 'Approved',
      problem: 'Traditional irrigation wastes 40% of water in institutional buildings.',
      solution: 'AI-based sensors with real-time moisture analytics optimize watering schedules.',
      upvotes: 1200,
      team: ['Saurabhi Sharma (Leader)', 'Aditya Sen', 'Rohan Mehta'],
      pitchDeck: 'EcoSync_Pitch_Deck_v2.pdf',
      assignedMentorId: 'mnt_001',
      assignedMentorName: 'Dr. Vikram Seth',
      comments: [{ id: 'c1', author: 'Institute T&P Cell', role: 'Institute', text: 'Approved for incubation space.', date: '2026-07-22' }]
    }
  ],
  mentors: [
    { id: 'mnt_001', name: 'Dr. Vikram Seth', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', designation: 'AI Research Director', organization: 'Google AI Research', expertise: 'Artificial Intelligence, Deep Learning', email: 'vikram.seth@google.com', assignedStartups: ['EcoSync Systems'], totalStartupsMentored: 8, successRate: '88%', studentRating: '4.9/5', activeSessions: 3 }
  ],
  recruiters: [
    { id: 'rec_001', name: 'Sarah Jenkins', company: 'Synthetix Cloud', designation: 'Head of Campus Talent', email: 'sarah.j@synthetix.com', phone: '+91 98765 43210', linkedin: 'linkedin.com/in/sarahjenkins', status: 'Active' }
  ],
  partnerships: [
    { id: 'prt_001', company: 'Synthetix Cloud', logo: 'SC', requestType: 'Center of Excellence MoU', submittedDate: '2026-07-10', status: 'Approved', contactPerson: 'Sarah Jenkins' }
  ],
  mentorshipPrograms: [
    { id: 'msp_001', company: 'Google AI Research', mentor: 'Dr. Vikram Seth', duration: '6 Months', studentCount: 15, progress: 65 }
  ],
  announcements: [
    { id: 'anc_001', title: 'Microsoft SDE Placement Drive Registration Open', content: 'Eligible 2026 passing batch students are requested to apply before July 28th.', category: 'Placement', priority: 'Urgent', publishedDate: '2026-07-24', audience: 'BE & TY Engineering Students', author: 'Head T&P Officer' }
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
          this.ensureSchemaDefaults();
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
        this.ensureSchemaDefaults();
        console.log('[DB] Connected to local browser storage.');
      } catch (e) {
        this.localCache = JSON.parse(JSON.stringify(DEFAULT_MOCK_DATA));
        this.saveLocally();
      }
    } else {
      this.localCache = JSON.parse(JSON.stringify(DEFAULT_MOCK_DATA));
      this.saveLocally();
    }
  }

  ensureSchemaDefaults() {
    if (!this.localCache) return;
    Object.keys(DEFAULT_MOCK_DATA).forEach(key => {
      if (!this.localCache[key]) {
        this.localCache[key] = JSON.parse(JSON.stringify(DEFAULT_MOCK_DATA[key]));
      }
    });
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
          this.ensureSchemaDefaults();
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

  // --- Academic Setup & Class Management ---
  async getAcademicSetup() {
    await this.initPromise;
    return this.localCache.academicSetup;
  }

  async getClasses() {
    await this.initPromise;
    return this.localCache.classes || [];
  }

  async createClass(classObj) {
    await this.initPromise;
    const newClass = {
      id: 'cls_' + Date.now(),
      totalStudents: 0,
      coursesAssigned: 0,
      mockTestsAssigned: 0,
      placementReadiness: 0,
      placementPercentage: 0,
      academicYear: this.localCache.academicSetup.currentAcademicYear || "2024-2025",
      ...classObj
    };
    this.localCache.classes.push(newClass);
    await this.save();
    return newClass;
  }

  // --- Student operations ---
  async getStudents() {
    await this.initPromise;
    return this.localCache.students || [];
  }

  async getStudentById(id) {
    await this.initPromise;
    return (this.localCache.students || []).find(s => s.id === id) || null;
  }

  async registerStudent(student) {
    await this.initPromise;
    const existsIndex = this.localCache.students.findIndex(s => s.id === student.id);
    const newStudent = {
      cgpa: 7.0,
      backlogs: 0,
      readiness: 50,
      stage: 'Imported',
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

    if (existsIndex !== -1) {
      // Upsert: update existing
      this.localCache.students[existsIndex] = { ...this.localCache.students[existsIndex], ...newStudent };
    } else {
      this.localCache.students.push(newStudent);
    }
    await this.save();
    return { success: true, student: newStudent };
  }

  async importStudentsBatch(studentsList) {
    await this.initPromise;
    let importedCount = 0;
    let updatedCount = 0;

    for (const studentData of studentsList) {
      const existsIndex = this.localCache.students.findIndex(s => s.id === studentData.id);
      const studentObj = {
        cgpa: studentData.cgpa || 7.0,
        backlogs: studentData.backlogs || 0,
        readiness: studentData.readiness || 50,
        stage: studentData.stage || 'Imported',
        rank: this.localCache.students.length + 1,
        targetCompany: 'TCS',
        resumeVerified: 'Pending',
        coursesCompleted: 0,
        todayHours: 0,
        mockTestsCompleted: 0,
        weakSkills: [],
        appliedJobs: [],
        interviewHistory: [],
        academicYear: this.localCache.academicSetup.currentAcademicYear || "2024-2025",
        ...studentData
      };

      if (existsIndex !== -1) {
        this.localCache.students[existsIndex] = { ...this.localCache.students[existsIndex], ...studentObj };
        updatedCount++;
      } else {
        this.localCache.students.push(studentObj);
        importedCount++;
      }
    }

    await this.save();
    return { importedCount, updatedCount, total: this.localCache.students.length };
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

  // --- Course Operations ---
  async getCourses() {
    await this.initPromise;
    return this.localCache.courses || [];
  }

  async publishCourse(courseData) {
    await this.initPromise;
    const newCourse = {
      id: 'crs_' + Date.now(),
      status: 'Published',
      assignedStudents: 150,
      completionPercentage: 0,
      createdAt: new Date().toISOString().split('T')[0],
      ...courseData
    };
    this.localCache.courses.push(newCourse);
    await this.save();
    return newCourse;
  }

  // --- Mock Test Operations ---
  async getMockTests() {
    await this.initPromise;
    return this.localCache.mockTests || [];
  }

  async publishMockTest(testData) {
    await this.initPromise;
    const newTest = {
      id: 'mkt_' + Date.now(),
      status: 'Active',
      attemptsCount: 0,
      avgScore: 0,
      createdAt: new Date().toISOString().split('T')[0],
      ...testData
    };
    this.localCache.mockTests.push(newTest);
    await this.save();
    return newTest;
  }

  // --- Job & Drive operations ---
  async getJobs() {
    await this.initPromise;
    return this.localCache.jobs || [];
  }

  async getDrives() {
    await this.initPromise;
    return this.localCache.drives || [];
  }

  async createPlacementDrive(driveData) {
    await this.initPromise;
    const newJob = {
      id: 'job_' + Date.now(),
      logo: (driveData.company || 'COMP').substring(0, 3).toUpperCase(),
      applicants: [],
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      ...driveData
    };
    this.localCache.jobs.push(newJob);

    const newDrive = {
      id: 'drv_' + Date.now(),
      company: driveData.company,
      role: driveData.role,
      package: driveData.ctc,
      status: 'Scheduled',
      date: driveData.deadline || new Date().toISOString().split('T')[0],
      dept: 'Engineering'
    };
    this.localCache.drives.push(newDrive);

    await this.save();
    return { job: newJob, drive: newDrive };
  }

  async calculateEligibleStudents(criteria) {
    await this.initPromise;
    const students = this.localCache.students || [];
    const minCgpa = parseFloat(criteria.cgpa) || 0;
    const maxBacklogs = parseInt(criteria.backlogs, 10) || 0;

    const eligible = students.filter(s => {
      const cgpaOk = (s.cgpa || 0) >= minCgpa;
      const backlogsOk = (s.backlogs || 0) <= maxBacklogs;
      const branchOk = !criteria.branches || criteria.branches.length === 0 || criteria.branches.includes(s.branch) || criteria.branches.includes('Entire Institute');
      return cgpaOk && backlogsOk && branchOk;
    });

    return eligible;
  }

  // --- Applications Operations ---
  async getApplications() {
    await this.initPromise;
    return this.localCache.applications || [];
  }

  async updateApplicationStatus(appId, newStatus) {
    await this.initPromise;
    const appIndex = this.localCache.applications.findIndex(a => a.id === appId);
    if (appIndex !== -1) {
      const app = this.localCache.applications[appIndex];
      app.status = newStatus;
      app.stageHistory = app.stageHistory || [];
      app.stageHistory.push({ stage: newStatus, date: new Date().toISOString().split('T')[0] });

      // Update student's applied jobs list & stage
      const studentIndex = this.localCache.students.findIndex(s => s.id === app.studentId);
      if (studentIndex !== -1) {
        const student = this.localCache.students[studentIndex];
        const studentApp = (student.appliedJobs || []).find(j => j.jobId === app.jobId);
        if (studentApp) studentApp.status = newStatus;

        if (newStatus === 'Selected') {
          student.stage = 'Placed';
        } else if (newStatus === 'Interview Scheduled') {
          student.stage = 'Interview Scheduled';
        } else if (newStatus === 'Shortlisted') {
          student.stage = 'Shortlisted';
        }
      }

      await this.save();
      return app;
    }
    return null;
  }

  // --- Company CRM Operations ---
  async getCompanies() {
    await this.initPromise;
    return this.localCache.companies || [];
  }

  async saveCompany(companyData) {
    await this.initPromise;
    const existingIndex = this.localCache.companies.findIndex(c => c.id === companyData.id);
    let company;
    if (existingIndex !== -1) {
      company = { ...this.localCache.companies[existingIndex], ...companyData };
      this.localCache.companies[existingIndex] = company;
    } else {
      company = {
        id: 'comp_' + Date.now(),
        avatar: (companyData.name || 'CP').substring(0, 2).toUpperCase(),
        status: 'Connected',
        relationshipScore: 85,
        scoreTier: 'Green',
        tierLabel: 'Excellent Partner',
        drivesConducted: 1,
        studentsHired: 5,
        avgPackage: '₹8.0 LPA',
        hrContacts: [],
        recruitmentHistory: [],
        timeline: [{ title: 'Company Profile Created', date: new Date().toISOString().split('T')[0], type: 'created', note: 'Created via Institute HQ.' }],
        ...companyData
      };
      this.localCache.companies.push(company);
    }
    await this.save();
    return company;
  }

  // --- Startups & Mentors Operations ---
  async getStartups() {
    await this.initPromise;
    return this.localCache.startups || [];
  }

  async updateStartupStatus(id, approvalStatus, commentText = null, assignedMentorId = null) {
    await this.initPromise;
    const index = this.localCache.startups.findIndex(s => s.id === id);
    if (index !== -1) {
      const startup = this.localCache.startups[index];
      if (approvalStatus) startup.approvalStatus = approvalStatus;

      if (assignedMentorId) {
        const mentor = (this.localCache.mentors || []).find(m => m.id === assignedMentorId);
        if (mentor) {
          startup.assignedMentorId = mentor.id;
          startup.assignedMentorName = mentor.name;
          if (!mentor.assignedStartups.includes(startup.name)) {
            mentor.assignedStartups.push(startup.name);
          }
        }
      }

      if (commentText) {
        startup.comments = startup.comments || [];
        startup.comments.push({
          id: 'c_' + Date.now(),
          author: 'Institute T&P Cell',
          role: 'Institute',
          text: commentText,
          date: new Date().toISOString().split('T')[0]
        });
      }

      await this.save();
      return startup;
    }
    return null;
  }

  async getMentors() {
    await this.initPromise;
    return this.localCache.mentors || [];
  }

  async createMentor(mentorData) {
    await this.initPromise;
    const newMentor = {
      id: 'mnt_' + Date.now(),
      assignedStartups: [],
      totalStartupsMentored: 0,
      successRate: '90%',
      studentRating: '5.0/5',
      activeSessions: 1,
      ...mentorData
    };
    this.localCache.mentors.push(newMentor);
    await this.save();
    return newMentor;
  }

  // --- Recruiter, Partnership, Mentorship & Announcements ---
  async getRecruiters() {
    await this.initPromise;
    return this.localCache.recruiters || [];
  }

  async getPartnerships() {
    await this.initPromise;
    return this.localCache.partnerships || [];
  }

  async getMentorshipPrograms() {
    await this.initPromise;
    return this.localCache.mentorshipPrograms || [];
  }

  async getAnnouncements() {
    await this.initPromise;
    return this.localCache.announcements || [];
  }

  async publishAnnouncement(ancData) {
    await this.initPromise;
    const newAnc = {
      id: 'anc_' + Date.now(),
      publishedDate: new Date().toISOString().split('T')[0],
      author: 'Head T&P Officer',
      ...ancData
    };
    this.localCache.announcements.push(newAnc);
    await this.save();
    return newAnc;
  }
}

// Instantiate global db manager
const db = new ElevateDatabase();
window.db = db;

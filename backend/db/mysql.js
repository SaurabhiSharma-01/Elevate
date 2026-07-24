/* ============================================================
   ELEVATE — MySQL Database Integration & Pool Manager
   ============================================================ */

'use strict';

const mysql = require('mysql2/promise');
const fs    = require('fs');
const path  = require('path');

const DB_FILE = path.join(__dirname, '../../database.json');

// Configuration from environment variables
const config = {
  host:            process.env.DB_HOST || 'localhost',
  port:            parseInt(process.env.DB_PORT || '3306', 10),
  user:            process.env.DB_USER || 'root',
  password:        process.env.DB_PASSWORD || '',
  database:        process.env.DB_NAME || 'elevate_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool = null;
let isConnected = false;

// ─── Initialize MySQL & Auto-Create Tables / Seed Data ───────────────────────
async function initMySQL() {
  try {
    // 1. Create Connection to MySQL Server without specifying DB to ensure DB exists
    const rootConn = await mysql.createConnection({
      host:     config.host,
      port:     config.port,
      user:     config.user,
      password: config.password,
    });

    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await rootConn.end();

    // 2. Create Pool with Target DB
    pool = mysql.createPool(config);
    
    // Test Connection
    const connection = await pool.getConnection();
    console.log(`[MySQL] Connected successfully to host '${config.host}' on port ${config.port}, database: '${config.database}'`);
    connection.release();

    isConnected = true;

    // 3. Create Tables
    await createTables();

    // 4. Seed Data if Tables are Empty
    await seedInitialData();

    return true;
  } catch (err) {
    console.warn(`[MySQL] Connection warning: ${err.message}`);
    console.warn(`[MySQL] Falling back to file-based database store (${DB_FILE}). Set DB_HOST & credentials in .env to connect to MySQL.`);
    isConnected = false;
    return false;
  }
}

// ─── Create Database Tables ──────────────────────────────────────────────────
async function createTables() {
  if (!pool) return;

  const tables = [
    `CREATE TABLE IF NOT EXISTS students (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL,
      dept VARCHAR(100) DEFAULT '',
      branch VARCHAR(100) DEFAULT '',
      semester VARCHAR(50) DEFAULT '',
      passingYear INT DEFAULT 2028,
      cgpa FLOAT DEFAULT 0,
      readiness INT DEFAULT 0,
      rank_val VARCHAR(50) DEFAULT '--',
      targetCompany VARCHAR(150) DEFAULT '--',
      resumeVerified VARCHAR(50) DEFAULT 'Pending',
      resumeText TEXT,
      coursesCompleted INT DEFAULT 0,
      todayHours FLOAT DEFAULT 0,
      mockTestsCompleted INT DEFAULT 0,
      weakSkills JSON,
      appliedJobs JSON,
      interviewHistory JSON,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS tnp_officers (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      passwordHash VARCHAR(255) NOT NULL,
      college VARCHAR(150) DEFAULT 'Raisoni College',
      role VARCHAR(50) DEFAULT 'tnp',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS student_accounts (
      prn VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL,
      dob VARCHAR(50),
      passingYear VARCHAR(50),
      passwordHash VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'student',
      firstLogin BOOLEAN DEFAULT TRUE,
      importedBy VARCHAR(50) DEFAULT 'system',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      lastLogin DATETIME NULL
    );`,

    `CREATE TABLE IF NOT EXISTS company_accounts (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      passwordHash VARCHAR(255) NOT NULL,
      industry VARCHAR(150) DEFAULT '',
      contactPerson VARCHAR(150) DEFAULT '',
      role VARCHAR(50) DEFAULT 'company',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS jobs (
      id VARCHAR(50) PRIMARY KEY,
      company VARCHAR(150) NOT NULL,
      logo VARCHAR(50) DEFAULT 'COMP',
      role VARCHAR(150) NOT NULL,
      type VARCHAR(50) DEFAULT 'Full Time',
      ctc VARCHAR(50) NOT NULL,
      location VARCHAR(150) DEFAULT '',
      description TEXT,
      eligibility JSON,
      applicants JSON,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS drives (
      id VARCHAR(50) PRIMARY KEY,
      company VARCHAR(150) NOT NULL,
      date VARCHAR(50) NOT NULL,
      status VARCHAR(50) DEFAULT 'Scheduled',
      dept VARCHAR(100) DEFAULT 'Engineering',
      minCgpa FLOAT DEFAULT 6.0,
      role VARCHAR(150) DEFAULT '',
      ctc VARCHAR(50) DEFAULT '',
      description TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS companies (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      industry VARCHAR(150) DEFAULT '',
      contact VARCHAR(150) DEFAULT '',
      status VARCHAR(50) DEFAULT 'Pending',
      avatar VARCHAR(50) DEFAULT 'CO',
      previousVisits INT DEFAULT 0,
      connectionDate VARCHAR(50) NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS startups (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      tagline TEXT,
      category VARCHAR(100) DEFAULT 'General',
      problem TEXT,
      solution TEXT,
      upvotes INT DEFAULT 0,
      comments INT DEFAULT 0,
      team JSON,
      gradient VARCHAR(255) DEFAULT '',
      trending BOOLEAN DEFAULT FALSE,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS meetings (
      id VARCHAR(50) PRIMARY KEY,
      company VARCHAR(150) NOT NULL,
      companyId VARCHAR(50),
      type VARCHAR(100) DEFAULT 'Meeting',
      date VARCHAR(50) NOT NULL,
      time VARCHAR(50) DEFAULT '10:00',
      mode VARCHAR(50) DEFAULT 'online',
      link VARCHAR(255) DEFAULT '',
      venue VARCHAR(255) DEFAULT '',
      description TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS assessments (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      questions INT DEFAULT 20,
      duration INT DEFAULT 45,
      createdBy VARCHAR(150) DEFAULT 'College T&P',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );`
  ];

  for (const tableSql of tables) {
    await pool.query(tableSql);
  }
}

// ─── Seed Data From database.json ────────────────────────────────────────────
async function seedInitialData() {
  if (!pool || !isConnected) return;

  try {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM students');
    if (rows[0].count > 0) return; // Already seeded

    let initialData = {};
    if (fs.existsSync(DB_FILE)) {
      initialData = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }

    console.log('[MySQL] Tables are empty. Seeding initial data from database.json...');

    // 1. Students
    if (Array.isArray(initialData.students)) {
      for (const s of initialData.students) {
        await pool.query(
          `INSERT IGNORE INTO students (id, name, email, dept, branch, semester, passingYear, cgpa, readiness, rank_val, targetCompany, resumeVerified, resumeText, coursesCompleted, todayHours, mockTestsCompleted, weakSkills, appliedJobs, interviewHistory) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            s.id, s.name, s.email, s.dept || '', s.branch || '', s.semester || '', s.passingYear || 2028,
            s.cgpa || 0, s.readiness || 0, s.rank || '--', s.targetCompany || '--', s.resumeVerified || 'Pending',
            s.resumeText || '', s.coursesCompleted || 0, s.todayHours || 0, s.mockTestsCompleted || 0,
            JSON.stringify(s.weakSkills || []), JSON.stringify(s.appliedJobs || []), JSON.stringify(s.interviewHistory || [])
          ]
        );
      }
    }

    // 2. Jobs
    if (Array.isArray(initialData.jobs)) {
      for (const j of initialData.jobs) {
        await pool.query(
          `INSERT IGNORE INTO jobs (id, company, logo, role, type, ctc, location, description, eligibility, applicants) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            j.id, j.company, j.logo || 'COMP', j.role, j.type || 'Full Time', j.ctc, j.location || '',
            j.desc || j.description || '', JSON.stringify(j.eligibility || {}), JSON.stringify(j.applicants || [])
          ]
        );
      }
    }

    // 3. Drives
    if (Array.isArray(initialData.drives)) {
      for (const d of initialData.drives) {
        await pool.query(
          `INSERT IGNORE INTO drives (id, company, date, status, dept, minCgpa, role, ctc, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            d.id, d.company, d.date, d.status || 'Scheduled', d.dept || 'Engineering',
            d.minCgpa || 6.0, d.role || '', d.ctc || '', d.description || ''
          ]
        );
      }
    }

    // 4. Companies
    if (Array.isArray(initialData.companies)) {
      for (const c of initialData.companies) {
        await pool.query(
          `INSERT IGNORE INTO companies (id, name, industry, contact, status, avatar, previousVisits, connectionDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            c.id, c.name, c.industry || '', c.contact || '', c.status || 'Pending',
            c.avatar || 'CO', c.previousVisits || 0, c.connectionDate || null
          ]
        );
      }
    }

    // 5. Startups
    if (Array.isArray(initialData.startups)) {
      for (const st of initialData.startups) {
        await pool.query(
          `INSERT IGNORE INTO startups (id, name, tagline, category, problem, solution, upvotes, comments, team, gradient, trending) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            st.id, st.name, st.tagline || '', st.category || 'General', st.problem || '', st.solution || '',
            st.upvotes || 0, st.comments || 0, JSON.stringify(st.team || []), st.gradient || '', st.trending || false
          ]
        );
      }
    }

    // 6. Meetings
    if (Array.isArray(initialData.meetings)) {
      for (const m of initialData.meetings) {
        await pool.query(
          `INSERT IGNORE INTO meetings (id, company, companyId, type, date, time, mode, link, venue, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            m.id, m.company, m.companyId || null, m.type || 'Meeting', m.date, m.time || '10:00',
            m.mode || 'online', m.link || '', m.venue || '', m.description || ''
          ]
        );
      }
    }

    // 7. T&P Officers
    if (Array.isArray(initialData.tnpOfficers)) {
      for (const o of initialData.tnpOfficers) {
        await pool.query(
          `INSERT IGNORE INTO tnp_officers (id, name, email, passwordHash, college, role, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [o.id, o.name, o.email, o.passwordHash, o.college || 'Raisoni College', o.role || 'tnp', o.createdAt || new Date()]
        );
      }
    }

    // 8. Student Accounts
    if (Array.isArray(initialData.studentAccounts)) {
      for (const sa of initialData.studentAccounts) {
        await pool.query(
          `INSERT IGNORE INTO student_accounts (prn, name, email, dob, passingYear, passwordHash, role, firstLogin, importedBy, createdAt, lastLogin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            sa.prn, sa.name, sa.email, sa.dob || '', sa.passingYear || '', sa.passwordHash,
            sa.role || 'student', sa.firstLogin ?? true, sa.importedBy || 'system', sa.createdAt || new Date(), sa.lastLogin || null
          ]
        );
      }
    }

    // 9. Company Accounts
    if (Array.isArray(initialData.companyAccounts)) {
      for (const ca of initialData.companyAccounts) {
        await pool.query(
          `INSERT IGNORE INTO company_accounts (id, name, email, passwordHash, industry, contactPerson, role, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            ca.id, ca.name, ca.email, ca.passwordHash, ca.industry || '', ca.contactPerson || '',
            ca.role || 'company', ca.createdAt || new Date()
          ]
        );
      }
    }

    console.log('[MySQL] Seeding completed successfully!');
  } catch (err) {
    console.error('[MySQL] Seeding error:', err.message);
  }
}

// Helper Query Execution
async function query(sql, params = []) {
  if (!pool || !isConnected) return null;
  const [rows] = await pool.query(sql, params);
  return rows;
}

// ─── Export Full DB Representation for Endpoints ──────────────────────────────
async function getFullDB() {
  if (!pool || !isConnected) return null;

  try {
    const [students]        = await pool.query('SELECT * FROM students');
    const [jobs]            = await pool.query('SELECT * FROM jobs');
    const [drives]          = await pool.query('SELECT * FROM drives');
    const [companies]       = await pool.query('SELECT * FROM companies');
    const [startups]        = await pool.query('SELECT * FROM startups');
    const [meetings]        = await pool.query('SELECT * FROM meetings');
    const [assessments]     = await pool.query('SELECT * FROM assessments');
    const [tnpOfficers]     = await pool.query('SELECT * FROM tnp_officers');
    const [studentAccounts] = await pool.query('SELECT * FROM student_accounts');
    const [companyAccounts] = await pool.query('SELECT * FROM company_accounts');

    // Parse JSON columns
    const parsedStudents = students.map(s => ({
      ...s,
      rank: s.rank_val || s.rank || '--',
      weakSkills: typeof s.weakSkills === 'string' ? JSON.parse(s.weakSkills) : s.weakSkills || [],
      appliedJobs: typeof s.appliedJobs === 'string' ? JSON.parse(s.appliedJobs) : s.appliedJobs || [],
      interviewHistory: typeof s.interviewHistory === 'string' ? JSON.parse(s.interviewHistory) : s.interviewHistory || []
    }));

    const parsedJobs = jobs.map(j => ({
      ...j,
      desc: j.description || j.desc || '',
      eligibility: typeof j.eligibility === 'string' ? JSON.parse(j.eligibility) : j.eligibility || {},
      applicants: typeof j.applicants === 'string' ? JSON.parse(j.applicants) : j.applicants || []
    }));

    const parsedStartups = startups.map(st => ({
      ...st,
      team: typeof st.team === 'string' ? JSON.parse(st.team) : st.team || []
    }));

    return {
      students: parsedStudents,
      jobs: parsedJobs,
      drives,
      companies,
      startups: parsedStartups,
      meetings,
      assessments,
      tnpOfficers,
      studentAccounts,
      companyAccounts
    };
  } catch (err) {
    console.error('[MySQL] Error building full DB representation:', err.message);
    return null;
  }
}

module.exports = {
  pool,
  initMySQL,
  query,
  getFullDB,
  isMySQLConnected: () => isConnected,
};

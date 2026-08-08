/* ============================================================
   ELEVATE — Auth Routes
   All authentication endpoints for T&P, Student, and Company
   Mounted at: /api/auth/
   ============================================================ */

'use strict';

const express  = require('express');
const multer   = require('multer');
const path     = require('path');
const fs       = require('fs');
const { v4: uuidv4 } = require('uuid');

const {
  hashPassword,
  verifyPassword,
  generateStudentPassword,
  generateToken,
  requireAuth,
  requireRole,
  isValidTnpEmail,
} = require('./auth-utils');

const { sendStudentCredentials } = require('./email-service');
const { isMySQLConnected, query } = require('../db/mysql');

const router = express.Router();

// ─── DB Path ──────────────────────────────────────────────────────────────────

const DB_FILE = path.join(__dirname, '../../data/database.json');

function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function writeDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}

// Ensure auth collections exist
function ensureCollections(db) {
  if (!db.tnpOfficers)     db.tnpOfficers     = [];
  if (!db.studentAccounts) db.studentAccounts  = [];
  if (!db.companyAccounts) db.companyAccounts  = [];
  return db;
}

// ─── Multer (CSV upload) ──────────────────────────────────────────────────────

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are accepted.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

// ─── CSV Parser ───────────────────────────────────────────────────────────────

function parseCSV(buffer) {
  const text   = buffer.toString('utf8');
  const lines  = text.split(/\r?\n/).filter(l => l.trim() !== '');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''));

  return lines.slice(1).map(line => {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === ',' && !inQuotes) { values.push(current.trim()); current = ''; continue; }
      current += ch;
    }
    values.push(current.trim());

    const obj = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ''; });
    return obj;
  });
}

function extractField(row, ...keys) {
  for (const key of keys) {
    const k = key.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    if (row[k] !== undefined && row[k] !== '') return row[k];
  }
  return '';
}

// ─── T&P OFFICER — Register ───────────────────────────────────────────────────

router.post('/tnp/register', async (req, res) => {
  try {
    const { name, email, password, college } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    if (!isValidTnpEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Only official @raisoni.net email addresses are allowed to register as T&P Officers.',
      });
    }

    const passwordHash = await hashPassword(password);
    const officer = {
      id:           uuidv4(),
      name:         name.trim(),
      email:        email.toLowerCase().trim(),
      passwordHash,
      college:      college || 'Raisoni College',
      role:         'tnp',
      createdAt:    new Date().toISOString(),
    };

    if (isMySQLConnected()) {
      const existing = await query('SELECT * FROM tnp_officers WHERE LOWER(email) = ?', [email.toLowerCase().trim()]);
      if (existing && existing.length > 0) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      }
      await query(
        'INSERT INTO tnp_officers (id, name, email, passwordHash, college, role, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [officer.id, officer.name, officer.email, officer.passwordHash, officer.college, officer.role, officer.createdAt]
      );
    }

    // Sync local DB file
    const db = ensureCollections(readDB());
    const exists = db.tnpOfficers.find(o => o.email.toLowerCase() === email.toLowerCase());
    if (!isMySQLConnected() && exists) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }
    if (!exists) db.tnpOfficers.push(officer);
    writeDB(db);

    const token = generateToken({ id: officer.id, role: 'tnp', email: officer.email, name: officer.name });
    const { passwordHash: _, ...safeOfficer } = officer;
    res.status(201).json({ success: true, token, user: safeOfficer });
  } catch (err) {
    console.error('[Auth] T&P register error:', err);
    res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
});

// ─── T&P OFFICER — Login ──────────────────────────────────────────────────────

router.post('/tnp/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    if (!isValidTnpEmail(email)) {
      return res.status(400).json({ success: false, message: 'Only @raisoni.net accounts can use this login.' });
    }

    let officer = null;
    if (isMySQLConnected()) {
      const rows = await query('SELECT * FROM tnp_officers WHERE LOWER(email) = ?', [email.toLowerCase().trim()]);
      if (rows && rows.length > 0) officer = rows[0];
    }

    if (!officer) {
      const db = ensureCollections(readDB());
      officer = db.tnpOfficers.find(o => o.email.toLowerCase() === email.toLowerCase());
    }

    if (!officer) {
      return res.status(401).json({ success: false, message: 'No T&P Officer account found with this email.' });
    }

    const valid = await verifyPassword(password, officer.passwordHash);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
    }

    const token = generateToken({ id: officer.id, role: 'tnp', email: officer.email, name: officer.name });
    const { passwordHash: _, ...safeOfficer } = officer;

    res.json({ success: true, token, user: safeOfficer, redirect: '/institute/' });
  } catch (err) {
    console.error('[Auth] T&P login error:', err);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
});

// ─── STUDENT — Login ──────────────────────────────────────────────────────────

router.post('/student/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username (PRN) and password are required.' });
    }

    let account = null;
    if (isMySQLConnected()) {
      const rows = await query('SELECT * FROM student_accounts WHERE LOWER(prn) = ?', [username.toLowerCase().trim()]);
      if (rows && rows.length > 0) account = rows[0];
    }

    if (!account) {
      const db = ensureCollections(readDB());
      account = db.studentAccounts.find(
        s => s.prn.toLowerCase() === username.toLowerCase().trim()
      );
    }

    if (!account) {
      return res.status(401).json({
        success: false,
        message: 'No student account found with this PRN. Contact your T&P office.',
      });
    }

    const valid = await verifyPassword(password, account.passwordHash);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
    }

    const token = generateToken({
      id:   account.prn,
      role: 'student',
      prn:  account.prn,
      name: account.name,
    });

    const now = new Date().toISOString();
    if (isMySQLConnected()) {
      await query('UPDATE student_accounts SET lastLogin = ? WHERE prn = ?', [now, account.prn]);
    }

    const db = ensureCollections(readDB());
    const idx = db.studentAccounts.findIndex(s => s.prn === account.prn);
    if (idx !== -1) db.studentAccounts[idx].lastLogin = now;
    writeDB(db);

    const { passwordHash: _, ...safeAccount } = account;
    res.json({ success: true, token, user: safeAccount, redirect: '/student/' });
  } catch (err) {
    console.error('[Auth] Student login error:', err);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
});

// ─── COMPANY — Register ───────────────────────────────────────────────────────

router.post('/company/register', async (req, res) => {
  try {
    const { companyName, email, password, industry, contactPerson } = req.body;

    if (!companyName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Company name, email, and password are required.' });
    }

    const passwordHash = await hashPassword(password);
    const company = {
      id:            uuidv4(),
      name:          companyName.trim(),
      email:         email.toLowerCase().trim(),
      passwordHash,
      industry:      industry || '',
      contactPerson: contactPerson || '',
      role:          'company',
      createdAt:     new Date().toISOString(),
    };

    if (isMySQLConnected()) {
      const existing = await query('SELECT * FROM company_accounts WHERE LOWER(email) = ?', [email.toLowerCase().trim()]);
      if (existing && existing.length > 0) {
        return res.status(409).json({ success: false, message: 'A company account with this email already exists.' });
      }
      await query(
        'INSERT INTO company_accounts (id, name, email, passwordHash, industry, contactPerson, role, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [company.id, company.name, company.email, company.passwordHash, company.industry, company.contactPerson, company.role, company.createdAt]
      );
    }

    const db = ensureCollections(readDB());
    const exists = db.companyAccounts.find(c => c.email.toLowerCase() === email.toLowerCase());
    if (!isMySQLConnected() && exists) {
      return res.status(409).json({ success: false, message: 'A company account with this email already exists.' });
    }
    if (!exists) db.companyAccounts.push(company);
    writeDB(db);

    const token = generateToken({ id: company.id, role: 'company', email: company.email, name: company.name });
    const { passwordHash: _, ...safeCompany } = company;

    res.status(201).json({ success: true, token, user: safeCompany });
  } catch (err) {
    console.error('[Auth] Company register error:', err);
    res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
});

// ─── COMPANY — Login ──────────────────────────────────────────────────────────

router.post('/company/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    let company = null;
    if (isMySQLConnected()) {
      const rows = await query('SELECT * FROM company_accounts WHERE LOWER(email) = ?', [email.toLowerCase().trim()]);
      if (rows && rows.length > 0) company = rows[0];
    }

    if (!company) {
      const db = ensureCollections(readDB());
      company = db.companyAccounts.find(c => c.email.toLowerCase() === email.toLowerCase());
    }

    if (!company) {
      return res.status(401).json({ success: false, message: 'No company account found with this email. Please register first.' });
    }

    const valid = await verifyPassword(password, company.passwordHash);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Incorrect password.' });
    }

    const token = generateToken({ id: company.id, role: 'company', email: company.email, name: company.name });
    const { passwordHash: _, ...safeCompany } = company;

    res.json({ success: true, token, user: safeCompany, redirect: '/industry/' });
  } catch (err) {
    console.error('[Auth] Company login error:', err);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
});

// ─── IMPORT STUDENTS (T&P only) ───────────────────────────────────────────────

router.post('/import-students', requireAuth, requireRole('tnp'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a CSV file.' });
    }

    const rows = parseCSV(req.file.buffer);
    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: 'CSV file is empty or has no data rows.' });
    }

    const db = ensureCollections(readDB());
    const results = { imported: [], skipped: [], errors: [] };

    for (const row of rows) {
      const prn         = extractField(row, 'prn', 'registration_number', 'registration number', 'reg_no', 'roll_no');
      const name        = extractField(row, 'name', 'student_name', 'full_name', 'full name');
      const email       = extractField(row, 'email', 'email_address', 'student_email');
      const dob         = extractField(row, 'dob', 'date_of_birth', 'birth_date', 'birthdate');
      const passingYear = extractField(row, 'passing_year', 'passing year', 'year', 'graduation_year');

      if (!prn || !name || !email) {
        results.errors.push({ row, reason: 'Missing required fields (PRN, Name, or Email).' });
        continue;
      }

      let alreadyExists = false;
      if (isMySQLConnected()) {
        const existing = await query('SELECT * FROM student_accounts WHERE LOWER(prn) = ?', [prn.toLowerCase().trim()]);
        if (existing && existing.length > 0) alreadyExists = true;
      }
      if (!alreadyExists) {
        alreadyExists = Boolean(db.studentAccounts.find(s => s.prn.toLowerCase() === prn.toLowerCase().trim()));
      }

      if (alreadyExists) {
        results.skipped.push({ prn, name, reason: 'Already exists in system.' });
        continue;
      }

      const plainPassword = generateStudentPassword(name, passingYear || new Date().getFullYear());
      const passwordHash  = await hashPassword(plainPassword);

      const account = {
        prn:          prn.trim(),
        name:         name.trim(),
        email:        email.toLowerCase().trim(),
        dob:          dob,
        passingYear:  passingYear,
        passwordHash,
        role:         'student',
        firstLogin:   true,
        importedBy:   req.user.id,
        createdAt:    new Date().toISOString(),
        lastLogin:    null,
      };

      if (isMySQLConnected()) {
        await query(
          'INSERT INTO student_accounts (prn, name, email, dob, passingYear, passwordHash, role, firstLogin, importedBy, createdAt, lastLogin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [account.prn, account.name, account.email, account.dob, account.passingYear, account.passwordHash, account.role, account.firstLogin, account.importedBy, account.createdAt, account.lastLogin]
        );

        await query(
          'INSERT IGNORE INTO students (id, name, email, passingYear) VALUES (?, ?, ?, ?)',
          [account.prn, account.name, account.email, account.passingYear || 2028]
        );
      }

      db.studentAccounts.push(account);

      const existingStudentIdx = db.students
        ? db.students.findIndex(s => (s.id || '').toLowerCase() === prn.toLowerCase())
        : -1;

      if (existingStudentIdx === -1) {
        if (!db.students) db.students = [];
        db.students.push({
          id:               prn.trim(),
          name:             name.trim(),
          email:            email.toLowerCase().trim(),
          dob:              dob,
          passingYear:      passingYear,
          cgpa:             0,
          readiness:        0,
          rank:             db.students.length + 1,
          dept:             '',
          branch:           '',
          semester:         '',
          targetCompany:    '',
          resumeVerified:   'Pending',
          resumeText:       '',
          coursesCompleted: 0,
          todayHours:       0,
          mockTestsCompleted: 0,
          weakSkills:       [],
          appliedJobs:      [],
          interviewHistory: [],
        });
      }

      sendStudentCredentials({ name, email }, prn.trim(), plainPassword)
        .catch(err => console.error('[Auth] Email error for', email, err.message));

      results.imported.push({ prn, name, email });
    }

    writeDB(db);

    res.json({
      success: true,
      message: `Import complete. ${results.imported.length} students added, ${results.skipped.length} skipped, ${results.errors.length} errors.`,
      results,
    });
  } catch (err) {
    console.error('[Auth] Import error:', err);
    res.status(500).json({ success: false, message: 'Import failed: ' + err.message });
  }
});

// ─── DATA/USERS.JSON STORAGE HELPERS ──────────────────────────────────────────

const USERS_FILE = path.join(__dirname, '../../data/users.json');

function readUsersDB() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } catch {
    return { admins: [], tnp_staff: [], incubation_staff: [], faculty: [], students: [] };
  }
}

function writeUsersDB(data) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// ─── UNIFIED RBAC LOGIN ───────────────────────────────────────────────────────

router.post('/login', async (req, res) => {
  try {
    const { identifier, password, portalType, role: requestedRole } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Identifier and password are required.' });
    }

    const usersData = readUsersDB();
    const allUsers = [
      ...(usersData.admins || []),
      ...(usersData.tnp_staff || []),
      ...(usersData.incubation_staff || []),
      ...(usersData.faculty || []),
      ...(usersData.students || [])
    ];

    const cleanId = identifier.trim().toLowerCase();
    let foundUser = allUsers.find(u =>
      (u.email && u.email.toLowerCase() === cleanId) ||
      (u.prn && u.prn.toLowerCase() === cleanId) ||
      (u.id && u.id.toLowerCase() === cleanId)
    );

    if (requestedRole && foundUser && foundUser.role !== requestedRole) {
      const matchRoleUser = allUsers.find(u =>
        ((u.email && u.email.toLowerCase() === cleanId) || (u.prn && u.prn.toLowerCase() === cleanId) || (u.id && u.id.toLowerCase() === cleanId)) &&
        u.role === requestedRole
      );
      if (matchRoleUser) foundUser = matchRoleUser;
    }

    // Fallback: search existing studentAccounts / tnpOfficers / companyAccounts in database.json if not in users.json
    if (!foundUser) {
      const db = readDB();
      if (db.studentAccounts) {
        const sa = db.studentAccounts.find(s => (s.prn && s.prn.toLowerCase() === cleanId) || (s.email && s.email.toLowerCase() === cleanId));
        if (sa) {
          foundUser = {
            id: sa.prn,
            prn: sa.prn,
            name: sa.name,
            email: sa.email,
            password: sa.passwordHash,
            role: 'STUDENT',
            yearOfStudy: sa.yearOfStudy || 'Final',
            department: sa.department || 'CSE'
          };
        }
      }
      if (!foundUser && db.tnpOfficers) {
        const tnp = db.tnpOfficers.find(t => t.email && t.email.toLowerCase() === cleanId);
        if (tnp) {
          foundUser = {
            id: tnp.id,
            name: tnp.name,
            email: tnp.email,
            password: tnp.passwordHash,
            role: 'TNP_ADMIN'
          };
        }
      }
      if (!foundUser && db.companyAccounts) {
        const comp = db.companyAccounts.find(c => c.email && c.email.toLowerCase() === cleanId);
        if (comp) {
          foundUser = {
            id: comp.id,
            name: comp.name,
            email: comp.email,
            password: comp.passwordHash,
            role: 'COMPANY'
          };
        }
      }
    }

    if (!foundUser) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const passwordHash = foundUser.password || foundUser.passwordHash;
    const isValid = await verifyPassword(password, passwordHash);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
    }

    const payload = {
      userId: foundUser.id || foundUser.prn,
      id: foundUser.id || foundUser.prn,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
      subRole: foundUser.subRole || foundUser.yearOfStudy || null,
      yearOfStudy: foundUser.yearOfStudy || (foundUser.role === 'STUDENT' ? 'Final' : null),
      portalType: portalType || (foundUser.role === 'STUDENT' ? 'student' : foundUser.role === 'COMPANY' ? 'industry' : 'institute')
    };

    const token = generateToken(payload);
    const { password: _, passwordHash: __, ...safeUser } = foundUser;

    let redirectUrl = '/institute/';
    if (payload.role === 'STUDENT') redirectUrl = '/student/';
    else if (payload.role === 'COMPANY' || payload.role === 'company') redirectUrl = '/industry/';

    res.json({
      success: true,
      token,
      user: safeUser,
      role: payload.role,
      subRole: payload.subRole,
      yearOfStudy: payload.yearOfStudy,
      redirect: redirectUrl
    });
  } catch (err) {
    console.error('[Auth] Login error:', err);
    res.status(500).json({ success: false, message: 'Login failed: ' + err.message });
  }
});

// ─── T&P ADMIN — REGISTER STUDENT ─────────────────────────────────────────────

router.post('/register-student', requireAuth(['TNP_ADMIN', 'SUPER_ADMIN', 'tnp']), async (req, res) => {
  try {
    const { prn, name, email, password, yearOfStudy, department, cgpa } = req.body;
    if (!prn || !name || !email || !password || !yearOfStudy) {
      return res.status(400).json({ success: false, message: 'PRN, name, email, password, and yearOfStudy are required.' });
    }

    const validYears = ['FY', 'SY', 'TY', 'Final'];
    if (!validYears.includes(yearOfStudy)) {
      return res.status(400).json({ success: false, message: `yearOfStudy must be one of: ${validYears.join(', ')}` });
    }

    const usersData = readUsersDB();
    if (!usersData.students) usersData.students = [];

    const existing = usersData.students.find(s => s.prn.toLowerCase() === prn.toLowerCase().trim() || s.email.toLowerCase() === email.toLowerCase().trim());
    if (existing) {
      return res.status(409).json({ success: false, message: 'Student with this PRN or email already exists.' });
    }

    const passwordHash = await hashPassword(password);
    const newStudent = {
      id: `STU_${Date.now()}`,
      prn: prn.trim(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: passwordHash,
      role: 'STUDENT',
      yearOfStudy,
      department: department || 'CSE',
      cgpa: parseFloat(cgpa) || 7.0
    };

    usersData.students.push(newStudent);
    writeUsersDB(usersData);

    const { password: _, ...safeStudent } = newStudent;
    res.status(201).json({ success: true, message: 'Student registered successfully.', student: safeStudent });
  } catch (err) {
    console.error('[Auth] Register student error:', err);
    res.status(500).json({ success: false, message: 'Student registration failed: ' + err.message });
  }
});

// ─── VERIFY TOKEN — Current User ──────────────────────────────────────────────

router.get('/me', requireAuth(), async (req, res) => {
  const usersData = readUsersDB();
  const allUsers = [
    ...(usersData.admins || []),
    ...(usersData.tnp_staff || []),
    ...(usersData.incubation_staff || []),
    ...(usersData.faculty || []),
    ...(usersData.students || [])
  ];

  let user = allUsers.find(u => (u.id === req.user.userId || u.prn === req.user.userId || u.id === req.user.id || u.email === req.user.email));

  if (!user) {
    user = {
      id: req.user.userId || req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      yearOfStudy: req.user.yearOfStudy
    };
  }

  const { password: _, passwordHash: __, ...safeUser } = user;

  const permissions = {
    canRegisterStudents: ['TNP_ADMIN', 'SUPER_ADMIN'].includes(req.user.role),
    canManageLearningMaterials: ['TNP_ADMIN', 'SUPER_ADMIN', 'FACULTY'].includes(req.user.role),
    canManageHackathons: ['TNP_ADMIN', 'SUPER_ADMIN'].includes(req.user.role),
    canViewHackathons: true,
    canViewStartups: ['SUPER_ADMIN', 'INCUBATION_ADMIN', 'FACULTY'].includes(req.user.role),
    canViewStartupAnalytics: ['SUPER_ADMIN', 'TNP_ADMIN', 'INCUBATION_ADMIN', 'FACULTY'].includes(req.user.role),
    isFacultyViewOnly: req.user.role === 'FACULTY',
    canSubmitInternshipReport: req.user.role === 'STUDENT' && req.user.yearOfStudy === 'Final',
    canVerifyInternshipReport: ['TNP_ADMIN', 'SUPER_ADMIN'].includes(req.user.role)
  };

  res.json({
    success: true,
    user: safeUser,
    role: req.user.role,
    subRole: req.user.subRole || req.user.yearOfStudy || null,
    yearOfStudy: req.user.yearOfStudy || (req.user.role === 'STUDENT' ? 'Final' : null),
    permissions
  });
});

// ─── GET imported students list (T&P only) ────────────────────────────────────

router.get('/students', requireAuth(), async (req, res) => {
  const usersData = readUsersDB();
  const safeStudents = (usersData.students || []).map(({ password: _, ...s }) => s);
  res.json({ success: true, students: safeStudents, total: safeStudents.length });
});

module.exports = router;


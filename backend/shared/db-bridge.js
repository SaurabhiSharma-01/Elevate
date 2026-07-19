/* ============================================================
   ELEVATE AI ECOSYSTEM — Database Bridge
   Reads and writes to the shared database.json used by server.js
   All AI agents use this to access student data — never read
   database.json directly in agent code.
   ============================================================ */

'use strict';

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../database.json');
const AI_DATA_PATH = path.join(__dirname, '../../ai-data.json');

// ─── Core DB helpers ─────────────────────────────────────────────────────────

function readDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[DBBridge] Failed to read database.json:', err.message);
    return { students: [], jobs: [], drives: [], assessments: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[DBBridge] Failed to write database.json:', err.message);
    return false;
  }
}

// ─── AI-specific data store ───────────────────────────────────────────────────
// Keeps AI reports/history separate from the core DB to avoid polluting it

function readAIData() {
  try {
    if (!fs.existsSync(AI_DATA_PATH)) {
      const seed = { reports: {}, sessions: {}, testHistory: {}, roadmaps: {}, skillProfiles: {} };
      fs.writeFileSync(AI_DATA_PATH, JSON.stringify(seed, null, 2), 'utf8');
      return seed;
    }
    return JSON.parse(fs.readFileSync(AI_DATA_PATH, 'utf8'));
  } catch (err) {
    console.error('[DBBridge] Failed to read ai-data.json:', err.message);
    return { reports: {}, sessions: {}, testHistory: {}, roadmaps: {}, skillProfiles: {} };
  }
}

function writeAIData(data) {
  try {
    fs.writeFileSync(AI_DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[DBBridge] Failed to write ai-data.json:', err.message);
    return false;
  }
}

// ─── Student Operations ────────────────────────────────────────────────────────

/**
 * Get all students
 * @returns {Array} - Array of student objects
 */
function getStudents() {
  return readDB().students || [];
}

/**
 * Get a student by ID
 * @param {string} id - Student ID
 * @returns {object|null} - Student object or null
 */
function getStudent(id) {
  const db = readDB();
  return db.students.find(s => s.id === id) || null;
}

/**
 * Update a student record with a partial patch
 * @param {string} id - Student ID
 * @param {object} patch - Fields to update
 * @returns {object|null} - Updated student or null
 */
function updateStudent(id, patch) {
  const db = readDB();
  const idx = db.students.findIndex(s => s.id === id);
  if (idx === -1) return null;
  db.students[idx] = { ...db.students[idx], ...patch };
  writeDB(db);
  return db.students[idx];
}

// ─── AI Report Operations ─────────────────────────────────────────────────────

/**
 * Save an AI-generated report for a student
 * @param {string} studentId
 * @param {string} reportType - e.g. 'skillAnalysis', 'placementReadiness', 'resumeReview'
 * @param {object} data - Report data
 */
function saveAIReport(studentId, reportType, data) {
  const aiData = readAIData();
  if (!aiData.reports[studentId]) aiData.reports[studentId] = {};
  aiData.reports[studentId][reportType] = {
    ...data,
    generatedAt: new Date().toISOString(),
  };
  writeAIData(aiData);
}

/**
 * Get the latest AI report for a student
 * @param {string} studentId
 * @param {string} reportType
 * @returns {object|null}
 */
function getAIReport(studentId, reportType) {
  const aiData = readAIData();
  return aiData.reports?.[studentId]?.[reportType] || null;
}

/**
 * Get all AI reports for a student
 * @param {string} studentId
 * @returns {object} - Map of reportType -> report
 */
function getAllAIReports(studentId) {
  const aiData = readAIData();
  return aiData.reports?.[studentId] || {};
}

// ─── Mock Test History ────────────────────────────────────────────────────────

/**
 * Save a completed mock test result
 * @param {string} studentId
 * @param {object} testResult - { testId, company, score, topicWise, timestamp }
 */
function saveTestResult(studentId, testResult) {
  const aiData = readAIData();
  if (!aiData.testHistory[studentId]) aiData.testHistory[studentId] = [];
  aiData.testHistory[studentId].push({
    ...testResult,
    savedAt: new Date().toISOString(),
  });
  writeAIData(aiData);
}

/**
 * Get all test results for a student
 * @param {string} studentId
 * @returns {Array}
 */
function getTestHistory(studentId) {
  const aiData = readAIData();
  return aiData.testHistory?.[studentId] || [];
}

// ─── Roadmap Storage ──────────────────────────────────────────────────────────

function saveRoadmap(studentId, roadmap) {
  const aiData = readAIData();
  aiData.roadmaps[studentId] = { ...roadmap, generatedAt: new Date().toISOString() };
  writeAIData(aiData);
}

function getRoadmap(studentId) {
  const aiData = readAIData();
  return aiData.roadmaps?.[studentId] || null;
}

// ─── Skill Profile Storage ────────────────────────────────────────────────────

function saveSkillProfile(studentId, profile) {
  const aiData = readAIData();
  aiData.skillProfiles[studentId] = { ...profile, generatedAt: new Date().toISOString() };
  writeAIData(aiData);
}

function getSkillProfile(studentId) {
  const aiData = readAIData();
  return aiData.skillProfiles?.[studentId] || null;
}

// ─── Interview Session Storage ────────────────────────────────────────────────

function saveInterviewSession(sessionId, sessionData) {
  const aiData = readAIData();
  if (!aiData.sessions) aiData.sessions = {};
  aiData.sessions[sessionId] = { ...sessionData, updatedAt: new Date().toISOString() };
  writeAIData(aiData);
}

function getInterviewSession(sessionId) {
  const aiData = readAIData();
  return aiData.sessions?.[sessionId] || null;
}

module.exports = {
  // Student
  getStudents,
  getStudent,
  updateStudent,
  // AI Reports
  saveAIReport,
  getAIReport,
  getAllAIReports,
  // Test History
  saveTestResult,
  getTestHistory,
  // Roadmap
  saveRoadmap,
  getRoadmap,
  // Skill Profile
  saveSkillProfile,
  getSkillProfile,
  // Interview Sessions
  saveInterviewSession,
  getInterviewSession,
};

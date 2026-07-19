/* ============================================================
   AGENT 1 — Skill Analysis AI
   Service Layer — Core business logic
   ============================================================ */

'use strict';

const { generateJSON } = require('../../shared/gemini-client');
const { getStudent, saveAIReport, saveSkillProfile } = require('../../shared/db-bridge');
const { bus, EVENTS } = require('../../shared/agent-bus');
const { buildSkillAnalysisPrompt } = require('./skill-analysis.prompts');

/**
 * Analyze a student's skills based on assessment answers and profile data.
 * This is the primary function of Agent 1.
 *
 * @param {string} studentId
 * @param {Array}  answers   - Array of { question, answer, isCorrect }
 * @param {string} department
 * @param {string} semester
 * @returns {Promise<object>} - Skill analysis report
 */
async function analyzeSkills(studentId, answers = [], department = '', semester = '') {
  // 1. Fetch student from DB
  const student = getStudent(studentId);
  if (!student) {
    throw Object.assign(new Error(`Student not found: ${studentId}`), { status: 404 });
  }

  // 2. Build prompt
  const prompt = buildSkillAnalysisPrompt(student, answers, department, semester);

  // 3. Call Gemini
  const fallback = {
    studentId,
    studentName: student.name,
    strengths: student.branch ? [`${student.branch} core concepts`] : ['Technical aptitude'],
    weaknesses: student.weakSkills || ['Aptitude', 'DSA'],
    knowledgeGaps: student.weakSkills || ['DSA', 'OS'],
    technicalSkillScore: Math.round(student.cgpa * 9),
    aptitudeScore: 60,
    communicationScore: 65,
    logicalReasoningScore: 65,
    overallSkillScore: Math.round(student.readiness || 65),
    skillProfile: {
      DSA: 'Intermediate',
      DBMS: 'Intermediate',
      OS: 'Beginner',
      Networks: 'Beginner',
      Aptitude: 'Intermediate',
      Communication: 'Intermediate',
      SystemDesign: 'Beginner'
    },
    improvementSuggestions: [
      'Practice DSA problems daily on LeetCode',
      'Revise Operating Systems fundamentals',
      'Improve verbal communication with mock GDs'
    ],
    priorityAreas: student.weakSkills?.slice(0, 2) || ['DSA', 'Aptitude'],
    estimatedReadinessLevel: (student.readiness || 0) >= 75 ? 'Almost Ready' : 'Partially Ready',
    summary: `${student.name} shows solid potential with a CGPA of ${student.cgpa}. Focus on bridging gaps in ${(student.weakSkills || []).slice(0, 2).join(' and ')} to accelerate placement readiness.`
  };

  const report = await generateJSON(prompt, { fallback });

  // 4. Save to AI data store
  saveAIReport(studentId, 'skillAnalysis', report);
  saveSkillProfile(studentId, report.skillProfile);

  // 5. Emit event so downstream agents can react
  bus.emit(EVENTS.SKILL_ANALYSIS_COMPLETE, { studentId, report });

  return report;
}

/**
 * Get the latest cached skill analysis for a student (no re-analysis)
 * @param {string} studentId
 * @returns {object|null}
 */
function getCachedSkillAnalysis(studentId) {
  const { getAIReport } = require('../../shared/db-bridge');
  return getAIReport(studentId, 'skillAnalysis');
}

module.exports = { analyzeSkills, getCachedSkillAnalysis };

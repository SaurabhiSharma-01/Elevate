/* ============================================================
   AGENT 2 — Placement Readiness AI
   Service Layer
   ============================================================ */

'use strict';

const { generateJSON } = require('../../shared/gemini-client');
const { getStudent, getAllAIReports, getTestHistory, saveAIReport, updateStudent } = require('../../shared/db-bridge');
const { bus, EVENTS } = require('../../shared/agent-bus');
const { buildReadinessPrompt } = require('./placement-readiness.prompts');

/**
 * Calculate the Placement Readiness Score for a student.
 * Aggregates data from Skill Analysis, Mock Tests, Interviews, and Resume AI.
 *
 * @param {string} studentId
 * @returns {Promise<object>} - Placement readiness report
 */
async function calculateReadiness(studentId) {
  const student = getStudent(studentId);
  if (!student) {
    throw Object.assign(new Error(`Student not found: ${studentId}`), { status: 404 });
  }

  const allReports = getAllAIReports(studentId);
  const testHistory = getTestHistory(studentId);

  const prompt = buildReadinessPrompt(student, allReports, testHistory);

  // Compute a baseline fallback score from available data
  const baseScore = computeBaselineScore(student, allReports, testHistory);

  const fallback = {
    studentId,
    studentName: student.name,
    placementReadinessScore: baseScore,
    hiringReadiness: baseScore >= 80 ? 'Highly Ready' : baseScore >= 65 ? 'Almost Ready' : baseScore >= 50 ? 'Partially Ready' : 'Not Ready',
    breakdown: {
      skillAssessment: { score: 70, weight: 25, weighted: 17.5 },
      mockTestPerformance: { score: Math.min(student.mockTestsCompleted * 5, 100), weight: 20, weighted: Math.min(student.mockTestsCompleted, 20) },
      courseCompletion: { score: Math.min(student.coursesCompleted * 8, 100), weight: 15, weighted: Math.min(student.coursesCompleted * 1.2, 15) },
      studyConsistency: { score: Math.min(student.todayHours * 30, 100), weight: 10, weighted: Math.min(student.todayHours * 3, 10) },
      interviewPerformance: { score: 60, weight: 15, weighted: 9 },
      resumeQuality: { score: student.resumeVerified === 'Verified' ? 80 : 40, weight: 10, weighted: student.resumeVerified === 'Verified' ? 8 : 4 },
      projectsCertifications: { score: 60, weight: 5, weighted: 3 }
    },
    strengths: [`${student.branch} background`, 'Consistent learning effort'],
    areasToImprove: student.weakSkills || ['Aptitude', 'DSA'],
    suggestions: [
      'Complete at least 2 more mock tests this week',
      `Focus on ${(student.weakSkills || ['DSA'])[0]} to boost your score`,
      'Get resume verified by T&P cell'
    ],
    targetCompanyReadiness: {
      company: student.targetCompany || 'TCS',
      readinessPercent: baseScore,
      verdict: baseScore >= 75 ? 'Ready' : baseScore >= 55 ? 'Need 2-4 weeks' : 'Need 1-2 months'
    },
    estimatedDaysToPlacementReady: Math.max(0, Math.round((80 - baseScore) * 1.5)),
    summary: `${student.name} has a placement readiness score of ${baseScore}/100. Consistent practice in ${(student.weakSkills || ['key areas'])[0]} will significantly improve prospects.`
  };

  const report = await generateJSON(prompt, { fallback });

  // Persist report
  saveAIReport(studentId, 'placementReadiness', report);

  // Sync score back to the main student record so the frontend sees updated readiness
  updateStudent(studentId, { readiness: report.placementReadinessScore });

  return report;
}

/**
 * Compute a baseline score using simple arithmetic (no AI)
 * Used as a fallback and sanity check
 */
function computeBaselineScore(student, allReports, testHistory) {
  let score = 0;

  // Skill assessment (25%)
  const skillReport = allReports.skillAnalysis;
  score += skillReport ? (skillReport.overallSkillScore / 100) * 25 : (student.cgpa / 10) * 25;

  // Mock test performance (20%)
  if (testHistory.length > 0) {
    const avgTestScore = testHistory.reduce((sum, t) => sum + (t.score || 0), 0) / testHistory.length;
    score += (avgTestScore / 100) * 20;
  } else {
    score += Math.min(student.mockTestsCompleted / 20, 1) * 20;
  }

  // Course completion (15%)
  score += Math.min(student.coursesCompleted / 15, 1) * 15;

  // Study consistency (10%)
  score += Math.min(student.todayHours / 4, 1) * 10;

  // Interview performance (15%)
  const interviews = student.interviewHistory || [];
  if (interviews.length > 0) {
    const avgInterviewScore = interviews.reduce((s, i) => s + (i.score || 0), 0) / interviews.length;
    score += (avgInterviewScore / 100) * 15;
  } else {
    score += 5; // base
  }

  // Resume quality (10%)
  score += student.resumeVerified === 'Verified' ? 10 : 4;

  // Projects/certifications (5%)
  score += 3; // base

  return Math.round(Math.min(score, 100));
}

/**
 * Get cached readiness report without recalculating
 */
function getCachedReadiness(studentId) {
  const { getAIReport } = require('../../shared/db-bridge');
  return getAIReport(studentId, 'placementReadiness');
}

// ─── Listen to agent bus events and auto-recalculate ─────────────────────────

bus.on(EVENTS.MOCK_TEST_COMPLETE, async ({ studentId }) => {
  try {
    console.log(`[PlacementReadiness] Auto-recalculating for student ${studentId} after mock test`);
    await calculateReadiness(studentId);
  } catch (e) {
    console.error('[PlacementReadiness] Auto-recalculation failed:', e.message);
  }
});

bus.on(EVENTS.INTERVIEW_ANALYSIS_COMPLETE, async ({ studentId }) => {
  try {
    console.log(`[PlacementReadiness] Auto-recalculating for student ${studentId} after interview analysis`);
    await calculateReadiness(studentId);
  } catch (e) {
    console.error('[PlacementReadiness] Auto-recalculation failed:', e.message);
  }
});

bus.on(EVENTS.RESUME_ANALYSIS_COMPLETE, async ({ studentId }) => {
  try {
    await calculateReadiness(studentId);
  } catch (e) {
    console.error('[PlacementReadiness] Auto-recalculation failed:', e.message);
  }
});

module.exports = { calculateReadiness, getCachedReadiness, computeBaselineScore };

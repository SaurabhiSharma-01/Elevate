/* ============================================================
   AGENT 6 — Progress Analytics AI — Service Layer
   ============================================================ */

'use strict';

const { generateJSON } = require('../../shared/gemini-client');
const { getStudent, getAllAIReports, getTestHistory, saveAIReport } = require('../../shared/db-bridge');
const { bus, EVENTS } = require('../../shared/agent-bus');
const { buildProgressPrompt } = require('./progress-analytics.prompts');

async function analyzeProgress(studentId) {
  const student = getStudent(studentId);
  if (!student) throw Object.assign(new Error(`Student not found: ${studentId}`), { status: 404 });

  const allReports = getAllAIReports(studentId);
  const testHistory = getTestHistory(studentId);
  const prompt = buildProgressPrompt(student, allReports, testHistory);

  const readinessScore = allReports.placementReadiness?.placementReadinessScore || student.readiness || 60;

  const fallback = {
    studentId,
    studentName: student.name,
    overallGrowthScore: readinessScore,
    consistencyScore: Math.min(student.todayHours * 25, 100),
    weeklyGrowthPercent: testHistory.length > 1
      ? ((testHistory[testHistory.length - 1]?.score || 0) - (testHistory[0]?.score || 0)).toFixed(1)
      : 0,
    studyStreak: Math.floor(student.todayHours * 3),
    insights: [
      `You have completed ${student.coursesCompleted} courses — keep the momentum!`,
      `${student.mockTestsCompleted} mock tests done. Target at least 20 before placement season.`,
      student.weakSkills?.[0] ? `${student.weakSkills[0]} needs more attention this week.` : 'Keep practicing consistently.',
      student.resumeVerified === 'Verified' ? 'Your resume is verified — great!' : 'Get your resume verified by T&P cell.'
    ],
    alerts: readinessScore < 60 ? ['Readiness score below 60. Increase practice intensity.'] : [],
    achievements: student.mockTestsCompleted >= 10 ? [{ badge: 'Mock Test Champion', description: '10+ mock tests completed', earnedAt: 'today' }] : [],
    trends: {
      testScores: testHistory.length >= 2 ? 'Improving' : 'Stable',
      studyHours: 'Consistent',
      skillGrowth: 'Moderate',
      interviewPerformance: (student.interviewHistory || []).length > 0 ? 'Improving' : 'No data yet'
    },
    performanceBreakdown: {
      dsa: 65,
      aptitude: 60,
      communication: 65,
      technicalKnowledge: Math.round(student.cgpa * 9),
      consistency: Math.min(student.todayHours * 25, 100)
    },
    nextMilestone: readinessScore < 75 ? 'Reach 75% placement readiness' : 'Complete a full company OA mock test',
    motivationalMessage: `Keep going, ${student.name}! You're making consistent progress toward your goal of joining ${student.targetCompany}.`,
    riskFlags: readinessScore < 50 ? ['Placement readiness is critically low — intensify preparation'] : [],
    summary: `${student.name} is progressing steadily with a readiness score of ${readinessScore}/100. ${student.coursesCompleted} courses completed and ${student.mockTestsCompleted} mock tests done.`
  };

  const analytics = await generateJSON(prompt, { fallback });
  saveAIReport(studentId, 'progressAnalytics', analytics);
  bus.emit(EVENTS.PROGRESS_UPDATED, { studentId, analytics });
  return analytics;
}

function getCachedProgress(studentId) {
  return getAIReport(studentId, 'progressAnalytics');
}

module.exports = { analyzeProgress, getCachedProgress };

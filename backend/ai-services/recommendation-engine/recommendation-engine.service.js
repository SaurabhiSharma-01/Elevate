/* ============================================================
   AGENT 4 — Learning Recommendation AI
   Service Layer
   ============================================================ */

'use strict';

const { generateJSON } = require('../../shared/gemini-client');
const { getStudent, getAIReport, getTestHistory, saveAIReport } = require('../../shared/db-bridge');
const { bus, EVENTS } = require('../../shared/agent-bus');
const { buildRecommendationPrompt } = require('./recommendation-engine.prompts');

async function getRecommendations(studentId) {
  const student = getStudent(studentId);
  if (!student) throw Object.assign(new Error(`Student not found: ${studentId}`), { status: 404 });

  const skillReport = getAIReport(studentId, 'skillAnalysis');
  const testHistory = getTestHistory(studentId);
  const prompt = buildRecommendationPrompt(student, skillReport, testHistory);

  const weakAreas = skillReport?.weaknesses || student.weakSkills || ['DSA'];

  const fallback = {
    studentId,
    studentName: student.name,
    generatedFor: student.targetCompany,
    courses: [
      { title: 'DSA Self-Paced', platform: 'GeeksforGeeks', url: 'https://practice.geeksforgeeks.org', topic: 'DSA', duration: '40 hours', priority: 'High', reason: 'Covers all core DSA topics needed for placements' },
      { title: 'DBMS Full Course', platform: 'YouTube (Gate Smashers)', url: 'https://youtube.com/@GateSmashersOfficial', topic: 'DBMS', duration: '12 hours', priority: 'Medium', reason: `${weakAreas.includes('DBMS') ? 'DBMS is one of your weak areas' : 'Core CS subject for all companies'}` }
    ],
    videos: [
      { title: 'Aptitude for Placements', channel: 'Unacademy', url: 'https://youtube.com/playlist?list=PLKkzGfxRapWUrDz0vpvJtFWBRcnXnN9aW', topic: 'Aptitude', duration: '2 hours', reason: 'Comprehensive aptitude prep' }
    ],
    codingChallenges: [
      { platform: 'LeetCode', topic: 'Arrays & Strings', difficulty: 'Easy', url: 'https://leetcode.com/problemset/', count: 15, reason: 'Build confidence before moving to harder problems' }
    ],
    aptitudeResources: [
      { title: 'IndiaBIX Aptitude', source: 'IndiaBIX', url: 'https://www.indiabix.com', topics: ['Number System', 'Ratio & Proportion', 'Time & Work'], reason: 'Best free aptitude resource for Indian placements' }
    ],
    communicationExercises: [
      { exercise: 'Speak for 2 minutes on a random topic daily', duration: '15 mins/day', platform: 'Self-practice', reason: 'Improves fluency and confidence' }
    ],
    mockTests: [
      { name: `${student.targetCompany || 'TCS'} Full Mock`, type: 'Company-OA', platform: 'PrepInsta', reason: 'Matches actual company test pattern' }
    ],
    resumeResources: [
      { title: 'ATS Resume Checker', url: 'https://resumeworded.com', reason: 'Check ATS compatibility instantly' }
    ],
    todayFocus: `Solve 5 ${weakAreas[0] || 'DSA'} problems on LeetCode`,
    weeklyGoal: `Complete ${weakAreas[0] || 'DSA'} basics and take one full mock test`
  };

  const recommendations = await generateJSON(prompt, { fallback });
  saveAIReport(studentId, 'recommendations', recommendations);
  return recommendations;
}

function getCachedRecommendations(studentId) {
  return getAIReport(studentId, 'recommendations');
}

// Auto-refresh recommendations when skills change
bus.on(EVENTS.SKILL_ANALYSIS_COMPLETE, async ({ studentId }) => {
  try { await getRecommendations(studentId); } catch (e) { console.error('[RecommendationEngine]', e.message); }
});
bus.on(EVENTS.MOCK_TEST_COMPLETE, async ({ studentId }) => {
  try { await getRecommendations(studentId); } catch (e) { console.error('[RecommendationEngine]', e.message); }
});

module.exports = { getRecommendations, getCachedRecommendations };

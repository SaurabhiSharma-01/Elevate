/* ============================================================
   AGENT 3 — Personalized Roadmap AI
   Service Layer
   ============================================================ */

'use strict';

const { generateJSON } = require('../../shared/gemini-client');
const { getStudent, getAIReport, saveRoadmap, getRoadmap } = require('../../shared/db-bridge');
const { bus, EVENTS } = require('../../shared/agent-bus');
const { buildRoadmapPrompt } = require('./roadmap-engine.prompts');

/**
 * Generate a personalized learning roadmap for a student
 * @param {string} studentId
 * @param {string} targetCompany - Override target company
 * @param {number} studyHoursPerDay - Override study hours
 * @returns {Promise<object>} - Roadmap
 */
async function generateRoadmap(studentId, targetCompany = '', studyHoursPerDay = 0) {
  const student = getStudent(studentId);
  if (!student) {
    throw Object.assign(new Error(`Student not found: ${studentId}`), { status: 404 });
  }

  const skillReport = getAIReport(studentId, 'skillAnalysis');
  const readinessReport = getAIReport(studentId, 'placementReadiness');

  const prompt = buildRoadmapPrompt(student, skillReport, readinessReport, targetCompany, studyHoursPerDay);

  const company = targetCompany || student.targetCompany || 'TCS';
  const hours = studyHoursPerDay || student.todayHours || 2;
  const weakAreas = skillReport?.weaknesses || student.weakSkills || ['DSA', 'Aptitude'];

  const fallback = {
    studentId,
    studentName: student.name,
    targetCompany: company,
    targetReadinessScore: Math.min((student.readiness || 60) + 20, 100),
    studyHoursPerDay: hours,
    weeklyPlan: [
      {
        week: 1, theme: `Foundations: ${weakAreas[0] || 'DSA'}`,
        focus: [weakAreas[0] || 'Data Structures', 'Aptitude basics'],
        dailyTasks: [
          { day: 'Monday', tasks: [`Study ${weakAreas[0] || 'Arrays and Strings'}`], hours },
          { day: 'Tuesday', tasks: ['Solve 10 LeetCode easy problems'], hours },
          { day: 'Wednesday', tasks: ['Aptitude - Number System'], hours },
          { day: 'Thursday', tasks: ['Resume update'], hours },
          { day: 'Friday', tasks: ['DBMS basics'], hours },
          { day: 'Saturday', tasks: ['Mock test - Aptitude'], hours },
          { day: 'Sunday', tasks: ['Light revision'], hours: 1 }
        ],
        milestone: `Complete ${weakAreas[0] || 'DSA'} basics`,
        resources: ['GeeksforGeeks', 'LeetCode easy set']
      }
    ],
    monthlyMilestones: [{ month: 1, goal: `Master ${weakAreas[0] || 'DSA'} fundamentals`, keyOutcome: '15% score improvement' }],
    priorities: weakAreas.slice(0, 3),
    companySpecificTips: [`Study ${company} interview patterns`, 'Practice previous year questions'],
    summary: `${student.name}'s roadmap focuses on ${weakAreas[0] || 'DSA'} improvement to reach placement readiness for ${company} within 4 weeks.`
  };

  const roadmap = await generateJSON(prompt, { fallback });
  saveRoadmap(studentId, roadmap);
  return roadmap;
}

/**
 * Get cached roadmap
 */
function getCachedRoadmap(studentId) {
  return getRoadmap(studentId);
}

// ─── Auto-regenerate roadmap when skill analysis or test is complete ──────────

bus.on(EVENTS.SKILL_ANALYSIS_COMPLETE, async ({ studentId }) => {
  try {
    console.log(`[RoadmapEngine] Regenerating roadmap for ${studentId} after skill analysis`);
    await generateRoadmap(studentId);
  } catch (e) {
    console.error('[RoadmapEngine] Auto-regeneration failed:', e.message);
  }
});

bus.on(EVENTS.MOCK_TEST_COMPLETE, async ({ studentId }) => {
  try {
    await generateRoadmap(studentId);
  } catch (e) {
    console.error('[RoadmapEngine] Auto-regeneration failed:', e.message);
  }
});

module.exports = { generateRoadmap, getCachedRoadmap };

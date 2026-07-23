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
  const correctCount = answers.filter(a => a.isCorrect).length;
  const totalQuestions = answers.length || 30;
  
  const getSectionScore = (sections, baseMin = 40) => {
    const secAnswers = answers.filter(a => {
      const qText = (a.question || '').toLowerCase();
      const sLabel = (a.section || '').toLowerCase();
      return sections.some(s => qText.includes(s.toLowerCase()) || sLabel.includes(s.toLowerCase()));
    });
    if (secAnswers.length === 0) {
      return Math.round(baseMin + (correctCount / totalQuestions) * (100 - baseMin));
    }
    const correct = secAnswers.filter(a => a.isCorrect).length;
    return Math.round(baseMin + (correct / secAnswers.length) * (100 - baseMin));
  };

  const technicalSkillScore = getSectionScore(['programming', 'structures', 'algorithm', 'technical', 'database', 'sql', 'oop', 'dsa', 'dbms'], 35);
  const aptitudeScore = getSectionScore(['aptitude', 'train', 'speed', 'work', 'discount', 'percent'], 30);
  const logicalReasoningScore = getSectionScore(['logical', 'reasoning', 'odd', 'series', 'machines'], 35);
  const communicationScore = Math.round(55 + (correctCount / totalQuestions) * 25);
  
  const overallSkillScore = Math.round((technicalSkillScore * 0.4) + (aptitudeScore * 0.25) + (logicalReasoningScore * 0.2) + (communicationScore * 0.15));

  const weakSections = Array.from(new Set(answers.filter(a => !a.isCorrect && a.section).map(a => a.section)));
  const weaknesses = weakSections.length > 0 ? weakSections : ['Data Structures', 'Operating Systems'];
  const strengths = overallSkillScore >= 60 
    ? (department === 'Engineering' ? ['Programming Fundamentals', 'Database Queries'] : ['Core Concepts'])
    : ['Basic Logic', 'Attention to Detail'];

  const estimatedReadinessLevel = overallSkillScore >= 75 ? 'Almost Ready' : overallSkillScore >= 50 ? 'Partially Ready' : 'Needs Improvement';
  const summary = overallSkillScore >= 75 
    ? `${student.name} completed the ${department || 'Engineering'} assessment with an excellent score of ${overallSkillScore}%. Performance is on track for placements. Focus on polishing advanced concepts.`
    : overallSkillScore >= 50
      ? `${student.name} completed the ${department || 'Engineering'} assessment with a score of ${overallSkillScore}%. Solid performance overall, but needs focus in ${weaknesses.slice(0, 2).join(' and ')} to improve readiness.`
      : `${student.name} completed the ${department || 'Engineering'} assessment. Score is ${overallSkillScore}%. Performance indicates a need for immediate reinforcement of foundational topics, particularly in ${weaknesses.slice(0, 2).join(' and ')}.`;

  const fallback = {
    studentId,
    studentName: student.name,
    strengths,
    weaknesses,
    knowledgeGaps: weaknesses,
    technicalSkillScore,
    aptitudeScore,
    communicationScore,
    logicalReasoningScore,
    overallSkillScore,
    skillProfile: {
      DSA: technicalSkillScore >= 75 ? 'Advanced' : technicalSkillScore >= 50 ? 'Intermediate' : 'Beginner',
      DBMS: technicalSkillScore >= 65 ? 'Intermediate' : 'Beginner',
      OS: technicalSkillScore >= 70 ? 'Intermediate' : 'Beginner',
      Networks: technicalSkillScore >= 70 ? 'Intermediate' : 'Beginner',
      Aptitude: aptitudeScore >= 65 ? 'Intermediate' : 'Beginner',
      Communication: communicationScore >= 70 ? 'Intermediate' : 'Beginner',
      SystemDesign: technicalSkillScore >= 80 ? 'Intermediate' : 'Beginner'
    },
    improvementSuggestions: weaknesses.map(w => `Study standard resources for ${w} and resolve practice exercises.`),
    priorityAreas: weaknesses.slice(0, 2),
    estimatedReadinessLevel,
    summary
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

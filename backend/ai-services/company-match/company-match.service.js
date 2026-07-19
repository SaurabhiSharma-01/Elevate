/* ============================================================
   AGENT 5 — Company Match AI — Service Layer
   ============================================================ */

'use strict';

const { generateJSON } = require('../../shared/gemini-client');
const { getStudent, getAIReport, getTestHistory, saveAIReport } = require('../../shared/db-bridge');
const { buildCompanyMatchPrompt, COMPANY_PROFILES } = require('./company-match.prompts');

async function matchStudentToCompany(studentId, company) {
  const student = getStudent(studentId);
  if (!student) throw Object.assign(new Error(`Student not found: ${studentId}`), { status: 404 });

  const skillReport = getAIReport(studentId, 'skillAnalysis');
  const readinessReport = getAIReport(studentId, 'placementReadiness');
  const testHistory = getTestHistory(studentId);

  const prompt = buildCompanyMatchPrompt(student, company, skillReport, readinessReport, testHistory);

  const readinessScore = readinessReport?.placementReadinessScore || student.readiness || 60;
  const cgpaOk = student.cgpa >= (COMPANY_PROFILES[company]?.minCGPA || 6.0);

  const fallback = {
    studentId,
    company,
    readinessPercent: readinessScore,
    verdict: readinessScore >= 80 ? 'Ready to Apply' : readinessScore >= 60 ? 'Almost Ready' : 'Needs 1-2 months',
    cgpaEligible: cgpaOk,
    missingSkills: student.weakSkills || ['DSA', 'Aptitude'],
    existingStrengths: [`${student.branch} knowledge`, 'Academic performance'],
    preparationTimeline: readinessScore >= 75 ? '2 weeks' : '4-6 weeks',
    interviewRounds: COMPANY_PROFILES[company]?.rounds || ['Technical', 'HR'],
    recommendedTopics: COMPANY_PROFILES[company]?.keySkills || ['DSA', 'Aptitude', 'Communication'],
    suggestedMockTests: [`${company} OA Mock`, 'General Aptitude Test'],
    recommendedInterviewTypes: ['Technical', 'HR'],
    weeklyPrepPlan: [
      { week: 1, focus: `Focus on ${company}'s key topics: ${COMPANY_PROFILES[company]?.focusAreas?.[0] || 'DSA'}` },
      { week: 2, focus: 'Full mock test + HR preparation' }
    ],
    insiderTips: COMPANY_PROFILES[company]?.interviewStyle ? [COMPANY_PROFILES[company].interviewStyle] : ['Prepare well and stay confident'],
    chanceOfSelection: readinessScore >= 80 ? 'High (> 80%)' : readinessScore >= 60 ? 'Moderate (30-60%)' : 'Low (< 30%)',
    summary: `${student.name} has ${readinessScore}% readiness for ${company}. ${cgpaOk ? 'CGPA is eligible.' : 'CGPA may not meet eligibility.'} Focus on ${(student.weakSkills || ['DSA'])[0]} to improve chances.`
  };

  const report = await generateJSON(prompt, { fallback });
  saveAIReport(studentId, `companyMatch_${company}`, report);
  return report;
}

/**
 * Get all company matches for a student (compare with multiple companies at once)
 */
async function matchAllCompanies(studentId) {
  const companies = Object.keys(COMPANY_PROFILES);
  const results = await Promise.allSettled(
    companies.map(c => matchStudentToCompany(studentId, c))
  );
  return results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value)
    .sort((a, b) => b.readinessPercent - a.readinessPercent);
}

module.exports = { matchStudentToCompany, matchAllCompanies, COMPANY_PROFILES };

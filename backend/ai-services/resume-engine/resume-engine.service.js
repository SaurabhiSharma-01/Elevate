/* ============================================================
   AGENT 11 — Resume AI — Service Layer
   ============================================================ */

'use strict';

const { generateJSON } = require('../../shared/gemini-client');
const { getStudent, saveAIReport, getAIReport, updateStudent } = require('../../shared/db-bridge');
const { bus, EVENTS } = require('../../shared/agent-bus');
const { buildResumeAnalysisPrompt } = require('./resume-engine.prompts');

async function analyzeResume(studentId, resumeText) {
  const student = getStudent(studentId);
  if (!student) throw Object.assign(new Error(`Student not found: ${studentId}`), { status: 404 });

  const text = resumeText || student.resumeText || '';
  if (!text.trim()) {
    throw Object.assign(new Error('No resume text provided. Please submit resume content.'), { status: 400 });
  }

  const prompt = buildResumeAnalysisPrompt(student, text);

  const wordCount = text.split(' ').length;
  const hasProjects = text.toLowerCase().includes('project');
  const hasSkills = text.toLowerCase().includes('skill');
  const baseAts = Math.min(60 + (hasProjects ? 15 : 0) + (hasSkills ? 10 : 0) + (wordCount > 200 ? 10 : 0), 100);

  const fallback = {
    studentId,
    studentName: student.name,
    atsScore: baseAts,
    formattingScore: 72,
    keywordScore: 65,
    contentScore: 70,
    grammarScore: 78,
    overallResumeScore: Math.round((baseAts + 72 + 65 + 70 + 78) / 5),
    atsCompatibility: {
      verdict: baseAts >= 75 ? 'ATS-Friendly' : 'Partially Compatible',
      issues: ['May lack specific role keywords', 'Ensure clean text formatting without tables/columns'],
      fixes: ['Add role-specific keywords from job descriptions', 'Use simple bullet points']
    },
    presentSections: ['Education', 'Skills'],
    missingSections: ['Professional Summary', 'Achievements', 'Certifications', 'LinkedIn URL'],
    keywordsFound: text.toLowerCase().includes('java') ? ['Java'] : [],
    missingKeywords: [`${student.targetCompany || 'IT'}-specific terms`, 'Problem solving', 'Team player'],
    suggestions: [
      { section: 'Summary', issue: 'Missing professional summary', fix: 'Add a 2-3 line professional summary at the top' },
      { section: 'Projects', issue: 'Projects lack measurable impact', fix: 'Add numbers/metrics to project descriptions' },
      { section: 'Skills', issue: 'Skills section not properly organized', fix: 'Group skills by category (Languages, Frameworks, Tools)' }
    ],
    strengthsList: [`${student.branch} educational background`, 'CGPA of ' + student.cgpa],
    criticalIssues: ['Add measurable achievements', 'Include a professional summary'],
    optimizedKeywords: ['Problem Solving', 'Team Collaboration', 'Agile', 'Git', 'SQL'],
    targetCompanyAlignment: {
      company: student.targetCompany || 'General IT',
      alignmentScore: 65,
      verdict: 'Partially Aligned',
      tips: [`Add ${student.targetCompany || 'company'}-specific keywords from their job descriptions`, 'Align project descriptions with company focus areas']
    },
    revisedSummaryExample: `Motivated ${student.branch} student (CGPA: ${student.cgpa}) with hands-on experience in software development. Passionate about building scalable solutions. Seeking ${student.targetCompany || 'IT'} opportunities to apply technical skills and drive impactful outcomes.`,
    summary: `${student.name}'s resume scores ${Math.round((baseAts + 72 + 65 + 70 + 78) / 5)}/100. The main improvements needed are adding a professional summary, quantifying project impacts, and optimizing keywords for ${student.targetCompany || 'target companies'}.`
  };

  const report = await generateJSON(prompt, { fallback });
  saveAIReport(studentId, 'resumeReview', report);

  // Update resume verified status if score is high enough
  if (report.overallResumeScore >= 75) {
    updateStudent(studentId, { resumeVerified: 'Verified' });
  }

  // Save resume text to student profile if not already there
  if (!student.resumeText && resumeText) {
    updateStudent(studentId, { resumeText: resumeText.slice(0, 2000) }); // Cap at 2000 chars
  }

  bus.emit(EVENTS.RESUME_ANALYSIS_COMPLETE, { studentId, report });

  return report;
}

function getCachedResumeReview(studentId) {
  return getAIReport(studentId, 'resumeReview');
}

module.exports = { analyzeResume, getCachedResumeReview };

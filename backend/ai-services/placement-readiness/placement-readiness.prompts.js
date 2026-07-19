/* ============================================================
   AGENT 2 — Placement Readiness AI
   Prompt Templates
   ============================================================ */

'use strict';

/**
 * Build the prompt to calculate a student's Placement Readiness Score
 */
function buildReadinessPrompt(student, allReports, testHistory) {
  const skillReport = allReports.skillAnalysis || null;
  const resumeReport = allReports.resumeReview || null;
  const interviewReports = allReports.interviewAnalysis || null;

  const recentTests = testHistory.slice(-5).map(t =>
    `- ${t.company || 'General'} test: Score ${t.score || 0}% (${t.testType || 'Mixed'})`
  ).join('\n') || '- No mock tests completed yet';

  const interviewHistorySummary = (student.interviewHistory || []).map(i =>
    `- ${i.company} ${i.type} interview: Score ${i.score}/100`
  ).join('\n') || '- No interviews conducted yet';

  return `
You are an AI Placement Readiness Analyst for the Elevate Career Intelligence Platform.

Your task is to calculate a comprehensive, dynamic Placement Readiness Score for this student.
The score must NEVER be hardcoded. It must be calculated from the actual data below.

## Student Profile
- Name: ${student.name}
- Branch: ${student.branch}
- Semester: ${student.semester}
- CGPA: ${student.cgpa}/10
- Target Company: ${student.targetCompany}
- Courses Completed: ${student.coursesCompleted} courses
- Mock Tests Completed: ${student.mockTestsCompleted}
- Daily Study Hours: ${student.todayHours} hours
- Resume Status: ${student.resumeVerified}
- Known Weak Skills: ${(student.weakSkills || []).join(', ')}

## Skill Assessment Data
${skillReport ? `- Overall Skill Score: ${skillReport.overallSkillScore}/100
- Technical Score: ${skillReport.technicalSkillScore}/100
- Aptitude Score: ${skillReport.aptitudeScore}/100
- Communication Score: ${skillReport.communicationScore}/100
- Estimated Level: ${skillReport.estimatedReadinessLevel}` : '- No skill assessment completed yet'}

## Recent Mock Test Performance
${recentTests}

## Interview History
${interviewHistorySummary}

## Resume Analysis
${resumeReport ? `- ATS Score: ${resumeReport.atsScore}/100
- Resume Quality: ${resumeReport.formattingScore}/100` : '- No resume analysis completed yet'}

## Scoring Weights (use these weights):
- Skill Assessment: 25%
- Mock Test Performance: 20%
- Course Completion Rate: 15%
- Study Consistency: 10%
- Interview Performance: 15%
- Resume Quality: 10%
- Projects & Certifications: 5%

Calculate scores for each weight category based on the actual data. Be realistic and data-driven.

Return ONLY valid JSON — no explanation, no markdown:

{
  "studentId": "${student.id}",
  "studentName": "${student.name}",
  "placementReadinessScore": 0-100,
  "hiringReadiness": "Not Ready|Partially Ready|Almost Ready|Placement Ready|Highly Ready",
  "breakdown": {
    "skillAssessment": { "score": 0-100, "weight": 25, "weighted": 0-25 },
    "mockTestPerformance": { "score": 0-100, "weight": 20, "weighted": 0-20 },
    "courseCompletion": { "score": 0-100, "weight": 15, "weighted": 0-15 },
    "studyConsistency": { "score": 0-100, "weight": 10, "weighted": 0-10 },
    "interviewPerformance": { "score": 0-100, "weight": 15, "weighted": 0-15 },
    "resumeQuality": { "score": 0-100, "weight": 10, "weighted": 0-10 },
    "projectsCertifications": { "score": 0-100, "weight": 5, "weighted": 0-5 }
  },
  "strengths": ["specific strength 1", "specific strength 2"],
  "areasToImprove": ["area 1", "area 2", "area 3"],
  "suggestions": ["actionable suggestion 1", "actionable suggestion 2", "actionable suggestion 3"],
  "targetCompanyReadiness": {
    "company": "${student.targetCompany || 'TCS'}",
    "readinessPercent": 0-100,
    "verdict": "Ready|Need 2-4 weeks|Need 1-2 months|Need 3+ months"
  },
  "estimatedDaysToPlacementReady": 0-180,
  "summary": "2-3 sentence personalized summary for this specific student"
}
`;
}

module.exports = { buildReadinessPrompt };

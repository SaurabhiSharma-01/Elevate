/* ============================================================
   AGENT 11 — Resume AI
   Prompt Templates
   ============================================================ */

'use strict';

function buildResumeAnalysisPrompt(student, resumeText) {
  return `
You are an expert AI Resume Analyst and ATS Specialist for the Elevate Career Intelligence Platform.

Perform a comprehensive resume review for this student targeting Indian IT placements.

## Student Profile
- Name: ${student.name}
- Branch: ${student.branch}
- Semester: ${student.semester}
- CGPA: ${student.cgpa}
- Target Company: ${student.targetCompany}

## Resume Text
${resumeText || student.resumeText || 'No resume text provided'}

## Your Analysis Must Cover:
1. ATS Compatibility: Keywords, formatting for Applicant Tracking Systems
2. Content Quality: Projects, achievements, skills sections
3. Grammar and language
4. Missing sections or information
5. Keyword optimization for ${student.targetCompany || 'IT companies'}
6. Overall impression

Return ONLY valid JSON:

{
  "studentId": "${student.id}",
  "studentName": "${student.name}",
  "atsScore": 0-100,
  "formattingScore": 0-100,
  "keywordScore": 0-100,
  "contentScore": 0-100,
  "grammarScore": 0-100,
  "overallResumeScore": 0-100,
  "atsCompatibility": {
    "verdict": "ATS-Friendly|Partially Compatible|ATS-Unfriendly",
    "issues": ["ATS issue 1", "ATS issue 2"],
    "fixes": ["Fix 1", "Fix 2"]
  },
  "presentSections": ["Summary", "Education", "Skills", "Projects"],
  "missingSections": ["Certifications", "Achievements", "LinkedIn Profile"],
  "keywordsFound": ["keyword1", "keyword2"],
  "missingKeywords": ["Important keyword for ${student.targetCompany || 'IT'} not found in resume"],
  "suggestions": [
    { "section": "Projects", "issue": "Specific issue", "fix": "Specific fix" },
    { "section": "Skills", "issue": "Specific issue", "fix": "Specific fix" }
  ],
  "strengthsList": ["Strength 1", "Strength 2"],
  "criticalIssues": ["Critical issue that must be fixed immediately"],
  "optimizedKeywords": ["Keyword 1 to add", "Keyword 2 to add"],
  "targetCompanyAlignment": {
    "company": "${student.targetCompany || 'General IT'}",
    "alignmentScore": 0-100,
    "verdict": "Well-Aligned|Partially Aligned|Misaligned",
    "tips": ["Specific tip for ${student.targetCompany || 'this company'}"]
  },
  "revisedSummaryExample": "An improved 2-3 line professional summary for this student",
  "summary": "2-3 sentence overall resume assessment"
}
`;
}

module.exports = { buildResumeAnalysisPrompt };

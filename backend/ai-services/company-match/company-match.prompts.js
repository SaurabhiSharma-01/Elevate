/* ============================================================
   AGENT 5 — Company Match AI
   Prompt Templates
   ============================================================ */

'use strict';

const COMPANY_PROFILES = {
  Google: {
    focusAreas: ['Algorithms', 'Data Structures', 'System Design', 'Problem Solving'],
    rounds: ['Coding Round (4-5)', 'System Design', 'Behavioral (Googleyness)', 'Team Matching'],
    minCGPA: 7.0,
    keySkills: ['DSA mastery', 'CS fundamentals', 'System Design', 'Distributed systems'],
    interviewStyle: 'Heavy algorithmic focus. Expects optimal solutions. Behavioral answers using STAR method.',
    avgPackage: '₹25-45 LPA'
  },
  Microsoft: {
    focusAreas: ['DSA', 'OOPs', 'System Design', 'Behavioral'],
    rounds: ['Coding Round (2-3)', 'System Design', 'HR + Behavioral'],
    minCGPA: 7.5,
    keySkills: ['C++/Java/Python', 'OOP principles', 'Cloud concepts (Azure)', 'Leadership'],
    interviewStyle: 'Balanced technical and behavioral. Values growth mindset and collaboration.',
    avgPackage: '₹25-50 LPA'
  },
  Amazon: {
    focusAreas: ['DSA', 'Leadership Principles', 'System Design', 'Coding'],
    rounds: ['OA (Coding + Debug)', 'Loop (4-5 rounds with Leadership Principles)'],
    minCGPA: 6.5,
    keySkills: ['14 Leadership Principles', 'Scalable system design', 'Problem solving under pressure'],
    interviewStyle: 'Every question connects to Leadership Principles. STAR method is essential.',
    avgPackage: '₹20-40 LPA'
  },
  TCS: {
    focusAreas: ['Aptitude', 'Verbal', 'Coding (basic)', 'English Proficiency'],
    rounds: ['TCS NQT (Online Test)', 'TR Interview', 'HR Interview'],
    minCGPA: 6.0,
    keySkills: ['Quantitative aptitude', 'Logical reasoning', 'Basic coding', 'Communication'],
    interviewStyle: 'Process-oriented. Focuses on aptitude scores and basic tech knowledge.',
    avgPackage: '₹3.5-7 LPA'
  },
  Infosys: {
    focusAreas: ['Aptitude', 'Verbal', 'Pseudocode', 'HR'],
    rounds: ['Infosys Instep/Springboard Test', 'TR Interview', 'HR'],
    minCGPA: 6.5,
    keySkills: ['Problem solving', 'Communication', 'Team player', 'Adaptability'],
    interviewStyle: 'Moderate difficulty. Focuses on attitude and learning ability.',
    avgPackage: '₹3.6-6.5 LPA'
  },
  Accenture: {
    focusAreas: ['Cognitive ability', 'Technical', 'Communication', 'Behavioral'],
    rounds: ['Cognitive & Technical Test', 'Communication Test', 'HR Interview'],
    minCGPA: 6.0,
    keySkills: ['Basic coding', 'Verbal communication', 'Adaptability', 'Teamwork'],
    interviewStyle: 'Personality and cultural fit focused. Communication is key.',
    avgPackage: '₹4.5-8 LPA'
  },
  Capgemini: {
    focusAreas: ['Aptitude', 'Pseudocode', 'Technical', 'HR'],
    rounds: ['Game-based Assessment', 'Pseudocode', 'Technical', 'HR'],
    minCGPA: 6.0,
    keySkills: ['Logical reasoning', 'Basic programming', 'Communication'],
    interviewStyle: 'Innovative assessment format. Values creativity and logical thinking.',
    avgPackage: '₹4-7 LPA'
  },
  Wipro: {
    focusAreas: ['Aptitude', 'Written English', 'Technical', 'HR'],
    rounds: ['NLTH Test', 'Technical Interview', 'HR'],
    minCGPA: 6.5,
    keySkills: ['Aptitude', 'Programming basics', 'Communication', 'Flexibility'],
    interviewStyle: 'Standard IT hiring process. Emphasis on attitude and learning.',
    avgPackage: '₹3.5-6.5 LPA'
  },
  Deloitte: {
    focusAreas: ['Case Study', 'Aptitude', 'Communication', 'Leadership'],
    rounds: ['Aptitude Test', 'Group Discussion', 'Case Interview', 'HR'],
    minCGPA: 7.0,
    keySkills: ['Analytical thinking', 'Case solving', 'Communication', 'Business acumen'],
    interviewStyle: 'Consulting-style case interviews. Strong communication essential.',
    avgPackage: '₹8-15 LPA'
  }
};

function getCompanyProfile(company) {
  // Try exact match first, then case-insensitive
  if (COMPANY_PROFILES[company]) return COMPANY_PROFILES[company];
  const key = Object.keys(COMPANY_PROFILES).find(k => k.toLowerCase() === company.toLowerCase());
  return key ? COMPANY_PROFILES[key] : null;
}

function buildCompanyMatchPrompt(student, company, skillReport, readinessReport, testHistory) {
  const profile = getCompanyProfile(company);
  const companyInfo = profile ? `
- Focus Areas: ${profile.focusAreas.join(', ')}
- Interview Rounds: ${profile.rounds.join(' → ')}
- Minimum CGPA: ${profile.minCGPA}
- Key Skills Needed: ${profile.keySkills.join(', ')}
- Interview Style: ${profile.interviewStyle}
- Average Package: ${profile.avgPackage}
` : `- General IT company hiring process`;

  const readinessScore = readinessReport?.placementReadinessScore || student.readiness || 60;
  const weakAreas = skillReport?.weaknesses || student.weakSkills || [];

  return `
You are an AI Company Match Analyst for the Elevate Career Intelligence Platform.

Compare this student's profile with ${company}'s hiring expectations and provide a detailed readiness assessment.

## Student Profile
- Name: ${student.name}
- Branch: ${student.branch}
- CGPA: ${student.cgpa}
- Current Readiness Score: ${readinessScore}/100
- Courses Completed: ${student.coursesCompleted}
- Mock Tests Done: ${student.mockTestsCompleted}
- Weak Areas: ${weakAreas.join(', ')}
- Resume: ${student.resumeVerified}

## ${company} Hiring Profile
${companyInfo}

Return ONLY valid JSON:

{
  "studentId": "${student.id}",
  "company": "${company}",
  "readinessPercent": 0-100,
  "verdict": "Ready to Apply|Almost Ready|Needs 1-2 months|Needs 3+ months",
  "cgpaEligible": true/false,
  "missingSkills": ["Missing skill 1", "Missing skill 2"],
  "existingStrengths": ["Existing strength 1"],
  "preparationTimeline": "Realistic timeline like '3 weeks' or '2 months'",
  "interviewRounds": ["Round 1 description", "Round 2 description"],
  "recommendedTopics": ["Topic 1", "Topic 2", "Topic 3"],
  "suggestedMockTests": ["Mock test 1", "Mock test 2"],
  "recommendedInterviewTypes": ["HR", "Technical"],
  "weeklyPrepPlan": [
    { "week": 1, "focus": "What to focus on this week" },
    { "week": 2, "focus": "What to focus on next week" }
  ],
  "insiderTips": ["Company-specific tip 1", "Company-specific tip 2"],
  "chanceOfSelection": "Low (< 30%)|Moderate (30-60%)|Good (60-80%)|High (> 80%)",
  "summary": "Personalized 2-3 sentence assessment for ${student.name} targeting ${company}"
}
`;
}

module.exports = { buildCompanyMatchPrompt, getCompanyProfile, COMPANY_PROFILES };

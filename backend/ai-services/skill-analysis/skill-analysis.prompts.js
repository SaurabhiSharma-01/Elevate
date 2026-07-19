/* ============================================================
   AGENT 1 — Skill Analysis AI
   Prompt Templates
   ============================================================ */

'use strict';

/**
 * Build the prompt for analyzing a student's skill assessment
 */
function buildSkillAnalysisPrompt(student, answers, department, semester) {
  const answersText = answers.length > 0
    ? answers.map((a, i) => `Q${i + 1}. ${a.question}\nAnswer: ${a.answer}\nCorrect: ${a.isCorrect ? 'Yes' : 'No'}`).join('\n\n')
    : 'No assessment answers provided — use student profile data only.';

  const weakSkillsText = (student.weakSkills || []).join(', ') || 'None specified';
  const interviewCount = (student.interviewHistory || []).length;

  return `
You are an expert AI Skill Analyst for the Elevate Career Intelligence Platform.

Your job is to analyze the student's profile and assessment answers, then generate a detailed skill analysis report.

## Student Profile
- Name: ${student.name}
- Department: ${department || student.dept || 'Engineering'}
- Branch: ${student.branch}
- Semester: ${semester || student.semester}
- CGPA: ${student.cgpa}
- Target Company: ${student.targetCompany}
- Courses Completed: ${student.coursesCompleted}
- Mock Tests Completed: ${student.mockTestsCompleted}
- Known Weak Skills: ${weakSkillsText}
- Interview History Count: ${interviewCount}

## Assessment Answers
${answersText}

## Your Task
Analyze the above data and return a JSON object with the following structure. Be specific and data-driven. Use the student's actual name and details.

Return ONLY valid JSON — no explanation, no markdown, no code fences:

{
  "studentId": "${student.id}",
  "studentName": "${student.name}",
  "strengths": ["specific strength 1", "specific strength 2"],
  "weaknesses": ["specific weakness 1", "specific weakness 2"],
  "knowledgeGaps": ["gap 1", "gap 2"],
  "technicalSkillScore": 0-100,
  "aptitudeScore": 0-100,
  "communicationScore": 0-100,
  "logicalReasoningScore": 0-100,
  "overallSkillScore": 0-100,
  "skillProfile": {
    "DSA": "Beginner|Intermediate|Advanced",
    "DBMS": "Beginner|Intermediate|Advanced",
    "OS": "Beginner|Intermediate|Advanced",
    "Networks": "Beginner|Intermediate|Advanced",
    "Aptitude": "Beginner|Intermediate|Advanced",
    "Communication": "Beginner|Intermediate|Advanced",
    "SystemDesign": "Beginner|Intermediate|Advanced"
  },
  "improvementSuggestions": ["specific suggestion 1", "specific suggestion 2", "specific suggestion 3"],
  "priorityAreas": ["top priority topic 1", "top priority topic 2"],
  "estimatedReadinessLevel": "Not Ready|Partially Ready|Almost Ready|Placement Ready",
  "summary": "2-3 sentence personalized summary about this student's skill profile"
}
`;
}

module.exports = { buildSkillAnalysisPrompt };

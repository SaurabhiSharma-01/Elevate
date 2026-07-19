/* ============================================================
   AGENT 7 — Mock Test Engine AI
   Prompt Templates
   ============================================================ */

'use strict';

const QUESTION_COUNTS = {
  Technical: 20,
  Coding: 5,
  Aptitude: 25,
  Communication: 15,
  'Company-OA': 30
};

function buildMockTestPrompt(student, company, role, testType, difficulty, testHistory) {
  const count = QUESTION_COUNTS[testType] || 20;
  const previousWeakTopics = testHistory.flatMap(t => t.weakConcepts || []).join(', ') || 'none identified yet';
  const pastAttempts = testHistory.filter(t => t.company === company).length;

  return `
You are an AI Mock Test Generator for the Elevate Career Intelligence Platform.

Generate a ${testType} mock test for ${company} (${role || 'Software Engineer'}).
The test should be realistic, company-specific, and adapt to this student's level.

## Student Profile
- Name: ${student.name}
- Branch: ${student.branch}
- Difficulty Level: ${difficulty || 'Medium'}
- Previous Weak Topics: ${previousWeakTopics}
- Past ${company} Attempts: ${pastAttempts}
- Readiness Level: ${student.readiness || 65}/100

## Test Parameters
- Company: ${company}
- Test Type: ${testType}
- Role: ${role || 'Software Engineer'}
- Number of Questions: ${count}
- Difficulty: ${difficulty || 'Medium'}

## Instructions
- For Aptitude: Include quantitative, logical reasoning, and verbal questions
- For Technical: Include OS, DBMS, Networks, OOP, DS questions relevant to ${company}
- For Coding: Include practical coding problems at ${difficulty || 'medium'} level
- For Communication: Include reading comprehension, grammar, email writing scenarios
- For Company-OA: Mirror the actual ${company} online assessment pattern
- Adapt difficulty: more hard questions if difficulty is "Hard", more easy/medium if "Easy"
- Do NOT repeat topics from previous weak areas — focus those areas more

Return ONLY valid JSON — no markdown, no explanation:

{
  "testId": "auto_generated",
  "company": "${company}",
  "role": "${role || 'Software Engineer'}",
  "testType": "${testType}",
  "difficulty": "${difficulty || 'Medium'}",
  "totalQuestions": ${count},
  "durationMinutes": ${count <= 10 ? 30 : count <= 20 ? 45 : 90},
  "questions": [
    {
      "id": "q1",
      "text": "Full question text here",
      "type": "MCQ|Coding|FillInBlank",
      "topic": "DSA|OS|DBMS|Aptitude|Verbal|etc",
      "difficulty": "Easy|Medium|Hard",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "correctAnswer": "Option A (or code for coding questions)",
      "explanation": "Brief explanation of correct answer",
      "marks": 1,
      "negativeMarks": 0
    }
  ],
  "sectionBreakdown": {
    "sectionName": "count of questions in that section"
  },
  "instructions": ["Test instruction 1", "Test instruction 2"],
  "companyNote": "Note about how this mirrors actual ${company} assessment"
}

Generate exactly ${count} questions. Make them realistic and company-appropriate.
`;
}

module.exports = { buildMockTestPrompt, QUESTION_COUNTS };

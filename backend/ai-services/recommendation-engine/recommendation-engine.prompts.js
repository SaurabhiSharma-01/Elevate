/* ============================================================
   AGENT 4 — Learning Recommendation AI
   Prompt Templates
   ============================================================ */

'use strict';

function buildRecommendationPrompt(student, skillReport, testHistory) {
  const weakAreas = skillReport?.weaknesses || student.weakSkills || ['DSA', 'Aptitude'];
  const recentTestTopics = testHistory.slice(-3).flatMap(t => t.weakConcepts || []).join(', ') || 'none';

  return `
You are an AI Learning Resource Recommender for the Elevate Career Intelligence Platform.

Generate highly personalized learning resource recommendations for this student.
Recommendations must adapt to their specific weak areas, learning history, and target company.

## Student Profile
- Name: ${student.name}
- Branch: ${student.branch}
- Target Company: ${student.targetCompany}
- Weak Areas: ${weakAreas.join(', ')}
- Recent Test Weak Concepts: ${recentTestTopics}
- Courses Completed: ${student.coursesCompleted}
- Mock Tests Done: ${student.mockTestsCompleted}

Return ONLY valid JSON:

{
  "studentId": "${student.id}",
  "studentName": "${student.name}",
  "generatedFor": "${student.targetCompany}",
  "courses": [
    { "title": "Course title", "platform": "Coursera/YouTube/NPTEL/Udemy", "url": "https://...", "topic": "DSA/DBMS/etc", "duration": "X hours", "priority": "High|Medium|Low", "reason": "Why this course" }
  ],
  "videos": [
    { "title": "Video title", "channel": "Channel name", "url": "https://youtube.com/...", "topic": "Topic", "duration": "30 mins", "reason": "Why this video" }
  ],
  "codingChallenges": [
    { "platform": "LeetCode/HackerRank/CodeChef", "topic": "Arrays/Trees/etc", "difficulty": "Easy|Medium|Hard", "url": "https://...", "count": 10, "reason": "Why these challenges" }
  ],
  "aptitudeResources": [
    { "title": "Resource title", "source": "IndiaBIX/PrepInsta/etc", "url": "https://...", "topics": ["Number system", "Ratio"], "reason": "Why" }
  ],
  "communicationExercises": [
    { "exercise": "Exercise description", "duration": "15 mins/day", "platform": "Speeko/YouTube/etc", "reason": "Why" }
  ],
  "mockTests": [
    { "name": "Test name", "type": "Aptitude|Technical|Coding|OA", "platform": "Elevate/PrepInsta/etc", "reason": "Why this test now" }
  ],
  "resumeResources": [
    { "title": "Resource title", "url": "https://...", "reason": "Why" }
  ],
  "todayFocus": "Single most important thing to do today",
  "weeklyGoal": "Specific goal for this week"
}

Note: Use REAL, accessible URLs for all resources. Prioritize free resources.
`;
}

module.exports = { buildRecommendationPrompt };

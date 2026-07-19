/* ============================================================
   AGENT 6 — Progress Analytics AI
   Prompt Templates
   ============================================================ */

'use strict';

function buildProgressPrompt(student, allReports, testHistory) {
  const tests = testHistory.slice(-10);
  const avgScore = tests.length > 0
    ? (tests.reduce((s, t) => s + (t.score || 0), 0) / tests.length).toFixed(1)
    : 0;

  const scoresTrend = tests.map(t => t.score || 0);
  const improving = scoresTrend.length >= 2
    ? scoresTrend[scoresTrend.length - 1] > scoresTrend[0]
    : null;

  const placementReadiness = allReports.placementReadiness?.placementReadinessScore || student.readiness || 60;
  const skillScore = allReports.skillAnalysis?.overallSkillScore || 65;

  return `
You are an AI Progress Analytics Engine for the Elevate Career Intelligence Platform.

Analyze this student's growth trajectory and generate intelligent insights.
Your insights should read like a smart personal coach — specific, encouraging, and actionable.

## Student Data
- Name: ${student.name}
- Current Readiness: ${placementReadiness}/100
- Overall Skill Score: ${skillScore}/100
- Daily Study Hours: ${student.todayHours}
- Courses Completed: ${student.coursesCompleted}
- Mock Tests Total: ${student.mockTestsCompleted}
- Interviews Done: ${(student.interviewHistory || []).length}

## Recent Test Scores (last ${tests.length} tests)
${tests.map((t, i) => `Test ${i + 1}: ${t.score || 0}%`).join(', ') || 'No test data yet'}
Average Score: ${avgScore}%
Trend: ${improving === null ? 'Insufficient data' : improving ? '↑ Improving' : '↓ Declining'}

## Interview Performance
${(student.interviewHistory || []).map(i => `- ${i.company} ${i.type}: ${i.score}/100`).join('\n') || 'No interview data'}

Return ONLY valid JSON:

{
  "studentId": "${student.id}",
  "studentName": "${student.name}",
  "overallGrowthScore": 0-100,
  "consistencyScore": 0-100,
  "weeklyGrowthPercent": -20 to +20,
  "studyStreak": 0-30,
  "insights": [
    "Specific insight 1 about their progress (e.g., 'You improved DSA by 14% this week')",
    "Specific insight 2",
    "Specific insight 3",
    "Specific insight 4"
  ],
  "alerts": [
    "Alert if something needs attention (e.g., 'Communication practice missing for 5 days')"
  ],
  "achievements": [
    { "badge": "Badge name", "description": "What was achieved", "earnedAt": "today" }
  ],
  "trends": {
    "testScores": "${improving === null ? 'Stable' : improving ? 'Improving' : 'Declining'}",
    "studyHours": "Consistent|Increasing|Decreasing",
    "skillGrowth": "Rapid|Moderate|Slow",
    "interviewPerformance": "Improving|Stable|Needs work"
  },
  "performanceBreakdown": {
    "dsa": 0-100,
    "aptitude": 0-100,
    "communication": 0-100,
    "technicalKnowledge": 0-100,
    "consistency": 0-100
  },
  "nextMilestone": "What the next achievement should be",
  "motivationalMessage": "Personalized encouraging message for ${student.name}",
  "riskFlags": ["Any risk that needs attention"],
  "summary": "2-3 sentence overall progress summary"
}
`;
}

module.exports = { buildProgressPrompt };

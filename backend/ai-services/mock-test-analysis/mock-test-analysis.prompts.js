/* ============================================================
   AGENT 8 — Mock Test Analysis AI
   Prompt Templates
   ============================================================ */

'use strict';

function buildTestAnalysisPrompt(student, test, answers, timings) {
  const totalQuestions = test.questions?.length || answers.length;
  const correct = answers.filter(a => a.isCorrect).length;
  const incorrect = answers.filter(a => !a.isCorrect && a.answered).length;
  const unattempted = answers.filter(a => !a.answered).length;
  const score = totalQuestions > 0 ? ((correct / totalQuestions) * 100).toFixed(1) : 0;

  const avgTimePerQ = timings.length > 0
    ? (timings.reduce((s, t) => s + t, 0) / timings.length).toFixed(1)
    : 60;

  const slowQuestions = timings.reduce((acc, t, i) => t > 120 ? [...acc, i + 1] : acc, []);
  const fastIncorrect = answers.reduce((acc, a, i) => (!a.isCorrect && timings[i] < 15) ? [...acc, i + 1] : acc, []);

  // Topic-wise analysis
  const topicMap = {};
  if (test.questions) {
    test.questions.forEach((q, i) => {
      const topic = q.topic || 'General';
      if (!topicMap[topic]) topicMap[topic] = { correct: 0, total: 0, avgTime: 0 };
      topicMap[topic].total++;
      topicMap[topic].avgTime += timings[i] || 60;
      if (answers[i]?.isCorrect) topicMap[topic].correct++;
    });
    Object.keys(topicMap).forEach(t => {
      topicMap[t].accuracy = ((topicMap[t].correct / topicMap[t].total) * 100).toFixed(1);
      topicMap[t].avgTime = (topicMap[t].avgTime / topicMap[t].total).toFixed(1);
    });
  }

  return `
You are an AI Mock Test Analyzer for the Elevate Career Intelligence Platform.

Analyze this completed mock test and generate a comprehensive, coach-level feedback report.
Go beyond just marks — analyze patterns, time management, guessing behavior, and trends.

## Student: ${student.name} (${student.branch})

## Test Summary
- Company: ${test.company || 'General'}
- Test Type: ${test.testType || 'Mixed'}
- Total Questions: ${totalQuestions}
- Correct: ${correct} | Incorrect: ${incorrect} | Unattempted: ${unattempted}
- Raw Score: ${score}%
- Average Time Per Question: ${avgTimePerQ} seconds
- Questions where student was very slow (>120s): Q${slowQuestions.join(', Q') || 'None'}
- Questions answered quickly but incorrectly (<15s): Q${fastIncorrect.join(', Q') || 'None (good sign)'}

## Topic-wise Performance
${Object.entries(topicMap).map(([topic, data]) => `- ${topic}: ${data.correct}/${data.total} correct (${data.accuracy}%), avg ${data.avgTime}s per question`).join('\n') || 'Topic data unavailable'}

Return ONLY valid JSON:

{
  "studentId": "${student.id}",
  "studentName": "${student.name}",
  "testCompany": "${test.company || 'General'}",
  "testType": "${test.testType || 'Mixed'}",
  "score": ${score},
  "totalQuestions": ${totalQuestions},
  "correct": ${correct},
  "incorrect": ${incorrect},
  "unattempted": ${unattempted},
  "accuracy": "${score}%",
  "timeManagement": {
    "avgTimePerQuestion": ${avgTimePerQ},
    "verdict": "Excellent|Good|Needs Work|Critical",
    "advice": "Specific time management advice"
  },
  "topicWisePerformance": ${JSON.stringify(Object.entries(topicMap).map(([topic, data]) => ({
    topic,
    score: `${data.correct}/${data.total}`,
    accuracy: data.accuracy + '%',
    avgTimeSecs: data.avgTime,
    verdict: parseFloat(data.accuracy) >= 70 ? 'Strong' : parseFloat(data.accuracy) >= 50 ? 'Average' : 'Weak'
  })))},
  "guessingBehavior": {
    "suspectedGuesses": ${fastIncorrect.length},
    "analysis": "Analysis of guessing pattern"
  },
  "strongConcepts": ["Topic where student scored well"],
  "weakConcepts": ["Topic where student needs improvement"],
  "feedback": [
    "Specific feedback 1 (e.g., 'Excellent accuracy in DSA questions')",
    "Specific feedback 2",
    "Specific feedback 3"
  ],
  "improvements": [
    "Actionable improvement 1",
    "Actionable improvement 2"
  ],
  "performanceTrend": "Improving|Stable|Declining (based on historical context)",
  "recommendedNextTest": "What type of test to take next",
  "estimatedReadinessImpact": "+X% or -X% impact on placement readiness score",
  "overallVerdict": "Excellent|Good|Average|Needs Improvement",
  "summary": "2-3 sentence personalized feedback for ${student.name}"
}
`;
}

module.exports = { buildTestAnalysisPrompt };

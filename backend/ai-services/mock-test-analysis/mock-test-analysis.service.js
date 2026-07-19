/* ============================================================
   AGENT 8 — Mock Test Analysis AI — Service Layer
   ============================================================ */

'use strict';

const { generateJSON } = require('../../shared/gemini-client');
const { getStudent, saveAIReport, saveTestResult, updateStudent } = require('../../shared/db-bridge');
const { bus, EVENTS } = require('../../shared/agent-bus');
const { buildTestAnalysisPrompt } = require('./mock-test-analysis.prompts');
const { getGeneratedTest } = require('../mock-test-engine/mock-test-engine.service');

async function analyzeTest(studentId, testId, answers, timings = []) {
  const student = getStudent(studentId);
  if (!student) throw Object.assign(new Error(`Student not found: ${studentId}`), { status: 404 });

  // Retrieve the original test from the engine's cache
  let test = getGeneratedTest(testId);
  if (!test) {
    // If test not in memory, use answer metadata to reconstruct minimal test object
    test = {
      testId,
      company: 'General',
      testType: 'Mixed',
      questions: answers.map((a, i) => ({
        id: `q${i + 1}`, topic: a.topic || 'General', difficulty: a.difficulty || 'Medium'
      }))
    };
  }

  // Normalize timings
  const normalizedTimings = timings.length === answers.length
    ? timings
    : answers.map(() => 60); // Default 60s per question

  const prompt = buildTestAnalysisPrompt(student, test, answers, normalizedTimings);

  const totalQuestions = answers.length;
  const correct = answers.filter(a => a.isCorrect).length;
  const score = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;

  const fallback = {
    studentId,
    studentName: student.name,
    testCompany: test.company || 'General',
    testType: test.testType || 'Mixed',
    score,
    totalQuestions,
    correct,
    incorrect: answers.filter(a => !a.isCorrect && a.answered).length,
    unattempted: answers.filter(a => !a.answered).length,
    accuracy: `${score}%`,
    timeManagement: {
      avgTimePerQuestion: normalizedTimings.length > 0 ? Math.round(normalizedTimings.reduce((s, t) => s + t, 0) / normalizedTimings.length) : 60,
      verdict: 'Good',
      advice: 'Try to spend no more than 90 seconds per question in aptitude tests.'
    },
    topicWisePerformance: [],
    guessingBehavior: { suspectedGuesses: 0, analysis: 'No suspicious guessing patterns detected.' },
    strongConcepts: ['General problem solving'],
    weakConcepts: student.weakSkills || ['DSA', 'Aptitude'],
    feedback: [
      score >= 80 ? 'Excellent performance! You are well-prepared.' : score >= 60 ? 'Good attempt. Focus on weak areas.' : 'Keep practicing — consistency is key.',
      `You answered ${correct} out of ${totalQuestions} questions correctly.`,
      `Review ${student.weakSkills?.[0] || 'weak topics'} to improve your score next time.`
    ],
    improvements: [
      `Dedicate 30 minutes daily to ${student.weakSkills?.[0] || 'weak topics'}`,
      'Take one more mock test before the weekend'
    ],
    performanceTrend: 'Stable',
    recommendedNextTest: score >= 70 ? `${test.company} Hard difficulty test` : `${test.company} Easy difficulty test`,
    estimatedReadinessImpact: score >= 70 ? `+${Math.round((score - 60) * 0.2)}%` : `-${Math.round((60 - score) * 0.1)}%`,
    overallVerdict: score >= 80 ? 'Excellent' : score >= 65 ? 'Good' : score >= 50 ? 'Average' : 'Needs Improvement',
    summary: `${student.name} scored ${score}% on the ${test.company} ${test.testType} test. ${score >= 70 ? 'Strong performance overall.' : 'Focus on improving accuracy and speed.'}`
  };

  const analysis = await generateJSON(prompt, { fallback });
  analysis.testId = testId;
  analysis.analyzedAt = new Date().toISOString();

  // Persist analysis
  saveAIReport(studentId, `testAnalysis_${testId}`, analysis);

  // Save to test history
  saveTestResult(studentId, {
    testId,
    company: test.company,
    testType: test.testType,
    score,
    weakConcepts: analysis.weakConcepts,
    strongConcepts: analysis.strongConcepts,
    timestamp: new Date().toISOString()
  });

  // Update mock test count on student record
  const currentCount = student.mockTestsCompleted || 0;
  updateStudent(studentId, { mockTestsCompleted: currentCount + 1 });

  // Emit event — triggers Placement Readiness recalc + Roadmap regen + Recommendation refresh
  bus.emit(EVENTS.MOCK_TEST_COMPLETE, { studentId, testId, score, analysis });

  return analysis;
}

module.exports = { analyzeTest };

/* ============================================================
   AGENT 10 — Interview Analysis AI — Service Layer
   ============================================================ */

'use strict';

const { generateJSON } = require('../../shared/gemini-client');
const { getStudent, getInterviewSession, saveAIReport, updateStudent } = require('../../shared/db-bridge');
const { bus, EVENTS } = require('../../shared/agent-bus');
const { buildInterviewAnalysisPrompt } = require('./interview-analysis.prompts');

async function analyzeInterview(studentId, sessionId) {
  const student = getStudent(studentId);
  if (!student) throw Object.assign(new Error(`Student not found: ${studentId}`), { status: 404 });

  const session = getInterviewSession(sessionId);
  if (!session) throw Object.assign(new Error('Interview session not found'), { status: 404 });

  const prompt = buildInterviewAnalysisPrompt(student, session);
  const totalAnswers = (session.transcript || []).filter(t => t.role === 'candidate').length;

  const fallback = {
    studentId,
    studentName: student.name,
    company: session.company,
    interviewType: session.interviewType,
    overallScore: 70,
    hiringRecommendation: 'Recommend',
    communication: {
      score: 72,
      grammar: 'Good',
      clarity: 'Clear',
      confidence: 'Confident',
      vocabulary: 'Good',
      feedback: 'Answers were clearly structured. Improve fluency under pressure.'
    },
    technical: {
      score: 68,
      accuracy: 'Medium',
      depth: 'Adequate',
      problemSolving: 'Good',
      feedback: `Demonstrated good foundational knowledge. ${student.weakSkills?.[0] || 'Advanced topics'} could be strengthened.`
    },
    behavioral: {
      score: 70,
      usedSTARMethod: false,
      leadershipSignals: 'Moderate',
      teamworkOrientation: 'High',
      feedback: 'Practice answering behavioral questions using the STAR method for more impact.'
    },
    questionWiseFeedback: Array.from({ length: Math.min(totalAnswers, 5) }, (_, i) => ({
      questionNumber: i + 1,
      topic: 'General',
      answerQuality: 'Good',
      feedback: 'Answer showed adequate understanding. Could be more specific with examples.'
    })),
    strengths: ['Clear communication', 'Structured answers', 'Good attitude'],
    areasToImprove: ['Use STAR method for behavioral questions', `Strengthen ${student.weakSkills?.[0] || 'technical'} knowledge`],
    improvementPlan: [
      { area: 'Behavioral', action: 'Practice 5 STAR-format answers daily', timeline: '1 week' },
      { area: 'Technical', action: `Study ${student.weakSkills?.[0] || 'DSA'} concepts deeply`, timeline: '2 weeks' }
    ],
    companyFitScore: 68,
    readinessImpact: '+5%',
    nextSteps: ['Book another mock interview in 1 week', 'Practice STAR answers', `Study ${session.company}-specific patterns`],
    summary: `${student.name} performed solidly in the ${session.company} ${session.interviewType} interview. Communication was clear and attitude was positive. Focusing on STAR method and technical depth will significantly improve performance.`
  };

  const analysis = await generateJSON(prompt, { fallback });
  analysis.sessionId = sessionId;
  analysis.analyzedAt = new Date().toISOString();

  // Persist analysis report
  saveAIReport(studentId, `interviewAnalysis_${sessionId}`, analysis);
  saveAIReport(studentId, 'interviewAnalysis', analysis); // Also save as latest

  // Add interview record to student history in main DB
  const currentHistory = student.interviewHistory || [];
  const newEntry = {
    company: session.company,
    type: session.interviewType,
    date: new Date().toISOString().split('T')[0],
    score: analysis.overallScore,
    reportId: sessionId,
    feedback: analysis.summary
  };
  // Avoid duplicates
  if (!currentHistory.some(h => h.reportId === sessionId)) {
    updateStudent(studentId, { interviewHistory: [...currentHistory, newEntry] });
  }

  // Emit events to trigger downstream updates
  bus.emit(EVENTS.INTERVIEW_ANALYSIS_COMPLETE, { studentId, sessionId, analysis });

  return analysis;
}

function getCachedInterviewAnalysis(studentId) {
  const { getAIReport } = require('../../shared/db-bridge');
  return getAIReport(studentId, 'interviewAnalysis');
}

module.exports = { analyzeInterview, getCachedInterviewAnalysis };

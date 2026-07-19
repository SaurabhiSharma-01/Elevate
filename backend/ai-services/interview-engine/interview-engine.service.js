/* ============================================================
   AGENT 9 — AI Mock Interview Engine — Service Layer
   ============================================================ */

'use strict';

const { v4: uuidv4 } = require('uuid');
const { generateJSON, startChat } = require('../../shared/gemini-client');
const { getStudent, saveInterviewSession, getInterviewSession } = require('../../shared/db-bridge');
const { buildSystemInstruction, buildFirstQuestionPrompt, buildFollowUpPrompt } = require('./interview-engine.prompts');

// In-memory session store: { sessionId -> { chat, metadata, transcript, questionCount } }
const activeSessions = new Map();

/**
 * Start a new interview session
 * @param {string} studentId
 * @param {string} company
 * @param {string} interviewType
 * @returns {Promise<object>} - { sessionId, firstQuestion, context }
 */
async function startInterview(studentId, company, interviewType) {
  const student = getStudent(studentId);
  if (!student) throw Object.assign(new Error(`Student not found: ${studentId}`), { status: 404 });

  const sessionId = `session_${uuidv4()}`;
  const systemInstruction = buildSystemInstruction(company, interviewType, student);
  const firstQuestionPrompt = buildFirstQuestionPrompt(company, interviewType, student);

  // Get the first question
  const firstQData = await generateJSON(firstQuestionPrompt, {
    fallback: {
      question: `Welcome ${student.name.split(' ')[0]}! Tell me about yourself and what led you to pursue a career in ${company}.`,
      questionType: 'HR',
      topic: 'Introduction',
      expectedApproach: 'Background, motivation, and goals'
    }
  });

  // Initialize Gemini chat with the system instruction
  const chat = startChat(
    [{
      role: 'user',
      parts: [{ text: `[SYSTEM] ${systemInstruction}` }]
    }, {
      role: 'model',
      parts: [{ text: `I understand. I am now acting as a ${company} ${interviewType} interviewer for ${student.name}. I will conduct a realistic interview.` }]
    }],
    { systemInstruction }
  );

  const session = {
    sessionId,
    studentId,
    company,
    interviewType,
    student: { name: student.name, branch: student.branch },
    chat,
    questionCount: 1,
    startedAt: new Date().toISOString(),
    isComplete: false,
    transcript: [{
      role: 'interviewer',
      content: firstQData.question,
      questionType: firstQData.questionType,
      topic: firstQData.topic,
      timestamp: new Date().toISOString()
    }]
  };

  activeSessions.set(sessionId, session);

  // Also persist to disk for interview analysis
  saveInterviewSession(sessionId, {
    studentId,
    company,
    interviewType,
    transcript: session.transcript,
    startedAt: session.startedAt
  });

  return {
    sessionId,
    firstQuestion: firstQData.question,
    questionType: firstQData.questionType,
    topic: firstQData.topic,
    questionNumber: 1,
    context: `${company} ${interviewType} Interview — Question 1`
  };
}

/**
 * Submit an answer and get the next question
 * @param {string} sessionId
 * @param {string} answer
 * @returns {Promise<object>} - { nextQuestion, isComplete, questionNumber }
 */
async function respondToInterview(sessionId, answer) {
  const session = activeSessions.get(sessionId);
  if (!session) throw Object.assign(new Error('Interview session not found or expired'), { status: 404 });
  if (session.isComplete) throw Object.assign(new Error('This interview session is already complete'), { status: 400 });

  // Record candidate's answer in transcript
  session.transcript.push({
    role: 'candidate',
    content: answer,
    timestamp: new Date().toISOString()
  });

  // Build follow-up prompt
  const followUpPrompt = buildFollowUpPrompt(
    session.transcript,
    answer,
    session.company,
    session.interviewType,
    session.questionCount
  );

  let nextData;
  try {
    // Try using the chat session for context-aware response
    const chatResult = await session.chat.sendMessage(
      `The candidate answered: "${answer}"\n\nNow generate your next question as the interviewer. Return ONLY JSON: ${followUpPrompt}`
    );
    const responseText = chatResult.response.text();
    const cleaned = responseText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    nextData = JSON.parse(cleaned);
  } catch (e) {
    // Fallback to standalone generation
    nextData = await generateJSON(followUpPrompt, {
      fallback: {
        question: session.questionCount >= 10
          ? `Thank you for your responses today. Do you have any questions for us?`
          : `Interesting! Can you elaborate more on that?`,
        questionType: 'General',
        topic: 'Follow-up',
        feedback: 'Unable to assess this answer automatically.',
        isComplete: session.questionCount >= 10,
        closingNote: session.questionCount >= 10 ? 'Thank you for your time. We will get back to you.' : null
      }
    });
  }

  session.questionCount++;
  const isComplete = nextData.isComplete || session.questionCount > 12;
  session.isComplete = isComplete;

  // Record interviewer's next question
  session.transcript.push({
    role: 'interviewer',
    content: isComplete ? (nextData.closingNote || 'Thank you for your time. The interview is now complete.') : nextData.question,
    questionType: nextData.questionType,
    topic: nextData.topic,
    feedback: nextData.feedback, // Internal, not shown to candidate
    timestamp: new Date().toISOString()
  });

  // Sync transcript to disk
  saveInterviewSession(sessionId, {
    studentId: session.studentId,
    company: session.company,
    interviewType: session.interviewType,
    transcript: session.transcript,
    startedAt: session.startedAt,
    isComplete,
    endedAt: isComplete ? new Date().toISOString() : null
  });

  return {
    nextQuestion: isComplete
      ? (nextData.closingNote || 'Thank you for your time. The interview is now complete.')
      : nextData.question,
    questionType: nextData.questionType,
    topic: nextData.topic,
    questionNumber: session.questionCount,
    isComplete,
    context: `Question ${session.questionCount} of ~10`
  };
}

/**
 * Formally end an interview session and get the full transcript
 * @param {string} sessionId
 * @returns {object} - { transcript, summary }
 */
function endInterview(sessionId) {
  const session = activeSessions.get(sessionId);
  if (!session) {
    const saved = getInterviewSession(sessionId);
    if (saved) return { transcript: saved.transcript, summary: 'Interview session retrieved from storage.' };
    throw Object.assign(new Error('Interview session not found'), { status: 404 });
  }

  session.isComplete = true;
  const transcript = session.transcript;

  // Persist final state
  saveInterviewSession(sessionId, {
    studentId: session.studentId,
    company: session.company,
    interviewType: session.interviewType,
    transcript,
    startedAt: session.startedAt,
    isComplete: true,
    endedAt: new Date().toISOString()
  });

  return {
    sessionId,
    transcript,
    totalQuestions: session.questionCount - 1,
    duration: `${Math.round((Date.now() - new Date(session.startedAt).getTime()) / 60000)} minutes`,
    summary: `${session.student.name} completed a ${session.company} ${session.interviewType} interview with ${session.questionCount - 1} questions.`
  };
}

module.exports = { startInterview, respondToInterview, endInterview };

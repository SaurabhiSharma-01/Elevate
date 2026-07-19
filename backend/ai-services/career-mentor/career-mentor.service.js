/* ============================================================
   AGENT 12 — Career Mentor AI — Service Layer
   This is the ONLY conversational chatbot.
   It consumes data from ALL other agents and answers using
   the student's real performance data.
   ============================================================ */

'use strict';

const { generateText } = require('../../shared/gemini-client');
const { getStudent, getAllAIReports, getTestHistory, getRoadmap, saveAIReport } = require('../../shared/db-bridge');
const { buildMentorReplyPrompt } = require('./career-mentor.prompts');

// In-memory conversation sessions: { sessionId -> { studentId, history[] } }
const mentorSessions = new Map();

/**
 * Send a message to the Career Mentor and get a response
 * @param {string} studentId
 * @param {string} message
 * @param {string|null} sessionId - Continue existing session or start new one
 * @returns {Promise<object>} - { reply, sessionId, suggestedActions }
 */
async function chat(studentId, message, sessionId = null) {
  const student = getStudent(studentId);
  if (!student) throw Object.assign(new Error(`Student not found: ${studentId}`), { status: 404 });

  // Get or create session
  let session;
  if (sessionId && mentorSessions.has(sessionId)) {
    session = mentorSessions.get(sessionId);
  } else {
    sessionId = `mentor_${Date.now()}_${studentId}`;
    session = { studentId, history: [] };
    mentorSessions.set(sessionId, session);
  }

  // Gather all AI data for this student
  const allReports = getAllAIReports(studentId);
  const testHistory = getTestHistory(studentId);
  const roadmap = getRoadmap(studentId);

  // Augment allReports with roadmap if available
  if (roadmap) allReports.roadmap = roadmap;

  // Add user message to history
  session.history.push({ role: 'user', content: message });

  // Build the full prompt
  const prompt = buildMentorReplyPrompt(student, allReports, testHistory, session.history, message);

  // Generate reply
  let reply;
  try {
    reply = await generateText(prompt, { temperature: 0.8 });
  } catch (e) {
    reply = generateFallbackReply(student, message, allReports, testHistory);
  }

  // Add AI response to history
  session.history.push({ role: 'assistant', content: reply });

  // Keep history to last 20 messages (10 pairs)
  if (session.history.length > 20) {
    session.history = session.history.slice(-20);
  }

  // Generate suggested follow-up actions based on message context
  const suggestedActions = generateSuggestedActions(message, student, allReports);

  // Save conversation snippet
  saveAIReport(studentId, 'mentorLastSession', {
    sessionId,
    lastMessage: message,
    lastReply: reply,
    historyLength: session.history.length
  });

  return { reply, sessionId, suggestedActions };
}

/**
 * Generate a contextual fallback reply without AI
 */
function generateFallbackReply(student, message, allReports, testHistory) {
  const readiness = allReports.placementReadiness?.placementReadinessScore || student.readiness || 60;
  const msg = message.toLowerCase();

  if (msg.includes('placement ready') || msg.includes('am i ready')) {
    return `${student.name.split(' ')[0]}, your current Placement Readiness Score is ${readiness}/100. ${
      readiness >= 80 ? "You're in great shape! Focus on company-specific mock tests now." :
      readiness >= 60 ? "You're getting there! Focus on your weak areas: " + (student.weakSkills || ['DSA']).slice(0, 2).join(' and ') + "." :
      "There's room to grow. Let's intensify practice in " + (student.weakSkills || ['DSA'])[0] + " this week."
    } Try taking a full mock test to boost your score!`;
  }

  if (msg.includes('study today') || msg.includes('what should i')) {
    const weakArea = (student.weakSkills || ['DSA'])[0];
    return `For today, I recommend focusing on ${weakArea}. Spend at least ${Math.max(student.todayHours || 2, 2)} hours practicing. Solve 5-10 problems on LeetCode related to ${weakArea}, then review your notes. Consistency is key, ${student.name.split(' ')[0]}!`;
  }

  if (msg.includes('company') || msg.includes('suit me')) {
    return `Based on your profile (CGPA: ${student.cgpa}, ${student.branch}), your target company ${student.targetCompany} seems like a good fit! You currently have ${readiness}% readiness for them. Would you like me to analyze your fit with other companies like TCS, Infosys, or Microsoft?`;
  }

  if (msg.includes('score decrease') || msg.includes('score drop')) {
    return `Your readiness score can decrease when weak areas haven't been practiced recently. The main factors affecting your score are mock test performance, study consistency, and skill assessments. To recover, take a mock test today and focus on ${(student.weakSkills || ['DSA'])[0]} for the next 3 days.`;
  }

  return `I'm here to help you with your career journey, ${student.name.split(' ')[0]}! Your current readiness is ${readiness}/100. Ask me anything about your preparation, study plan, or company targeting!`;
}

/**
 * Generate suggested quick actions based on conversation context
 */
function generateSuggestedActions(message, student, allReports) {
  const msg = message.toLowerCase();
  const readiness = allReports.placementReadiness?.placementReadinessScore || student.readiness || 60;

  const actions = [];

  if (readiness < 70) actions.push('Take a Mock Test now');
  if (msg.includes('company') || msg.includes('ready')) actions.push(`Check ${student.targetCompany} Company Match`);
  if (msg.includes('study') || msg.includes('learn')) actions.push('View My Learning Roadmap');
  if (msg.includes('resume')) actions.push('Analyze My Resume');
  if (msg.includes('interview')) actions.push('Start a Mock Interview');
  if (actions.length === 0) {
    actions.push('View My Progress Analytics', 'Get Personalized Recommendations');
  }

  return actions.slice(0, 3);
}

/**
 * Get conversation history for a session
 */
function getSessionHistory(sessionId) {
  const session = mentorSessions.get(sessionId);
  return session ? session.history : [];
}

module.exports = { chat, getSessionHistory };

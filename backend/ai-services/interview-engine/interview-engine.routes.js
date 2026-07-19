/* ============================================================
   AGENT 9 — AI Mock Interview Engine — Routes
   ============================================================ */

'use strict';

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../middleware/error-handler');
const { validateStudentId, validateInterviewType, requireFields } = require('../../shared/validators');
const { startInterview, respondToInterview, endInterview } = require('./interview-engine.service');

/** POST /api/ai/interview/start — Start a new interview session */
router.post('/start', asyncHandler(async (req, res) => {
  const { studentId, company, interviewType } = req.body;

  const v1 = validateStudentId(studentId);
  if (!v1.valid) return res.status(400).json({ success: false, error: v1.error });

  const v2 = requireFields(req.body, ['company', 'interviewType']);
  if (!v2.valid) return res.status(400).json({ success: false, error: v2.error });

  const v3 = validateInterviewType(interviewType);
  if (!v3.valid) return res.status(400).json({ success: false, error: v3.error });

  const session = await startInterview(studentId, company, interviewType);
  res.json({ success: true, session });
}));

/** POST /api/ai/interview/respond — Submit an answer and get next question */
router.post('/respond', asyncHandler(async (req, res) => {
  const { sessionId, answer } = req.body;

  const v = requireFields(req.body, ['sessionId', 'answer']);
  if (!v.valid) return res.status(400).json({ success: false, error: v.error });

  const response = await respondToInterview(sessionId, answer);
  res.json({ success: true, response });
}));

/** POST /api/ai/interview/end — End a session and get full transcript */
router.post('/end', asyncHandler(async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ success: false, error: 'sessionId is required' });

  const result = endInterview(sessionId);
  res.json({ success: true, result });
}));

module.exports = router;

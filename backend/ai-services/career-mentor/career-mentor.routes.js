/* ============================================================
   AGENT 12 — Career Mentor AI — Routes
   ============================================================ */

'use strict';

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../middleware/error-handler');
const { validateStudentId, requireFields, sanitize } = require('../../shared/validators');
const { chat, getSessionHistory } = require('./career-mentor.service');

/** POST /api/ai/mentor/chat — Send a message to the Career Mentor */
router.post('/chat', asyncHandler(async (req, res) => {
  const { studentId, message, sessionId } = req.body;

  const v1 = validateStudentId(studentId);
  if (!v1.valid) return res.status(400).json({ success: false, error: v1.error });

  const v2 = requireFields(req.body, ['message']);
  if (!v2.valid) return res.status(400).json({ success: false, error: v2.error });

  const safeMessage = sanitize(message);
  if (!safeMessage) return res.status(400).json({ success: false, error: 'Message cannot be empty' });

  const result = await chat(studentId, safeMessage, sessionId || null);
  res.json({ success: true, ...result });
}));

/** GET /api/ai/mentor/history/:sessionId — Get conversation history */
router.get('/history/:sessionId', asyncHandler(async (req, res) => {
  const history = getSessionHistory(req.params.sessionId);
  res.json({ success: true, history, count: history.length });
}));

module.exports = router;

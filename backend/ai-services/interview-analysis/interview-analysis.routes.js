/* ============================================================
   AGENT 10 — Interview Analysis AI — Routes
   ============================================================ */

'use strict';

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../middleware/error-handler');
const { validateStudentId, requireFields } = require('../../shared/validators');
const { analyzeInterview, getCachedInterviewAnalysis } = require('./interview-analysis.service');

/** POST /api/ai/interview/analyze — Analyze a completed interview */
router.post('/analyze', asyncHandler(async (req, res) => {
  const { studentId, sessionId } = req.body;

  const v1 = validateStudentId(studentId);
  if (!v1.valid) return res.status(400).json({ success: false, error: v1.error });

  const v2 = requireFields(req.body, ['sessionId']);
  if (!v2.valid) return res.status(400).json({ success: false, error: v2.error });

  const analysis = await analyzeInterview(studentId, sessionId);
  res.json({ success: true, analysis });
}));

/** GET /api/ai/interview/analysis/:studentId — Get latest interview analysis */
router.get('/analysis/:studentId', asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const v = validateStudentId(studentId);
  if (!v.valid) return res.status(400).json({ success: false, error: v.error });

  const analysis = getCachedInterviewAnalysis(studentId);
  if (!analysis) {
    return res.status(404).json({ success: false, message: 'No interview analysis found. Complete a mock interview first.' });
  }
  res.json({ success: true, analysis });
}));

module.exports = router;

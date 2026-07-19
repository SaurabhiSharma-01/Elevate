/* ============================================================
   AGENT 6 — Progress Analytics AI — Routes
   ============================================================ */

'use strict';

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../middleware/error-handler');
const { validateStudentId } = require('../../shared/validators');
const { analyzeProgress, getCachedProgress } = require('./progress-analytics.service');

/** GET /api/ai/progress/:studentId */
router.get('/:studentId', asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const v = validateStudentId(studentId);
  if (!v.valid) return res.status(400).json({ success: false, error: v.error });

  const cached = getCachedProgress(studentId);
  if (cached) return res.json({ success: true, analytics: cached });

  const analytics = await analyzeProgress(studentId);
  res.json({ success: true, analytics });
}));

/** POST /api/ai/progress — Force-refresh analytics */
router.post('/', asyncHandler(async (req, res) => {
  const { studentId } = req.body;
  const v = validateStudentId(studentId);
  if (!v.valid) return res.status(400).json({ success: false, error: v.error });

  const analytics = await analyzeProgress(studentId);
  res.json({ success: true, analytics });
}));

module.exports = router;

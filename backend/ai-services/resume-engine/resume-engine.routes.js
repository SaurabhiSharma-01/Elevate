/* ============================================================
   AGENT 11 — Resume AI — Routes
   ============================================================ */

'use strict';

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../middleware/error-handler');
const { validateStudentId, requireFields, sanitize } = require('../../shared/validators');
const { analyzeResume, getCachedResumeReview } = require('./resume-engine.service');

/** POST /api/ai/resume/analyze — Analyze a resume */
router.post('/analyze', asyncHandler(async (req, res) => {
  const { studentId, resumeText } = req.body;

  const v1 = validateStudentId(studentId);
  if (!v1.valid) return res.status(400).json({ success: false, error: v1.error });

  const safeText = sanitize(resumeText || '');
  const report = await analyzeResume(studentId, safeText);
  res.json({ success: true, report });
}));

/** GET /api/ai/resume/:studentId — Get cached resume review */
router.get('/:studentId', asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const v = validateStudentId(studentId);
  if (!v.valid) return res.status(400).json({ success: false, error: v.error });

  const report = getCachedResumeReview(studentId);
  if (!report) {
    return res.status(404).json({ success: false, message: 'No resume review found. POST to /api/ai/resume/analyze to generate one.' });
  }
  res.json({ success: true, report });
}));

module.exports = router;

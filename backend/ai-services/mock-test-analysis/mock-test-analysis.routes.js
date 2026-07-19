/* ============================================================
   AGENT 8 — Mock Test Analysis AI — Routes
   ============================================================ */

'use strict';

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../middleware/error-handler');
const { validateStudentId, requireFields } = require('../../shared/validators');
const { analyzeTest } = require('./mock-test-analysis.service');

/** POST /api/ai/mock-test/analyze — Submit and analyze a completed test */
router.post('/analyze', asyncHandler(async (req, res) => {
  const { studentId, testId, answers = [], timings = [] } = req.body;

  const v1 = validateStudentId(studentId);
  if (!v1.valid) return res.status(400).json({ success: false, error: v1.error });

  const v2 = requireFields(req.body, ['testId']);
  if (!v2.valid) return res.status(400).json({ success: false, error: v2.error });

  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ success: false, error: 'answers must be a non-empty array' });
  }

  const analysis = await analyzeTest(studentId, testId, answers, timings);
  res.json({ success: true, analysis });
}));

module.exports = router;

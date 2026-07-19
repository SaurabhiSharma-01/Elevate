/* ============================================================
   AGENT 7 — Mock Test Engine AI — Routes
   ============================================================ */

'use strict';

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../middleware/error-handler');
const { validateStudentId, validateTestType, requireFields } = require('../../shared/validators');
const { generateMockTest, getGeneratedTest } = require('./mock-test-engine.service');

/** POST /api/ai/mock-test/generate — Generate a new test */
router.post('/generate', asyncHandler(async (req, res) => {
  const { studentId, company, role, testType, difficulty } = req.body;

  const v1 = validateStudentId(studentId);
  if (!v1.valid) return res.status(400).json({ success: false, error: v1.error });

  const v2 = requireFields(req.body, ['company', 'testType']);
  if (!v2.valid) return res.status(400).json({ success: false, error: v2.error });

  const v3 = validateTestType(testType);
  if (!v3.valid) return res.status(400).json({ success: false, error: v3.error });

  const test = await generateMockTest(studentId, company, role, testType, difficulty);
  res.json({ success: true, test });
}));

/** GET /api/ai/mock-test/:testId — Retrieve a generated test */
router.get('/:testId', asyncHandler(async (req, res) => {
  const { testId } = req.params;
  const test = getGeneratedTest(testId);
  if (!test) {
    return res.status(404).json({ success: false, message: 'Test not found. It may have expired from server memory.' });
  }
  res.json({ success: true, test });
}));

module.exports = router;

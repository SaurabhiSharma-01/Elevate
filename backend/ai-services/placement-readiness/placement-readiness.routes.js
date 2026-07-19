/* ============================================================
   AGENT 2 — Placement Readiness AI
   Route Definitions
   ============================================================ */

'use strict';

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../middleware/error-handler');
const { validateStudentId } = require('../../shared/validators');
const { calculateReadiness, getCachedReadiness } = require('./placement-readiness.service');

/**
 * POST /api/ai/placement-readiness
 * Calculate or recalculate a student's Placement Readiness Score
 * Body: { studentId }
 */
router.post('/', asyncHandler(async (req, res) => {
  const { studentId } = req.body;
  const v = validateStudentId(studentId);
  if (!v.valid) return res.status(400).json({ success: false, error: v.error });

  const report = await calculateReadiness(studentId);
  res.json({ success: true, report });
}));

/**
 * GET /api/ai/placement-readiness/:studentId
 * Get the latest cached Placement Readiness Score
 */
router.get('/:studentId', asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const v = validateStudentId(studentId);
  if (!v.valid) return res.status(400).json({ success: false, error: v.error });

  const report = getCachedReadiness(studentId);
  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'No readiness report found. POST to /api/ai/placement-readiness to generate one.'
    });
  }
  res.json({ success: true, report });
}));

module.exports = router;

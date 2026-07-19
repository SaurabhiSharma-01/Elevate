/* ============================================================
   AGENT 4 — Learning Recommendation AI — Routes
   ============================================================ */

'use strict';

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../middleware/error-handler');
const { validateStudentId } = require('../../shared/validators');
const { getRecommendations, getCachedRecommendations } = require('./recommendation-engine.service');

/** GET /api/ai/recommendations/:studentId — Get cached recommendations */
router.get('/:studentId', asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const v = validateStudentId(studentId);
  if (!v.valid) return res.status(400).json({ success: false, error: v.error });

  const cached = getCachedRecommendations(studentId);
  if (cached) return res.json({ success: true, recommendations: cached });

  // Auto-generate if not cached
  const recommendations = await getRecommendations(studentId);
  res.json({ success: true, recommendations });
}));

/** POST /api/ai/recommendations — Force-regenerate */
router.post('/', asyncHandler(async (req, res) => {
  const { studentId } = req.body;
  const v = validateStudentId(studentId);
  if (!v.valid) return res.status(400).json({ success: false, error: v.error });

  const recommendations = await getRecommendations(studentId);
  res.json({ success: true, recommendations });
}));

module.exports = router;

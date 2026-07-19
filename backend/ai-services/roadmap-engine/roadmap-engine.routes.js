/* ============================================================
   AGENT 3 — Personalized Roadmap AI
   Route Definitions
   ============================================================ */

'use strict';

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../middleware/error-handler');
const { validateStudentId } = require('../../shared/validators');
const { generateRoadmap, getCachedRoadmap } = require('./roadmap-engine.service');

/** POST /api/ai/roadmap — Generate a new roadmap */
router.post('/', asyncHandler(async (req, res) => {
  const { studentId, targetCompany = '', studyHoursPerDay = 0 } = req.body;
  const v = validateStudentId(studentId);
  if (!v.valid) return res.status(400).json({ success: false, error: v.error });

  const roadmap = await generateRoadmap(studentId, targetCompany, studyHoursPerDay);
  res.json({ success: true, roadmap });
}));

/** GET /api/ai/roadmap/:studentId — Get cached roadmap */
router.get('/:studentId', asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const v = validateStudentId(studentId);
  if (!v.valid) return res.status(400).json({ success: false, error: v.error });

  const roadmap = getCachedRoadmap(studentId);
  if (!roadmap) {
    return res.status(404).json({ success: false, message: 'No roadmap found. POST to /api/ai/roadmap to generate one.' });
  }
  res.json({ success: true, roadmap });
}));

module.exports = router;

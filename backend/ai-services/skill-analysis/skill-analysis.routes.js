/* ============================================================
   AGENT 1 — Skill Analysis AI
   Route Definitions
   ============================================================ */

'use strict';

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../middleware/error-handler');
const { requireFields, validateStudentId } = require('../../shared/validators');
const { analyzeSkills, getCachedSkillAnalysis } = require('./skill-analysis.service');

/**
 * POST /api/ai/skill-analysis
 * Analyze a student's skills based on assessment answers + profile
 *
 * Body: { studentId, answers?, department?, semester? }
 * Returns: Full skill analysis report
 */
router.post('/', asyncHandler(async (req, res) => {
  const { studentId, answers = [], department = '', semester = '' } = req.body;

  const v = validateStudentId(studentId);
  if (!v.valid) return res.status(400).json({ success: false, error: v.error });

  const report = await analyzeSkills(studentId, answers, department, semester);
  res.json({ success: true, report });
}));

/**
 * GET /api/ai/skill-analysis/:studentId
 * Return the latest cached skill analysis without re-running Gemini
 */
router.get('/:studentId', asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const v = validateStudentId(studentId);
  if (!v.valid) return res.status(400).json({ success: false, error: v.error });

  const report = getCachedSkillAnalysis(studentId);
  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'No skill analysis found. POST to /api/ai/skill-analysis to generate one.'
    });
  }
  res.json({ success: true, report });
}));

module.exports = router;

/* ============================================================
   AGENT 5 — Company Match AI — Routes
   ============================================================ */

'use strict';

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../middleware/error-handler');
const { validateStudentId, requireFields } = require('../../shared/validators');
const { matchStudentToCompany, matchAllCompanies, COMPANY_PROFILES } = require('./company-match.service');

/** POST /api/ai/company-match — Match student to a specific company */
router.post('/', asyncHandler(async (req, res) => {
  const { studentId, company } = req.body;
  const v1 = validateStudentId(studentId);
  if (!v1.valid) return res.status(400).json({ success: false, error: v1.error });
  const v2 = requireFields(req.body, ['company']);
  if (!v2.valid) return res.status(400).json({ success: false, error: v2.error });

  const report = await matchStudentToCompany(studentId, company);
  res.json({ success: true, report });
}));

/** GET /api/ai/company-match/:studentId/all — Match against all known companies */
router.get('/:studentId/all', asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const v = validateStudentId(studentId);
  if (!v.valid) return res.status(400).json({ success: false, error: v.error });

  const reports = await matchAllCompanies(studentId);
  res.json({ success: true, totalCompanies: reports.length, reports });
}));

/** GET /api/ai/company-match/companies — List all known companies */
router.get('/companies', (req, res) => {
  res.json({ success: true, companies: Object.keys(COMPANY_PROFILES) });
});

module.exports = router;

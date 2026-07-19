/* ============================================================
   ELEVATE AI ECOSYSTEM — Central API Router
   Aggregates all 12 AI agent routers under /api/ai/
   ============================================================ */

'use strict';

const express = require('express');
const router = express.Router();

// ─── Import all 12 Agent Routers ─────────────────────────────────────────────

const skillAnalysisRoutes       = require('../ai-services/skill-analysis/skill-analysis.routes');
const placementReadinessRoutes  = require('../ai-services/placement-readiness/placement-readiness.routes');
const roadmapRoutes             = require('../ai-services/roadmap-engine/roadmap-engine.routes');
const recommendationRoutes      = require('../ai-services/recommendation-engine/recommendation-engine.routes');
const companyMatchRoutes        = require('../ai-services/company-match/company-match.routes');
const progressAnalyticsRoutes   = require('../ai-services/progress-analytics/progress-analytics.routes');
const mockTestEngineRoutes      = require('../ai-services/mock-test-engine/mock-test-engine.routes');
const mockTestAnalysisRoutes    = require('../ai-services/mock-test-analysis/mock-test-analysis.routes');
const interviewEngineRoutes     = require('../ai-services/interview-engine/interview-engine.routes');
const interviewAnalysisRoutes   = require('../ai-services/interview-analysis/interview-analysis.routes');
const resumeEngineRoutes        = require('../ai-services/resume-engine/resume-engine.routes');
const careerMentorRoutes        = require('../ai-services/career-mentor/career-mentor.routes');

// ─── Mount Routers ────────────────────────────────────────────────────────────

router.use('/skill-analysis',        skillAnalysisRoutes);
router.use('/placement-readiness',   placementReadinessRoutes);
router.use('/roadmap',               roadmapRoutes);
router.use('/recommendations',       recommendationRoutes);
router.use('/company-match',         companyMatchRoutes);
router.use('/progress',              progressAnalyticsRoutes);
router.use('/mock-test',             mockTestEngineRoutes);
router.use('/mock-test',             mockTestAnalysisRoutes);  // Shares /mock-test prefix
router.use('/interview',             interviewEngineRoutes);
router.use('/interview',             interviewAnalysisRoutes); // Shares /interview prefix
router.use('/resume',                resumeEngineRoutes);
router.use('/mentor',                careerMentorRoutes);

// ─── Health Check & Route Index ───────────────────────────────────────────────

router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Elevate AI Ecosystem',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    agents: {
      'Agent 1 - Skill Analysis':        { post: 'POST /api/ai/skill-analysis', get: 'GET /api/ai/skill-analysis/:studentId' },
      'Agent 2 - Placement Readiness':   { post: 'POST /api/ai/placement-readiness', get: 'GET /api/ai/placement-readiness/:studentId' },
      'Agent 3 - Roadmap Engine':        { post: 'POST /api/ai/roadmap', get: 'GET /api/ai/roadmap/:studentId' },
      'Agent 4 - Recommendations':       { get: 'GET /api/ai/recommendations/:studentId', post: 'POST /api/ai/recommendations' },
      'Agent 5 - Company Match':         { post: 'POST /api/ai/company-match', all: 'GET /api/ai/company-match/:studentId/all', companies: 'GET /api/ai/company-match/companies' },
      'Agent 6 - Progress Analytics':    { get: 'GET /api/ai/progress/:studentId', post: 'POST /api/ai/progress' },
      'Agent 7 - Mock Test Engine':      { generate: 'POST /api/ai/mock-test/generate', get: 'GET /api/ai/mock-test/:testId' },
      'Agent 8 - Mock Test Analysis':    { analyze: 'POST /api/ai/mock-test/analyze' },
      'Agent 9 - Interview Engine':      { start: 'POST /api/ai/interview/start', respond: 'POST /api/ai/interview/respond', end: 'POST /api/ai/interview/end' },
      'Agent 10 - Interview Analysis':   { analyze: 'POST /api/ai/interview/analyze', get: 'GET /api/ai/interview/analysis/:studentId' },
      'Agent 11 - Resume Engine':        { analyze: 'POST /api/ai/resume/analyze', get: 'GET /api/ai/resume/:studentId' },
      'Agent 12 - Career Mentor':        { chat: 'POST /api/ai/mentor/chat', history: 'GET /api/ai/mentor/history/:sessionId' },
    }
  });
});

module.exports = router;

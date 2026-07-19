/* ============================================================
   ELEVATE AI ECOSYSTEM — Main Entry Point
   Runs as a separate Express server on port 5001.
   Zero conflict with the existing frontend server on port 5000.
   ============================================================ */

'use strict';

// Load environment variables from .env file
// Uses CWD — always run from the Elevate- project root
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

// Debug: confirm key loaded
if (process.env.GEMINI_API_KEY) {
  console.log('[AI Server] ✅ GEMINI_API_KEY loaded successfully.');
} else {
  console.warn('[AI Server] ⚠️  GEMINI_API_KEY not found in .env — check the file is in the Elevate- root folder.');
}

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const aiRouter = require('./api/ai-router');
const { errorHandler, notFoundHandler } = require('./middleware/error-handler');

const app = express();
const AI_PORT = process.env.AI_PORT || 5001;

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(cors({
  origin: [
    'http://localhost:5000',   // Main frontend server
    'http://127.0.0.1:5000',
    'http://localhost:3000',   // React dev server (if used in future)
    'http://127.0.0.1:3000',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(bodyParser.json({ limit: '10mb' })); // Allow large resume text
app.use(bodyParser.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} — ${duration}ms`);
  });
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────

// Mount all AI routes under /api/ai
app.use('/api/ai', aiRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Elevate AI Ecosystem',
    version: '1.0.0',
    status: 'Running',
    port: AI_PORT,
    healthCheck: `http://localhost:${AI_PORT}/api/ai/health`,
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    message: process.env.GEMINI_API_KEY
      ? '✅ Gemini API is configured. All 12 AI agents are active.'
      : '⚠️  GEMINI_API_KEY not set. Agents will use intelligent fallback responses. Add key to .env to enable full AI.',
    agents: 12,
    architecture: 'Multi-Agent AI System',
    developer: 'Elevate — Developer 2 (AI Ecosystem)'
  });
});

// ─── Error Handling (must be LAST) ───────────────────────────────────────────

app.use(notFoundHandler);
app.use(errorHandler);

// ─── Boot ─────────────────────────────────────────────────────────────────────

app.listen(AI_PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║          ELEVATE AI ECOSYSTEM — MULTI-AGENT SYSTEM          ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log(`║  🚀  AI Server running at: http://localhost:${AI_PORT}           ║`);
  console.log(`║  📋  Health Check:  http://localhost:${AI_PORT}/api/ai/health    ║`);
  console.log(`║  🔑  Gemini API:    ${process.env.GEMINI_API_KEY ? '✅  Configured' : '⚠️   Not configured (add to .env)'}                  ║`);
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log('║  12 AI AGENTS ACTIVE:                                        ║');
  console.log('║  1. Skill Analysis AI         7. Mock Test Engine AI         ║');
  console.log('║  2. Placement Readiness AI    8. Mock Test Analysis AI       ║');
  console.log('║  3. Roadmap Engine AI         9. Interview Engine AI         ║');
  console.log('║  4. Recommendation AI        10. Interview Analysis AI       ║');
  console.log('║  5. Company Match AI         11. Resume Engine AI            ║');
  console.log('║  6. Progress Analytics AI    12. Career Mentor AI            ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');
});

module.exports = app;

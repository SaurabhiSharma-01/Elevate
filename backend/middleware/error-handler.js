/* ============================================================
   ELEVATE AI ECOSYSTEM — Central Error Handler Middleware
   ============================================================ */

'use strict';

/**
 * Async route wrapper — catches errors from async route handlers
 * and passes them to Express error middleware.
 * Usage: router.post('/path', asyncHandler(myAsyncFn))
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Central error handler middleware
 * Must be registered LAST in the Express app (after all routes).
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(`[ErrorHandler] ${req.method} ${req.path} — ${err.message}`);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: err.message,
    });
  }

  if (err.message && err.message.includes('Gemini API error')) {
    return res.status(503).json({
      success: false,
      error: 'AI Service Unavailable',
      message: err.message,
      hint: 'Ensure GEMINI_API_KEY is set in .env and the API is reachable.',
    });
  }

  if (err.message && err.message.includes('malformed JSON')) {
    return res.status(500).json({
      success: false,
      error: 'AI Response Error',
      message: 'The AI returned an unexpected response format. Please retry.',
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.',
  });
}

/**
 * 404 handler — catches requests that don't match any route
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `AI endpoint not found: ${req.method} ${req.path}`,
    availableRoutes: 'See GET /api/ai/health for the full route list.',
  });
}

module.exports = { asyncHandler, errorHandler, notFoundHandler };

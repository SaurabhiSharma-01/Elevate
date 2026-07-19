/* ============================================================
   ELEVATE — Auth Utilities
   Password hashing, JWT management, student password generation
   ============================================================ */

'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ─── Config ──────────────────────────────────────────────────────────────────

const BCRYPT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'elevate_dev_secret_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

// ─── Password Hashing ─────────────────────────────────────────────────────────

/**
 * Hash a plain-text password.
 * @param {string} plain
 * @returns {Promise<string>} bcrypt hash
 */
async function hashPassword(plain) {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

/**
 * Verify a plain-text password against a stored hash.
 * @param {string} plain
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

// ─── Student Password Generation ──────────────────────────────────────────────

/**
 * Generate a student's initial temporary password.
 * 
 * FORMAT (configurable): FirstName + PassingYear
 * Example: "Priya2025" for Priya Sharma passing in 2025
 * 
 * To change the format in the future, update this function only.
 * 
 * @param {string} name        Full student name
 * @param {string|number} passingYear  e.g. 2025
 * @returns {string} Generated plain-text password
 */
function generateStudentPassword(name, passingYear) {
  const firstName = name.trim().split(' ')[0];
  return `${firstName}${passingYear}`;
}

// ─── JWT ──────────────────────────────────────────────────────────────────────

/**
 * Sign a JWT with the given payload.
 * @param {object} payload  e.g. { id, role, email }
 * @returns {string} signed JWT
 */
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify and decode a JWT.
 * @param {string} token
 * @returns {object|null} decoded payload or null if invalid/expired
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Express middleware: require a valid JWT in Authorization header.
 * Sets req.user = decoded payload on success.
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token. Please log in again.' });
  }

  req.user = decoded;
  next();
}

/**
 * Express middleware: require a specific role.
 * @param {string} role  'tnp' | 'student' | 'company'
 */
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ success: false, message: `Access denied. This route requires '${role}' role.` });
    }
    next();
  };
}

// ─── Email Domain Validation ──────────────────────────────────────────────────

/**
 * Validate that an email belongs to the authorised T&P domain.
 * @param {string} email
 * @returns {boolean}
 */
function isValidTnpEmail(email) {
  return typeof email === 'string' && email.toLowerCase().endsWith('@raisoni.net');
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateStudentPassword,
  generateToken,
  verifyToken,
  requireAuth,
  requireRole,
  isValidTnpEmail,
};

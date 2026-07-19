/* ============================================================
   ELEVATE AI ECOSYSTEM — Input Validators
   Shared validation helpers for all AI agent endpoints.
   ============================================================ */

'use strict';

/**
 * Validate that required fields exist and are non-empty
 * @param {object} body - Request body
 * @param {string[]} fields - Required field names
 * @returns {{ valid: boolean, error?: string }}
 */
function requireFields(body, fields) {
  for (const field of fields) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      return { valid: false, error: `Missing required field: "${field}"` };
    }
  }
  return { valid: true };
}

/**
 * Validate studentId format (basic check)
 * @param {string} studentId
 * @returns {{ valid: boolean, error?: string }}
 */
function validateStudentId(studentId) {
  if (!studentId || typeof studentId !== 'string' || studentId.trim().length < 3) {
    return { valid: false, error: 'Invalid studentId. Must be a non-empty string.' };
  }
  return { valid: true };
}

/**
 * Validate that a value is a non-empty string
 */
function isNonEmptyString(val) {
  return typeof val === 'string' && val.trim().length > 0;
}

/**
 * Validate company name against known list
 * @param {string} company
 * @returns {{ valid: boolean, error?: string }}
 */
const KNOWN_COMPANIES = [
  'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple',
  'TCS', 'Infosys', 'Wipro', 'Accenture', 'Capgemini',
  'Cognizant', 'HCL', 'Tech Mahindra', 'Deloitte',
  'IBM', 'Oracle', 'Salesforce', 'Adobe', 'Samsung',
];

function validateCompany(company) {
  if (!isNonEmptyString(company)) {
    return { valid: false, error: 'Company name must be a non-empty string.' };
  }
  // Accept any company name (not restricted to known list — open for future additions)
  return { valid: true };
}

/**
 * Validate interview type
 */
const VALID_INTERVIEW_TYPES = ['HR', 'Technical', 'Behavioral', 'Coding', 'Managerial', 'Resume-Based'];

function validateInterviewType(type) {
  if (!VALID_INTERVIEW_TYPES.includes(type)) {
    return {
      valid: false,
      error: `Invalid interview type. Must be one of: ${VALID_INTERVIEW_TYPES.join(', ')}`
    };
  }
  return { valid: true };
}

/**
 * Validate test type
 */
const VALID_TEST_TYPES = ['Technical', 'Coding', 'Aptitude', 'Communication', 'Company-OA'];

function validateTestType(type) {
  if (!VALID_TEST_TYPES.includes(type)) {
    return {
      valid: false,
      error: `Invalid test type. Must be one of: ${VALID_TEST_TYPES.join(', ')}`
    };
  }
  return { valid: true };
}

/**
 * Validate difficulty level
 */
function validateDifficulty(difficulty) {
  const valid = ['Easy', 'Medium', 'Hard', 'Mixed'];
  if (!valid.includes(difficulty)) {
    return { valid: false, error: `Difficulty must be one of: ${valid.join(', ')}` };
  }
  return { valid: true };
}

/**
 * Sanitize string input — remove dangerous characters
 */
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').trim().slice(0, 5000);
}

module.exports = {
  requireFields,
  validateStudentId,
  validateCompany,
  validateInterviewType,
  validateTestType,
  validateDifficulty,
  isNonEmptyString,
  sanitize,
  KNOWN_COMPANIES,
  VALID_INTERVIEW_TYPES,
  VALID_TEST_TYPES,
};

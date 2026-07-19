/* ============================================================
   AGENT 7 — Mock Test Engine AI — Service Layer
   ============================================================ */

'use strict';

const { v4: uuidv4 } = require('uuid');
const { generateJSON } = require('../../shared/gemini-client');
const { getStudent, getAIReport, getTestHistory } = require('../../shared/db-bridge');
const { buildMockTestPrompt } = require('./mock-test-engine.prompts');

// In-memory cache for generated tests (keyed by testId)
const generatedTests = new Map();

async function generateMockTest(studentId, company, role, testType, difficulty) {
  const student = getStudent(studentId);
  if (!student) throw Object.assign(new Error(`Student not found: ${studentId}`), { status: 404 });

  const testHistory = getTestHistory(studentId);
  const prompt = buildMockTestPrompt(student, company, role, testType, difficulty, testHistory);

  const testId = `test_${uuidv4()}`;
  const count = { Technical: 20, Coding: 5, Aptitude: 25, Communication: 15, 'Company-OA': 30 }[testType] || 20;

  // Build a realistic fallback with actual question data
  const fallbackQuestions = generateFallbackQuestions(testType, company, count, difficulty);

  const fallback = {
    testId,
    company,
    role: role || 'Software Engineer',
    testType,
    difficulty: difficulty || 'Medium',
    totalQuestions: count,
    durationMinutes: count <= 10 ? 30 : count <= 20 ? 45 : 90,
    questions: fallbackQuestions,
    sectionBreakdown: { [testType]: count },
    instructions: [`Complete all ${count} questions`, `Time limit: ${count <= 10 ? 30 : count <= 20 ? 45 : 90} minutes`, 'No negative marking unless specified'],
    companyNote: `This test mirrors the standard ${company} ${testType} assessment format.`
  };

  const test = await generateJSON(prompt, { fallback });
  test.testId = testId;
  test.studentId = studentId;
  test.generatedAt = new Date().toISOString();

  // Cache the test for analysis later
  generatedTests.set(testId, test);

  return test;
}

/**
 * Get a generated test by ID (needed for analysis)
 */
function getGeneratedTest(testId) {
  return generatedTests.get(testId) || null;
}

/**
 * Generate realistic fallback questions when Gemini is unavailable
 */
function generateFallbackQuestions(testType, company, count, difficulty) {
  const questions = [];
  const aptitudePool = [
    { text: 'A train travels 360 km in 4 hours. What is its speed?', options: ['80 km/h', '90 km/h', '100 km/h', '120 km/h'], correctIndex: 1, topic: 'Aptitude', explanation: '360/4 = 90 km/h' },
    { text: 'Find the next number in the series: 2, 6, 12, 20, 30, ?', options: ['40', '42', '44', '46'], correctIndex: 1, topic: 'Logical Reasoning', explanation: 'Differences are 4,6,8,10,12 → next is 42' },
    { text: 'If P is the brother of Q, Q is the sister of R, what is P to R?', options: ['Brother', 'Sister', 'Cousin', 'Cannot determine'], correctIndex: 0, topic: 'Verbal Reasoning', explanation: 'P is Q\'s brother. Q is R\'s sister. So P is R\'s brother.' },
    { text: 'A shopkeeper marks goods 20% above cost and allows 10% discount. Profit %?', options: ['8%', '10%', '12%', '15%'], correctIndex: 0, topic: 'Aptitude', explanation: 'Profit = 20 - 10 - 2 = 8%' },
  ];
  const technicalPool = [
    { text: 'Which data structure follows LIFO order?', options: ['Queue', 'Stack', 'Linked List', 'Tree'], correctIndex: 1, topic: 'DSA', explanation: 'Stack uses Last In First Out (LIFO) order' },
    { text: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correctIndex: 1, topic: 'DSA', explanation: 'Binary search halves the search space each iteration → O(log n)' },
    { text: 'Which SQL command is used to remove a table completely?', options: ['DELETE', 'DROP', 'TRUNCATE', 'REMOVE'], correctIndex: 1, topic: 'DBMS', explanation: 'DROP TABLE removes the table structure and all data permanently' },
    { text: 'What does TCP stand for?', options: ['Transfer Control Protocol', 'Transmission Control Protocol', 'Terminal Control Program', 'Transfer Communication Protocol'], correctIndex: 1, topic: 'Networks', explanation: 'TCP = Transmission Control Protocol' },
    { text: 'In OOP, which concept allows a class to inherit from multiple classes?', options: ['Encapsulation', 'Polymorphism', 'Multiple Inheritance', 'Abstraction'], correctIndex: 2, topic: 'OOP', explanation: 'Multiple Inheritance allows a class to inherit from more than one parent class' },
  ];
  const pool = testType === 'Technical' ? technicalPool : aptitudePool;

  for (let i = 0; i < count; i++) {
    const q = pool[i % pool.length];
    questions.push({
      id: `q${i + 1}`,
      ...q,
      difficulty: difficulty || 'Medium',
      marks: 1,
      negativeMarks: 0
    });
  }
  return questions;
}

module.exports = { generateMockTest, getGeneratedTest };

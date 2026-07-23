/* ============================================================
   ELEVATE AI ECOSYSTEM — Shared Gemini Client
   Singleton wrapper around @google/generative-ai
   All 12 AI agents use this — never call Gemini directly.
   ============================================================ */

'use strict';

const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
  console.warn('[GeminiClient] WARNING: GEMINI_API_KEY not set. AI features will return mock responses.');
}

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Default generation config for balanced performance
const DEFAULT_CONFIG = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 4096,
};

// Strict JSON config — lower temperature for deterministic structured output
const JSON_CONFIG = {
  temperature: 0.3,
  topK: 20,
  topP: 0.85,
  maxOutputTokens: 4096,
};

/**
 * Get a Gemini model instance
 * @param {string} modelName - Model name (default: gemini-1.5-flash)
 * @param {object} config - Generation config override
 */
function getModel(modelName = 'gemini-2.0-flash', config = DEFAULT_CONFIG) {
  if (!genAI) return null;
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: config,
  });
}

/**
 * Generate text from a prompt
 * @param {string} prompt - Full prompt string
 * @param {object} options - { modelName, temperature }
 * @returns {Promise<string>} - Generated text
 */
async function generateText(prompt, options = {}) {
  if (!genAI) {
    console.warn('[GeminiClient] No API key — returning placeholder text.');
    return 'AI response unavailable. Please configure GEMINI_API_KEY in .env';
  }

  try {
    const config = { ...DEFAULT_CONFIG, ...(options.temperature ? { temperature: options.temperature } : {}) };
    const model = getModel(options.modelName || 'gemini-2.0-flash', config);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('[GeminiClient] generateText error:', error.message);
    throw new Error(`Gemini API error: ${error.message}`);
  }
}

/**
 * Generate and parse a JSON response from a prompt
 * The prompt MUST instruct the model to return valid JSON.
 * @param {string} prompt - Full prompt string (must request JSON output)
 * @param {object} options - { modelName, fallback }
 * @returns {Promise<object>} - Parsed JSON object
 */
async function generateJSON(prompt, options = {}) {
  if (!genAI) {
    console.warn('[GeminiClient] No API key — returning fallback object.');
    return options.fallback || { error: 'AI unavailable', message: 'Configure GEMINI_API_KEY in .env' };
  }

  try {
    const model = getModel(options.modelName || 'gemini-2.0-flash', JSON_CONFIG);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Strip markdown code fences if model wraps JSON in ```json ... ```
    const cleaned = text
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('[GeminiClient] JSON parse error — model returned invalid JSON:', error.message);
      if (options.fallback) return options.fallback;
      throw new Error('AI returned malformed JSON. Please retry.');
    }
    // For API errors (quota exceeded, rate limits, model errors), use fallback if provided
    console.error('[GeminiClient] generateJSON error:', error.message);
    if (options.fallback) {
      console.warn('[GeminiClient] Returning fallback due to API error.');
      return options.fallback;
    }
    throw new Error(`Gemini API error: ${error.message}`);
  }
}

/**
 * Start a multi-turn chat session (for mock interview)
 * @param {Array} history - Array of { role: 'user'|'model', parts: [{ text }] }
 * @param {object} options - { modelName, systemInstruction }
 * @returns {object} - Gemini chat session object
 */
function startChat(history = [], options = {}) {
  if (!genAI) {
    // Return a mock chat object for development without API key
    return {
      sendMessage: async (msg) => ({
        response: {
          text: () => 'Chat unavailable. Please configure GEMINI_API_KEY in .env'
        }
      })
    };
  }

  const model = genAI.getGenerativeModel({
    model: options.modelName || 'gemini-2.0-flash',
    generationConfig: DEFAULT_CONFIG,
    ...(options.systemInstruction ? { systemInstruction: options.systemInstruction } : {}),
  });

  return model.startChat({ history });
}

module.exports = { generateText, generateJSON, startChat };

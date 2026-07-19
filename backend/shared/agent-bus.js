/* ============================================================
   ELEVATE AI ECOSYSTEM — Inter-Agent Event Bus
   Lightweight in-process EventEmitter for agent-to-agent
   communication. Decouples agents from each other — agents
   emit events, listeners react without tight coupling.
   ============================================================ */

'use strict';

const EventEmitter = require('events');

class AgentBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50); // Support up to 50 listeners across all agents
    this._log = true;
  }

  /**
   * Emit an event from one agent to trigger downstream agents
   * @param {string} event - Event name (see EVENTS below)
   * @param {object} payload - Event data
   */
  emit(event, payload) {
    if (this._log) {
      console.log(`[AgentBus] Event: ${event}`, payload?.studentId ? `(student: ${payload.studentId})` : '');
    }
    return super.emit(event, payload);
  }

  /**
   * Register a listener that runs once per event type
   */
  on(event, handler) {
    super.on(event, handler);
    return this;
  }
}

// Singleton instance
const bus = new AgentBus();

// ─── Event Name Constants ─────────────────────────────────────────────────────

const EVENTS = {
  // Fired when Skill Analysis AI completes
  SKILL_ANALYSIS_COMPLETE: 'skill_analysis_complete',

  // Fired when any mock test is submitted and analyzed
  MOCK_TEST_COMPLETE: 'mock_test_complete',

  // Fired when an interview session is analyzed
  INTERVIEW_ANALYSIS_COMPLETE: 'interview_analysis_complete',

  // Fired when resume is analyzed
  RESUME_ANALYSIS_COMPLETE: 'resume_analysis_complete',

  // Fired when any course is marked completed
  COURSE_COMPLETED: 'course_completed',

  // Fired to request a Placement Readiness recalculation
  RECALCULATE_READINESS: 'recalculate_readiness',

  // Fired to request a Roadmap regeneration
  REGENERATE_ROADMAP: 'regenerate_roadmap',

  // Fired to request updated recommendations
  REFRESH_RECOMMENDATIONS: 'refresh_recommendations',

  // Fired when Progress Analytics generates new insights
  PROGRESS_UPDATED: 'progress_updated',
};

module.exports = { bus, EVENTS };

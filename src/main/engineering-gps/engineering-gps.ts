import type { IntentResult } from '../intent-engine/types.js';
import type { ProjectHealthReport } from '../project-health/types.js';
import type { GPSRecommendation } from './types.js';

/**
 * Very simple GPS that suggests the next actionable step based on the detected intent
 * and the overall health of the project. The logic is deliberately lightweight –
 * it merely returns a short recommendation string that can be stitched into the LLM
 * prompt.
 */
export function createEngineeringGPS() {
  function getNextStep(intent: IntentResult, health: ProjectHealthReport): GPSRecommendation {
    // If health is poor, recommend improving health first.
    if (health.summary && health.summary.score < 70) {
      return {
        action: 'Improve project health',
        rationale: `Current overall health score is ${health.summary.score}. Focus on fixing the most critical issues before proceeding with '${intent.intent}'.`,
      };
    }

    // Intent‑specific suggestions
    switch (intent.intent) {
      case 'add-dependency':
        return {
          action: 'Add dependency',
          rationale: 'Run `npm install <package>` and commit the updated package-lock.json.',
        };
      case 'run-tests':
        return {
          action: 'Run test suite',
          rationale: 'Execute `npm test` (or `vitest run`) to ensure all tests pass.',
        };
      case 'refactor':
        return {
          action: 'Refactor code',
          rationale: 'Identify the file(s) to modify and apply the refactor with appropriate tests.',
        };
      case 'deploy':
        return {
          action: 'Prepare deployment',
          rationale: 'Run the project‑health assessment and ensure CI builds pass before deployment.',
        };
      case 'write-docs':
        return {
          action: 'Write documentation',
          rationale: 'Add or update markdown files in the docs/ folder.',
        };
      default:
        return {
          action: 'Proceed with user request',
          rationale: `No specific guidance – follow the user's intent '${intent.intent}'.`,
        };
    }
  }

  return { getNextStep };
}

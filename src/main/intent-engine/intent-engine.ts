import type { IntentResult } from './types.js';
import type { Goal } from '../project-intelligence/types.js';

/**
 * Very lightweight rule‑based intent detector.
 * It looks for known keywords in the user message and, if a goal title is mentioned,
 * boosts confidence for that related intent.
 */
export function createIntentEngine() {
  /** Map of keyword patterns to intent identifiers */
  const intentMap: Record<string, string> = {
    'add dependency': 'add-dependency',
    'install': 'add-dependency',
    'npm install': 'add-dependency',
    'run tests': 'run-tests',
    'run test': 'run-tests',
    'test': 'run-tests',
    'refactor': 'refactor',
    'rename': 'refactor',
    'deploy': 'deploy',
    'release': 'deploy',
    'documentation': 'write-docs',
    'doc': 'write-docs',
  };

  function detect(userMessage: string, goals: Goal[] = []): IntentResult {
    const lowered = userMessage.toLowerCase();
    let bestIntent = 'none';
    let bestScore = 0;
    let detail = '';

    // 1️⃣ keyword matching
    for (const [phrase, intent] of Object.entries(intentMap)) {
      if (lowered.includes(phrase)) {
        const score = 60; // base confidence for keyword match
        if (score > bestScore) {
          bestScore = score;
          bestIntent = intent;
          detail = `Detected keyword "${phrase}"`;
        }
      }
    }

    // 2️⃣ goal title boost – if the message mentions a goal title, lift confidence
    if (goals.length > 0) {
      for (const goal of goals) {
        if (goal.title && lowered.includes(goal.title.toLowerCase())) {
          // boost confidence, but keep within 0‑100
          const boosted = Math.min(bestScore + 30, 100);
          bestScore = boosted;
          detail = `Matched active goal "${goal.title}"`;
          // Derive a generic intent from the goal status (simple heuristic)
          if (goal.title.toLowerCase().includes('test')) bestIntent = 'run-tests';
          else if (goal.title.toLowerCase().includes('doc')) bestIntent = 'write-docs';
          else if (goal.title.toLowerCase().includes('refactor')) bestIntent = 'refactor';
        }
      }
    }

    return {
      intent: bestIntent,
      confidence: bestScore,
      details: detail || undefined,
    };
  }

  return { detect };
}

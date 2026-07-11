/**
 * Simple intent detection result.
 */
export interface IntentResult {
  intent: string;            // e.g., "add-dependency", "run-tests", "refactor"
  confidence: number;       // 0‑100 confidence score
  details?: string;          // optional human‑readable explanation
}

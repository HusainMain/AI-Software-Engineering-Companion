import type { KnowledgeCategory, KnowledgePattern } from '../knowledge-engine/types.js';

export interface Recommendation {
  /** The actual guidance */
  recommendation: string;
  /** Explanation of why this guidance is suggested */
  reasoning: string;
  /** Other viable options that were considered */
  alternativesConsidered: string[];
  /** Trade‑offs of the chosen approach */
  tradeoffs: string;
  /** Confidence level (High/Medium/Low/Unknown) */
  confidence: 'High' | 'Medium' | 'Low' | 'Unknown';
  /** Domain name (e.g., Architecture) */
  domain: string;
  /** Knowledge source category */
  knowledgeSource: KnowledgeCategory;
}

/** Minimal API the engine expects */
export interface RecommendationEngine {
  /** Generate recommendations based on health and project intelligence */
  getRecommendations(healthScore: number, destinationGoals: string[]): Recommendation[];
}

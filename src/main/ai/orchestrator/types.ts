import type { KnowledgeEngine } from '../../knowledge-engine/types.js';
import type { RecommendationEngine, Recommendation } from '../../recommendation-engine/types.js';

/** Input from Project Health Engine when an emergency finding occurs */
export interface EmergencyFinding {
  finding_type: string; // e.g., 'SECRET_IN_COMMITTED_FILE'
  severity: 'CRITICAL' | 'HIGH';
  affected_component: string;
  detected_at: string; // ISO timestamp
  detection_confidence: 'High' | 'Medium';
}

/** Orchestrator API */
export interface AIOrchestrator {
  /** Process an emergency health finding, generate a combined message */
  handleEmergency(
    finding: EmergencyFinding,
    knowledge: KnowledgeEngine,
    recommendationEngine: RecommendationEngine,
  ): { message: string; dismissible: boolean };
}

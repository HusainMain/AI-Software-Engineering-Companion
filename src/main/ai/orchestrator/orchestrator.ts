import type { AIOrchestrator, EmergencyFinding } from './types.js';
import type { KnowledgeEngine } from '../../knowledge-engine/types.js';
import type { RecommendationEngine, Recommendation } from '../../recommendation-engine/types.js';

/** Minimal AI Orchestrator handling emergency health findings. */
export function createAIOrchestrator(): AIOrchestrator {
  // Map health finding types to knowledge categories (simplified)
  const categoryMap: Record<string, keyof Recommendation['knowledgeSource']> = {
    SECRET_IN_COMMITTED_FILE: 'security',
    DATA_LOSS_RISK_UNMITIGATED: 'cost',
    CRITICAL_DEPENDENCY_EXPLOIT: 'security',
    DEPLOYMENT_BLOCKER: 'deployment',
    AUTH_MISCONFIGURATION: 'security',
  };

  function mapFindingToCategory(finding: EmergencyFinding): string {
    return categoryMap[finding.finding_type] ?? 'documentation';
  }

  function handleEmergency(
    finding: EmergencyFinding,
    knowledge: KnowledgeEngine,
    recommendationEngine: RecommendationEngine,
  ): { message: string; dismissible: boolean } {
    const category = mapFindingToCategory(finding) as any;
    // Retrieve a recommendation – we can let the RecommendationEngine produce one and pick the first
    const recs = recommendationEngine.getRecommendations(0, []);
    const matching = recs.find((r) => r.knowledgeSource === category);
    const recommendation: Recommendation | undefined = matching || recs[0];

    const findingMsg = `⚠️ ${finding.severity} ${finding.finding_type} in ${finding.affected_component}`;
    const recMsg = recommendation ? `Recommendation: ${recommendation.recommendation}` : 'No recommendation available.';
    const message = `${findingMsg}\n${recMsg}`;
    return { message, dismissible: true };
  }

  return { handleEmergency };
}

import { describe, it, expect } from 'vitest';
import { createAIOrchestrator } from './orchestrator.js';
import { createKnowledgeEngine } from '../../knowledge-engine/index.js';
import { createRecommendationEngine } from '../../recommendation-engine/index.js';

describe('AIOrchestrator (emergency handling)', () => {
  it('combines a critical finding with a recommendation', () => {
    const knowledge = createKnowledgeEngine();
    // Add a security pattern
    knowledge.addPattern({
      category: 'security',
      title: 'Secret Detection',
      description: 'Detect secrets in source files',
      validated: true,
    });
    const recommendationEngine = createRecommendationEngine(knowledge);
    const orchestrator = createAIOrchestrator();
    const finding = {
      finding_type: 'SECRET_IN_COMMITTED_FILE',
      severity: 'CRITICAL' as const,
      affected_component: 'src/config.ts',
      detected_at: new Date().toISOString(),
      detection_confidence: 'High' as const,
    };
    const result = orchestrator.handleEmergency(finding, knowledge, recommendationEngine);
    expect(result.message).toContain('CRITICAL');
    expect(result.message).toContain('Secret Detection');
    expect(result.dismissible).toBe(true);
  });
});

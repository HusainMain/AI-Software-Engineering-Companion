import { describe, it, expect } from 'vitest';
import { createRecommendationEngine } from './recommendation-engine.js';
import { createKnowledgeEngine } from '../knowledge-engine/index.js';

describe('RecommendationEngine', () => {
  it('generates recommendations from knowledge patterns', () => {
    const knowledge = createKnowledgeEngine();
    // add a pattern for architecture
    knowledge.addPattern({
      category: 'architecture',
      title: 'Layered Architecture',
      description: 'Separate concerns into layers',
      validated: true,
    });
    const engine = createRecommendationEngine(knowledge);
    const recs = engine.getRecommendations(80, []);
    expect(recs).toHaveLength(1);
    const rec = recs[0];
    expect(rec.domain).toBe('Architecture');
    expect(rec.recommendation).toContain('Layered Architecture');
    expect(rec.confidence).toBe('High');
    expect(rec.knowledgeSource).toBe('architecture');
  });
});

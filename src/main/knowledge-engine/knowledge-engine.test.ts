import { describe, it, expect } from 'vitest';
import { createKnowledgeEngine } from './knowledge-engine.js';

describe('KnowledgeEngine', () => {
  it('adds, retrieves and validates patterns', () => {
    const engine = createKnowledgeEngine();
    const pattern = engine.addPattern({
      category: 'architecture',
      title: 'Layered Architecture',
      description: 'Separate concerns into layers',
      validated: false,
    });

    expect(pattern.id).toBeDefined();
    expect(pattern.validated).toBe(false);

    // Retrieve by category
    const fetched = engine.getPatterns('architecture');
    expect(fetched).toContainEqual(pattern);

    // Validate pattern
    engine.validatePattern(pattern.id);
    const after = engine.getPatterns('architecture').find(p => p.id === pattern.id);
    expect(after?.validated).toBe(true);
  });
});

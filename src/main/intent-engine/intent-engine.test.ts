import { describe, it, expect } from 'vitest';
import { createIntentEngine } from './intent-engine.js';
import type { Goal } from '../project-intelligence/types.js';

describe('IntentEngine', () => {
  const engine = createIntentEngine();

  it('detects add‑dependency intent from keyword', () => {
    const result = engine.detect('I need to add a new dependency for lodash');
    expect(result.intent).toBe('add-dependency');
    expect(result.confidence).toBeGreaterThanOrEqual(60);
  });

  it('detects run‑tests intent from keyword', () => {
    const result = engine.detect('Please run tests');
    expect(result.intent).toBe('run-tests');
    expect(result.confidence).toBeGreaterThanOrEqual(60);
  });

  it('boosts confidence when goal title is mentioned', () => {
    const goals: Goal[] = [{
      id: 'g1',
      title: 'Add OAuth login',
      description: 'Implement auth flow',
      status: 'active',
      priority: 'high',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }];
    const result = engine.detect('Working on Add OAuth login', goals);
    expect(result.intent).toBe('none'); // no specific keyword, but confidence should be boosted
    expect(result.confidence).toBeGreaterThanOrEqual(30);
    expect(result.details).toContain('Matched active goal');
  });
});

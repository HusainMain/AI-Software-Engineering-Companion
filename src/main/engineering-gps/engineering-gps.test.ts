import { describe, it, expect } from 'vitest';
import { createEngineeringGPS } from './engineering-gps.js';
import type { ProjectHealthReport } from '../project-health/types.js';
import type { Goal } from '../project-intelligence/types.js';

function mockHealth(score: number): ProjectHealthReport {
  return {
    summary: { score, grade: 'C', issues: [], strengths: [] },
    testCoverage: { sourceFileCount: 0, testFileCount: 0, ratio: 0, testFrameworks: [] },
    todoDebt: { totalCount: 0, todoCount: 0, fixmeCount: 0, hackCount: 0, xxxCount: 0, perFile: [] },
    documentationHealth: { readmeExists: false, readmeAgeDays: null, docsDirExists: false, docsFileCount: 0 },
    configHealth: { hasLintConfig: false, hasTypeCheck: false, hasTests: false, hasCiConfig: false, hasGitignore: false, hasLicense: false, hasDockerfile: false, missingRecommended: [] },
  };
}

function mockGoal(overrides?: Partial<Goal>): Goal {
  return {
    id: crypto.randomUUID(),
    title: 'Default Goal',
    description: 'desc',
    status: 'planned',
    priority: 'low',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('EngineeringGPS', () => {
  it('suggests health improvement when score low', () => {
    const gps = createEngineeringGPS();
    const health = mockHealth(60);
    const suggestion = gps.suggest(health, { goals: [] });
    expect(suggestion.step).toBe('improve health');
    expect(suggestion.reason).toContain('60');
  });

  it('suggests work on active goal', () => {
    const gps = createEngineeringGPS();
    const health = mockHealth(85);
    const active = mockGoal({ title: 'Add OAuth', status: 'active' });
    const suggestion = gps.suggest(health, { goals: [active] });
    expect(suggestion.step).toBe(`work on goal: ${active.title}`);
    expect(suggestion.reason).toBe('Goal is currently active');
  });

  it('starts highest‑priority planned goal when no active', () => {
    const gps = createEngineeringGPS();
    const health = mockHealth(85);
    const low = mockGoal({ title: 'Low', priority: 'low', status: 'planned' });
    const high = mockGoal({ title: 'High', priority: 'high', status: 'planned' });
    const suggestion = gps.suggest(health, { goals: [low, high] });
    expect(suggestion.step).toBe(`start goal: ${high.title}`);
    expect(suggestion.reason).toContain('high');
  });

  it('defaults to maintain when health ok and no goals', () => {
    const gps = createEngineeringGPS();
    const health = mockHealth(90);
    const suggestion = gps.suggest(health, { goals: [] });
    expect(suggestion.step).toBe('maintain');
    expect(suggestion.reason).toContain('No active or planned goals');
  });
});

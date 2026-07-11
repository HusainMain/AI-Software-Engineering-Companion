import { describe, it, expect } from 'vitest';
import { createEngineeringGPS } from './engineering-gps.js';
import type { IntentResult } from '../intent-engine/types.js';
import type { ProjectHealthReport } from '../project-health/types.js';

describe('EngineeringGPS', () => {
  const gps = createEngineeringGPS();

  const dummyHealth: ProjectHealthReport = {
    summary: { score: 80, grade: 'B', issues: [], strengths: [] },
    testCoverage: { sourceFileCount: 10, testFileCount: 3, ratio: 0.3, testFrameworks: ['vitest'] },
    todoDebt: { totalCount: 5, todoCount: 5, fixmeCount: 0, hackCount: 0, xxxCount: 0, perFile: [] },
    documentationHealth: { readmeExists: true, readmeAgeDays: 2, docsDirExists: false, docsFileCount: 0 },
    configHealth: { hasLintConfig: false, hasTypeCheck: false, hasTests: false, hasCiConfig: false, hasGitignore: false, hasLicense: false, hasDockerfile: false, missingRecommended: [] },
  };

  it('recommends health improvement when score is low', () => {
    const lowHealth = { ...dummyHealth, summary: { ...dummyHealth.summary, score: 50, grade: 'D', issues: [], strengths: [] } };
    const intent: IntentResult = { intent: 'add-dependency', confidence: 80 };
    const rec = gps.getNextStep(intent, lowHealth);
    expect(rec.action).toBe('Improve project health');
  });

  it('suggests add‑dependency action for that intent', () => {
    const intent: IntentResult = { intent: 'add-dependency', confidence: 80 };
    const rec = gps.getNextStep(intent, dummyHealth);
    expect(rec.action).toBe('Add dependency');
  });

  it('fallbacks to generic when intent unknown', () => {
    const intent: IntentResult = { intent: 'unknown', confidence: 30 };
    const rec = gps.getNextStep(intent, dummyHealth);
    expect(rec.action).toBe('Proceed with user request');
  });
});

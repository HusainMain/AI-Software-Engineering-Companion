import { describe, it, expect } from 'vitest';
import { assess } from './project-health.js';
import { resolve } from 'path';

describe('ProjectHealthEngine', () => {
  it('returns a health report with numeric fields', async () => {
    const root = resolve(__dirname, '../../..'); // repo root
    const report = await assess(root);
    // Verify nested health report structure
    expect(report.summary).toMatchObject({
      score: expect.any(Number),
      grade: expect.any(String),
      issues: expect.any(Array),
      strengths: expect.any(Array),
    });
    expect(report.testCoverage).toMatchObject({
      sourceFileCount: expect.any(Number),
      testFileCount: expect.any(Number),
      ratio: expect.any(Number),
      testFrameworks: expect.any(Array),
    });
    expect(report.todoDebt).toMatchObject({
      totalCount: expect.any(Number),
      todoCount: expect.any(Number),
      fixmeCount: expect.any(Number),
      hackCount: expect.any(Number),
      xxxCount: expect.any(Number),
      perFile: expect.any(Array),
    });
    expect(report.documentationHealth).toMatchObject({
      readmeExists: expect.any(Boolean),
      readmeAgeDays: expect.any(Number),
      docsDirExists: expect.any(Boolean),
      docsFileCount: expect.any(Number),
    });
    expect(report.configHealth).toMatchObject({
      hasLintConfig: expect.any(Boolean),
      hasTypeCheck: expect.any(Boolean),
      hasTests: expect.any(Boolean),
      hasCiConfig: expect.any(Boolean),
      hasGitignore: expect.any(Boolean),
      hasLicense: expect.any(Boolean),
      hasDockerfile: expect.any(Boolean),
      missingRecommended: expect.any(Array),
    });
    // sanity check that values are within expected ranges
    expect(report.summary.score).toBeGreaterThanOrEqual(0);
    expect(report.summary.score).toBeLessThanOrEqual(100);
  });
});

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import type { ProjectHealthReport, HealthSummary, Issue, TestCoverage, TodoDebt, DocumentationHealth, ConfigHealth } from './types.js';

/**
 * Simple heuristic health assessment that returns a full `ProjectHealthReport` structure.
 * The implementation uses the same lightweight scans as before (coverage JSON,
 * TODO/FIXME comments, docs age) and maps the results into the richer shape that
 * the Prompt Builder expects. For now many fields are filled with placeholder
 * values – they can be refined later without breaking the type contract.
 */
export async function assess(rootPath: string): Promise<ProjectHealthReport> {
  // ---- 1️⃣ Coverage -------------------------------------------------------
  let coveragePct = 0;
  let sourceFileCount = 0;
  let testFileCount = 0;
  let testFrameworks: string[] = [];
  try {
    const coveragePath = join(rootPath, 'coverage', 'coverage-summary.json');
    const content = readFileSync(coveragePath, 'utf-8');
    const parsed = JSON.parse(content);
    coveragePct = typeof parsed.total?.statements?.pct === 'number' ? parsed.total.statements.pct : 0;
    // For demo purposes we also pull source/test file counts if present.
    if (parsed.total?.statements?.total !== undefined && parsed.total?.branches?.total !== undefined) {
      // These numbers are not exact but give a hint; we just set them to 0 if unavailable.
      sourceFileCount = parsed.total.statements.total || 0;
    }
    // Attempt to infer test framework from the file paths in the coverage data.
    if (parsed?.files) {
      const frameworks = new Set<string>();
        for (const file of Object.keys(parsed.files)) {
          if (/\/test\//.test(file)) frameworks.add('vitest');
          if (/\/\_test\//.test(file)) frameworks.add('jest');
        }
      testFrameworks = Array.from(frameworks);
    }
    // Count test files (very rough) – look for *.test.* under the root.
    const walkCount = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        const stat = statSync(full);
        if (stat.isDirectory()) {
          if (entry === 'node_modules' || entry === '.git') continue;
          walkCount(full);
        } else if (/\.test\.(ts|js|tsx|jsx)$/.test(entry)) {
          testFileCount++;
        }
      }
    };
    try { walkCount(rootPath); } catch {}
    // Approximate source file count by counting .ts/.js files (excluding tests).
    const walkSource = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        const stat = statSync(full);
        if (stat.isDirectory()) {
          if (entry === 'node_modules' || entry === '.git' || entry === 'test' || entry === '__tests__') continue;
          walkSource(full);
        } else if (full.endsWith('.ts') || full.endsWith('.js')) {
          if (!/\.test\./.test(full)) sourceFileCount++;
        }
      }
    };
    try { walkSource(rootPath); } catch {}
  } catch {
    // leave defaults (0)
  }

  const coverageRatio = sourceFileCount > 0 ? testFileCount / sourceFileCount : 0;

  // ---- 2️⃣ TODO/FIXME/HACK/XXX debt --------------------------------------
  let todoCount = 0;
  let fixmeCount = 0;
  let hackCount = 0;
  let xxxCount = 0;
  const perFileMap = new Map<string, number>();
  const walkDep = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        if (entry === 'node_modules' || entry === '.git') continue;
        walkDep(full);
      } else if (full.endsWith('.ts') || full.endsWith('.js')) {
        const src = readFileSync(full, 'utf-8');
        const todoMatches = src.match(/TODO/g) ?? [];
        const fixmeMatches = src.match(/FIXME/g) ?? [];
        const hackMatches = src.match(/HACK/g) ?? [];
        const xxxMatches = src.match(/XXX/g) ?? [];
        const totalMatches = todoMatches.length + fixmeMatches.length + hackMatches.length + xxxMatches.length;
        if (totalMatches > 0) {
          perFileMap.set(full, totalMatches);
        }
        todoCount += todoMatches.length;
        fixmeCount += fixmeMatches.length;
        hackCount += hackMatches.length;
        xxxCount += xxxMatches.length;
      }
    }
  };
  try { walkDep(rootPath); } catch {}
  const perFile = Array.from(perFileMap.entries()).map(([file, count]) => ({ file, count }));
  const totalDebt = todoCount + fixmeCount + hackCount + xxxCount;

  // ---- 3️⃣ Documentation health ------------------------------------------
  let readmeExists = false;
  let readmeAgeDays: number | null = null;
  let docsDirExists = false;
  let docsFileCount = 0;
  try {
    const readmePath = join(rootPath, 'README.md');
    const readmeStat = statSync(readmePath);
    readmeExists = readmeStat.isFile();
    if (readmeExists) {
      const ageMs = Date.now() - readmeStat.mtimeMs;
      readmeAgeDays = Math.round(ageMs / (1000 * 60 * 60 * 24));
    }
  } catch {}
  try {
    const docsDir = join(rootPath, 'docs');
    const docsStat = statSync(docsDir);
    docsDirExists = docsStat.isDirectory();
    if (docsDirExists) {
      const files = readdirSync(docsDir).filter(f => f.endsWith('.md'));
      docsFileCount = files.length;
    }
  } catch {}

  // ---- 4️⃣ Config health (placeholder – all false) ------------------------
  const configHealth: ConfigHealth = {
    hasLintConfig: false,
    hasTypeCheck: false,
    hasTests: false,
    hasCiConfig: false,
    hasGitignore: false,
    hasLicense: false,
    hasDockerfile: false,
    missingRecommended: [],
  };

  // ---- 5️⃣ Summary --------------------------------------------------------
  const overallScore = Math.round(
    0.4 * coveragePct +
    0.3 * (100 - Math.min(totalDebt * 2, 100)) +
    0.2 * (100 - Math.min(readmeAgeDays ?? 0, 100)) +
    0.1 * (100 - Math.min(0, 100)) // lint errors are 0 for now
  );
  const grade = overallScore >= 90 ? 'A' : overallScore >= 80 ? 'B' : overallScore >= 70 ? 'C' : 'D';
  const summary: HealthSummary = {
    score: overallScore,
    grade,
    issues: [], // could be populated later
    strengths: [],
  };

  const report: ProjectHealthReport = {
    summary,
    testCoverage: {
      sourceFileCount,
      testFileCount,
      ratio: coverageRatio,
      testFrameworks,
    },
    todoDebt: {
      totalCount: totalDebt,
      todoCount,
      fixmeCount,
      hackCount,
      xxxCount,
      perFile,
    },
    documentationHealth: {
      readmeExists,
      readmeAgeDays,
      docsDirExists,
      docsFileCount,
    },
    configHealth,
  };

  return report;
}

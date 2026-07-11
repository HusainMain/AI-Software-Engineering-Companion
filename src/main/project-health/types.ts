export interface HealthSummary {
  score: number; // 0–100 composite score
  grade: string; // e.g., A, B, C
  issues: Issue[]; // any detected problems
  strengths: string[]; // positive aspects
}

export interface Issue {
  severity: 'low' | 'medium' | 'high';
  category: string;
  message: string;
  details?: string;
}

export interface TestCoverage {
  sourceFileCount: number;
  testFileCount: number;
  ratio: number; // test files / source files (0‑1)
  testFrameworks: string[];
}

export interface TodoDebt {
  totalCount: number;
  todoCount: number;
  fixmeCount: number;
  hackCount: number;
  xxxCount: number;
  perFile: { file: string; count: number }[];
}

export interface DocumentationHealth {
  readmeExists: boolean;
  readmeAgeDays: number | null;
  docsDirExists: boolean;
  docsFileCount: number;
}

export interface ConfigHealth {
  hasLintConfig: boolean;
  hasTypeCheck: boolean;
  hasTests: boolean;
  hasCiConfig: boolean;
  hasGitignore: boolean;
  hasLicense: boolean;
  hasDockerfile: boolean;
  missingRecommended: string[];
}

export interface ProjectHealthReport {
  summary: HealthSummary;
  testCoverage: TestCoverage;
  todoDebt: TodoDebt;
  documentationHealth: DocumentationHealth;
  configHealth: ConfigHealth;
}

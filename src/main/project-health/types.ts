export interface HealthIssue {
  severity: 'critical' | 'warning' | 'info'
  category: string
  message: string
  details?: string
}

export interface HealthSummary {
  score: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  issues: HealthIssue[]
  strengths: string[]
}

export interface TestCoverage {
  testFileCount: number
  sourceFileCount: number
  ratio: number
  estimatedStatementCoverage: number | null
  testFrameworks: string[]
}

export interface TodoDebt {
  totalCount: number
  todoCount: number
  fixmeCount: number
  hackCount: number
  xxxCount: number
  perFile: { file: string; count: number }[]
}

export interface DocumentationHealth {
  readmeExists: boolean
  readmeAgeDays: number | null
  docsDirExists: boolean
  docsFileCount: number
  outdatedDocs: string[]
}

export interface ConfigHealth {
  hasLintConfig: boolean
  hasTypeCheck: boolean
  hasTests: boolean
  hasCiConfig: boolean
  hasGitignore: boolean
  hasLicense: boolean
  hasDockerfile: boolean
  missingRecommended: string[]
}

export interface ProjectHealthReport {
  assessedAt: string
  summary: HealthSummary
  testCoverage: TestCoverage
  todoDebt: TodoDebt
  documentationHealth: DocumentationHealth
  configHealth: ConfigHealth
}

export interface ProjectHealthEngine {
  assess(projectRoot: string): Promise<ProjectHealthReport>
}
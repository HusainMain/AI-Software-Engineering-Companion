import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import type { ProjectHealthEngine, ProjectHealthReport, HealthSummary, TestCoverage, TodoDebt, DocumentationHealth, ConfigHealth, HealthIssue } from './types.js'

const EXCLUDE_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'coverage', '.vscode', '.idea'])
const MAX_DEPTH = 5

interface FileInfo {
  path: string
  relativePath: string
  isTest: boolean
  content: string
}

async function walkDir(dir: string, depth = 0): Promise<FileInfo[]> {
  if (depth > MAX_DEPTH) return []
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const results: FileInfo[] = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!EXCLUDE_DIRS.has(entry.name)) {
        results.push(...await walkDir(fullPath, depth + 1))
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase()
      const isSource = ['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs', '.java', '.cs'].includes(ext)
      const isTestFile = entry.name.match(/\.(test|spec|_test)\.(ts|tsx|js|jsx|py|go|rs|java|cs)$/) !== null || path.dirname(fullPath).includes('__tests__')
      if (isSource || isTestFile) {
        try {
          const content = await fs.readFile(fullPath, 'utf-8')
          results.push({ path: fullPath, relativePath: path.relative(dir, fullPath), isTest: isTestFile, content })
        } catch {
        }
      }
    }
  }
  return results
}

function detectTestFrameworks(packageJson: Record<string, unknown>): string[] {
  const devDeps = { ...(packageJson.devDependencies as Record<string, string>), ...(packageJson.dependencies as Record<string, string>) }
  const frameworks = [
    ['vitest', 'vitest'],
    ['jest', 'jest'],
    ['mocha', 'mocha'],
    ['cypress', 'cypress'],
    ['playwright', '@playwright/test'],
    ['ava', 'ava'],
    ['tape', 'tape'],
    ['jasmine', 'jasmine'],
  ]
  return frameworks.filter(([, pkg]) => devDeps[pkg]).map(([name]) => name)
}

function countTodos(content: string): { todo: number; fixme: number; hack: number; xxx: number } {
  const lines = content.split('\n')
  const counts = { todo: 0, fixme: 0, hack: 0, xxx: 0 }
  for (const line of lines) {
    const lower = line.toLowerCase()
    if (lower.includes('todo')) counts.todo++
    if (lower.includes('fixme')) counts.fixme++
    if (lower.includes('hack')) counts.hack++
    if (lower.includes('xxx')) counts.xxx++
  }
  return counts
}

async function readPackageJson(projectRoot: string): Promise<Record<string, unknown> | null> {
  try {
    const content = await fs.readFile(path.join(projectRoot, 'package.json'), 'utf-8')
    return JSON.parse(content)
  } catch {
    return null
  }
}

async function checkReadme(projectRoot: string): Promise<{ exists: boolean; ageDays: number | null }> {
  try {
    const stat = await fs.stat(path.join(projectRoot, 'README.md'))
    const ageMs = Date.now() - stat.mtimeMs
    return { exists: true, ageDays: Math.floor(ageMs / (1000 * 60 * 60 * 24)) }
  } catch {
    return { exists: false, ageDays: null }
  }
}

async function checkDocsDir(projectRoot: string): Promise<{ exists: boolean; fileCount: number }> {
  try {
    const entries = await fs.readdir(path.join(projectRoot, 'docs'), { withFileTypes: true })
    return { exists: true, fileCount: entries.filter(e => e.isFile()).length }
  } catch {
    return { exists: false, fileCount: 0 }
  }
}

function calculateScore(
  testCoverage: TestCoverage,
  todoDebt: TodoDebt,
  documentationHealth: DocumentationHealth,
  configHealth: ConfigHealth
): number {
  let score = 15

  if (testCoverage.ratio >= 0.3) score += 25
  else if (testCoverage.ratio >= 0.1) score += 15
  else if (testCoverage.ratio > 0) score += 10

  let debtPenalty = todoDebt.todoCount * 2 + todoDebt.fixmeCount * 3 + todoDebt.hackCount * 1 + todoDebt.xxxCount * 1
  debtPenalty = Math.min(debtPenalty, 20)
  score += 20 - debtPenalty

  if (documentationHealth.readmeExists) score += 10
  if (documentationHealth.docsDirExists && documentationHealth.docsFileCount > 0) score += 10

  const configChecks = [
    configHealth.hasLintConfig,
    configHealth.hasTypeCheck,
    configHealth.hasTests,
    configHealth.hasCiConfig,
    configHealth.hasGitignore,
    configHealth.hasLicense,
    configHealth.hasDockerfile,
  ]
  score += configChecks.filter(Boolean).length * 3

  return Math.max(0, Math.min(100, score))
}

function gradeFromScore(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A'
  if (score >= 70) return 'B'
  if (score >= 50) return 'C'
  if (score >= 30) return 'D'
  return 'F'
}

function generateIssues(
  testCoverage: TestCoverage,
  todoDebt: TodoDebt,
  documentationHealth: DocumentationHealth,
  configHealth: ConfigHealth
): HealthIssue[] {
  const issues: HealthIssue[] = []

  if (testCoverage.ratio < 0.1 && testCoverage.sourceFileCount > 0) {
    issues.push({ severity: 'critical', category: 'testing', message: 'Very low test coverage', details: `Test-to-source ratio: ${(testCoverage.ratio * 100).toFixed(1)}%` })
  } else if (testCoverage.ratio < 0.3 && testCoverage.sourceFileCount > 0) {
    issues.push({ severity: 'warning', category: 'testing', message: 'Low test coverage', details: `Test-to-source ratio: ${(testCoverage.ratio * 100).toFixed(1)}%` })
  }

  if (todoDebt.totalCount > 20) {
    issues.push({ severity: 'warning', category: 'technical-debt', message: 'High TODO/FIXME debt', details: `${todoDebt.totalCount} total (${todoDebt.todoCount} TODO, ${todoDebt.fixmeCount} FIXME, ${todoDebt.hackCount} HACK, ${todoDebt.xxxCount} XXX)` })
  }

  if (!documentationHealth.readmeExists) {
    issues.push({ severity: 'info', category: 'documentation', message: 'No README.md found' })
  }

  if (configHealth.missingRecommended.length > 0) {
    issues.push({ severity: 'info', category: 'configuration', message: 'Missing recommended config files', details: configHealth.missingRecommended.join(', ') })
  }

  return issues
}

function generateStrengths(
  testCoverage: TestCoverage,
  todoDebt: TodoDebt,
  documentationHealth: DocumentationHealth,
  configHealth: ConfigHealth
): string[] {
  const strengths: string[] = []
  if (testCoverage.ratio >= 0.3) strengths.push('Good test coverage')
  if (todoDebt.totalCount <= 5) strengths.push('Low technical debt')
  if (documentationHealth.readmeExists) strengths.push('README present')
  if (documentationHealth.docsDirExists) strengths.push('Documentation directory exists')
  if (configHealth.hasLintConfig) strengths.push('Linting configured')
  if (configHealth.hasTypeCheck) strengths.push('Type checking configured')
  if (configHealth.hasCiConfig) strengths.push('CI configured')
  return strengths
}

export function createProjectHealthEngine(): ProjectHealthEngine {
  async function assess(projectRoot: string): Promise<ProjectHealthReport> {
    const files = await walkDir(projectRoot)

    const sourceFiles = files.filter(f => !f.isTest)
    const testFiles = files.filter(f => f.isTest)

    const packageJson = await readPackageJson(projectRoot)
    const testFrameworks = packageJson ? detectTestFrameworks(packageJson) : []

    let totalTodo = 0, totalFixme = 0, totalHack = 0, totalXxx = 0
    const perFile: { file: string; count: number }[] = []
    for (const file of sourceFiles) {
      const counts = countTodos(file.content)
      const total = counts.todo + counts.fixme + counts.hack + counts.xxx
      if (total > 0) {
        perFile.push({ file: file.relativePath, count: total })
      }
      totalTodo += counts.todo
      totalFixme += counts.fixme
      totalHack += counts.hack
      totalXxx += counts.xxx
    }
    perFile.sort((a, b) => b.count - a.count)

    const readme = await checkReadme(projectRoot)
    const docs = await checkDocsDir(projectRoot)

    const hasLintConfig = await fs.access(path.join(projectRoot, '.eslintrc')).then(() => true).catch(() => false) ||
      await fs.access(path.join(projectRoot, '.eslintrc.js')).then(() => true).catch(() => false) ||
      await fs.access(path.join(projectRoot, '.eslintrc.json')).then(() => true).catch(() => false) ||
      await fs.access(path.join(projectRoot, '.eslintrc.yml')).then(() => true).catch(() => false)
    const hasTypeCheck = await fs.access(path.join(projectRoot, 'tsconfig.json')).then(() => true).catch(() => false)
    const hasTests = testFiles.length > 0
    const hasCiConfig = await fs.access(path.join(projectRoot, '.github', 'workflows')).then(() => true).catch(() => false) ||
      await fs.access(path.join(projectRoot, '.gitlab-ci.yml')).then(() => true).catch(() => false)
    const hasGitignore = await fs.access(path.join(projectRoot, '.gitignore')).then(() => true).catch(() => false)
    const hasLicense = await fs.access(path.join(projectRoot, 'LICENSE')).then(() => true).catch(() => false) ||
      await fs.access(path.join(projectRoot, 'LICENSE.md')).then(() => true).catch(() => false) ||
      await fs.access(path.join(projectRoot, 'LICENSE.txt')).then(() => true).catch(() => false)
    const hasDockerfile = await fs.access(path.join(projectRoot, 'Dockerfile')).then(() => true).catch(() => false) ||
      await fs.access(path.join(projectRoot, 'dockerfile')).then(() => true).catch(() => false)

    const missingRecommended: string[] = []
    if (!hasLintConfig) missingRecommended.push('.eslintrc*')
    if (!hasTypeCheck) missingRecommended.push('tsconfig.json')
    if (!hasTests) missingRecommended.push('test files')
    if (!hasCiConfig) missingRecommended.push('.github/workflows/')
    if (!hasGitignore) missingRecommended.push('.gitignore')
    if (!hasLicense) missingRecommended.push('LICENSE*')
    if (!hasDockerfile) missingRecommended.push('Dockerfile')

    const testCoverage: TestCoverage = {
      testFileCount: testFiles.length,
      sourceFileCount: sourceFiles.length,
      ratio: sourceFiles.length > 0 ? testFiles.length / sourceFiles.length : 0,
      estimatedStatementCoverage: null,
      testFrameworks,
    }

    const todoDebt: TodoDebt = {
      totalCount: totalTodo + totalFixme + totalHack + totalXxx,
      todoCount: totalTodo,
      fixmeCount: totalFixme,
      hackCount: totalHack,
      xxxCount: totalXxx,
      perFile: perFile.slice(0, 20),
    }

    const documentationHealth: DocumentationHealth = {
      readmeExists: readme.exists,
      readmeAgeDays: readme.ageDays,
      docsDirExists: docs.exists,
      docsFileCount: docs.fileCount,
      outdatedDocs: [],
    }

    const configHealth: ConfigHealth = {
      hasLintConfig,
      hasTypeCheck,
      hasTests,
      hasCiConfig,
      hasGitignore,
      hasLicense,
      hasDockerfile,
      missingRecommended,
    }

    const score = calculateScore(testCoverage, todoDebt, documentationHealth, configHealth)
    const grade = gradeFromScore(score)
    const issues = generateIssues(testCoverage, todoDebt, documentationHealth, configHealth)
    const strengths = generateStrengths(testCoverage, todoDebt, documentationHealth, configHealth)

    const summary: HealthSummary = { score, grade, issues, strengths }

    return {
      assessedAt: new Date().toISOString(),
      summary,
      testCoverage,
      todoDebt,
      documentationHealth,
      configHealth,
    }
  }

  return { assess }
}
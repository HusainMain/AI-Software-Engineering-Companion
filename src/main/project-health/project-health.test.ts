import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createProjectHealthEngine } from './project-health.js'
import type { ProjectHealthReport } from './types.js'

const mockFs = vi.hoisted(() => ({
  readdir: vi.fn(),
  readFile: vi.fn(),
  stat: vi.fn(),
  access: vi.fn(),
}))

vi.mock('node:fs/promises', () => ({
  readdir: mockFs.readdir,
  readFile: mockFs.readFile,
  stat: mockFs.stat,
  access: mockFs.access,
}))

vi.mock('node:path', () => ({
  join: (...args: string[]) => args.join('/'),
  relative: (from: string, to: string) => to.replace(from + '/', ''),
  extname: (p: string) => p.slice(p.lastIndexOf('.')),
  dirname: (p: string) => p.slice(0, p.lastIndexOf('/')),
}))

function setupBasicProject() {
  mockFs.readdir
    .mockImplementation((p: string) => {
      if (p.includes('src')) return [{ name: 'main.ts', isFile: () => true, isDirectory: () => false }]
      if (p.includes('tests')) return [{ name: 'main.test.ts', isFile: () => true, isDirectory: () => false }]
      if (p === '/project') return [{ name: 'src', isFile: () => false, isDirectory: () => true }, { name: 'tests', isFile: () => false, isDirectory: () => true }, { name: 'package.json', isFile: () => true, isDirectory: () => false }, { name: 'README.md', isFile: () => true, isDirectory: () => false }]
      return []
    })
  mockFs.readFile
    .mockImplementation((p: string) => {
      if (p.includes('package.json')) return Promise.resolve(JSON.stringify({ devDependencies: { vitest: '1.0.0' } }))
      return Promise.resolve('// code\n')
    })
  mockFs.stat.mockResolvedValue({ mtimeMs: Date.now() - 86400000 * 5 })
  mockFs.access.mockResolvedValue(undefined)
}

function setupManySourceFiles() {
  mockFs.readdir.mockImplementation((p: string) => {
    if (p.includes('src')) return Array(10).fill({ name: 'file.ts', isFile: () => true, isDirectory: () => false })
    if (p.includes('tests')) return [{ name: 'one.test.ts', isFile: () => true, isDirectory: () => false }]
    if (p === '/project') return [{ name: 'src', isFile: () => false, isDirectory: () => true }, { name: 'tests', isFile: () => false, isDirectory: () => true }, { name: 'package.json', isFile: () => true, isDirectory: () => false }, { name: 'README.md', isFile: () => true, isDirectory: () => false }]
    return []
  })
  mockFs.readFile.mockImplementation((p: string) => {
    if (p.includes('package.json')) return Promise.resolve(JSON.stringify({ devDependencies: { vitest: '1.0.0' } }))
    return Promise.resolve('// code\n')
  })
  mockFs.stat.mockResolvedValue({ mtimeMs: Date.now() })
  mockFs.access.mockResolvedValue(undefined)
}

function setupHighDebt() {
  mockFs.readdir.mockImplementation((p: string) => {
    if (p.includes('src')) return Array(1).fill({ name: 'file.ts', isFile: () => true, isDirectory: () => false })
    if (p === '/project') return [{ name: 'src', isFile: () => false, isDirectory: () => true }, { name: 'package.json', isFile: () => true, isDirectory: () => false }, { name: 'README.md', isFile: () => true, isDirectory: () => false }]
    return []
  })
  mockFs.readFile.mockResolvedValue('// TODO: a\n// TODO: b\n// TODO: c\n// TODO: d\n// TODO: e\n// TODO: f\n// TODO: g\n// TODO: h\n// TODO: i\n// TODO: j\n// TODO: k\n// TODO: l\n// TODO: m\n// TODO: n\n// TODO: o\n// TODO: p\n// FIXME: q\n// FIXME: r\n// FIXME: s\n// HACK: t\n// XXX: u\n')
  mockFs.stat.mockResolvedValue({ mtimeMs: Date.now() })
  mockFs.access.mockResolvedValue(undefined)
}

function setupNoReadme() {
  mockFs.readdir.mockImplementation((p: string) => {
    if (p.includes('src')) return [{ name: 'main.ts', isFile: () => true, isDirectory: () => false }]
    if (p.includes('tests')) return [{ name: 'main.test.ts', isFile: () => true, isDirectory: () => false }]
    if (p === '/project') return [{ name: 'src', isFile: () => false, isDirectory: () => true }, { name: 'tests', isFile: () => false, isDirectory: () => true }, { name: 'package.json', isFile: () => true, isDirectory: () => false }]
    return []
  })
  mockFs.readFile.mockImplementation((p: string) => {
    if (p.includes('package.json')) return Promise.resolve(JSON.stringify({ devDependencies: { vitest: '1.0.0' } }))
    return Promise.resolve('// code\n')
  })
  mockFs.stat.mockRejectedValue({ code: 'ENOENT' })
  mockFs.access.mockResolvedValue(undefined)
}

function setupEmptyProject() {
  mockFs.readdir.mockResolvedValue([])
  mockFs.readFile.mockRejectedValue(new Error('ENOENT'))
  mockFs.access.mockRejectedValue(new Error('ENOENT'))
}

function setupNoSourceFiles() {
  mockFs.readdir.mockResolvedValue([{ name: 'README.md', isFile: () => true, isDirectory: () => false }])
  mockFs.readFile.mockResolvedValue('# Project')
  mockFs.stat.mockResolvedValue({ mtimeMs: Date.now() })
  mockFs.access.mockResolvedValue(undefined)
}

function setupRatioTest() {
  mockFs.readdir.mockImplementation((p: string) => {
    if (p.includes('src')) return Array(5).fill({ name: 'f.ts', isFile: () => true, isDirectory: () => false })
    if (p.includes('tests')) return Array(2).fill({ name: 'f.test.ts', isFile: () => true, isDirectory: () => false })
    if (p === '/project') return [{ name: 'src', isFile: () => false, isDirectory: () => true }, { name: 'tests', isFile: () => false, isDirectory: () => true }, { name: 'package.json', isFile: () => true, isDirectory: () => false }, { name: 'README.md', isFile: () => true, isDirectory: () => false }]
    return []
  })
  mockFs.readFile.mockResolvedValue('// code')
  mockFs.stat.mockResolvedValue({ mtimeMs: Date.now() })
  mockFs.access.mockResolvedValue(undefined)
}

function setupTodoCounts() {
  mockFs.readdir.mockImplementation((p: string) => {
    if (p.includes('src')) return [{ name: 'f.ts', isFile: () => true, isDirectory: () => false }]
    if (p === '/project') return [{ name: 'src', isFile: () => false, isDirectory: () => true }, { name: 'package.json', isFile: () => true, isDirectory: () => false }, { name: 'README.md', isFile: () => true, isDirectory: () => false }]
    return []
  })
  mockFs.readFile.mockResolvedValue('// TODO: a\n// FIXME: b\n// HACK: c\n// XXX: d\n')
  mockFs.stat.mockResolvedValue({ mtimeMs: Date.now() })
  mockFs.access.mockResolvedValue(undefined)
}

function setupGradeA() {
  mockFs.readdir.mockImplementation((p: string) => {
    if (p.includes('src')) return [{ name: 'f.ts', isFile: () => true, isDirectory: () => false }]
    if (p.includes('tests')) return Array(5).fill({ name: 'f.test.ts', isFile: () => true, isDirectory: () => false })
    if (p === '/project') return [{ name: 'src', isFile: () => false, isDirectory: () => true }, { name: 'tests', isFile: () => false, isDirectory: () => true }, { name: 'package.json', isFile: () => true, isDirectory: () => false }, { name: 'README.md', isFile: () => true, isDirectory: () => false }]
    return []
  })
  mockFs.readFile.mockResolvedValue('{"devDependencies": {"vitest": "1.0.0"}}')
  mockFs.stat.mockResolvedValue({ mtimeMs: Date.now() })
  mockFs.access.mockResolvedValue(undefined)
}

function setupGradeF() {
  mockFs.readdir.mockResolvedValue([])
  mockFs.readFile.mockRejectedValue(new Error('ENOENT'))
  mockFs.stat.mockRejectedValue({ code: 'ENOENT' })
  mockFs.access.mockRejectedValue(new Error('ENOENT'))
}

describe('ProjectHealthEngine', () => {
  let engine: ReturnType<typeof createProjectHealthEngine>

  beforeEach(() => {
    vi.resetAllMocks()
    engine = createProjectHealthEngine()
  })

  it('healthy project returns high score and grade A or B', async () => {
    setupBasicProject()
    const report = await engine.assess('/project')
    expect(report.summary.score).toBeGreaterThanOrEqual(70)
    expect(['A', 'B']).toContain(report.summary.grade)
    expect(report.testCoverage.testFrameworks).toContain('vitest')
  })

  it('low test coverage generates warning issue', async () => {
    setupManySourceFiles()
    const report = await engine.assess('/project')
    const lowCovIssue = report.summary.issues.find(i => i.category === 'testing' && i.severity === 'warning')
    expect(lowCovIssue).toBeDefined()
  })

  it('high TODO debt generates warning issue', async () => {
    setupHighDebt()
    const report = await engine.assess('/project')
    const debtIssue = report.summary.issues.find(i => i.category === 'technical-debt')
    expect(debtIssue).toBeDefined()
    expect(debtIssue?.severity).toBe('warning')
  })

  it('missing README generates info issue', async () => {
    setupNoReadme()
    const report = await engine.assess('/project')
    const readmeIssue = report.summary.issues.find(i => i.message === 'No README.md found')
    expect(readmeIssue).toBeDefined()
  })

  it('grade boundaries: A >= 90, B >= 70, C >= 50, D >= 30, F < 30', async () => {
    setupBasicProject()
    const report = await engine.assess('/project')
    const score = report.summary.score
    if (score >= 90) expect(report.summary.grade).toBe('A')
    else if (score >= 70) expect(report.summary.grade).toBe('B')
    else if (score >= 50) expect(report.summary.grade).toBe('C')
    else if (score >= 30) expect(report.summary.grade).toBe('D')
    else expect(report.summary.grade).toBe('F')
  })

  it('empty directory returns valid report', async () => {
    setupEmptyProject()
    const report = await engine.assess('/empty')
    expect(report).toBeDefined()
    expect(report.summary.score).toBeGreaterThanOrEqual(0)
    expect(report.summary.score).toBeLessThanOrEqual(100)
  })

  it('project with no source files still assesses', async () => {
    setupNoSourceFiles()
    const report = await engine.assess('/project')
    expect(report.testCoverage.sourceFileCount).toBe(0)
    expect(report.testCoverage.ratio).toBe(0)
  })

  it('test-to-source ratio calculation', async () => {
    setupRatioTest()
    const report = await engine.assess('/project')
    expect(report.testCoverage.ratio).toBeCloseTo(0.4, 1)
  })

  it('counts TODO, FIXME, HACK, XXX correctly', async () => {
    setupTodoCounts()
    const report = await engine.assess('/project')
    expect(report.todoDebt.todoCount).toBe(1)
    expect(report.todoDebt.fixmeCount).toBe(1)
    expect(report.todoDebt.hackCount).toBe(1)
    expect(report.todoDebt.xxxCount).toBe(1)
    expect(report.todoDebt.totalCount).toBe(4)
  })

  it('grade A for score 95', async () => {
    setupGradeA()
    const report = await engine.assess('/project')
    expect(report.summary.grade).toBe('A')
  })

  it('grade F for very low score', async () => {
    setupGradeF()
    const report = await engine.assess('/bad')
    expect(['F', 'D']).toContain(report.summary.grade)
  })

  it('issues and strengths arrays are populated', async () => {
    setupBasicProject()
    const report = await engine.assess('/project')
    expect(Array.isArray(report.summary.issues)).toBe(true)
    expect(Array.isArray(report.summary.strengths)).toBe(true)
    expect(report.summary.strengths.length).toBeGreaterThan(0)
  })

  it('factory returns valid engine', () => {
    expect(engine).toBeDefined()
    expect(typeof engine.assess).toBe('function')
  })
})
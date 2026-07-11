import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createContextIntelligence } from './context-intelligence.js'
import type { ContextPackage } from './types.js'

function createMockProjectStateStore(overrides?: Record<string, unknown>) {
  return {
    load: vi.fn().mockResolvedValue({
      projectName: 'TestProject',
      currentMilestone: 'Milestone 1',
      updatedAt: '2024-01-01T00:00:00.000Z',
      conversationCount: 5,
      projectContext: {
        projectName: 'TestProject',
        version: '1.0.0',
        rootPath: '/test/project',
        scannedAt: '2024-01-01T00:00:00.000Z',
        scanDurationMs: 100,
        packageInfo: null,
        technologies: [{ name: 'TypeScript', category: 'language', confidence: 'high', source: 'file-extension' }],
        languages: [{ name: 'TypeScript', fileCount: 10, totalLines: 0, percentage: 100 }],
        importantFiles: [
          { relativePath: 'README.md', fileName: 'README.md', extension: '.md', size: 500, lastModified: '2024-01-01T00:00:00.000Z', isImportant: true },
        ],
        documentationFiles: [],
        sourceFiles: [],
        folderStructure: [],
        fileExtensions: { '.ts': 10 },
        totalFiles: 10,
        totalSize: 10000,
      },
      ...overrides,
    }),
    update: vi.fn(),
    save: vi.fn(),
  }
}

function createMockEngineeringMemory(overrides?: Record<string, unknown>) {
  return {
    recordObservation: vi.fn(),
    getObservation: vi.fn(),
    getObservationsByFile: vi.fn().mockReturnValue([]),
    getRecentObservations: vi.fn().mockReturnValue([
      { id: 'obs-1', eventType: 'file:created', filePath: '/test/project/src/main.ts', size: 1000, message: null, timestamp: '2024-01-01T00:00:00.000Z', createdAt: '2024-01-01T00:00:00.000Z' },
      { id: 'obs-2', eventType: 'file:modified', filePath: '/test/project/package.json', size: 200, message: null, timestamp: '2024-01-01T01:00:00.000Z', createdAt: '2024-01-01T01:00:00.000Z' },
    ]),
    getObservationsSince: vi.fn().mockReturnValue([]),
    recordConversation: vi.fn(),
    getConversation: vi.fn(),
    getRecentConversations: vi.fn().mockReturnValue([
      { id: 'conv-1', userMessage: 'What is this project?', response: '{"recommendation":"A TypeScript project","reasoning":"...","alternatives":[],"tradeOffs":[],"followUps":[]}', timestamp: '2024-01-01T00:00:00.000Z' },
    ]),
    migrateFromDecisionLog: vi.fn(),
    close: vi.fn(),
    ...overrides,
  }
}

vi.mock('../relevant-file-selector/relevant-file-selector.js', () => ({
  createRelevantFileSelector: vi.fn(() => ({
    select: vi.fn().mockResolvedValue({
      files: [
        { path: 'src/main.ts', score: 10, matchedKeywords: [], reason: 'keyword match', content: 'console.log("hello")' },
        { path: 'package.json', score: 8, matchedKeywords: [], reason: 'keyword match', content: '{"name":"test"}' },
      ],
      query: 'test',
      extractedKeywords: ['test'],
      totalFilesScanned: 10,
      totalFilesSelected: 2,
      selectionTimeMs: 5,
    }),
  })),
}))

describe('ContextIntelligence', () => {
  let intelligence: ReturnType<typeof createContextIntelligence>

  beforeEach(() => {
    const store = createMockProjectStateStore()
    const memory = createMockEngineeringMemory()
    intelligence = createContextIntelligence('/test/project', store, memory)
  })

  it('build returns a complete ContextPackage', async () => {
    const pkg = await intelligence.build('what is this project?')
    expect(pkg).toBeDefined()
    expect(pkg.projectName).toBe('TestProject')
  })

  it('includes user question in package', async () => {
    const pkg = await intelligence.build('how do I add a dependency?')
    expect(pkg.userQuestion).toBe('how do I add a dependency?')
  })

  it('includes relevant files', async () => {
    const pkg = await intelligence.build('test')
    expect(pkg.relevantFiles.length).toBeGreaterThan(0)
    expect(pkg.relevantFiles[0].path).toBeDefined()
  })

  it('includes recent observations', async () => {
    const pkg = await intelligence.build('what changed recently?')
    expect(pkg.recentObservations.length).toBe(2)
    expect(pkg.recentObservations[0].eventType).toBe('file:created')
  })

  it('includes conversation history', async () => {
    const pkg = await intelligence.build('test')
    expect(pkg.conversationHistory.length).toBe(1)
    expect(pkg.conversationHistory[0].userMessage).toBe('What is this project?')
  })

  it('includes technologies', async () => {
    const pkg = await intelligence.build('test')
    expect(pkg.technologies.length).toBe(1)
    expect(pkg.technologies[0].name).toBe('TypeScript')
  })

  it('includes important documents', async () => {
    const pkg = await intelligence.build('test')
    expect(pkg.importantDocuments.length).toBe(1)
    expect(pkg.importantDocuments[0].relativePath).toBe('README.md')
  })

  it('tokenEstimate is greater than 0 when content exists', async () => {
    const pkg = await intelligence.build('test')
    expect(pkg.tokenEstimate).toBeGreaterThan(0)
  })

  it('handles empty project state gracefully', async () => {
    const store = createMockProjectStateStore({
      projectContext: null,
      projectName: 'EmptyProject',
    })
    const memory = createMockEngineeringMemory()
    const ci = createContextIntelligence('/test/empty', store, memory)
    const pkg = await ci.build('test')
    expect(pkg.projectName).toBe('EmptyProject')
    expect(pkg.technologies).toEqual([])
    expect(pkg.importantDocuments).toEqual([])
  })

  it('handles empty observations gracefully', async () => {
    const store = createMockProjectStateStore()
    const memory = createMockEngineeringMemory({
      getRecentObservations: vi.fn().mockReturnValue([]),
    })
    const ci = createContextIntelligence('/test/project', store, memory)
    const pkg = await ci.build('test')
    expect(pkg.recentObservations).toEqual([])
  })

  it('handles empty conversations gracefully', async () => {
    const store = createMockProjectStateStore()
    const memory = createMockEngineeringMemory({
      getRecentConversations: vi.fn().mockReturnValue([]),
    })
    const ci = createContextIntelligence('/test/project', store, memory)
    const pkg = await ci.build('test')
    expect(pkg.conversationHistory).toEqual([])
  })

  it('trims to token budget when configured small', async () => {
    const store = createMockProjectStateStore()
    const memory = createMockEngineeringMemory()
    const ci = createContextIntelligence('/test/project', store, memory, {
      maxContextTokens: 1,
      maxDocumentLines: 0,
    })
    const pkg = await ci.build('test')
    expect(pkg.tokenEstimate).toBeGreaterThan(0)
  })
})

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createWorkspaceCore } from './workspace-core.js'
import * as path from 'node:path'

const testDataPath = path.join('/test', 'data', 'engineering-memory.db')
const testProjectPath = path.join('/test', 'project')
const testFilePath = path.join('/test', 'file.txt')

vi.mock('electron', () => ({
  ipcMain: {
    handle: vi.fn(),
    on: vi.fn(),
    removeHandler: vi.fn(),
    removeAllListeners: vi.fn(),
  },
  dialog: {
    showOpenDialog: vi.fn(),
  },
}))

vi.mock('../event-bus/event-bus.js', () => ({
  eventBus: {
    on: vi.fn(() => ({ unsubscribe: vi.fn() })),
    emit: vi.fn(),
    off: vi.fn(),
  },
}))

vi.mock('../observation-engine/observation-engine.js', () => ({
  createObservationEngine: vi.fn(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    isWatching: true,
  })),
}))

const mockEngineeringMemory = {
  recordObservation: vi.fn(),
  recordConversation: vi.fn(),
  close: vi.fn(),
  getRecentObservations: vi.fn(() => []),
  getRecentConversations: vi.fn(() => []),
}

vi.mock('../engineering-memory/index.js', () => ({
  createEngineeringMemory: vi.fn(async () => mockEngineeringMemory),
  migrateDecisionLog: vi.fn(() => Promise.resolve({ migrated: 0, skipped: 0 })),
}))

const mockProjectIntelligence = {
  load: vi.fn().mockResolvedValue(undefined),
  save: vi.fn().mockResolvedValue(undefined),
  getState: vi.fn(() => ({ goals: [], activeFocus: null, updatedAt: new Date().toISOString() })),
  setFocus: vi.fn(),
  addGoal: vi.fn(),
  updateGoal: vi.fn(),
}

const mockProjectHealthEngine = {
  assess: vi.fn().mockResolvedValue({
    assessedAt: new Date().toISOString(),
    summary: { score: 80, grade: 'B', issues: [], strengths: [] },
    testCoverage: { testFileCount: 1, sourceFileCount: 2, ratio: 0.5, estimatedStatementCoverage: null, testFrameworks: ['vitest'] },
    todoDebt: { totalCount: 0, todoCount: 0, fixmeCount: 0, hackCount: 0, xxxCount: 0, perFile: [] },
    documentationHealth: { readmeExists: true, readmeAgeDays: 5, docsDirExists: false, docsFileCount: 0, outdatedDocs: [] },
    configHealth: { hasLintConfig: true, hasTypeCheck: true, hasTests: true, hasCiConfig: true, hasGitignore: true, hasLicense: true, hasDockerfile: false, missingRecommended: [] },
  }),
}

vi.mock('../context-intelligence/context-intelligence.js', () => ({
  createContextIntelligence: vi.fn(() => ({
    build: vi.fn().mockResolvedValue({
      projectName: 'test-project',
      technologies: [],
      totalFiles: 0,
      totalSize: 0,
      importantDocuments: [],
      relevantFiles: [],
      recentObservations: [],
      conversationHistory: [],
      userQuestion: '',
      tokenEstimate: 0,
    }),
  })),
}))

vi.mock('../project-intelligence/index.js', () => ({
  createProjectIntelligence: vi.fn(() => mockProjectIntelligence),
}))

vi.mock('../project-health/index.js', () => ({
  createProjectHealthEngine: vi.fn(() => mockProjectHealthEngine),
}))

vi.mock('../project-state/project-state-store.js', () => ({
  createProjectStateStore: vi.fn(() => ({
    load: vi.fn(() => ({ projectName: 'Test', currentMilestone: 'M1', updatedAt: new Date().toISOString(), conversationCount: 0 })),
    save: vi.fn(),
    update: vi.fn(),
  })),
}))

vi.mock('../project-scanner/index.js', () => ({
  createProjectScanner: vi.fn(() => ({
    scan: vi.fn().mockResolvedValue({
      context: {
        projectName: 'test',
        version: '1.0.0',
        rootPath: '/test/project',
        scannedAt: new Date().toISOString(),
        scanDurationMs: 100,
        packageInfo: null,
        technologies: [],
        languages: [],
        importantFiles: [],
        documentationFiles: [],
        sourceFiles: [],
        folderStructure: [],
        fileExtensions: {},
        totalFiles: 0,
        totalSize: 0,
      },
      errors: [],
      warnings: [],
    }),
  })),
}))

vi.mock('../conversation/conversation-manager.js', () => ({
  createConversationManager: vi.fn(() => ({
    cancel: vi.fn(),
  })),
}))

vi.mock('../ai/provider-manager.js', () => ({
  createProviderManager: vi.fn(() => ({
    completeStructured: vi.fn().mockResolvedValue({ ok: true, provider: 'test', model: 'test', data: { recommendation: 'test', reasoning: 'test', alternatives: [], tradeOffs: [], followUps: [] } }),
  })),
}))

vi.mock('../ai/prompt-builder.js', () => ({
  createPromptBuilder: vi.fn(() => ({
    build: vi.fn().mockReturnValue('test prompt'),
  })),
}))

describe('WorkspaceCore', () => {
  let workspaceCore: Awaited<ReturnType<typeof createWorkspaceCore>>
  const testProjectPath = '/test/project'

  beforeEach(async () => {
    vi.clearAllMocks()
    workspaceCore = await createWorkspaceCore({ dataRoot: '/test/data' })
  })

  afterEach(async () => {
    await workspaceCore.stop()
  })

  it('start creates Engineering Memory', async () => {
    const { createEngineeringMemory } = await import('../engineering-memory/index.js')
    await workspaceCore.start()
    const dbPath = (createEngineeringMemory as vi.Mock).mock.calls[0][0]
    expect(dbPath).toMatch(/engineering-memory\.db$/)
  })

  it('open project starts observation', async () => {
    const { createObservationEngine } = await import('../observation-engine/observation-engine.js')
    await workspaceCore.openProject(testProjectPath)
    expect(createObservationEngine).toHaveBeenCalledWith(
      { rootPath: testProjectPath },
      expect.anything()
    )
    const engine = (createObservationEngine as vi.Mock).mock.results[0].value
    expect(engine.start).toHaveBeenCalled()
  })

  it('open project triggers scan', async () => {
    const { createProjectScanner } = await import('../project-scanner/index.js')
    await workspaceCore.openProject(testProjectPath)
    expect(createProjectScanner).toHaveBeenCalledWith({ rootPath: testProjectPath })
    const scanner = (createProjectScanner as vi.Mock).mock.results[0].value
    expect(scanner.scan).toHaveBeenCalled()
  })

  it('open project emits workspace:started event', async () => {
    const { eventBus } = await import('../event-bus/event-bus.js')
    await workspaceCore.openProject(testProjectPath)
    expect(eventBus.emit).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'workspace:started',
        projectRoot: testProjectPath,
      })
    )
  })

  it('open project loads project intelligence and sets focus', async () => {
    await workspaceCore.openProject(testProjectPath)
    expect(mockProjectIntelligence.load).toHaveBeenCalled()
    expect(mockProjectIntelligence.setFocus).toHaveBeenCalledWith('Project analysis and engineering decisions')
  })

  it('close project stops observation', async () => {
    const { createObservationEngine } = await import('../observation-engine/observation-engine.js')
    await workspaceCore.openProject(testProjectPath)
    await workspaceCore.closeProject()
    const engine = (createObservationEngine as vi.Mock).mock.results[0].value
    expect(engine.stop).toHaveBeenCalled()
  })

  it('close project saves project intelligence', async () => {
    await workspaceCore.openProject(testProjectPath)
    await workspaceCore.closeProject()
    expect(mockProjectIntelligence.save).toHaveBeenCalled()
  })

  it('close project emits workspace:stopped event', async () => {
    const { eventBus } = await import('../event-bus/event-bus.js')
    await workspaceCore.openProject(testProjectPath)
    await workspaceCore.closeProject()
    expect(eventBus.emit).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'workspace:stopped' })
    )
  })

  it('get active project returns current project root', async () => {
    await workspaceCore.openProject(testProjectPath)
    expect(workspaceCore.getActiveProject()).toBe(testProjectPath)
  })

  it('get active project when none open returns null', async () => {
    expect(workspaceCore.getActiveProject()).toBeNull()
  })

  it('send message without project throws', async () => {
    await expect(workspaceCore.sendMessage('hello')).rejects.toThrow('No project selected')
  })

  it('send message calls project health engine assess', async () => {
    await workspaceCore.openProject(testProjectPath)
    await workspaceCore.sendMessage('test message')
    expect(mockProjectHealthEngine.assess).toHaveBeenCalledWith(testProjectPath)
  })

  it('send message includes project intelligence and health in prompt', async () => {
    await workspaceCore.openProject(testProjectPath)
    const { createPromptBuilder } = await import('../ai/prompt-builder.js')
    await workspaceCore.sendMessage('test message')
    const promptBuilder = (createPromptBuilder as vi.Mock).mock.results[0].value
    expect(promptBuilder.build).toHaveBeenCalledWith(
      expect.objectContaining({
        projectIntelligence: expect.any(Object),
        projectHealth: expect.any(Object),
      })
    )
  })

  it('file events are forwarded to memory', async () => {
    const { eventBus } = await import('../event-bus/event-bus.js')
    await workspaceCore.openProject('/test/project')

    const onCalls = (eventBus.on as vi.Mock).mock.calls
    const handler = onCalls.find(
      (call) => call[0] === 'file:created'
    )?.[1]
    if (handler) {
      handler({ type: 'file:created', filePath: '/test/file.txt', size: 100, timestamp: new Date().toISOString() })
    }
    expect(mockEngineeringMemory.recordObservation).toHaveBeenCalled()
  })

  it('stop closes memory', async () => {
    await workspaceCore.start()
    await workspaceCore.stop()
    expect(mockEngineeringMemory.close).toHaveBeenCalled()
  })
})
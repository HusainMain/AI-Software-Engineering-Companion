import { createRelevantFileSelector } from '../relevant-file-selector/relevant-file-selector.js'
import { createObservationEngine } from '../observation-engine/observation-engine.js'
import { createEngineeringMemory } from '../engineering-memory/index.js'
import { migrateDecisionLog } from '../engineering-memory/migrate.js'
import { createContextIntelligence } from '../context-intelligence/index.js'
import { createProjectIntelligence } from '../project-intelligence/index.js'
import { createProjectHealthEngine } from '../project-health/index.js'
import { createProjectStateStore, type ProjectStateStore } from '../project-state/project-state-store.js'
import { createProjectScanner } from '../project-scanner/index.js'
import { createProviderManager, type ProviderManager } from '../ai/provider-manager.js'
import { createPromptBuilder, type PromptBuilder } from '../ai/prompt-builder.js'
import { eventBus } from '../event-bus/event-bus.js'
import * as path from 'node:path'
import { ipcMain, dialog } from 'electron'
import type { WorkspaceCore, WorkspaceCoreConfig, WorkspaceSession, ConversationReply, ProviderCompletionResult, RelevantFilesResult, RelevantFile, MatchedKeyword, SelectedFile } from './types.js'
import type { ProjectContext } from '../project-scanner/types.js'
import type { ProjectIntelligenceState } from '../project-intelligence/types.js'
import type { ProjectHealthReport } from '../project-health/types.js'

export async function createWorkspaceCore(config: WorkspaceCoreConfig): Promise<WorkspaceCore> {
  const projectStateStore = createProjectStateStore(config.dataRoot)
  const engineeringMemory = await createEngineeringMemory(path.join(config.dataRoot, 'engineering-memory.db'))

  const decisionsJsonlPath = path.join(config.dataRoot, 'decisions.jsonl')
  migrateDecisionLog(path.join(config.dataRoot, 'engineering-memory.db'), decisionsJsonlPath)
    .then(result => {
      console.log('[WorkspaceCore] Migration result:', result)
    })
    .catch(error => {
      console.error('[WorkspaceCore] Migration failed:', error)
    })

  let activeProject: string | null = null
  let observationEngine: ReturnType<typeof createObservationEngine> | null = null
  let contextIntelligence: ReturnType<typeof createContextIntelligence> | null = null
  let projectIntelligence: ReturnType<typeof createProjectIntelligence> | null = null
  let projectHealthEngine: ReturnType<typeof createProjectHealthEngine> | null = null
  let providerManager: ProviderManager | null = null
  let promptBuilder: PromptBuilder | null = null
  let session: WorkspaceSession | null = null
  let ipcHandlersRegistered = false

  async function registerIpcHandlers(): Promise<void> {
    if (ipcHandlersRegistered) return

    ipcMain.handle('workspace:select-project', async () => {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
        title: 'Select Project Folder',
      })
      if (result.canceled || result.filePaths.length === 0) {
        return null
      }
      const selectedPath = result.filePaths[0]
      await openProject(selectedPath)
      return selectedPath
    })

    ipcMain.handle('workspace:get-active-project', () => {
      return activeProject
    })

    ipcMain.handle('conversation:send-message', async (_event, message: string, signal?: AbortSignal) => {
      if (typeof message !== 'string') {
        throw new TypeError('Conversation message must be a string.')
      }
      return sendMessage(message, signal)
    })

    ipcHandlersRegistered = true
  }

  async function openProject(projectRoot: string): Promise<void> {
    if (activeProject) {
      await closeProject()
    }

    activeProject = projectRoot
    session = { projectRoot, startedAt: new Date().toISOString() }

    const projectScanner = createProjectScanner({ rootPath: projectRoot })
    const scanResult = await projectScanner.scan()
    await projectStateStore.update({ projectContext: scanResult.context })

    observationEngine = createObservationEngine({ rootPath: projectRoot }, eventBus)
    observationEngine.start()

    contextIntelligence = createContextIntelligence(projectRoot, projectStateStore, engineeringMemory)

    projectIntelligence = createProjectIntelligence(projectRoot, config.dataRoot)
    await projectIntelligence.load()
    projectIntelligence.setFocus('Project analysis and engineering decisions')

    projectHealthEngine = createProjectHealthEngine()

    providerManager = createProviderManager()
    promptBuilder = createPromptBuilder()

    eventBus.on('file:created', (event) => {
      engineeringMemory.recordObservation({
        eventType: event.type,
        filePath: event.filePath,
        size: event.size,
        message: null,
        timestamp: event.timestamp,
        createdAt: new Date().toISOString(),
      })
    })

    eventBus.on('file:modified', (event) => {
      engineeringMemory.recordObservation({
        eventType: event.type,
        filePath: event.filePath,
        size: event.size,
        message: null,
        timestamp: event.timestamp,
        createdAt: new Date().toISOString(),
      })
    })

    eventBus.on('file:deleted', (event) => {
      engineeringMemory.recordObservation({
        eventType: event.type,
        filePath: event.filePath,
        size: 0,
        message: null,
        timestamp: event.timestamp,
        createdAt: new Date().toISOString(),
      })
    })

    eventBus.on('git:commit', (event) => {
      engineeringMemory.recordObservation({
        eventType: event.type,
        filePath: null,
        size: 0,
        message: event.message,
        timestamp: event.timestamp,
        createdAt: new Date().toISOString(),
      })
    })

    eventBus.emit({
      type: 'workspace:started',
      timestamp: new Date().toISOString(),
      projectRoot,
    })

    await projectStateStore.update({ projectName: projectRoot.split(path.sep).pop() ?? 'Unknown' })
    await registerIpcHandlers()
  }

  async function closeProject(): Promise<void> {
    if (!activeProject) return

    if (observationEngine) {
      observationEngine.stop()
      observationEngine = null
    }

    if (projectIntelligence) {
      await projectIntelligence.save()
      projectIntelligence = null
    }
    projectHealthEngine = null

    contextIntelligence = null
    providerManager = null
    promptBuilder = null

    eventBus.emit({
      type: 'workspace:stopped',
      timestamp: new Date().toISOString(),
    })

    activeProject = null
    session = null

    await projectStateStore.update({ projectContext: undefined })
  }

  async function sendMessage(userMessage: string, signal?: AbortSignal): Promise<ConversationReply> {
    if (!activeProject || !contextIntelligence || !providerManager || !promptBuilder) {
      throw new Error('No project selected. Please open a project first.')
    }

    const contextPackage = await contextIntelligence.build(userMessage)

    const projectContext = {
      projectName: activeProject.split(path.sep).pop() ?? activeProject,
      version: '0.0.0',
      rootPath: activeProject,
      scannedAt: new Date().toISOString(),
      scanDurationMs: 0,
      packageInfo: null,
      technologies: [],
      languages: [],
      importantFiles: [],
      documentationFiles: [],
      sourceFiles: [],
      folderStructure: [],
      fileExtensions: {},
      totalFiles: contextPackage.totalFiles,
      totalSize: contextPackage.totalSize,
    } as ProjectContext

    const relevantFiles: RelevantFilesResult = {
      files: contextPackage.relevantFiles.map((f: SelectedFile) => ({
        path: f.path,
        score: f.score,
        matchedKeywords: f.matchedKeywords,
        reason: f.reason,
        content: f.content,
      })),
      query: userMessage,
      extractedKeywords: [],
      totalFilesScanned: 0,
      totalFilesSelected: contextPackage.relevantFiles.length,
      selectionTimeMs: 0,
    }

    const piState = projectIntelligence?.getState()
    const healthReport = activeProject && projectHealthEngine
      ? await projectHealthEngine.assess(activeProject)
      : undefined

    const prompt = promptBuilder.build({
      projectContext,
      relevantFiles,
      userQuestion: userMessage,
      projectIntelligence: piState,
      projectHealth: healthReport,
    })

    const result = await providerManager.completeStructured(prompt, signal)

    if (!result.ok) {
      return {
        result,
        decision: null,
      }
    }

    const decisionId = crypto.randomUUID()
    engineeringMemory.recordConversation({
      userMessage,
      response: JSON.stringify(result),
      timestamp: new Date().toISOString(),
    })

    await projectIntelligence?.save()

    return {
      result,
      decision: { id: decisionId },
    }
  }

  async function start(): Promise<void> {
    await registerIpcHandlers()

    const state = await projectStateStore.load()
    if (state.projectContext) {
      const projectRoot = state.projectContext.rootPath
      if (projectRoot) {
        await openProject(projectRoot)
      }
    }
  }

  async function stop(): Promise<void> {
    await closeProject()
    engineeringMemory.close()
    ipcMain.removeHandler('workspace:select-project')
    ipcMain.removeHandler('workspace:get-active-project')
    ipcMain.removeHandler('conversation:send-message')
    ipcHandlersRegistered = false
  }

  function getActiveProject(): string | null {
    return activeProject
  }

  function getSession(): WorkspaceSession | null {
    return session
  }

  return {
    openProject,
    closeProject,
    getActiveProject,
    getSession,
    sendMessage,
    start,
    stop,
  }
}
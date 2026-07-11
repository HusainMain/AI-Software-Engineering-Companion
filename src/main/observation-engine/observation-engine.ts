import chokidar from 'chokidar'
import type { FSWatcher } from 'chokidar'
import * as fs from 'fs'
import * as fsp from 'fs/promises'
import * as path from 'path'
import { EventBus } from '../event-bus/event-bus.js'
import type { FileCreatedEvent, FileModifiedEvent, FileDeletedEvent, GitCommitDetectedEvent } from '../event-bus/events.js'
import { createObservationEngineConfig, type ObservationEngine, type ObservationEngineConfig } from './types.js'

function matchesExcludePattern(filePath: string, excludePatterns: string[]): boolean {
  const normalizedPath = filePath.replace(/\\/g, '/')
  const pathSegments = normalizedPath.split('/')

  for (const pattern of excludePatterns) {
    if (pattern.includes('*')) {
      const regexPattern = pattern
        .replace(/\./g, '\\.')
        .replace(/\*\*/g, '.*')
        .replace(/\*/g, '[^/]*')
      const regex = new RegExp(`^${regexPattern}$`)
      if (regex.test(normalizedPath)) {
        return true
      }
    } else {
      if (pathSegments.includes(pattern)) {
        return true
      }
      if (normalizedPath.startsWith(`${pattern}/`) || normalizedPath === pattern) {
        return true
      }
    }
  }
  return false
}

function getFileSize(filePath: string): number {
  try {
    const stats = fs.statSync(filePath)
    return stats.size
  } catch {
    return 0
  }
}

function getGitCommitMessage(gitDir: string): string {
  try {
    const commitMsgPath = path.join(gitDir, 'COMMIT_EDITMSG')
    const content = fs.readFileSync(commitMsgPath, 'utf-8').trim()
    return content || 'No commit message'
  } catch {
    return 'Unable to read commit message'
  }
}

export function createObservationEngine(config: ObservationEngineConfig, eventBus: EventBus): ObservationEngine {
  const fullConfig = createObservationEngineConfig(config)
  let fileWatcher: FSWatcher | null = null
  let gitWatcher: FSWatcher | null = null
  const debounceTimers = new Map<string, NodeJS.Timeout>()
  let isWatching = false

  function emitFileCreated(filePath: string): void {
    const event: FileCreatedEvent = {
      type: 'file:created',
      timestamp: new Date().toISOString(),
      filePath,
      size: getFileSize(filePath),
    }
    eventBus.emit(event)
  }

  function emitFileModified(filePath: string): void {
    const event: FileModifiedEvent = {
      type: 'file:modified',
      timestamp: new Date().toISOString(),
      filePath,
      size: getFileSize(filePath),
    }
    eventBus.emit(event)
  }

  function emitFileDeleted(filePath: string): void {
    const event: FileDeletedEvent = {
      type: 'file:deleted',
      timestamp: new Date().toISOString(),
      filePath,
    }
    eventBus.emit(event)
  }

  function emitGitCommit(message: string): void {
    const event: GitCommitDetectedEvent = {
      type: 'git:commit',
      timestamp: new Date().toISOString(),
      message,
    }
    eventBus.emit(event)
  }

  function debouncedEmit(filePath: string, emitFn: () => void): void {
    const existingTimer = debounceTimers.get(filePath)
    if (existingTimer) {
      clearTimeout(existingTimer)
    }
    const timer = setTimeout(() => {
      debounceTimers.delete(filePath)
      emitFn()
    }, fullConfig.debounceMs)
    debounceTimers.set(filePath, timer)
  }

  function startFileWatcher(): void {
    fileWatcher = chokidar.watch(fullConfig.rootPath, {
      ignoreInitial: true,
      persistent: true,
      ignorePermissionErrors: true,
      alwaysStat: false,
      ignored: (filePath: string) => {
        const normalizedPath = filePath.replace(/\\/g, '/')
        return matchesExcludePattern(normalizedPath, fullConfig.excludePatterns)
      },
    })

    fileWatcher.on('add', (filePath: string) => {
      if (!matchesExcludePattern(filePath.replace(/\\/g, '/'), fullConfig.excludePatterns)) {
        emitFileCreated(filePath)
      }
    })

    fileWatcher.on('change', (filePath: string) => {
      if (!matchesExcludePattern(filePath.replace(/\\/g, '/'), fullConfig.excludePatterns)) {
        debouncedEmit(filePath, () => emitFileModified(filePath))
      }
    })

    fileWatcher.on('unlink', (filePath: string) => {
      if (!matchesExcludePattern(filePath.replace(/\\/g, '/'), fullConfig.excludePatterns)) {
        emitFileDeleted(filePath)
      }
    })

    fileWatcher.on('error', (error: unknown) => {
      console.error('[ObservationEngine] Watcher error:', error)
    })
  }

  function startGitWatcher(): void {
    const gitDir = path.join(fullConfig.rootPath, '.git')

    gitWatcher = chokidar.watch([
      path.join(gitDir, 'HEAD'),
      path.join(gitDir, 'refs', 'heads', '**'),
      path.join(gitDir, 'COMMIT_EDITMSG'),
    ], {
      ignoreInitial: true,
      persistent: true,
      ignorePermissionErrors: true,
      alwaysStat: false,
    })

    let lastHeadContent = ''

    const checkHeadChange = async (): Promise<void> => {
      try {
        const headPath = path.join(gitDir, 'HEAD')
        const content = await fsp.readFile(headPath, 'utf-8')
        if (content !== lastHeadContent) {
          lastHeadContent = content
          const message = getGitCommitMessage(gitDir)
          emitGitCommit(message)
        }
      } catch {
      }
    }

    gitWatcher.on('change', checkHeadChange)
    gitWatcher.on('add', checkHeadChange)

    gitWatcher.on('error', (error: unknown) => {
      console.error('[ObservationEngine] Git watcher error:', error)
    })
  }

  return {
    start(): void {
      if (isWatching) {
        return
      }

      try {
        startFileWatcher()
        if (fullConfig.watchGit) {
          startGitWatcher()
        }
        isWatching = true
        console.log('[ObservationEngine] Started watching:', fullConfig.rootPath)
      } catch (error) {
        console.error('[ObservationEngine] Failed to start:', error)
      }
    },

    stop(): void {
      if (!isWatching) {
        return
      }

      fileWatcher?.close()
      gitWatcher?.close()

      for (const timer of debounceTimers.values()) {
        clearTimeout(timer)
      }
      debounceTimers.clear()

      fileWatcher = null
      gitWatcher = null
      isWatching = false

      console.log('[ObservationEngine] Stopped')
    },

    get isWatching(): boolean {
      return isWatching
    },
  }
}
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createObservationEngine } from '../src/main/observation-engine/observation-engine.js'
import { createEventBus } from '../src/main/event-bus/event-bus.js'
import type { FileCreatedEvent, FileModifiedEvent, FileDeletedEvent } from '../src/main/event-bus/events.js'

const mockWatchers = new Map<number, {
  on: ReturnType<typeof vi.fn>
  close: ReturnType<typeof vi.fn>
  emit: (event: string, path: string) => void
}>()

let watcherId = 0
let headContent = 'initial'

vi.mock('fs/promises', () => ({
  readFile: vi.fn(async (path: string) => {
    if (path.includes('.git/HEAD')) {
      return headContent
    }
    if (path.includes('COMMIT_EDITMSG')) {
      return 'Test commit message\n'
    }
    return ''
  }),
}))

vi.mock('chokidar', () => {
  const handlers = new Map<number, Map<string, Set<(path: string) => void>>>()

  function createMockWatcher() {
    const id = watcherId++
    const eventHandlers = new Map<string, Set<(path: string) => void>>()
    handlers.set(id, eventHandlers)

    const watcher = {
      on: vi.fn((event: string, handler: (path: string) => void) => {
        if (!eventHandlers.has(event)) {
          eventHandlers.set(event, new Set())
        }
        eventHandlers.get(event)!.add(handler)
      }),
      close: vi.fn(() => {
        handlers.delete(id)
      }),
      emit: (event: string, path: string) => {
        eventHandlers.get(event)?.forEach(h => h(path))
      },
    }
    mockWatchers.set(id, watcher)
    return watcher
  }

  const mockWatchFn = vi.fn(() => createMockWatcher())

  return {
    __esModule: true,
    default: { watch: mockWatchFn },
    watch: mockWatchFn,
    __getWatchers: () => mockWatchers,
    __clearWatchers: () => {
      mockWatchers.clear()
      watcherId = 0
      headContent = 'initial'
    },
    __setHeadContent: (content: string) => { headContent = content },
  }
})

import chokidar, { __getWatchers, __clearWatchers, __setHeadContent } from 'chokidar'

const mockWatch = (chokidar as any).watch
const getWatchers = __getWatchers
const clearWatchers = __clearWatchers
const setHeadContent = __setHeadContent

describe('ObservationEngine', () => {
  let eventBus: ReturnType<typeof createEventBus>
  let engine: ReturnType<typeof createObservationEngine>

  beforeEach(() => {
    eventBus = createEventBus()
    engine = createObservationEngine({ rootPath: '/test/project' }, eventBus)
    vi.clearAllMocks()
    clearWatchers?.()
  })

  afterEach(() => {
    engine.stop()
  })

  it('start/stop lifecycle', () => {
    expect(engine.isWatching).toBe(false)

    engine.start()
    expect(engine.isWatching).toBe(true)
    expect(getWatchers?.()).toBeDefined()

    engine.stop()
    expect(engine.isWatching).toBe(false)
  })

  it('file created emits event', () => {
    const handler = vi.fn<[FileCreatedEvent]>()
    eventBus.on('file:created', handler)

    engine.start()

    const watchers = Array.from(getWatchers?.().values() || [])
    const fileWatcher = watchers[0]
    fileWatcher.emit('add', '/test/project/new-file.txt')

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(expect.objectContaining({
      type: 'file:created',
      filePath: '/test/project/new-file.txt',
    }))
  })

  it('file modified emits event', async () => {
    const handler = vi.fn<[FileModifiedEvent]>()
    eventBus.on('file:modified', handler)

    engine = createObservationEngine({ rootPath: '/test/project', debounceMs: 50 }, eventBus)
    engine.start()

    const watchers = Array.from(getWatchers?.().values() || [])
    const fileWatcher = watchers[0]
    fileWatcher.emit('change', '/test/project/modified.txt')

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(expect.objectContaining({
      type: 'file:modified',
      filePath: '/test/project/modified.txt',
    }))
  })

  it('file deleted emits event', () => {
    const handler = vi.fn<[FileDeletedEvent]>()
    eventBus.on('file:deleted', handler)

    engine.start()

    const watchers = Array.from(getWatchers?.().values() || [])
    const fileWatcher = watchers[0]
    fileWatcher.emit('unlink', '/test/project/deleted.txt')

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(expect.objectContaining({
      type: 'file:deleted',
      filePath: '/test/project/deleted.txt',
    }))
  })

  it('excluded files are ignored', () => {
    const handler = vi.fn()
    eventBus.on('file:created', handler)

    engine.start()

    const watchers = Array.from(getWatchers?.().values() || [])
    const fileWatcher = watchers[0]
    fileWatcher.emit('add', '/test/project/node_modules/some-package/file.js')

    expect(handler).not.toHaveBeenCalled()
  })

  it('debounces rapid changes', async () => {
    const handler = vi.fn()
    eventBus.on('file:modified', handler)

    engine = createObservationEngine({ rootPath: '/test/project', debounceMs: 100 }, eventBus)
    engine.start()

    const watchers = Array.from(getWatchers?.().values() || [])
    const fileWatcher = watchers[0]

    fileWatcher.emit('change', '/test/project/rapid.txt')
    fileWatcher.emit('change', '/test/project/rapid.txt')
    fileWatcher.emit('change', '/test/project/rapid.txt')

    expect(handler).toHaveBeenCalledTimes(0)

    await new Promise(resolve => setTimeout(resolve, 150))

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('git commit detection - watcher is created', () => {
    engine.start()

    expect(mockWatch).toHaveBeenCalledTimes(2)

    const calls = (mockWatch as ReturnType<typeof vi.fn>).mock.calls
    const fileWatchArgs = calls[0]
    const gitWatchArgs = calls[1]

    expect(fileWatchArgs[0]).toBe('/test/project')
    const gitPaths = Array.isArray(gitWatchArgs[0]) ? gitWatchArgs[0].join(',') : gitWatchArgs[0]
    // Normalize path separators for cross-platform
    const normalizedPaths = gitPaths.replace(/\\/g, '/')
    expect(normalizedPaths).toContain('.git/HEAD')
  })

  it('git commit detection - handlers registered', () => {
    engine.start()

    const watchers = Array.from(getWatchers?.().values() || [])
    const gitWatcher = watchers[1]

    // Verify git watcher has change and add handlers registered
    expect(gitWatcher.on).toHaveBeenCalledWith('change', expect.any(Function))
    expect(gitWatcher.on).toHaveBeenCalledWith('add', expect.any(Function))
  })

  it('handles watcher errors without crashing', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    engine.start()

    const watchers = Array.from(getWatchers?.().values() || [])
    const fileWatcher = watchers[0]
    fileWatcher.emit('error', new Error('Watcher error'))

    expect(consoleErrorSpy).toHaveBeenCalledWith('[ObservationEngine] Watcher error:', expect.any(Error))

    consoleErrorSpy.mockRestore()
  })

  it('starts on non-existent path without throwing', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const badEngine = createObservationEngine({ rootPath: '/nonexistent/path' }, eventBus)
    expect(() => badEngine.start()).not.toThrow()

    consoleErrorSpy.mockRestore()
  })

  it('creates separate file and git watchers', () => {
    engine.start()

    expect(chokidar.watch).toHaveBeenCalledTimes(2)

    const calls = (chokidar.watch as ReturnType<typeof vi.fn>).mock.calls
    const fileWatchArgs = calls[0]
    const gitWatchArgs = calls[1]

    expect(fileWatchArgs[0]).toBe('/test/project')
    const gitPaths = Array.isArray(gitWatchArgs[0]) ? gitWatchArgs[0].join(',') : gitWatchArgs[0]
    // Normalize path separators for cross-platform
    const normalizedPaths = gitPaths.replace(/\\/g, '/')
    expect(normalizedPaths).toContain('.git/HEAD')
  })
})
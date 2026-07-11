import { describe, it, expect, beforeEach, vi } from 'vitest'
import { EventBus, createEventBus } from '../src/main/event-bus/index.js'
import type { AppEvent, FileCreatedEvent, FileModifiedEvent } from '../src/main/event-bus/events.js'

describe('EventBus', () => {
  let bus: EventBus

  beforeEach(() => {
    bus = createEventBus()
  })

  it('emits and receives events', () => {
    const handler = vi.fn()
    const event: FileCreatedEvent = {
      type: 'file:created',
      timestamp: new Date().toISOString(),
      filePath: '/test/file.txt',
      size: 100,
    }

    bus.on('file:created', handler)
    bus.emit(event)

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(event)
  })

  it('supports multiple handlers for same event', () => {
    const handler1 = vi.fn()
    const handler2 = vi.fn()
    const event: FileModifiedEvent = {
      type: 'file:modified',
      timestamp: new Date().toISOString(),
      filePath: '/test/file.txt',
      size: 200,
    }

    bus.on('file:modified', handler1)
    bus.on('file:modified', handler2)
    bus.emit(event)

    expect(handler1).toHaveBeenCalledWith(event)
    expect(handler2).toHaveBeenCalledWith(event)
  })

  it('unsubscribes handler with off()', () => {
    const handler = vi.fn()
    const event: FileCreatedEvent = {
      type: 'file:created',
      timestamp: new Date().toISOString(),
      filePath: '/test/file.txt',
      size: 100,
    }

    bus.on('file:created', handler)
    bus.off('file:created', handler)
    bus.emit(event)

    expect(handler).not.toHaveBeenCalled()
  })

  it('unsubscribes via subscription.unsubscribe()', () => {
    const handler = vi.fn()
    const event: FileCreatedEvent = {
      type: 'file:created',
      timestamp: new Date().toISOString(),
      filePath: '/test/file.txt',
      size: 100,
    }

    const sub = bus.on('file:created', handler)
    sub.unsubscribe()
    bus.emit(event)

    expect(handler).not.toHaveBeenCalled()
  })

  it('once() fires only once', () => {
    const handler = vi.fn()
    const event: FileCreatedEvent = {
      type: 'file:created',
      timestamp: new Date().toISOString(),
      filePath: '/test/file.txt',
      size: 100,
    }

    bus.once('file:created', handler)
    bus.emit(event)
    bus.emit(event)

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('emitAsync waits for async handlers', async () => {
    const results: number[] = []
    const event: FileCreatedEvent = {
      type: 'file:created',
      timestamp: new Date().toISOString(),
      filePath: '/test/file.txt',
      size: 100,
    }

    bus.on('file:created', async (e) => {
      await Promise.resolve()
      results.push(1)
    })
    bus.on('file:created', async (e) => {
      await Promise.resolve()
      results.push(2)
    })

    await bus.emitAsync(event)

    expect(results).toEqual([1, 2])
  })

  it('emitAsync handles handler errors gracefully', async () => {
    const event: FileCreatedEvent = {
      type: 'file:created',
      timestamp: new Date().toISOString(),
      filePath: '/test/file.txt',
      size: 100,
    }

    bus.on('file:created', () => {
      throw new Error('handler error')
    })
    bus.on('file:created', () => {
      // second handler should still run
    })

    await expect(bus.emitAsync(event)).resolves.toBeDefined()
  })

  it('clear() removes all handlers', () => {
    const handler = vi.fn()
    const event: FileCreatedEvent = {
      type: 'file:created',
      timestamp: new Date().toISOString(),
      filePath: '/test/file.txt',
      size: 100,
    }

    bus.on('file:created', handler)
    bus.clear()
    bus.emit(event)

    expect(handler).not.toHaveBeenCalled()
  })

  it('clear(eventType) removes handlers for specific type', () => {
    const handler1 = vi.fn()
    const handler2 = vi.fn()
    const event1: FileCreatedEvent = {
      type: 'file:created',
      timestamp: new Date().toISOString(),
      filePath: '/test/file.txt',
      size: 100,
    }
    const event2: FileModifiedEvent = {
      type: 'file:modified',
      timestamp: new Date().toISOString(),
      filePath: '/test/file.txt',
      size: 200,
    }

    bus.on('file:created', handler1)
    bus.on('file:modified', handler2)
    bus.clear('file:created')
    bus.emit(event1)
    bus.emit(event2)

    expect(handler1).not.toHaveBeenCalled()
    expect(handler2).toHaveBeenCalledWith(event2)
  })

  it('listenerCount returns correct count', () => {
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    expect(bus.listenerCount('file:created')).toBe(0)

    bus.on('file:created', handler1)
    expect(bus.listenerCount('file:created')).toBe(1)

    bus.on('file:created', handler2)
    expect(bus.listenerCount('file:created')).toBe(2)

    bus.off('file:created', handler1)
    expect(bus.listenerCount('file:created')).toBe(1)
  })

  it('eventTypes returns registered event types', () => {
    const handler = vi.fn()

    expect(bus.eventTypes()).toEqual([])

    bus.on('file:created', handler)
    expect(bus.eventTypes()).toContain('file:created')

    bus.on('file:modified', handler)
    expect(bus.eventTypes()).toContain('file:modified')
  })

  it('handles async handlers in emit() without blocking', () => {
    const results: string[] = []
    const event: FileCreatedEvent = {
      type: 'file:created',
      timestamp: new Date().toISOString(),
      filePath: '/test/file.txt',
      size: 100,
    }

    bus.on('file:created', async () => {
      await Promise.resolve()
      results.push('async')
    })
    bus.on('file:created', () => {
      results.push('sync')
    })

    bus.emit(event)

    expect(results).toEqual(['sync'])
  })

  it('shared eventBus instance works', async () => {
    const { eventBus } = await import('../src/main/event-bus/index.js')
    const handler = vi.fn()
    const event: FileCreatedEvent = {
      type: 'file:created',
      timestamp: new Date().toISOString(),
      filePath: '/test/shared.txt',
      size: 100,
    }

    eventBus.on('file:created', handler)
    eventBus.emit(event)
    eventBus.off('file:created', handler)

    expect(handler).toHaveBeenCalledWith(event)
  })

  it('type safety: only allows valid event types', () => {
    const handler = vi.fn()
    const validEvent: AppEvent = {
      type: 'file:created',
      timestamp: new Date().toISOString(),
      filePath: '/test/file.txt',
      size: 100,
    }

    bus.on('file:created', handler)
    bus.emit(validEvent)

    expect(handler).toHaveBeenCalled()
  })
})
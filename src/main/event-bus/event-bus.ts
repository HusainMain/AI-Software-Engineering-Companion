import type { AppEvent } from './events.js'

type EventHandler = (event: AppEvent) => void | Promise<void>

interface Subscription {
  unsubscribe(): void
}

export class EventBus {
  private handlers = new Map<string, Set<EventHandler>>()
  private oneTimeHandlers = new Map<string, Set<EventHandler>>()

  emit<T extends AppEvent>(event: T): void {
    const typeHandlers = this.handlers.get(event.type)
    if (typeHandlers) {
      for (const handler of typeHandlers) {
        try {
          handler(event)
        } catch (error) {
          console.error(`Error in event handler for ${event.type}:`, error)
        }
      }
    }

    const oneTime = this.oneTimeHandlers.get(event.type)
    if (oneTime) {
      for (const handler of oneTime) {
        try {
          handler(event)
        } catch (error) {
          console.error(`Error in one-time handler for ${event.type}:`, error)
        }
      }
      this.oneTimeHandlers.delete(event.type)
    }
  }

  emitAsync<T extends AppEvent>(event: T): Promise<void[]> {
    const typeHandlers = this.handlers.get(event.type)
    const oneTime = this.oneTimeHandlers.get(event.type)

    const promises: Promise<void>[] = []

    if (typeHandlers) {
      for (const handler of typeHandlers) {
        try {
          const result = handler(event)
          if (result instanceof Promise) {
            promises.push(result)
          }
        } catch (error) {
          console.error(`Error in async event handler for ${event.type}:`, error)
        }
      }
    }

    if (oneTime) {
      for (const handler of oneTime) {
        try {
          const result = handler(event)
          if (result instanceof Promise) {
            promises.push(result)
          }
        } catch (error) {
          console.error(`Error in one-time async handler for ${event.type}:`, error)
        }
      }
      this.oneTimeHandlers.delete(event.type)
    }

    return Promise.all(promises)
  }

  on<E extends AppEvent['type']>(
    eventType: E,
    handler: (event: Extract<AppEvent, { type: E }>) => void | Promise<void>,
  ): Subscription {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set())
    }
    this.handlers.get(eventType)!.add(handler as EventHandler)

    return {
      unsubscribe: () => {
        this.handlers.get(eventType)?.delete(handler as EventHandler)
        if (this.handlers.get(eventType)?.size === 0) {
          this.handlers.delete(eventType)
        }
      },
    }
  }

  once<E extends AppEvent['type']>(
    eventType: E,
    handler: (event: Extract<AppEvent, { type: E }>) => void | Promise<void>,
  ): Subscription {
    if (!this.oneTimeHandlers.has(eventType)) {
      this.oneTimeHandlers.set(eventType, new Set())
    }
    this.oneTimeHandlers.get(eventType)!.add(handler as EventHandler)

    return {
      unsubscribe: () => {
        this.oneTimeHandlers.get(eventType)?.delete(handler as EventHandler)
        if (this.oneTimeHandlers.get(eventType)?.size === 0) {
          this.oneTimeHandlers.delete(eventType)
        }
      },
    }
  }

  off<E extends AppEvent['type']>(
    eventType: E,
    handler: (event: Extract<AppEvent, { type: E }>) => void | Promise<void>,
  ): void {
    this.handlers.get(eventType)?.delete(handler as EventHandler)
    if (this.handlers.get(eventType)?.size === 0) {
      this.handlers.delete(eventType)
    }
  }

  clear(eventType?: string): void {
    if (eventType) {
      this.handlers.delete(eventType)
      this.oneTimeHandlers.delete(eventType)
    } else {
      this.handlers.clear()
      this.oneTimeHandlers.clear()
    }
  }

  listenerCount(eventType: string): number {
    return (this.handlers.get(eventType)?.size ?? 0) + (this.oneTimeHandlers.get(eventType)?.size ?? 0)
  }

  eventTypes(): string[] {
    return [...new Set([...this.handlers.keys(), ...this.oneTimeHandlers.keys()])]
  }
}

export const eventBus = new EventBus()

export function createEventBus(): EventBus {
  return new EventBus()
}
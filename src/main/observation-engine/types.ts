import type { EventBus } from '../event-bus/event-bus.js'
import { DEFAULT_EXCLUDE_PATTERNS } from '../project-scanner/types.js'

export interface ObservationEngineConfig {
  rootPath: string
  excludePatterns?: string[]
  debounceMs?: number
  watchGit?: boolean
}

export interface ObservationEngine {
  start(): void
  stop(): void
  isWatching: boolean
}

export function createObservationEngineConfig(config: ObservationEngineConfig): Required<ObservationEngineConfig> {
  return {
    rootPath: config.rootPath,
    excludePatterns: config.excludePatterns ?? DEFAULT_EXCLUDE_PATTERNS,
    debounceMs: config.debounceMs ?? 100,
    watchGit: config.watchGit ?? true,
  }
}

export type { EventBus }
export { DEFAULT_EXCLUDE_PATTERNS }
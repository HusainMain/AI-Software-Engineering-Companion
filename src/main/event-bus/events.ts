// Observation Engine events
export interface FileCreatedEvent {
  type: 'file:created'
  timestamp: string
  filePath: string
  size: number
}

export interface FileModifiedEvent {
  type: 'file:modified'
  timestamp: string
  filePath: string
  size: number
}

export interface FileDeletedEvent {
  type: 'file:deleted'
  timestamp: string
  filePath: string
}

export interface GitCommitDetectedEvent {
  type: 'git:commit'
  timestamp: string
  message: string
}

// Engineering Memory events
export interface ObservationRecordedEvent {
  type: 'memory:observation-recorded'
  timestamp: string
  observationId: string
}

export interface DecisionRecordedEvent {
  type: 'memory:decision-recorded'
  timestamp: string
  decisionId: string
}

// Context Intelligence events
export interface ContextPackageBuiltEvent {
  type: 'context:package-built'
  timestamp: string
  tokenCount: number
}

// Workspace events
export interface WorkspaceStartedEvent {
  type: 'workspace:started'
  timestamp: string
  projectRoot: string
}

export interface WorkspaceStoppedEvent {
  type: 'workspace:stopped'
  timestamp: string
}

// Union type
export type AppEvent =
  | FileCreatedEvent
  | FileModifiedEvent
  | FileDeletedEvent
  | GitCommitDetectedEvent
  | ObservationRecordedEvent
  | DecisionRecordedEvent
  | ContextPackageBuiltEvent
  | WorkspaceStartedEvent
  | WorkspaceStoppedEvent
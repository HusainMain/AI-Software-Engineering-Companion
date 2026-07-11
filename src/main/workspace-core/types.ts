import type {
  ProviderCompletionResult,
  ProviderCompletionSuccess,
  ProviderCompletionFailure,
  ProviderError,
  StructuredProviderResponse,
} from '../ai/provider-types.js'
import type { SelectedFile } from '../relevant-file-selector/types.js'

export interface WorkspaceSession {
  projectRoot: string
  startedAt: string
}

export interface MatchedKeyword {
  keyword: string
  locations: ('filename' | 'folder' | 'markdown-title' | 'markdown-heading' | 'package-json' | 'important-file' | 'documentation')[]
}

export interface RelevantFile {
  path: string
  score: number
  matchedKeywords: MatchedKeyword[]
  reason: string
  content: string
}

export interface RelevantFilesResult {
  files: RelevantFile[]
  query: string
  extractedKeywords: string[]
  totalFilesScanned: number
  totalFilesSelected: number
  selectionTimeMs: number
}

export type {
  ProviderCompletionResult,
  ProviderCompletionSuccess,
  ProviderCompletionFailure,
  ProviderError,
  StructuredProviderResponse,
} from '../ai/provider-types.js'

export type { SelectedFile } from '../relevant-file-selector/types.js'

export interface ConversationReply {
  result: ProviderCompletionResult
  decision: { id: string } | null
}

export interface WorkspaceCore {
  openProject(projectRoot: string): Promise<void>
  closeProject(): Promise<void>
  getActiveProject(): string | null
  getSession(): WorkspaceSession | null
  sendMessage(userMessage: string, signal?: AbortSignal): Promise<ConversationReply>
  start(): Promise<void>
  stop(): Promise<void>
}

export interface WorkspaceCoreConfig {
  dataRoot: string
}
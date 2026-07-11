import type {
  ProjectContext,
  FileMetadata,
  TechnologyInfo,
} from '../project-scanner/types.js'
import type { SelectedFile } from '../relevant-file-selector/types.js'
import type { StoredObservation, StoredConversation } from '../engineering-memory/types.js'
import type { ProjectIntelligenceState } from '../project-intelligence/types.js'
import type { ProjectHealthReport } from '../project-health/types.js'

export interface ContextPackage {
  projectName: string
  technologies: TechnologyInfo[]
  totalFiles: number
  totalSize: number
  importantDocuments: FileMetadata[]
  relevantFiles: SelectedFile[]
  recentObservations: StoredObservation[]
  conversationHistory: StoredConversation[]
  userQuestion: string
  tokenEstimate: number
  projectIntelligence?: ProjectIntelligenceState
  projectHealth?: ProjectHealthReport
}

export interface ContextIntelligenceConfig {
  maxContextTokens: number
  maxRelevantFiles: number
  maxObservations: number
  maxConversations: number
  maxDocumentLines: number
}

export interface ContextIntelligence {
  build(userQuestion: string): Promise<ContextPackage>
}

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

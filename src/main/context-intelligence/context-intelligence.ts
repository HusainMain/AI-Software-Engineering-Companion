import { createRelevantFileSelector, type RelevantFileSelector } from '../relevant-file-selector/relevant-file-selector.js'
import type { EngineeringMemory } from '../engineering-memory/types.js'
import type { ProjectStateStore } from '../project-state/project-state-store.js'
import type {
  ContextIntelligence,
  ContextIntelligenceConfig,
  ContextPackage,
} from './types.js'
import { estimateTokens } from './types.js'

const DEFAULT_CONFIG: ContextIntelligenceConfig = {
  maxContextTokens: 4000,
  maxRelevantFiles: 10,
  maxObservations: 20,
  maxConversations: 5,
  maxDocumentLines: 100,
}

function truncateContent(content: string, maxLines: number): string {
  const lines = content.split('\n')
  if (lines.length <= maxLines) return content
  return lines.slice(0, maxLines).join('\n') + '\n... (truncated)'
}

export function createContextIntelligence(
  projectRoot: string,
  projectStateStore: ProjectStateStore,
  engineeringMemory: EngineeringMemory,
  config: Partial<ContextIntelligenceConfig> = {},
): ContextIntelligence {
  const fullConfig = { ...DEFAULT_CONFIG, ...config }
  const relevantFileSelector = createRelevantFileSelector(projectRoot)

  function serializeForEstimation(pkg: Omit<ContextPackage, 'tokenEstimate'>): string {
    const parts: string[] = []
    parts.push(`Project: ${pkg.projectName}`)
    parts.push(`Technologies: ${pkg.technologies.map(t => t.name).join(', ')}`)
    parts.push(`Total Files: ${pkg.totalFiles} (${pkg.totalSize} bytes)`)
    parts.push('')
    if (pkg.importantDocuments.length > 0) {
      parts.push('Important Documents:')
      for (const doc of pkg.importantDocuments) {
        parts.push(`  ${doc.relativePath}`)
      }
      parts.push('')
    }
    if (pkg.relevantFiles.length > 0) {
      parts.push('Relevant Files:')
      for (const f of pkg.relevantFiles) {
        parts.push(`--- ${f.path} ---`)
        parts.push(f.content)
      }
      parts.push('')
    }
    if (pkg.recentObservations.length > 0) {
      parts.push('Recent Observations:')
      for (const obs of pkg.recentObservations) {
        parts.push(`  [${obs.eventType}] ${obs.filePath ?? obs.message ?? ''}`)
      }
      parts.push('')
    }
    if (pkg.conversationHistory.length > 0) {
      parts.push('Conversation History:')
      for (const conv of pkg.conversationHistory) {
        parts.push(`  Q: ${conv.userMessage}`)
        parts.push(`  A: ${conv.response.slice(0, 200)}`)
      }
      parts.push('')
    }
    parts.push(`User Question: ${pkg.userQuestion}`)
    return parts.join('\n')
  }

  async function build(userQuestion: string): Promise<ContextPackage> {
    try {
      const projectState = await projectStateStore.load()
      const projectContext: import('../project-scanner/types.js').ProjectContext | null =
        projectState.projectContext ?? null

      const technologies = projectContext?.technologies ?? []
      const totalFiles = projectContext?.totalFiles ?? 0
      const totalSize = projectContext?.totalSize ?? 0
      const importantDocuments = projectContext?.importantFiles ?? []

      const relevantFilesResult = await relevantFileSelector.select(userQuestion, projectContext ?? undefined)
      const relevantFiles = relevantFilesResult.files.slice(0, fullConfig.maxRelevantFiles)

      const allObservations = engineeringMemory.getRecentObservations(fullConfig.maxObservations)
      const recentObservations = allObservations.slice(0, fullConfig.maxObservations)

      const allConversations = engineeringMemory.getRecentConversations(fullConfig.maxConversations)
      const conversationHistory = allConversations.slice(0, fullConfig.maxConversations)

      const pkg: Omit<ContextPackage, 'tokenEstimate'> = {
        projectName: projectState.projectName,
        technologies,
        totalFiles,
        totalSize,
        importantDocuments,
        relevantFiles,
        recentObservations,
        conversationHistory,
        userQuestion,
      }

      let trimmedObs = recentObservations
      let trimmedConvs = conversationHistory
      let trimmedFiles = relevantFiles

      let serialized = serializeForEstimation({ ...pkg, relevantFiles: trimmedFiles, recentObservations: trimmedObs, conversationHistory: trimmedConvs })
      let tokenEstimate = estimateTokens(serialized)

      // Trim progressively until under budget
      if (tokenEstimate > fullConfig.maxContextTokens) {
        trimmedFiles = trimmedFiles.map(f => ({
          ...f,
          content: truncateContent(f.content, fullConfig.maxDocumentLines),
        }))
        serialized = serializeForEstimation({ ...pkg, relevantFiles: trimmedFiles, recentObservations: trimmedObs, conversationHistory: trimmedConvs })
        tokenEstimate = estimateTokens(serialized)
      }

      if (tokenEstimate > fullConfig.maxContextTokens) {
        trimmedObs = trimmedObs.slice(0, Math.ceil(fullConfig.maxObservations / 2))
        serialized = serializeForEstimation({ ...pkg, relevantFiles: trimmedFiles, recentObservations: trimmedObs, conversationHistory: trimmedConvs })
        tokenEstimate = estimateTokens(serialized)
      }

      if (tokenEstimate > fullConfig.maxContextTokens) {
        trimmedConvs = trimmedConvs.slice(0, Math.ceil(fullConfig.maxConversations / 2))
        serialized = serializeForEstimation({ ...pkg, relevantFiles: trimmedFiles, recentObservations: trimmedObs, conversationHistory: trimmedConvs })
        tokenEstimate = estimateTokens(serialized)
      }

      return {
        ...pkg,
        relevantFiles: trimmedFiles,
        recentObservations: trimmedObs,
        conversationHistory: trimmedConvs,
        tokenEstimate,
      }
    } catch (error) {
      console.error('[ContextIntelligence] Failed to build context package:', error)
      return {
        projectName: '',
        technologies: [],
        totalFiles: 0,
        totalSize: 0,
        importantDocuments: [],
        relevantFiles: [],
        recentObservations: [],
        conversationHistory: [],
        userQuestion,
        tokenEstimate: 0,
      }
    }
  }

  return { build }
}

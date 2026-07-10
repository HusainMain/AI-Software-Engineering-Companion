import type { PromptBuilder } from '../ai/prompt-builder.js';
import type { ProviderManager } from '../ai/provider-manager.js';
import type { ProviderCompletionResult } from '../ai/provider-types.js';
import type { DecisionLog } from '../decision-log/decision-log.js';
import type { ProjectStateStore } from '../project-state/project-state-store.js';
import type { RelevantFileSelector } from '../relevant-file-selector/relevant-file-selector.js';
import type { ProjectScanner } from '../project-scanner/index.js';
import type { ConversationReply } from './types.js';
import type { FileMetadata } from '../project-scanner/types.js';

const isDevelopment = process.env.NODE_ENV === 'development';

function debugLog(...args: unknown[]): void {
  if (isDevelopment) {
    console.log('[DEBUG]', ...args);
  }
}

export interface ConversationManagerDependencies {
  projectStateStore: ProjectStateStore;
  relevantFileSelector: RelevantFileSelector;
  promptBuilder: PromptBuilder;
  providerManager: ProviderManager;
  decisionLog: DecisionLog;
  projectScanner: ProjectScanner;
}

export interface ConversationManager {
  handleUserMessage(userMessage: string, signal?: AbortSignal): Promise<ConversationReply>;
}

export function createConversationManager({
  projectStateStore,
  relevantFileSelector,
  promptBuilder,
  providerManager,
  decisionLog,
  projectScanner,
}: ConversationManagerDependencies): ConversationManager {
  void projectScanner;

  async function handleUserMessage(userMessage: string, signal?: AbortSignal): Promise<ConversationReply> {
    debugLog('ConversationManager.handleUserMessage -> received user message:', userMessage);
    
    const currentState = await projectStateStore.load();
    const projectState = await projectStateStore.update({
      conversationCount: currentState.conversationCount + 1,
    });
    
    const projectContext = projectState.projectContext ?? {
      projectName: projectState.projectName,
      version: '0.0.0',
      rootPath: '',
      scannedAt: new Date().toISOString(),
      scanDurationMs: 0,
      packageInfo: null,
      technologies: [],
      languages: [],
      importantFiles: [] as FileMetadata[],
      documentationFiles: [] as FileMetadata[],
      sourceFiles: [] as FileMetadata[],
      folderStructure: [],
      fileExtensions: {},
      totalFiles: 0,
      totalSize: 0,
    };

    const relevantFiles = await relevantFileSelector.select(userMessage, projectContext);
    
    const promptBuilderInput = { 
      userQuestion: userMessage, 
      projectContext, 
      relevantFiles 
    };
    
    debugLog('ConversationManager.handleUserMessage -> Project State Context:', {
      repositoryRoot: projectContext.rootPath,
      projectName: projectContext.projectName,
      totalFiles: projectContext.totalFiles,
      totalSize: projectContext.totalSize,
      importantDocumentsCount: projectContext.documentationFiles.length,
      sourceFilesCount: projectContext.sourceFiles.length,
      technologiesDetected: projectContext.technologies.map(t => t.name),
    });

    debugLog('ConversationManager.handleUserMessage -> PromptBuilder input:', {
      projectName: projectContext.projectName,
      userQuestion: userMessage,
      userQuestionLength: userMessage.length,
      relevantFilesCount: relevantFiles.files.length,
      relevantFilePaths: relevantFiles.files.map(f => f.path),
    });

    const prompt = promptBuilder.build(promptBuilderInput);

    debugLog('ConversationManager.handleUserMessage -> prompt length:', prompt.length);
    debugLog('ConversationManager.handleUserMessage -> project loaded:', currentState !== undefined);
    debugLog('ConversationManager.handleUserMessage -> relevant files count:', relevantFiles.files.length);

    debugLog('ConversationManager.handleUserMessage -> calling ProviderManager.completeStructured');
    const result: ProviderCompletionResult = await providerManager.completeStructured(prompt, signal);

    debugLog('ConversationManager.handleUserMessage -> ProviderManager result:', {
      ok: result.ok,
      provider: result.ok ? result.provider : undefined,
      model: result.ok ? result.model : undefined,
      error: result.ok ? undefined : result.error,
    });

    const decision = await decisionLog.append({
      summary: 'User conversation processed',
      userMessage,
      response: JSON.stringify(result),
    });

    return {
      result,
      projectState,
      relevantFiles,
      decision,
    };
  }

  return { handleUserMessage };
}

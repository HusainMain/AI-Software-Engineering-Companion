import type { PromptBuilder } from '../ai/prompt-builder.js';
import type { ProviderManager } from '../ai/provider-manager.js';
import type { DecisionLog } from '../decision-log/decision-log.js';
import type { ProjectStateStore } from '../project-state/project-state-store.js';
import type { RelevantFileSelector } from '../relevant-file-selector/relevant-file-selector.js';
import type { ConversationReply } from './types.js';

export interface ConversationManagerDependencies {
  projectStateStore: ProjectStateStore;
  relevantFileSelector: RelevantFileSelector;
  promptBuilder: PromptBuilder;
  providerManager: ProviderManager;
  decisionLog: DecisionLog;
}

export interface ConversationManager {
  handleUserMessage(userMessage: string): Promise<ConversationReply>;
}

export function createConversationManager({
  projectStateStore,
  relevantFileSelector,
  promptBuilder,
  providerManager,
  decisionLog,
}: ConversationManagerDependencies): ConversationManager {
  async function handleUserMessage(userMessage: string): Promise<ConversationReply> {
    const currentState = await projectStateStore.load();
    const projectState = await projectStateStore.update({
      conversationCount: currentState.conversationCount + 1,
    });
    const relevantFiles = await relevantFileSelector.select(userMessage);
    const prompt = promptBuilder.build({ userMessage, projectState, relevantFiles });
    const response = await providerManager.complete(prompt);
    const decision = await decisionLog.append({
      summary: 'User conversation processed',
      userMessage,
      response,
    });

    return {
      response,
      projectState,
      relevantFiles,
      decision,
    };
  }

  return { handleUserMessage };
}

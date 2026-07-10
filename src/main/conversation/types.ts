import type { DecisionRecord } from '../decision-log/types.js';
import type { ProjectState } from '../project-state/types.js';
import type { RelevantFilesResult } from '../relevant-file-selector/types.js';
import type { ProviderCompletionResult } from '../ai/provider-types.js';

export interface ConversationReply {
  result: ProviderCompletionResult;
  projectState: ProjectState;
  relevantFiles: RelevantFilesResult;
  decision: DecisionRecord;
}

// For rendering, a simplified version of the structured response for display
export interface DisplayableStructuredResponse {
  recommendation: string;
  reasoning: string;
  alternatives: string[];
  tradeOffs: string[];
  followUps: string[];
  confidence?: number;
}


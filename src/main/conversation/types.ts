import type { DecisionRecord } from '../decision-log/types.js';
import type { ProjectState } from '../project-state/types.js';
import type { RelevantFileSelection } from '../relevant-file-selector/types.js';

export interface ConversationReply {
  response: string;
  projectState: ProjectState;
  relevantFiles: RelevantFileSelection;
  decision: DecisionRecord;
}

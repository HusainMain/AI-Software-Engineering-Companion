import type { ProjectState } from '../project-state/types.js';
import type { RelevantFileSelection } from '../relevant-file-selector/types.js';

export interface PromptBuilderInput {
  userMessage: string;
  projectState: ProjectState;
  relevantFiles: RelevantFileSelection;
}

export interface PromptBuilder {
  build(input: PromptBuilderInput): string;
}

export function createPromptBuilder(): PromptBuilder {
  function build({ userMessage, projectState, relevantFiles }: PromptBuilderInput): string {
    const fileList = relevantFiles.files.map((file) => `- ${file.path} (${file.reason})`).join('\n');

    return [
      `Project: ${projectState.projectName}`,
      `Milestone: ${projectState.currentMilestone}`,
      `User message: ${userMessage}`,
      'Relevant files:',
      fileList.length > 0 ? fileList : '- none',
    ].join('\n');
  }

  return { build };
}

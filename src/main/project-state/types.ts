import type {
  ProjectContext,
  FileMetadata,
  DirectoryMetadata,
  PackageInfo,
  TechnologyInfo,
  LanguageInfo,
} from '../project-scanner/types.js';

export interface ProjectState {
  projectName: string;
  currentMilestone: string;
  updatedAt: string;
  conversationCount: number;
  projectContext?: ProjectContext;
}

export type ProjectStateUpdate = Partial<Omit<ProjectState, 'updatedAt'>>;

export type {
  ProjectContext,
  FileMetadata,
  DirectoryMetadata,
  PackageInfo,
  TechnologyInfo,
  LanguageInfo,
};
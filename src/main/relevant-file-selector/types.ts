import type { FileMetadata, ProjectContext } from '../project-scanner/types.js';

export interface MatchedKeyword {
  keyword: string;
  locations: ('filename' | 'folder' | 'markdown-title' | 'markdown-heading' | 'package-json' | 'important-file' | 'documentation')[];
}

export interface SelectedFile {
  path: string;
  score: number;
  matchedKeywords: MatchedKeyword[];
  reason: string;
  content: string;
}

export interface RelevantFilesResult {
  files: SelectedFile[];
  query: string;
  extractedKeywords: string[];
  totalFilesScanned: number;
  totalFilesSelected: number;
  selectionTimeMs: number;
}

export interface RelevantFileSelectorConfig {
  projectRoot: string;
  projectContext: ProjectContext;
  maxResults?: number;
  minScore?: number;
  maxFileSize?: number;
}

export interface FileScoreInput {
  file: FileMetadata;
  projectContext: ProjectContext;
  keywords: string[];
}
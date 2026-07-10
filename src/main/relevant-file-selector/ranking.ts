import type { MatchedKeyword, SelectedFile, RelevantFilesResult } from './types.js';
import type { FileMetadata, ProjectContext } from '../project-scanner/types.js';
import { scoreFile } from './file-scorer.js';
import { extractKeywords } from './keyword-extractor.js';

export interface RankingConfig {
  maxResults: number;
  minScore: number;
  maxFileSize: number;
}

export const DEFAULT_RANKING_CONFIG: RankingConfig = {
  maxResults: 15,
  minScore: 1,
  maxFileSize: 500000,
};

export function rankFiles(
  files: FileMetadata[],
  projectContext: ProjectContext,
  query: string,
  config: RankingConfig = DEFAULT_RANKING_CONFIG
): SelectedFile[] {
  const keywords = extractKeywords(query);
  const scoredFiles = files
    .filter(file => file.size <= config.maxFileSize)
    .map(file => {
      const { score, matches } = scoreFile({ file, projectContext, keywords });
      return { file, score, matches };
    })
    .filter(item => item.score >= config.minScore)
    .sort((a, b) => {
      // Primary sort: score descending
      if (b.score !== a.score) return b.score - a.score;
      
      // Secondary sort: prefer source files over test files
      const aIsTest = isTestFile(a.file.relativePath);
      const bIsTest = isTestFile(b.file.relativePath);
      if (aIsTest !== bIsTest) return aIsTest ? 1 : -1;
      
      // Tertiary sort: prefer files in src/ over others
      const aInSrc = a.file.relativePath.startsWith('src/');
      const bInSrc = b.file.relativePath.startsWith('src/');
      if (aInSrc !== bInSrc) return aInSrc ? -1 : 1;
      
      // Final sort: alphabetical
      return a.file.relativePath.localeCompare(b.file.relativePath);
    });

  return scoredFiles.slice(0, config.maxResults).map(item => ({
    path: item.file.relativePath,
    score: item.score,
    matchedKeywords: item.matches,
    reason: determineReason(item.file, item.matches),
    content: '',
  }));
}

function isTestFile(relativePath: string): boolean {
  const path = relativePath.toLowerCase();
  return path.includes('.test.') || 
         path.includes('.spec.') || 
         path.includes('__tests__') || 
         path.includes('__specs__') ||
         path.includes('-test.') ||
         path.includes('-spec.') ||
         path.endsWith('.dev-test.ts') ||
         path.endsWith('.dev-test.js');
}

function determineReason(
  file: FileMetadata,
  matches: MatchedKeyword[]
): string {
  if (matches.length > 0) {
    const locations = matches.flatMap(m => m.locations);
    if (locations.includes('markdown-title')) return 'markdown-title-match';
    if (locations.includes('markdown-heading')) return 'markdown-heading-match';
    if (locations.includes('filename')) return 'filename-match';
    if (locations.includes('folder')) return 'folder-match';
    if (locations.includes('package-json')) return 'package-json-match';
    if (locations.includes('important-file')) return 'important-file-keyword';
    if (locations.includes('documentation')) return 'documentation-keyword';
    return 'keyword-match';
  }
  if (file.isImportant) return 'important-file';
  if (isDocumentationFile(file.fileName)) return 'documentation';
  if (file.relativePath.includes('src/') || file.relativePath.includes('lib/')) return 'source';
  return 'other';
}

export async function selectRelevantFiles(
  projectContext: ProjectContext,
  query: string,
  config: RankingConfig = DEFAULT_RANKING_CONFIG,
  readFileContent: (path: string) => Promise<string>
): Promise<RelevantFilesResult> {
  const startTime = Date.now();

  const allFiles = [
    ...projectContext.importantFiles,
    ...projectContext.documentationFiles,
    ...projectContext.sourceFiles,
  ];

  // Deduplicate by path
  const uniqueFiles = [...new Map(allFiles.map(f => [f.relativePath, f])).values()];

  const selectedFiles = rankFiles(
    uniqueFiles,
    projectContext,
    query,
    config
  );

  const filesWithContent = await Promise.all(
    selectedFiles.map(async file => ({
      ...file,
      content: await readFileContent(file.path).catch(() => ''),
    }))
  );

  return {
    files: filesWithContent,
    query,
    extractedKeywords: extractKeywords(query),
    totalFilesScanned: projectContext.totalFiles,
    totalFilesSelected: filesWithContent.length,
    selectionTimeMs: Date.now() - startTime,
  };
}

function isDocumentationFile(fileName: string): boolean {
  const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  return ['.md', '.mdx', '.txt', '.rst', '.adoc', '.asciidoc'].includes(ext);
}
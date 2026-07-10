import type { FileScoreInput, MatchedKeyword } from './types.js';
import type { FileMetadata, ProjectContext } from '../project-scanner/types.js';
import { getImportanceScore } from '../project-scanner/important-file-detector.js';

const EXTENSION_WEIGHTS: Record<string, number> = {
  '.md': 3,
  '.mdx': 3,
  '.txt': 2,
  '.ts': 2,
  '.tsx': 2,
  '.js': 2,
  '.jsx': 2,
  '.json': 2,
  '.vue': 2,
  '.svelte': 2,
  '.py': 2,
  '.rs': 2,
  '.go': 2,
  '.java': 2,
  '.cs': 2,
};

const FOLDER_WEIGHTS: Record<string, number> = {
  'src': 3,
  'lib': 3,
  'app': 3,
  'components': 3,
  'pages': 3,
  'routes': 3,
  'hooks': 2,
  'utils': 2,
  'services': 2,
  'api': 2,
  'store': 2,
  'context': 2,
  'types': 2,
  'interfaces': 2,
  'models': 2,
  'schemas': 2,
  'tests': 1,
  'spec': 1,
  '__tests__': 1,
  'docs': 3,
  'documentation': 3,
  'architecture': 4,
  'specs': 3,
  'adr': 3,
  'decisions': 3,
};

function calculateExtensionScore(extension: string): number {
  return EXTENSION_WEIGHTS[extension.toLowerCase()] ?? 1;
}

function calculateFolderScore(relativePath: string): number {
  const parts = relativePath.split('/');
  let maxScore = 0;
  for (const part of parts) {
    const lower = part.toLowerCase();
    const score = FOLDER_WEIGHTS[lower] ?? 0;
    if (score > maxScore) maxScore = score;
  }
  return maxScore;
}

function calculateImportanceScore(fileName: string, relativePath: string): number {
  const score = getImportanceScore({ name: fileName, path: relativePath });
  return score / 10;
}

function findKeywordMatches(
  file: FileMetadata,
  projectContext: ProjectContext,
  keywords: string[]
): MatchedKeyword[] {
  const matches: MatchedKeyword[] = [];
  const fileName = file.fileName.toLowerCase();
  const relativePath = file.relativePath.toLowerCase();

  for (const keyword of keywords) {
    const kw = keyword.toLowerCase();
    const locations: MatchedKeyword['locations'] = [];

    if (fileName.includes(kw)) {
      locations.push('filename');
    }

    if (relativePath.includes(kw)) {
      locations.push('folder');
    }

    if (file.isImportant) {
      const importantFiles = projectContext.importantFiles.map(f => f.fileName.toLowerCase());
      if (importantFiles.some(f => f.includes(kw))) {
        locations.push('important-file');
      }
    }

    const docFiles = projectContext.documentationFiles.map(f => f.fileName.toLowerCase());
    if (docFiles.some(f => f.includes(kw))) {
      locations.push('documentation');
    }

    if (projectContext.packageInfo && kw === 'package' && fileName === 'package.json') {
      locations.push('package-json');
    }

    if (locations.length > 0) {
      matches.push({ keyword, locations });
    }
  }

  return matches;
}

function calculateKeywordScore(matches: MatchedKeyword[]): number {
  let score = 0;
  for (const match of matches) {
    const locationWeights: Record<MatchedKeyword['locations'][number], number> = {
      'filename': 3,
      'folder': 2,
      'markdown-title': 4,
      'markdown-heading': 3,
      'package-json': 5,
      'important-file': 4,
      'documentation': 3,
    };
    for (const location of match.locations) {
      score += locationWeights[location] ?? 1;
    }
  }
  return score;
}

export function scoreFile(input: FileScoreInput): { score: number; matches: MatchedKeyword[] } {
  const { file, projectContext, keywords } = input;

  const extensionScore = calculateExtensionScore(file.extension);
  const folderScore = calculateFolderScore(file.relativePath);
  const importanceScore = calculateImportanceScore(file.fileName, file.relativePath);
  const matches = findKeywordMatches(file, projectContext, keywords);
  const keywordScore = calculateKeywordScore(matches);

  let sizePenalty = 0;
  if (file.size > 50000) sizePenalty = 2;
  else if (file.size > 20000) sizePenalty = 1;

  const totalScore = extensionScore + folderScore + importanceScore + keywordScore - sizePenalty;

  return { score: Math.max(0, totalScore), matches };
}

export function scoreFiles(files: FileMetadata[], projectContext: ProjectContext, keywords: string[]) {
  return files.map(file => ({
    file,
    ...scoreFile({ file, projectContext, keywords }),
  }));
}
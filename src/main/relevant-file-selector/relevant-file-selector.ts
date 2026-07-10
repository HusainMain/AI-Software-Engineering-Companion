import fs from 'node:fs/promises';
import path from 'node:path';
import type { RelevantFilesResult } from './types.js';
import { selectRelevantFiles, DEFAULT_RANKING_CONFIG } from './ranking.js';
import { createProjectScanner, type ProjectContext } from '../project-scanner/index.js';

export interface RelevantFileSelector {
  select(userMessage: string, providedContext?: ProjectContext): Promise<RelevantFilesResult>;
}

export function createRelevantFileSelector(projectRoot: string): RelevantFileSelector {
  const projectScanner = createProjectScanner({ rootPath: projectRoot });
  let cachedContext: Awaited<ReturnType<typeof projectScanner.scan>>['context'] | null = null;

  async function getProjectContext() {
    if (!cachedContext) {
      const result = await projectScanner.scan();
      cachedContext = result.context;
    }
    return cachedContext;
  }

  async function readFileContent(relativePath: string): Promise<string> {
    const filePath = path.join(projectRoot, relativePath);
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch {
      return '';
    }
  }

  async function select(userMessage: string, providedContext?: ProjectContext): Promise<RelevantFilesResult> {
    const projectContext = providedContext ?? await getProjectContext();
    return selectRelevantFiles(
      projectContext,
      userMessage,
      DEFAULT_RANKING_CONFIG,
      readFileContent
    );
  }

  return { select };
}

export { selectRelevantFiles, DEFAULT_RANKING_CONFIG, extractKeywords } from './index.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { RelevantFileSelection, SelectedFile } from './types.js';

const RECENT_FILE_LIMIT = 8;
const EXCLUDED_DIRS = new Set(['.git', 'node_modules', 'dist', 'dist-electron', 'release']);
const TEXT_FILE_EXTENSIONS = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.jsonl',
  '.jsx',
  '.md',
  '.ts',
  '.tsx',
  '.txt',
]);

export interface RelevantFileSelector {
  select(userMessage: string): Promise<RelevantFileSelection>;
}

export function createRelevantFileSelector(projectRoot: string): RelevantFileSelector {
  function isInsideProject(fullPath: string): boolean {
    const relativePath = path.relative(projectRoot, fullPath);
    return relativePath.length === 0 || (!relativePath.startsWith('..') && !path.isAbsolute(relativePath));
  }

  function isTextFile(filePath: string): boolean {
    return TEXT_FILE_EXTENSIONS.has(path.extname(filePath).toLowerCase());
  }

  async function readTextFile(filePath: string): Promise<string | undefined> {
    if (!isTextFile(filePath)) {
      return undefined;
    }

    return fs.readFile(filePath, 'utf8');
  }

  async function loadKnownFile(
    fileName: string,
    reason: SelectedFile['reason'],
  ): Promise<SelectedFile | undefined> {
    const filePath = path.join(projectRoot, fileName);
    try {
      const content = await readTextFile(filePath);
      if (content === undefined) {
        return undefined;
      }

      return {
        path: fileName,
        reason,
        content,
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return undefined;
      }

      throw error;
    }
  }

  async function collectFiles(directory: string): Promise<string[]> {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        if (EXCLUDED_DIRS.has(entry.name)) {
          return [];
        }

        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
          return collectFiles(fullPath);
        }

        return [fullPath];
      }),
    );

    return files.flat();
  }

  async function loadRecentlyModifiedFiles(): Promise<SelectedFile[]> {
    const files = await collectFiles(projectRoot);
    const fileStats = await Promise.all(
      files
        .filter(isTextFile)
        .map(async (filePath) => ({
          filePath,
          stats: await fs.stat(filePath),
        })),
    );

    const recentFiles = fileStats
      .filter(({ stats }) => stats.isFile())
      .sort((a, b) => b.stats.mtimeMs - a.stats.mtimeMs)
      .slice(0, RECENT_FILE_LIMIT);

    return Promise.all(
      recentFiles.map(async ({ filePath, stats }) => ({
        path: path.relative(projectRoot, filePath),
        reason: 'recently-modified' as const,
        content: (await readTextFile(filePath)) ?? '',
        modifiedAt: stats.mtime.toISOString(),
      })),
    );
  }

  async function loadUserReferencedFiles(userMessage: string): Promise<SelectedFile[]> {
    const references = Array.from(userMessage.matchAll(/[\w./\\-]+\.[a-zA-Z0-9]+/g)).map(
      ([match]) => match,
    );
    const uniqueReferences = [...new Set(references)];
    const selectedFiles = await Promise.all(
      uniqueReferences.map(async (reference) => {
        const normalizedReference = reference.replaceAll('/', path.sep).replaceAll('\\', path.sep);
        const fullPath = path.resolve(projectRoot, normalizedReference);

        if (!isInsideProject(fullPath)) {
          return undefined;
        }

        try {
          const content = await readTextFile(fullPath);
          if (content === undefined) {
            return undefined;
          }

          return {
            path: path.relative(projectRoot, fullPath),
            reason: 'user-referenced' as const,
            content,
          };
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return undefined;
          }

          throw error;
        }
      }),
    );

    return selectedFiles.filter((file) => file !== undefined);
  }

  async function select(userMessage: string): Promise<RelevantFileSelection> {
    const knownFiles = await Promise.all([
      loadKnownFile('package.json', 'package-json'),
      loadKnownFile('tsconfig.json', 'tsconfig'),
    ]);
    const recentlyModifiedFiles = await loadRecentlyModifiedFiles();
    const userReferencedFiles = await loadUserReferencedFiles(userMessage);
    const selectedFiles = [...knownFiles, ...recentlyModifiedFiles, ...userReferencedFiles];

    const filesByPath = new Map<string, SelectedFile>();
    for (const file of selectedFiles) {
      if (file !== undefined && !filesByPath.has(file.path)) {
        filesByPath.set(file.path, file);
      }
    }

    return { files: [...filesByPath.values()] };
  }

  return { select };
}

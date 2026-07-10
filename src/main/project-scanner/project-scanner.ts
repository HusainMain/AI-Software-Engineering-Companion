import { promises as fs } from 'node:fs';
import path from 'node:path';
import type {
  DirectoryMetadata,
  FileMetadata,
  LanguageInfo,
  PackageJsonInfo,
  ProjectContext,
  ProjectFile,
  ProjectScannerConfig,
  ScanResult,
} from './types.js';
import { DEFAULT_EXCLUDE_PATTERNS } from './types.js';
import { getImportanceScore, isDocumentationFile, isImportantFile, categorizeFile } from './important-file-detector.js';
import { parseMarkdown } from './markdown-parser.js';
import { parsePackageJson } from './package-parser.js';
import { detectTechnologies } from './technology-detector.js';

type FinalProjectScannerConfig = Required<ProjectScannerConfig>;

export function createProjectScannerConfig(config: ProjectScannerConfig): FinalProjectScannerConfig {
  return {
    rootPath: path.resolve(config.rootPath),
    excludePatterns: config.excludePatterns ?? DEFAULT_EXCLUDE_PATTERNS,
    maxFileSize: config.maxFileSize ?? 10 * 1024 * 1024,
    includeHidden: config.includeHidden ?? true,
    maxDepth: config.maxDepth ?? 20,
    maxFiles: config.maxFiles ?? 10_000,
  };
}

export class ProjectScanner {
  private readonly config: FinalProjectScannerConfig;

  constructor(config: ProjectScannerConfig) {
    this.config = createProjectScannerConfig(config);
  }

  async scan(): Promise<ScanResult> {
    const startedAt = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const { files, directories } = await this.collectProjectFiles(warnings);
      const packageInfo = await this.readPackageInfo();
      const documentationFiles = await this.buildDocumentationIndex(files, warnings);
      const importantFiles = this.buildImportantFiles(files, documentationFiles);
      const sourceFiles = this.buildSourceFiles(files, documentationFiles, importantFiles);
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);

      return {
        context: {
          projectName: packageInfo?.name ?? path.basename(this.config.rootPath),
          version: packageInfo?.version ?? '0.0.0',
          rootPath: this.config.rootPath,
          scannedAt: new Date().toISOString(),
          scanDurationMs: Date.now() - startedAt,
          packageInfo,
          technologies: detectTechnologies(packageInfo, files.map((file) => file.path), this.config.rootPath),
          languages: buildLanguageSummary(files),
          importantFiles,
          documentationFiles,
          sourceFiles,
          folderStructure: directories.sort((a, b) => a.relativePath.localeCompare(b.relativePath)),
          fileExtensions: buildExtensionCounts(files),
          totalFiles: files.length,
          totalSize,
        },
        errors,
        warnings,
      };
    } catch (error) {
      errors.push(`Scan failed: ${error instanceof Error ? error.message : String(error)}`);

      return {
        context: createEmptyProjectContext(this.config.rootPath, Date.now() - startedAt),
        errors,
        warnings,
      };
    }
  }

  private async collectProjectFiles(warnings: string[]): Promise<{ files: ProjectFile[]; directories: DirectoryMetadata[] }> {
    const files: ProjectFile[] = [];
    const directoryMap = new Map<string, DirectoryMetadata>();

    await this.walkDirectory(this.config.rootPath, 0, files, directoryMap, warnings);

    return {
      files,
      directories: [...directoryMap.values()],
    };
  }

  private async walkDirectory(
    directoryPath: string,
    depth: number,
    files: ProjectFile[],
    directoryMap: Map<string, DirectoryMetadata>,
    warnings: string[]
  ): Promise<void> {
    if (depth > this.config.maxDepth) {
      warnings.push(`Skipped ${toRelativePath(this.config.rootPath, directoryPath)} because maxDepth was reached.`);
      return;
    }

    if (files.length >= this.config.maxFiles) {
      return;
    }

    let entries: import('node:fs').Dirent[];
    try {
      entries = await fs.readdir(directoryPath, { withFileTypes: true });
    } catch (error) {
      warnings.push(`Could not read ${toRelativePath(this.config.rootPath, directoryPath)}: ${error instanceof Error ? error.message : String(error)}`);
      return;
    }

    let directFileCount = 0;
    let directDirectoryCount = 0;
    let totalSize = 0;

    for (const entry of entries) {
      const absolutePath = path.join(directoryPath, entry.name);
      const relativePath = toRelativePath(this.config.rootPath, absolutePath);

      if (this.shouldSkipEntry(relativePath, entry)) {
        continue;
      }

      if (entry.isDirectory()) {
        directDirectoryCount += 1;
        await this.walkDirectory(absolutePath, depth + 1, files, directoryMap, warnings);
        totalSize += directoryMap.get(relativePath)?.totalSize ?? 0;
        continue;
      }

      if (!entry.isFile() || files.length >= this.config.maxFiles) {
        continue;
      }

      let stats;
      try {
        stats = await fs.stat(absolutePath);
      } catch {
        continue;
      }

      if (stats.size > this.config.maxFileSize) {
        warnings.push(`Skipped ${relativePath} because it exceeds maxFileSize.`);
        continue;
      }

      directFileCount += 1;
      totalSize += stats.size;
      files.push({
        path: relativePath,
        name: entry.name,
        extension: path.extname(entry.name).toLowerCase(),
        size: stats.size,
        modifiedAt: stats.mtime.toISOString(),
        isDirectory: false,
        depth,
        isImportant: isImportantFile(entry.name, relativePath),
      });
    }

    const relativeDirectoryPath = toRelativePath(this.config.rootPath, directoryPath);
    if (relativeDirectoryPath.length > 0) {
      directoryMap.set(relativeDirectoryPath, {
        relativePath: relativeDirectoryPath,
        fileCount: directFileCount,
        subdirectoryCount: directDirectoryCount,
        totalSize,
      });
    }
  }

  private shouldSkipEntry(relativePath: string, entry: import('node:fs').Dirent): boolean {
    if (!this.config.includeHidden && entry.name.startsWith('.')) {
      return true;
    }

    return this.config.excludePatterns.some((pattern) => matchesExcludePattern(relativePath, pattern));
  }

  private async readPackageInfo(): Promise<PackageJsonInfo | null> {
    try {
      const content = await fs.readFile(path.join(this.config.rootPath, 'package.json'), 'utf-8');
      return parsePackageJson(content);
    } catch {
      return null;
    }
  }

  private async buildDocumentationIndex(files: ProjectFile[], warnings: string[]): Promise<FileMetadata[]> {
    const documentationFiles: FileMetadata[] = [];

    for (const file of files) {
      if (!isDocumentationFile(file.name)) {
        continue;
      }

      const metadata = toFileMetadata(file);
      try {
        const content = await fs.readFile(path.join(this.config.rootPath, file.path), 'utf-8');
        const parsed = parseMarkdown(content);
        metadata.firstHeading = parsed.firstHeading;
        metadata.title = parsed.title;
        metadata.sectionCount = parsed.sectionCount;
      } catch (error) {
        warnings.push(`Could not parse documentation ${file.path}: ${error instanceof Error ? error.message : String(error)}`);
      }

      documentationFiles.push(metadata);
    }

    return documentationFiles.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
  }

  private buildImportantFiles(files: ProjectFile[], documentationFiles: FileMetadata[]): FileMetadata[] {
    const documentationByPath = new Map(documentationFiles.map((file) => [file.relativePath, file]));

    return files
      .filter((file) => file.isImportant)
      .sort((a, b) => getImportanceScore(b) - getImportanceScore(a) || a.path.localeCompare(b.path))
      .map((file) => documentationByPath.get(file.path) ?? toFileMetadata(file));
  }

  private buildSourceFiles(files: ProjectFile[], documentationFiles: FileMetadata[], importantFiles: FileMetadata[]): FileMetadata[] {
    const docPaths = new Set(documentationFiles.map((f) => f.relativePath));
    const importantPaths = new Set(importantFiles.map((f) => f.relativePath));

    return files
      .filter((file) => !docPaths.has(file.path) && !importantPaths.has(file.path))
      .filter((file) => categorizeFile(file.name, file.path) === 'source')
      .map((file) => toFileMetadata(file))
      .sort((a, b) => a.relativePath.localeCompare(b.relativePath));
  }
}

export function createProjectScanner(config: ProjectScannerConfig): ProjectScanner {
  return new ProjectScanner(config);
}

function matchesExcludePattern(relativePath: string, pattern: string): boolean {
  const normalizedPath = relativePath.replace(/\\/g, '/');
  const normalizedPattern = pattern.replace(/\\/g, '/').replace(/\/$/, '');
  const pathSegments = normalizedPath.split('/');

  if (!normalizedPattern.includes('*')) {
    return pathSegments.includes(normalizedPattern) || normalizedPath === normalizedPattern || normalizedPath.startsWith(`${normalizedPattern}/`);
  }

  const escapedPattern = normalizedPattern
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '.*')
    .replace(/\*/g, '[^/]*');

  return new RegExp(`^${escapedPattern}$`).test(normalizedPath);
}

function toRelativePath(rootPath: string, absolutePath: string): string {
  return path.relative(rootPath, absolutePath).replace(/\\/g, '/');
}

function toFileMetadata(file: ProjectFile): FileMetadata {
  return {
    relativePath: file.path,
    fileName: file.name,
    extension: file.extension,
    size: file.size,
    lastModified: file.modifiedAt,
    isImportant: file.isImportant ?? false,
  };
}

function buildExtensionCounts(files: ProjectFile[]): Record<string, number> {
  return files.reduce<Record<string, number>>((counts, file) => {
    const extension = file.extension || '[none]';
    counts[extension] = (counts[extension] ?? 0) + 1;
    return counts;
  }, {});
}

function buildLanguageSummary(files: ProjectFile[]): LanguageInfo[] {
  const counts = new Map<string, number>();

  for (const file of files) {
    const language = getLanguageForExtension(file.extension);
    if (language) {
      counts.set(language, (counts.get(language) ?? 0) + 1);
    }
  }

  const totalLanguageFiles = [...counts.values()].reduce((sum, count) => sum + count, 0);

  return [...counts.entries()]
    .map(([name, fileCount]) => ({
      name,
      fileCount,
      totalLines: 0,
      percentage: totalLanguageFiles > 0 ? (fileCount / totalLanguageFiles) * 100 : 0,
    }))
    .sort((a, b) => b.fileCount - a.fileCount || a.name.localeCompare(b.name));
}

function getLanguageForExtension(extension: string): string | null {
  const languages: Record<string, string> = {
    '.ts': 'TypeScript',
    '.tsx': 'TypeScript',
    '.js': 'JavaScript',
    '.jsx': 'JavaScript',
    '.mjs': 'JavaScript',
    '.cjs': 'JavaScript',
    '.json': 'JSON',
    '.md': 'Markdown',
    '.mdx': 'MDX',
    '.css': 'CSS',
    '.scss': 'SCSS',
    '.sass': 'Sass',
    '.less': 'Less',
    '.html': 'HTML',
    '.vue': 'Vue',
    '.svelte': 'Svelte',
    '.py': 'Python',
    '.rs': 'Rust',
    '.go': 'Go',
    '.java': 'Java',
    '.kt': 'Kotlin',
    '.swift': 'Swift',
    '.rb': 'Ruby',
    '.php': 'PHP',
    '.cs': 'C#',
    '.cpp': 'C++',
    '.cc': 'C++',
    '.c': 'C',
    '.h': 'C/C++',
    '.hpp': 'C++',
    '.sql': 'SQL',
    '.sh': 'Shell',
    '.ps1': 'PowerShell',
    '.yaml': 'YAML',
    '.yml': 'YAML',
    '.toml': 'TOML',
    '.xml': 'XML',
  };

  return languages[extension.toLowerCase()] ?? null;
}

function createEmptyProjectContext(rootPath: string, scanDurationMs: number): ProjectContext {
  return {
    projectName: path.basename(rootPath),
    version: '0.0.0',
    rootPath,
    scannedAt: new Date().toISOString(),
    scanDurationMs,
    packageInfo: null,
    technologies: [],
    languages: [],
    importantFiles: [],
    documentationFiles: [],
    sourceFiles: [],
    folderStructure: [],
    fileExtensions: {},
    totalFiles: 0,
    totalSize: 0,
  };
}

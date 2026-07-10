export interface FileMetadata {
  relativePath: string;
  fileName: string;
  extension: string;
  size: number;
  lastModified: string;
  isImportant: boolean;
  firstHeading?: string;
  title?: string;
  sectionCount?: number;
}

export interface DirectoryMetadata {
  relativePath: string;
  fileCount: number;
  subdirectoryCount: number;
  totalSize: number;
}

export interface PackageInfo {
  name?: string;
  version?: string;
  description?: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  engines?: Record<string, string>;
  license?: string;
  repository?: string | { type: string; url: string };
  author?: string | { name: string; email: string; url: string };
}

export interface PackageJsonInfo extends PackageInfo {
  main?: string;
  peerDependencies?: Record<string, string>;
  workspaces?: string[];
}

export interface TechnologyInfo {
  name: string;
  category: 'framework' | 'language' | 'tool' | 'runtime' | 'library' | 'testing' | 'build';
  confidence: 'high' | 'medium' | 'low';
  source: 'package.json' | 'config-file' | 'file-extension' | 'folder-structure';
}

export interface LanguageInfo {
  name: string;
  fileCount: number;
  totalLines: number;
  percentage: number;
}

export interface ProjectContext {
  projectName: string;
  version: string;
  rootPath: string;
  scannedAt: string;
  scanDurationMs: number;
  packageInfo: PackageInfo | null;
  technologies: TechnologyInfo[];
  languages: LanguageInfo[];
  importantFiles: FileMetadata[];
  documentationFiles: FileMetadata[];
  sourceFiles: FileMetadata[];
  folderStructure: DirectoryMetadata[];
  fileExtensions: Record<string, number>;
  totalFiles: number;
  totalSize: number;
}

export interface ProjectScannerConfig {
  rootPath: string;
  excludePatterns?: string[];
  maxFileSize?: number;
  includeHidden?: boolean;
  maxDepth?: number;
  maxFiles?: number;
}

export interface ScanResult {
  context: ProjectContext;
  errors: string[];
  warnings: string[];
}

export interface ProjectFile {
  path: string;
  name: string;
  extension: string;
  size: number;
  modifiedAt: string;
  isDirectory: boolean;
  depth: number;
  isImportant?: boolean;
}

const DEFAULT_EXCLUDE_PATTERNS = [
  'node_modules',
  'dist',
  'dist-electron',
  'build',
  'out',
  'tmp',
  'temp',
  '.vite',
  '.git',
  'coverage',
  '.cache',
  '.vscode',
  'release/**',
  '*.log',
  '*.tmp',
  '*.temp',
  '.DS_Store',
  'Thumbs.db',
];

export { DEFAULT_EXCLUDE_PATTERNS };

import type { ProjectFile } from './types.js';

const IMPORTANT_FILE_PATTERNS = [
  /^README/i,
  /^CHANGELOG/i,
  /^CONTRIBUTING/i,
  /^LICENSE/i,
  /^CODE_OF_CONDUCT/i,
  /^SECURITY/i,
  /^SUPPORT/i,
  /^FAQ/i,
  /^ROADMAP/i,
  /^ARCHITECTURE/i,
  /^DESIGN/i,
  /^SPEC/i,
  /^ADR/i,
  /^DECISION/i,
  /^IMPLEMENTATION/i,
  /^GLOSSARY/i,
  /^package\.json$/,
  /^tsconfig\.json$/,
  /^vite\.config\./i,
  /^webpack\.config\./i,
  /^rollup\.config\./i,
  /^esbuild\./i,
  /^\.eslintrc/i,
  /^eslint\.config\./i,
  /^\.prettierrc/i,
  /^prettier\.config\./i,
  /^\.gitignore$/,
  /^\.gitattributes$/,
  /^docker-compose\./i,
  /^Dockerfile/i,
  /^\.dockerignore$/,
  /^Makefile$/,
  /^makefile$/,
  /^\.env/i,
  /^\.nvmrc$/,
  /^\.node-version$/,
  /^\.tool-versions$/,
  /^yarn\.lock$/,
  /^pnpm-lock\.yaml$/,
  /^pnpm-workspace\.yaml$/,
  /^bun\.lockb$/,
  /^deno\.lock$/,
  /^electron-builder\./i,
  /^turbo\.json$/,
  /^nx\.json$/,
  /^workspace\.json$/,
  /^\.github\/workflows\//i,
  /^\.gitlab-ci\.yml$/i,
  /^\.circleci\/config\.yml$/i,
  /^jest\.config\./i,
  /^vitest\.config\./i,
  /^playwright\.config\./i,
  /^cypress\.config\./i,
  /^\.storybook\//i,
  /^\.husky\//i,
  /^tailwind\.config\./i,
  /^postcss\.config\./i,
  /^babel\.config\./i,
  /^\.babelrc/i,
  /^commitlint\.config\./i,
  /^\.commitlintrc/i,
];

const DOCUMENTATION_EXTENSIONS = ['.md', '.mdx', '.txt', '.rst', '.adoc', '.asciidoc'];

export function isImportantFile(fileName: string, relativePath: string): boolean {
  if (isDocumentationFile(fileName)) {
    return true;
  }

  const normalizedPath = relativePath.replace(/\\/g, '/');
  for (const pattern of IMPORTANT_FILE_PATTERNS) {
    if (pattern.test(fileName) || pattern.test(normalizedPath)) {
      return true;
    }
  }
  return false;
}

export function isDocumentationFile(fileName: string): boolean {
  const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  return DOCUMENTATION_EXTENSIONS.includes(ext);
}

export function categorizeFile(fileName: string, relativePath: string): 'important' | 'documentation' | 'config' | 'source' | 'test' | 'other' {
  if (isImportantFile(fileName, relativePath)) {
    return 'important';
  }
  if (isDocumentationFile(fileName)) {
    return 'documentation';
  }
  const configPatterns = [
    /\.config\./i,
    /\.rc$/i,
    /\.config$/i,
    /^eslint/i,
    /^prettier/i,
    /^jest/i,
    /^vitest/i,
    /^playwright/i,
    /^cypress/i,
    /^tailwind/i,
    /^postcss/i,
    /^babel/i,
    /^webpack/i,
    /^rollup/i,
    /^vite/i,
    /^tsconfig/i,
    /^jsconfig/i,
  ];
  for (const pattern of configPatterns) {
    if (pattern.test(fileName)) {
      return 'config';
    }
  }
  const testPatterns = [
    /\.test\./i,
    /\.spec\./i,
    /__tests__/i,
    /__specs__/i,
    /\.stories\./i,
    /\.story\./i,
  ];
  for (const pattern of testPatterns) {
    if (pattern.test(relativePath)) {
      return 'test';
    }
  }
  const sourceExtensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.vue', '.svelte', '.astro', '.py', '.rs', '.go', '.java', '.kt', '.swift', '.rb', '.php', '.cs', '.cpp', '.c', '.h'];
  const ext = '.' + relativePath.split('.').pop()?.toLowerCase();
  if (sourceExtensions.includes(ext)) {
    return 'source';
  }
  return 'other';
}

export function getImportanceScore(file: Pick<ProjectFile, 'name' | 'path'>): number {
  const name = file.name.toLowerCase();
  const relativePath = file.path.replace(/\\/g, '/').toLowerCase();

  if (name === 'package.json') return 100;
  if (name.startsWith('readme')) return 95;
  if (name.startsWith('architecture') || relativePath.includes('/architecture')) return 90;
  if (name.startsWith('implementation') || name.startsWith('roadmap')) return 85;
  if (name.startsWith('spec') || name.startsWith('adr') || name.startsWith('decision')) return 80;
  if (name.startsWith('glossary')) return 75;
  if (name.startsWith('changelog')) return 70;
  if (name === 'tsconfig.json' || name.startsWith('vite.config')) return 65;
  if (isDocumentationFile(name)) return 50;

  return 10;
}

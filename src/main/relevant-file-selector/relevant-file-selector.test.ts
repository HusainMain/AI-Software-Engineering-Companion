import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ProjectScanner } from '../project-scanner/project-scanner.js';
import { selectRelevantFiles, extractKeywords, DEFAULT_RANKING_CONFIG } from './index.js';
import type { ProjectContext } from '../project-scanner/types.js';

type FixtureFiles = Record<string, string>;

async function withTempProject(files: FixtureFiles, test: (rootPath: string) => Promise<void>): Promise<void> {
  const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), 'relevant-file-selector-'));

  try {
    for (const [relativePath, content] of Object.entries(files)) {
      const filePath = path.join(rootPath, relativePath);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, content, 'utf-8');
    }

    await test(rootPath);
  } finally {
    await fs.rm(rootPath, { recursive: true, force: true });
  }
}

async function scanProject(rootPath: string): Promise<ProjectContext> {
  const { context, errors } = await new ProjectScanner({ rootPath }).scan();
  assert.deepEqual(errors, []);
  return context;
}

function createMockReadFile(rootPath: string) {
  return async (relativePath: string): Promise<string> => {
    const filePath = path.join(rootPath, relativePath);
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch {
      return '';
    }
  };
}

function testKeywordExtraction(): void {
  assert.deepEqual(extractKeywords('How does provider selection work?'), ['provider', 'selection', 'work']);
  assert.deepEqual(extractKeywords('React component lifecycle'), ['react', 'component', 'lifecycle']);
  assert.deepEqual(extractKeywords('Electron main process'), ['electron', 'main', 'process']);
  assert.deepEqual(extractKeywords('package.json scripts'), ['package', 'json', 'scripts']);
  assert.deepEqual(extractKeywords('the and or but'), []);
  assert.deepEqual(extractKeywords(''), []);
  assert.deepEqual(extractKeywords('PROVIDER Selection'), ['provider', 'selection']);
}

async function testProviderQuestion(): Promise<void> {
  await withTempProject(
    {
      'package.json': JSON.stringify({
        name: 'test-app',
        version: '1.0.0',
        dependencies: { electron: '^25.0.0' },
        devDependencies: { typescript: '^5.0.0' },
      }),
      'src/main/provider-manager.ts': 'export class ProviderManager { select() {} }',
      'src/main/provider-registry.ts': 'export const ProviderRegistry = {};',
      'src/main/provider-adapters.ts': 'export const adapters = [];',
      'src/main/provider-types.ts': 'export type Provider = any;',
      'src/main/provider-config.ts': 'export const config = {};',
      'src/renderer/App.tsx': 'export function App() { return null; }',
      'README.md': '# Test App\n\n## Provider System',
    },
    async (rootPath) => {
      const context = await scanProject(rootPath);
      const result = await selectRelevantFiles(context, 'How does provider selection work?', DEFAULT_RANKING_CONFIG, createMockReadFile(rootPath));

      const paths = result.files.map((f) => f.path);
      assert.ok(paths.includes('src/main/provider-manager.ts'), 'should find provider-manager.ts');
      assert.ok(paths.includes('src/main/provider-registry.ts'), 'should find provider-registry.ts');
      assert.ok(paths.includes('src/main/provider-types.ts'), 'should find provider-types.ts');

      for (const file of result.files) {
        assert.ok(file.content.length > 0, `content should be loaded for ${file.path}`);
        assert.ok(file.score > 0, `score should be positive for ${file.path}`);
        assert.ok(file.reason.length > 0, `reason should be set for ${file.path}`);
      }
    }
  );
}

async function testReactQuestion(): Promise<void> {
  await withTempProject(
    {
      'package.json': JSON.stringify({
        name: 'react-app',
        dependencies: { react: '^19.0.0', 'react-dom': '^19.0.0' },
        devDependencies: { '@vitejs/plugin-react': '^4.0.0', vite: '^6.0.0' },
      }),
      'src/components/Button.tsx': 'export function Button() { return <button />; }',
      'src/components/Header.tsx': 'export function Header() { return <header />; }',
      'src/hooks/useAuth.ts': 'export function useAuth() { return {}; }',
      'src/utils/api.ts': 'export const api = {};',
      'vite.config.ts': 'import { defineConfig } from "vite"; export default defineConfig({});',
      'README.md': '# React App\n\n## Components\n\n### Button\n\n### Header',
    },
    async (rootPath) => {
      const context = await scanProject(rootPath);
      const result = await selectRelevantFiles(context, 'How do React components work?', DEFAULT_RANKING_CONFIG, createMockReadFile(rootPath));

      const paths = result.files.map((f) => f.path);
      assert.ok(paths.includes('src/components/Button.tsx'));
      assert.ok(paths.includes('src/components/Header.tsx'));
      assert.ok(paths.includes('README.md'));
    }
  );
}

async function testElectronQuestion(): Promise<void> {
  await withTempProject(
    {
      'package.json': JSON.stringify({
        name: 'electron-app',
        main: 'dist-electron/main.js',
        dependencies: { electron: '^25.0.0' },
        devDependencies: { 'electron-builder': '^24.0.0' },
      }),
      'src/main/main.ts': 'import { app } from "electron"; app.whenReady();',
      'src/main/preload.ts': 'contextBridge.exposeInMainWorld();',
      'src/renderer/index.tsx': 'export function App() { return null; }',
      'electron-builder.json': '{}',
    },
    async (rootPath) => {
      const context = await scanProject(rootPath);
      const result = await selectRelevantFiles(context, 'Electron main process', DEFAULT_RANKING_CONFIG, createMockReadFile(rootPath));

      const paths = result.files.map((f) => f.path);
      assert.ok(paths.includes('src/main/main.ts'));
      assert.ok(paths.includes('electron-builder.json'));
    }
  );
}

async function testMarkdownDocumentationQuery(): Promise<void> {
  await withTempProject(
    {
      'ARCHITECTURE.md': '# Architecture\n\n## Provider System\n\nThe provider system handles...\n\n## Data Flow\n\nData flows through...',
      'README.md': '# App\n\nBasic info',
      'src/main/provider-manager.ts': 'export class ProviderManager {}',
    },
    async (rootPath) => {
      const context = await scanProject(rootPath);
      const result = await selectRelevantFiles(context, 'architecture provider system', DEFAULT_RANKING_CONFIG, createMockReadFile(rootPath));

      const paths = result.files.map((f) => f.path);
      assert.ok(paths.includes('ARCHITECTURE.md'));
      const archFile = result.files.find((f) => f.path === 'ARCHITECTURE.md');
      assert.ok(archFile?.reason.includes('match') || archFile?.reason.includes('documentation') || archFile?.reason.includes('keyword'));
    }
  );
}

async function testPackageJsonQuery(): Promise<void> {
  await withTempProject(
    {
      'package.json': JSON.stringify({
        name: 'pkg-test',
        scripts: { build: 'tsc', test: 'vitest' },
        dependencies: { react: '^19.0.0' },
      }),
      'src/index.ts': 'export {};',
    },
    async (rootPath) => {
      const context = await scanProject(rootPath);
      const result = await selectRelevantFiles(context, 'package.json scripts', DEFAULT_RANKING_CONFIG, createMockReadFile(rootPath));

      const paths = result.files.map((f) => f.path);
      assert.ok(paths.includes('package.json'));
      const pkgFile = result.files.find((f) => f.path === 'package.json');
      assert.ok(pkgFile?.reason.includes('filename') || pkgFile?.reason.includes('package'));
    }
  );
}

async function testUnknownTopic(): Promise<void> {
  await withTempProject(
    {
      'package.json': JSON.stringify({ name: 'unknown-test' }),
      'src/unrelated.ts': 'export const x = 1;',
      'README.md': '# Unrelated',
    },
    async (rootPath) => {
      const context = await scanProject(rootPath);
      const result = await selectRelevantFiles(context, 'quantum computing', DEFAULT_RANKING_CONFIG, createMockReadFile(rootPath));

      assert.ok(result.files.length <= 10);
      assert.ok(result.extractedKeywords.includes('quantum'));
      assert.ok(result.extractedKeywords.includes('computing'));
    }
  );
}

async function testEmptyQuery(): Promise<void> {
  await withTempProject(
    {
      'package.json': JSON.stringify({ name: 'empty-test' }),
      'src/index.ts': 'export {};',
      'README.md': '# Readme',
    },
    async (rootPath) => {
      const context = await scanProject(rootPath);
      const result = await selectRelevantFiles(context, '', DEFAULT_RANKING_CONFIG, createMockReadFile(rootPath));

      assert.equal(result.extractedKeywords.length, 0);
      assert.ok(result.files.length >= 0);
    }
  );
}

async function testMultipleMatchingFiles(): Promise<void> {
  await withTempProject(
    {
      'package.json': JSON.stringify({ name: 'multi-test' }),
      'src/auth/login.ts': 'export function login() {}',
      'src/auth/register.ts': 'export function register() {}',
      'src/auth/utils.ts': 'export function hash() {}',
      'src/api/users.ts': 'export function getUsers() {}',
      'README.md': '# Auth Module',
    },
    async (rootPath) => {
      const context = await scanProject(rootPath);
      const result = await selectRelevantFiles(context, 'auth login', DEFAULT_RANKING_CONFIG, createMockReadFile(rootPath));

      const paths = result.files.map((f) => f.path);
      assert.ok(paths.includes('src/auth/login.ts'));
      assert.ok(paths.includes('src/auth/register.ts'));
    }
  );
}

async function testDeterministicOrdering(): Promise<void> {
  await withTempProject(
    {
      'package.json': JSON.stringify({ name: 'deterministic-test' }),
      'src/a.ts': 'export const a = 1;',
      'src/b.ts': 'export const b = 2;',
      'src/c.ts': 'export const c = 3;',
    },
    async (rootPath) => {
      const context = await scanProject(rootPath);

      const result1 = await selectRelevantFiles(context, 'test', DEFAULT_RANKING_CONFIG, createMockReadFile(rootPath));
      const result2 = await selectRelevantFiles(context, 'test', DEFAULT_RANKING_CONFIG, createMockReadFile(rootPath));

      const paths1 = result1.files.map((f) => f.path);
      const paths2 = result2.files.map((f) => f.path);

      assert.deepEqual(paths1, paths2);

      const scores1 = result1.files.map((f) => f.score);
      const scores2 = result2.files.map((f) => f.score);
      assert.deepEqual(scores1, scores2);
    }
  );
}

async function testDistElectronIgnored(): Promise<void> {
  await withTempProject(
    {
      'package.json': JSON.stringify({ name: 'dist-test' }),
      'src/main/provider-manager.ts': 'export class ProviderManager { work() {} }',
      'dist-electron/main/provider-manager.js': 'class ProviderManager { work() {} }',
      'src/main/provider-registry.ts': 'export const registry = {};',
    },
    async (rootPath) => {
      const context = await scanProject(rootPath);

      // Verify dist-electron is not indexed
      const distFiles = context.sourceFiles.filter(f => f.relativePath.startsWith('dist-electron/'));
      assert.equal(distFiles.length, 0, 'dist-electron files should be ignored');

      const result = await selectRelevantFiles(context, 'ProviderManager work', DEFAULT_RANKING_CONFIG, createMockReadFile(rootPath));
      const paths = result.files.map((f) => f.path);

      // Should find source files, not dist-electron
      assert.ok(paths.includes('src/main/provider-manager.ts'), 'should find source provider-manager.ts');
      assert.ok(!paths.some(p => p.startsWith('dist-electron/')), 'should not select dist-electron files');
    }
  );
}

async function testSourcePreferredOverGenerated(): Promise<void> {
  await withTempProject(
    {
      'package.json': JSON.stringify({ name: 'source-test' }),
      'src/main/provider-manager.ts': 'export class ProviderManager { selectProvider() {} }',
      'dist-electron/main/provider-manager.js': 'class ProviderManager { selectProvider() {} }',
      'src/main/provider-types.ts': 'export type Provider = any;',
    },
    async (rootPath) => {
      const context = await scanProject(rootPath);
      const result = await selectRelevantFiles(context, 'selectProvider', DEFAULT_RANKING_CONFIG, createMockReadFile(rootPath));

      // Find the provider-manager entries
      const sourceFile = result.files.find(f => f.path === 'src/main/provider-manager.ts');
      const generatedFile = result.files.find(f => f.path.startsWith('dist-electron/'));

      assert.ok(sourceFile, 'source provider-manager.ts should be selected');
      assert.ok(!generatedFile, 'dist-electron provider-manager.js should NOT be selected');
    }
  );
}

async function testBuildArtifactsIgnored(): Promise<void> {
  await withTempProject(
    {
      'package.json': JSON.stringify({ name: 'build-test' }),
      'src/main/app.ts': 'export function run() {}',
      'build/output.js': 'function run() {}',
      'out/bundle.js': 'function run() {}',
      'tmp/temp.js': 'function run() {}',
      'temp/cache.js': 'function run() {}',
      '.vite/manifest.json': '{}',
    },
    async (rootPath) => {
      const context = await scanProject(rootPath);

      // Verify build artifact directories are ignored
      const buildFiles = context.sourceFiles.filter(f =>
        f.relativePath.startsWith('build/') ||
        f.relativePath.startsWith('out/') ||
        f.relativePath.startsWith('tmp/') ||
        f.relativePath.startsWith('temp/') ||
        f.relativePath.startsWith('.vite/')
      );
      assert.equal(buildFiles.length, 0, 'build artifact directories should be ignored');
    }
  );
}

async function runRelevantFileSelectorTests(): Promise<void> {
  testKeywordExtraction();
  await testProviderQuestion();
  await testReactQuestion();
  await testElectronQuestion();
  await testMarkdownDocumentationQuery();
  await testPackageJsonQuery();
  await testUnknownTopic();
  await testEmptyQuery();
  await testMultipleMatchingFiles();
  await testDeterministicOrdering();
  await testDistElectronIgnored();
  await testSourcePreferredOverGenerated();
  await testBuildArtifactsIgnored();

  console.log('Relevant file selector tests passed.');
}

void runRelevantFileSelectorTests().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
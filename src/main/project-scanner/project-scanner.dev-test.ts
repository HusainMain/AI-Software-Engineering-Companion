import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ProjectScanner } from './project-scanner.js';

type FixtureFiles = Record<string, string>;

async function withTempProject(files: FixtureFiles, test: (rootPath: string) => Promise<void>): Promise<void> {
  const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), 'project-scanner-'));

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

async function scanFixture(files: FixtureFiles) {
  let scanResult: Awaited<ReturnType<ProjectScanner['scan']>> | undefined;
  await withTempProject(files, async (rootPath) => {
    scanResult = await new ProjectScanner({ rootPath }).scan();
  });

  assert.ok(scanResult);
  assert.deepEqual(scanResult.errors, []);
  return scanResult.context;
}

async function testIgnoredDirectories(): Promise<void> {
  const context = await scanFixture({
    'src/index.ts': 'export const value = 1;',
    'node_modules/library/index.js': 'module.exports = {};',
    'dist/bundle.js': 'console.log("dist");',
    '.git/config': '[core]',
    'coverage/coverage.json': '{}',
  });

  assert.equal(context.totalFiles, 1);
  assert.equal(context.fileExtensions['.ts'], 1);
  assert.equal(context.fileExtensions['.js'], undefined);
  assert.equal(context.fileExtensions['.json'], undefined);

  const folders = new Set(context.folderStructure.map((folder) => folder.relativePath));
  assert.ok(folders.has('src'));
  assert.ok(!folders.has('node_modules'));
  assert.ok(!folders.has('dist'));
  assert.ok(!folders.has('.git'));
  assert.ok(!folders.has('coverage'));
}

async function testPackageJsonParsing(): Promise<void> {
  const context = await scanFixture({
    'package.json': JSON.stringify({
      name: 'fixture-app',
      version: '1.2.3',
      scripts: { build: 'tsc' },
      dependencies: { react: '^19.0.0' },
      devDependencies: { typescript: '^6.0.0' },
    }),
  });

  assert.equal(context.projectName, 'fixture-app');
  assert.equal(context.version, '1.2.3');
  assert.equal(context.packageInfo?.scripts.build, 'tsc');
  assert.equal(context.packageInfo?.dependencies.react, '^19.0.0');
  assert.equal(context.packageInfo?.devDependencies.typescript, '^6.0.0');
}

async function testImportantFileDetection(): Promise<void> {
  const context = await scanFixture({
    'README.md': '# Fixture',
    'src/index.ts': 'export {};',
    'vite.config.ts': 'export default {};',
    'notes.md': '# Notes',
  });

  const importantPaths = context.importantFiles.map((file) => file.relativePath);
  assert.ok(importantPaths.includes('README.md'));
  assert.ok(importantPaths.includes('vite.config.ts'));
  assert.ok(importantPaths.includes('notes.md'));
  assert.ok(!importantPaths.includes('src/index.ts'));
}

async function testMarkdownDetection(): Promise<void> {
  const context = await scanFixture({
    'docs/guide.md': '# Guide\n\n## Install\n\n```ts\nconst a = 1;\n```\n\n## Use',
  });

  assert.equal(context.documentationFiles.length, 1);
  assert.equal(context.documentationFiles[0]?.firstHeading, 'Guide');
  assert.equal(context.documentationFiles[0]?.title, 'Guide');
  assert.equal(context.documentationFiles[0]?.sectionCount, 3);
}

async function testTechnologyDetection(): Promise<void> {
  const context = await scanFixture({
    'package.json': JSON.stringify({
      name: 'tech-fixture',
      version: '0.0.1',
      dependencies: {
        electron: '^43.0.0',
        express: '^5.0.0',
        react: '^19.0.0',
        tailwindcss: '^4.0.0',
      },
      devDependencies: {
        '@vitejs/plugin-react': '^6.0.0',
        typescript: '^6.0.0',
        vite: '^8.0.0',
      },
    }),
    'src/main.ts': 'export {};',
    'src/App.tsx': 'export function App() { return null; }',
    'vite.config.ts': 'export default {};',
  });

  const technologies = new Set(context.technologies.map((technology) => technology.name));
  assert.ok(technologies.has('Electron'));
  assert.ok(technologies.has('Express'));
  assert.ok(technologies.has('React'));
  assert.ok(technologies.has('Tailwind CSS'));
  assert.ok(technologies.has('TypeScript'));
  assert.ok(technologies.has('Vite'));
  assert.ok(technologies.has('Node.js'));
}

async function testEmptyProject(): Promise<void> {
  await withTempProject({}, async (rootPath) => {
    const { context, errors } = await new ProjectScanner({ rootPath }).scan();
    assert.deepEqual(errors, []);
    assert.equal(context.projectName, path.basename(rootPath));
    assert.equal(context.version, '0.0.0');
    assert.equal(context.totalFiles, 0);
    assert.equal(context.packageInfo, null);
  });
}

async function testNestedFolders(): Promise<void> {
  const context = await scanFixture({
    'src/components/Button.tsx': 'export function Button() { return null; }',
    'src/utils/format.ts': 'export const format = String;',
  });

  const folders = new Set(context.folderStructure.map((folder) => folder.relativePath));
  assert.ok(folders.has('src'));
  assert.ok(folders.has('src/components'));
  assert.ok(folders.has('src/utils'));
  assert.equal(context.totalFiles, 2);
}

async function runProjectScannerDeveloperTests(): Promise<void> {
  await testIgnoredDirectories();
  await testPackageJsonParsing();
  await testImportantFileDetection();
  await testMarkdownDetection();
  await testTechnologyDetection();
  await testEmptyProject();
  await testNestedFolders();

  console.log('Project scanner developer tests passed.');
}

void runProjectScannerDeveloperTests().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

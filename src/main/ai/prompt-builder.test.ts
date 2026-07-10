import assert from 'node:assert/strict';
import { createPromptBuilder, DEFAULT_PROMPT_BUILDER_CONFIG } from './prompt-builder.js';
import type { ProjectContext } from '../project-scanner/types.js';
import type { RelevantFilesResult, SelectedFile } from '../relevant-file-selector/types.js';

function createMockProjectContext(overrides: Partial<ProjectContext> = {}): ProjectContext {
  return {
    projectName: 'test-project',
    version: '1.0.0',
    rootPath: '/test',
    scannedAt: '2024-01-01T00:00:00.000Z',
    scanDurationMs: 100,
    packageInfo: {
      name: 'test-project',
      version: '1.0.0',
      scripts: { build: 'tsc', test: 'vitest' },
      dependencies: { react: '^19.0.0', electron: '^25.0.0' },
      devDependencies: { typescript: '^6.0.0', vite: '^6.0.0' },
    },
    technologies: [
      { name: 'React', category: 'framework', confidence: 'high', source: 'package.json' },
      { name: 'TypeScript', category: 'language', confidence: 'high', source: 'package.json' },
      { name: 'Electron', category: 'framework', confidence: 'high', source: 'package.json' },
      { name: 'Vite', category: 'build', confidence: 'high', source: 'package.json' },
      { name: 'Node.js', category: 'runtime', confidence: 'high', source: 'config-file' },
      { name: 'ESLint', category: 'tool', confidence: 'high', source: 'package.json' },
    ],
    languages: [
      { name: 'TypeScript', fileCount: 10, totalLines: 1000, percentage: 60 },
      { name: 'JavaScript', fileCount: 5, totalLines: 500, percentage: 30 },
      { name: 'JSON', fileCount: 2, totalLines: 100, percentage: 10 },
    ],
    importantFiles: [
      { relativePath: 'package.json', fileName: 'package.json', extension: '.json', size: 500, lastModified: '2024-01-01T00:00:00.000Z', isImportant: true },
      { relativePath: 'README.md', fileName: 'README.md', extension: '.md', size: 1000, lastModified: '2024-01-01T00:00:00.000Z', isImportant: true, title: 'Test Project', firstHeading: 'Test Project', sectionCount: 3 },
    ],
    documentationFiles: [
      { relativePath: 'README.md', fileName: 'README.md', extension: '.md', size: 1000, lastModified: '2024-01-01T00:00:00.000Z', isImportant: true, title: 'Test Project', firstHeading: 'Test Project', sectionCount: 3 },
      { relativePath: 'ARCHITECTURE.md', fileName: 'ARCHITECTURE.md', extension: '.md', size: 2000, lastModified: '2024-01-01T00:00:00.000Z', isImportant: true, title: 'Architecture', firstHeading: 'Architecture', sectionCount: 5 },
    ],
    sourceFiles: [
      { relativePath: 'src/main.ts', fileName: 'main.ts', extension: '.ts', size: 500, lastModified: '2024-01-01T00:00:00.000Z', isImportant: false },
    ],
    folderStructure: [
      { relativePath: 'src', fileCount: 10, subdirectoryCount: 2, totalSize: 5000 },
    ],
    fileExtensions: { '.ts': 10, '.js': 5, '.json': 2, '.md': 2 },
    totalFiles: 19,
    totalSize: 10000,
    ...overrides,
  };
}

function createMockRelevantFiles(overrides: Partial<RelevantFilesResult> = {}): RelevantFilesResult {
  const files: SelectedFile[] = [
    {
      path: 'src/main/provider-manager.ts',
      score: 15,
      matchedKeywords: [
        { keyword: 'provider', locations: ['filename', 'folder'] },
        { keyword: 'selection', locations: ['filename'] },
      ],
      reason: 'filename-match',
      content: 'export class ProviderManager { select() {} }',
    },
    {
      path: 'src/main/provider-registry.ts',
      score: 12,
      matchedKeywords: [
        { keyword: 'provider', locations: ['filename'] },
      ],
      reason: 'filename-match',
      content: 'export const ProviderRegistry = {};',
    },
    {
      path: 'README.md',
      score: 10,
      matchedKeywords: [],
      reason: 'important-file',
      content: '# Test Project\n\n## Provider System\n\nThe provider system handles selection.',
    },
  ];
  
  return {
    files,
    query: 'How does provider selection work?',
    extractedKeywords: ['provider', 'selection'],
    totalFilesScanned: 19,
    totalFilesSelected: 3,
    selectionTimeMs: 50,
    ...overrides,
  };
}

function testSystemInstructions(): void {
  const builder = createPromptBuilder();
  const prompt = builder.build({
    projectContext: createMockProjectContext(),
    relevantFiles: createMockRelevantFiles(),
    userQuestion: 'How does provider selection work?',
  });
  
  assert.ok(prompt.includes('SYSTEM INSTRUCTIONS'));
  assert.ok(prompt.includes('AI Software Engineering Companion'));
  assert.ok(prompt.includes('Base your answers on the supplied project context'));
  assert.ok(prompt.includes('Never invent files'));
  assert.ok(prompt.includes('Distinguish facts from assumptions'));
  
  // Milestone 3D: strengthened grounding
  assert.ok(prompt.includes('Repository Facts Are Primary'));
  assert.ok(prompt.includes('primary source of truth'));
  assert.ok(prompt.includes('Evidence Requirements'));
  assert.ok(prompt.includes('Reference relevant file paths'));
  assert.ok(prompt.includes('Missing Evidence'));
  assert.ok(prompt.includes("couldn't find evidence"));
  assert.ok(prompt.includes('Never Fabricate'));
  assert.ok(prompt.includes('Never invent files, folders, functions'));
  assert.ok(prompt.includes('Repository-First Answers'));
  assert.ok(prompt.includes('repository-first'));
  assert.ok(prompt.includes('Scope Awareness'));
}

function testProjectSummary(): void {
  const builder = createPromptBuilder();
  const prompt = builder.build({
    projectContext: createMockProjectContext(),
    relevantFiles: createMockRelevantFiles(),
    userQuestion: 'Test question',
  });
  
  assert.ok(prompt.includes('PROJECT SUMMARY'));
  assert.ok(prompt.includes('Project: test-project'));
  assert.ok(prompt.includes('Version: 1.0.0'));
  assert.ok(prompt.includes('TypeScript'));
  assert.ok(prompt.includes('JavaScript'));
  assert.ok(prompt.includes('Total files: 19'));
}

function testTechnologyStack(): void {
  const builder = createPromptBuilder();
  const prompt = builder.build({
    projectContext: createMockProjectContext(),
    relevantFiles: createMockRelevantFiles(),
    userQuestion: 'Test question',
  });
  
  assert.ok(prompt.includes('TECHNOLOGY STACK'));
  assert.ok(prompt.includes('React'));
  assert.ok(prompt.includes('TypeScript'));
  assert.ok(prompt.includes('Electron'));
  assert.ok(prompt.includes('Vite'));
  assert.ok(prompt.includes('Node.js'));
  assert.ok(prompt.includes('ESLint'));
  assert.ok(prompt.includes('Scripts:'));
  assert.ok(prompt.includes('build: tsc'));
}

function testRelevantFiles(): void {
  const builder = createPromptBuilder();
  const prompt = builder.build({
    projectContext: createMockProjectContext(),
    relevantFiles: createMockRelevantFiles(),
    userQuestion: 'Test question',
  });
  
  assert.ok(prompt.includes('RELEVANT FILES'));
  assert.ok(prompt.includes('src/main/provider-manager.ts'));
  assert.ok(prompt.includes('src/main/provider-registry.ts'));
  assert.ok(prompt.includes('README.md'));
  assert.ok(prompt.includes('Score: 15'));
  assert.ok(prompt.includes('Reason: filename-match'));
  assert.ok(prompt.includes('Matched keywords:'));
  assert.ok(prompt.includes('export class ProviderManager'));
}

function testDocumentation(): void {
  const builder = createPromptBuilder();
  const prompt = builder.build({
    projectContext: createMockProjectContext(),
    relevantFiles: createMockRelevantFiles(),
    userQuestion: 'Test question',
  });
  
  assert.ok(prompt.includes('IMPORTANT PROJECT DOCUMENTS'));
  assert.ok(prompt.includes('README.md'));
  assert.ok(prompt.includes('ARCHITECTURE.md'));
  assert.ok(prompt.includes('Test Project'));
  assert.ok(prompt.includes('Architecture'));
}

function testUserQuestionPreserved(): void {
  const builder = createPromptBuilder();
  const question = 'How does provider selection work?';
  const prompt = builder.build({
    projectContext: createMockProjectContext(),
    relevantFiles: createMockRelevantFiles(),
    userQuestion: question,
  });
  
  assert.ok(prompt.includes('USER QUESTION'));
  assert.ok(prompt.includes(question));
}

function testOutputRequirements(): void {
  const builder = createPromptBuilder();
  const prompt = builder.build({
    projectContext: createMockProjectContext(),
    relevantFiles: createMockRelevantFiles(),
    userQuestion: 'Test question',
  });
  
  assert.ok(prompt.includes('OUTPUT REQUIREMENTS'));
  assert.ok(prompt.includes('repository evidence'));
  assert.ok(prompt.includes('file paths'));
  assert.ok(prompt.includes('Separate facts from assumptions'));
  assert.ok(prompt.includes('Acknowledge uncertainty'));
  assert.ok(prompt.includes('structured JSON'));
  
  // Milestone 3D: enhanced output requirements
  assert.ok(prompt.includes('Citation Requirements'));
  assert.ok(prompt.includes('[relative/path/to/file.ts]'));
  assert.ok(prompt.includes('Cite every claim'));
  assert.ok(prompt.includes('Evidence Standards'));
  assert.ok(prompt.includes('strong evidence'));
  assert.ok(prompt.includes('Weak evidence'));
  assert.ok(prompt.includes('No evidence'));
  assert.ok(prompt.includes('uncertainty markers'));
  assert.ok(prompt.includes('confidence indicators'));
  assert.ok(prompt.includes('probably, likely, appears'));
  assert.ok(prompt.includes('File Reference Format'));
  assert.ok(prompt.includes('Completion Format'));
}

function testPromptTrimming(): void {
  const hugeFiles = createMockRelevantFiles({
    files: [
      {
        path: 'src/main/huge-file.ts',
        score: 10,
        matchedKeywords: [],
        reason: 'test',
        content: 'X'.repeat(20000),
      }
    ]
  });

  const config = { ...DEFAULT_PROMPT_BUILDER_CONFIG, maxPromptChars: 6000 };
  const builder = createPromptBuilder(config);
  const prompt = builder.build({
    projectContext: createMockProjectContext(),
    relevantFiles: hugeFiles,
    userQuestion: 'Test question',
  });
  
  assert.ok(prompt.length <= 6000);
  assert.ok(prompt.includes('SYSTEM INSTRUCTIONS'));
  assert.ok(prompt.includes('PROJECT SUMMARY'));
  assert.ok(prompt.includes('USER QUESTION'));
  assert.ok(prompt.includes('Test question'));
  assert.ok(prompt.includes('OUTPUT REQUIREMENTS'));
  assert.ok(prompt.includes('TECHNOLOGY STACK'));
  assert.ok(prompt.includes('IMPORTANT PROJECT DOCUMENTS'));
  assert.ok(!prompt.includes('huge-file.ts'));
  assert.ok(prompt.includes('[trimmed: remaining sections omitted to fit size limit]'));
}

function testSectionOrderAndHeadings(): void {
  const builder = createPromptBuilder();
  const prompt = builder.build({
    projectContext: createMockProjectContext(),
    relevantFiles: createMockRelevantFiles(),
    userQuestion: 'How does ProviderManager work?',
  });

  const systemIdx = prompt.indexOf('SYSTEM INSTRUCTIONS');
  const summaryIdx = prompt.indexOf('PROJECT SUMMARY');
  const stackIdx = prompt.indexOf('TECHNOLOGY STACK');
  const docsIdx = prompt.indexOf('IMPORTANT PROJECT DOCUMENTS');
  const filesIdx = prompt.indexOf('RELEVANT FILES');
  const questionIdx = prompt.indexOf('USER QUESTION');
  const outputIdx = prompt.indexOf('OUTPUT REQUIREMENTS');

  assert.ok(systemIdx < summaryIdx);
  assert.ok(summaryIdx < stackIdx);
  assert.ok(stackIdx < docsIdx);
  assert.ok(docsIdx < filesIdx);
  assert.ok(filesIdx < questionIdx);
  assert.ok(questionIdx < outputIdx);

  const expectedSubstring = 'USER QUESTION\n\nHow does ProviderManager work?\n\nOUTPUT REQUIREMENTS';
  assert.ok(prompt.includes(expectedSubstring));
}

function testSkipLargeOptionalIncludeLaterSmall(): void {
  const mockContext = createMockProjectContext();
  mockContext.documentationFiles = [
    {
      relativePath: 'ARCHITECTURE.md',
      fileName: 'ARCHITECTURE.md',
      extension: '.md',
      size: 15000,
      lastModified: '',
      isImportant: true,
      title: 'X'.repeat(15000),
      sectionCount: 1
    }
  ];

  const builder = createPromptBuilder({
    ...DEFAULT_PROMPT_BUILDER_CONFIG,
    maxPromptChars: 5500
  });

  const prompt = builder.build({
    projectContext: mockContext,
    relevantFiles: createMockRelevantFiles({
      files: [
        {
          path: 'small.ts',
          score: 1,
          matchedKeywords: [],
          reason: 'test',
          content: 'class Small {}'
        }
      ]
    }),
    userQuestion: 'Test question',
  });

  assert.ok(prompt.length <= 5500);
  assert.ok(prompt.includes('SYSTEM INSTRUCTIONS'));
  assert.ok(prompt.includes('PROJECT SUMMARY'));
  assert.ok(prompt.includes('TECHNOLOGY STACK'));
  assert.ok(!prompt.includes('IMPORTANT PROJECT DOCUMENTS'));
  assert.ok(prompt.includes('RELEVANT FILES'));
  assert.ok(prompt.includes('small.ts'));
  assert.ok(prompt.includes('USER QUESTION'));
  assert.ok(prompt.includes('OUTPUT REQUIREMENTS'));
  assert.ok(prompt.includes('[trimmed: remaining sections omitted to fit size limit]'));
}

function testDeterministicOutput(): void {
  const builder = createPromptBuilder();
  const input = {
    projectContext: createMockProjectContext(),
    relevantFiles: createMockRelevantFiles(),
    userQuestion: 'Test question',
  };
  
  const prompt1 = builder.build(input);
  const prompt2 = builder.build(input);
  
  assert.equal(prompt1, prompt2);
}

function testEmptyProjectContext(): void {
  const emptyContext = createMockProjectContext({
    projectName: 'empty-project',
    version: '0.0.0',
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
  });
  
  const builder = createPromptBuilder();
  const prompt = builder.build({
    projectContext: emptyContext,
    relevantFiles: createMockRelevantFiles({ files: [] }),
    userQuestion: 'Test question',
  });
  
  assert.ok(prompt.includes('PROJECT SUMMARY'));
  assert.ok(prompt.includes('Project: empty-project'));
  assert.ok(prompt.includes('Version: 0.0.0'));
  assert.ok(prompt.includes('Total files: 0'));
}

function testEmptyRelevantFiles(): void {
  const builder = createPromptBuilder();
  const prompt = builder.build({
    projectContext: createMockProjectContext(),
    relevantFiles: createMockRelevantFiles({ files: [] }),
    userQuestion: 'Test question',
  });
  
  assert.ok(prompt.includes('RELEVANT FILES'));
  assert.ok(prompt.includes('none'));
}

function testImportantDocumentsNotSelected(): void {
  const relevantFiles = createMockRelevantFiles({
    files: [
      {
        path: 'src/main/provider-manager.ts',
        score: 15,
        matchedKeywords: [{ keyword: 'provider', locations: ['filename'] }],
        reason: 'filename-match',
        content: 'export class ProviderManager {}',
      },
    ],
  });
  
  const builder = createPromptBuilder();
  const prompt = builder.build({
    projectContext: createMockProjectContext(),
    relevantFiles,
    userQuestion: 'Test question',
  });
  
  assert.ok(prompt.includes('IMPORTANT PROJECT DOCUMENTS'));
  assert.ok(prompt.includes('README.md'));
  assert.ok(prompt.includes('ARCHITECTURE.md'));
}

function runPromptBuilderTests(): void {
  testSystemInstructions();
  testProjectSummary();
  testTechnologyStack();
  testRelevantFiles();
  testDocumentation();
  testUserQuestionPreserved();
  testOutputRequirements();
  testPromptTrimming();
  testSectionOrderAndHeadings();
  testSkipLargeOptionalIncludeLaterSmall();
  testDeterministicOutput();
  testEmptyProjectContext();
  testEmptyRelevantFiles();
  testImportantDocumentsNotSelected();
  
  console.log('Prompt builder tests passed.');
}

runPromptBuilderTests();
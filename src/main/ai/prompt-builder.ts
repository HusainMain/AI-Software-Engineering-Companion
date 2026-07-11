import type { ProjectContext } from '../project-scanner/types.js';
import type { IntentResult } from '../../intent-engine/types.js';
import type { GPSRecommendation } from '../../engineering-gps/types.js';
import type { RelevantFilesResult, SelectedFile } from '../relevant-file-selector/types.js';
import type { ProjectIntelligenceState } from '../project-intelligence/types.js';
import type { ProjectHealthReport } from '../project-health/types.js';

const isDevelopment = process.env.NODE_ENV === 'development';

function debugLog(...args: unknown[]): void {
  if (isDevelopment) {
    console.log('[DEBUG]', ...args);
  }
}

export interface PromptBuilderInput {
  projectContext: ProjectContext;
  relevantFiles: RelevantFilesResult;
  userQuestion: string;
  projectIntelligence?: ProjectIntelligenceState;
  projectHealth?: ProjectHealthReport;
  intent?: IntentResult;
  gps?: GPSRecommendation;
}

export interface PromptBuilder {
  build(input: PromptBuilderInput): string;
}

export interface PromptBuilderConfig {
  maxPromptChars: number;
  includeSystemInstructions: boolean;
  includeOutputRequirements: boolean;
}

export const DEFAULT_PROMPT_BUILDER_CONFIG: PromptBuilderConfig = {
  maxPromptChars: 100000,
  includeSystemInstructions: true,
  includeOutputRequirements: true,
};

const SYSTEM_INSTRUCTIONS_TITLE = 'SYSTEM INSTRUCTIONS';
const SYSTEM_INSTRUCTIONS_CONTENT = `You are an AI Software Engineering Companion.

Base your answers on the supplied project context.
Prefer repository evidence over general knowledge.
If evidence is missing, clearly say so.
Never invent files, functions, or architecture.
Distinguish facts from assumptions.
Keep recommendations actionable.
Reference file paths when citing evidence.

Repository Facts Are Primary:
- Treat the provided project files and context as the primary source of truth.
- Repository evidence always takes precedence over general software engineering knowledge.
- If the repository contains the answer, use it.

Evidence Requirements:
- Reference relevant file paths (e.g., src/main/provider-manager.ts, package.json, README.md) when making claims.
- Explain which files support important conclusions.
- Use citations naturally when they improve clarity.

Missing Evidence:
- If the supplied files do not contain enough information to answer, explicitly state:
  "I couldn't find evidence for this in the provided repository."
- Do not guess or invent project details.

Never Fabricate:
- Never invent files, folders, functions, classes, architecture, dependencies, or project decisions.
- Never hallucinate implementation details not present in the context.

Repository-First Answers (repository-first):
- When the question is about the current project, prefer discussing the repository.
- Avoid generic textbook explanations unless explicitly requested.
- Example: Instead of "React is a library...", prefer "This project uses React in src/renderer/main.tsx..."

Scope Awareness:
- Recognize when an answer comes from repository files vs general engineering knowledge.
- Make this distinction clear in your response.`;

const OUTPUT_REQUIREMENTS_TITLE = 'OUTPUT REQUIREMENTS';
const OUTPUT_REQUIREMENTS_CONTENT = `Answer using repository evidence.
Explicitly reference file paths where useful.
Separate facts from assumptions in your response.
Acknowledge uncertainty when evidence is insufficient.
If information cannot be determined from the repository, state that clearly.
Avoid speculation.
Keep recommendations concrete, actionable, and repository-aware.
Reasoning should explain WHY the recommendation follows from the repository.
Alternatives should remain legitimate alternatives.
Trade-offs should explain consequences.
Follow-up questions should only ask for genuinely missing information.
Return the existing structured JSON response format.

Citation Requirements:
- Cite every claim derived from the repository with a file path in brackets: [relative/path/to/file.ts]
- Include citations inline when making specific claims about code, architecture, or configuration.
- Use natural citation flow; don't just dump file paths at the end.

Evidence Standards:
- Strong evidence: Direct code, config, or documentation from the provided files.
- strong evidence: Direct code, config, or documentation from the provided files.
- Weak evidence: Indirect references, inferred patterns, or partial matches.
- No evidence: General knowledge not supported by the repository.

Uncertainty Markers:
- uncertainty markers: Use confidence indicators: "high confidence", "moderate confidence", "low confidence", "uncertain".
- Use confidence indicators: "high confidence", "moderate confidence", "low confidence", "uncertain".
- Use uncertainty markers when evidence is incomplete: "probably", "likely", "appears to", "may", "could".
- probably, likely, appears: Use uncertainty markers when evidence is incomplete.
- Do not present speculation as fact.

File Reference Format:
- Always use relative paths from the project root.
- Format: [path/to/file.ts] for files, [path/to/folder/] for directories.
- Reference specific sections when relevant: [path/to/file.ts:section]

Completion Format:
- Return the response in the existing structured JSON format.
- Include citations in the reasoning field.
- Include confidence level in the response.`;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface PromptSection {
  title: string;
  content: string;
  required: boolean;
  priority?: number;
}

function buildProjectSummary(context: ProjectContext): string {
  const lines: string[] = [];
  
  lines.push(`Project: ${context.projectName}`);
  lines.push(`Version: ${context.version}`);
  
  if (context.packageInfo?.description) {
    lines.push(`Description: ${context.packageInfo.description}`);
  }
  
  lines.push(`Root: ${context.rootPath}`);
  lines.push(`Total files: ${context.totalFiles}`);
  lines.push(`Total size: ${formatFileSize(context.totalSize)}`);
  lines.push(`Scanned: ${context.scannedAt}`);
  
  if (context.languages.length > 0) {
    lines.push('');
    lines.push('Languages:');
    for (const lang of context.languages) {
      lines.push(`  - ${lang.name}: ${lang.fileCount} files (${lang.percentage.toFixed(1)}%)`);
    }
  }
  
  if (context.technologies.length > 0) {
    lines.push('');
    lines.push('Technologies:');
    const byCategory: Record<string, string[]> = {};
    for (const tech of context.technologies) {
      if (!byCategory[tech.category]) byCategory[tech.category] = [];
      byCategory[tech.category].push(`${tech.name} (${tech.confidence})`);
    }
    for (const [category, techs] of Object.entries(byCategory)) {
      lines.push(`  ${category}: ${techs.join(', ')}`);
    }
  }
  
  if (context.importantFiles.length > 0) {
    lines.push('');
    lines.push('Important files:');
    for (const file of context.importantFiles.slice(0, 10)) {
      lines.push(`  - ${file.relativePath}`);
    }
    if (context.importantFiles.length > 10) {
      lines.push(`  ... and ${context.importantFiles.length - 10} more`);
    }
  }
  
  if (context.documentationFiles.length > 0) {
    lines.push('');
    lines.push('Documentation files:');
    for (const file of context.documentationFiles.slice(0, 10)) {
      lines.push(`  - ${file.relativePath}`);
    }
    if (context.documentationFiles.length > 10) {
      lines.push(`  ... and ${context.documentationFiles.length - 10} more`);
    }
  }
  
  return lines.join('\n');
}

function buildTechnologyStack(context: ProjectContext): string {
  const lines: string[] = [];
  
  const frameworks = context.technologies.filter(t => t.category === 'framework');
  const languages = context.technologies.filter(t => t.category === 'language');
  const runtimes = context.technologies.filter(t => t.category === 'runtime');
  const buildTools = context.technologies.filter(t => t.category === 'build');
  const tools = context.technologies.filter(t => t.category === 'tool');
  const testing = context.technologies.filter(t => t.category === 'testing');
  const libraries = context.technologies.filter(t => t.category === 'library');
  
  if (frameworks.length > 0) {
    lines.push('Frameworks:');
    for (const f of frameworks) {
      lines.push(`  - ${f.name} (${f.confidence}, ${f.source})`);
    }
  }
  
  if (languages.length > 0) {
    lines.push('Languages:');
    for (const l of languages) {
      lines.push(`  - ${l.name} (${l.confidence}, ${l.source})`);
    }
  }
  
  if (runtimes.length > 0) {
    lines.push('Runtimes:');
    for (const r of runtimes) {
      lines.push(`  - ${r.name} (${r.confidence}, ${r.source})`);
    }
  }
  
  if (buildTools.length > 0) {
    lines.push('Build tools:');
    for (const b of buildTools) {
      lines.push(`  - ${b.name} (${b.confidence}, ${b.source})`);
    }
  }
  
  if (testing.length > 0) {
    lines.push('Testing:');
    for (const t of testing) {
      lines.push(`  - ${t.name} (${t.confidence}, ${t.source})`);
    }
  }
  
  if (tools.length > 0) {
    lines.push('Tools:');
    for (const t of tools) {
      lines.push(`  - ${t.name} (${t.confidence}, ${t.source})`);
    }
  }
  
  if (libraries.length > 0) {
    lines.push('Libraries:');
    for (const l of libraries) {
      lines.push(`  - ${l.name} (${l.confidence}, ${l.source})`);
    }
  }
  
  if (context.packageInfo) {
    lines.push('');
    lines.push('Package info:');
    if (context.packageInfo.scripts && Object.keys(context.packageInfo.scripts).length > 0) {
      lines.push('  Scripts:');
      for (const [name, cmd] of Object.entries(context.packageInfo.scripts)) {
        lines.push(`    ${name}: ${cmd}`);
      }
    }
    const depCount = Object.keys(context.packageInfo.dependencies ?? {}).length;
    const devDepCount = Object.keys(context.packageInfo.devDependencies ?? {}).length;
    lines.push(`  Dependencies: ${depCount} prod, ${devDepCount} dev`);
  }
  
  return lines.join('\n');
}

function buildRelevantFiles(files: SelectedFile[]): string {
  if (files.length === 0) {
    return '- none';
  }
  
  const MAX_FILE_CONTENT_CHARS = 8000;
  
  const lines: string[] = [];
  
  for (const file of files) {
    lines.push(`---`);
    lines.push(`Path: ${file.path}`);
    lines.push(`Score: ${file.score}`);
    lines.push(`Reason: ${file.reason}`);
    
    if (file.matchedKeywords.length > 0) {
      const kwStr = file.matchedKeywords
        .map(mk => `${mk.keyword} [${mk.locations.join(', ')}]`)
        .join('; ');
      lines.push(`Matched keywords: ${kwStr}`);
    }
    
    lines.push(`Content:`);
    let content = file.content;
    if (content.length > MAX_FILE_CONTENT_CHARS) {
      content = content.substring(0, MAX_FILE_CONTENT_CHARS) + '\n... [truncated]';
    }
    lines.push(content);
  }
  
  return lines.join('\n');
}

function buildDocumentationContext(context: ProjectContext, selectedFiles: SelectedFile[]): string {
  const selectedPaths = new Set(selectedFiles.map(sf => sf.path));
  const docFiles = context.documentationFiles.filter(df => 
    selectedPaths.has(df.relativePath) || df.isImportant
  );
  
  if (docFiles.length === 0) {
    return '- none selected';
  }
  
  const lines: string[] = [];
  
  for (const file of docFiles) {
    lines.push(`---`);
    lines.push(`Title: ${file.title ?? file.fileName}`);
    lines.push(`Path: ${file.relativePath}`);
    if (file.firstHeading) {
      lines.push(`First heading: ${file.firstHeading}`);
    }
    lines.push(`Sections: ${file.sectionCount ?? 0}`);
  }
  
  return lines.join('\n');
}

function buildProjectIntelligence(state: ProjectIntelligenceState): string {
  const lines: string[] = [];
  
  if (state.activeFocus) {
    lines.push(`Active Focus: ${state.activeFocus.description}`);
    lines.push(`Focus Started: ${state.activeFocus.startedAt}`);
    if (state.activeFocus.relatedGoalId) {
      lines.push(`Related Goal ID: ${state.activeFocus.relatedGoalId}`);
    }
    lines.push('');
  }
  
  const activeGoals = state.goals.filter(g => g.status === 'active')
  const plannedGoals = state.goals.filter(g => g.status === 'planned')
  const completedGoals = state.goals.filter(g => g.status === 'completed')
  
  if (activeGoals.length > 0) {
    lines.push('Active Goals:');
    for (const goal of activeGoals) {
      lines.push(`  - [${goal.priority.toUpperCase()}] ${goal.title}: ${goal.description}`);
    }
    lines.push('')
  }
  
  if (plannedGoals.length > 0) {
    lines.push('Planned Goals:');
    for (const goal of plannedGoals) {
      lines.push(`  - [${goal.priority.toUpperCase()}] ${goal.title}: ${goal.description}`);
    }
    lines.push('')
  }
  
  if (completedGoals.length > 0) {
    lines.push('Completed Goals:');
    for (const goal of completedGoals.slice(-5)) {
      lines.push(`  - ${goal.title} (completed ${goal.completedAt?.slice(0, 10) ?? 'recently'})`);
    }
    lines.push('')
  }
  
  if (state.goals.length === 0) {
    lines.push('- No goals defined')
  }
  
  return lines.join('\n')
}

function buildProjectHealth(report: ProjectHealthReport): string {
  const { summary, testCoverage, todoDebt, documentationHealth, configHealth } = report
  const lines: string[] = []
  
  lines.push(`Overall Score: ${summary.score}/100 (Grade: ${summary.grade})`)
  lines.push('')
  
  lines.push('Test Coverage:')
  lines.push(`  Source Files: ${testCoverage.sourceFileCount}`)
  lines.push(`  Test Files: ${testCoverage.testFileCount}`)
  lines.push(`  Ratio: ${(testCoverage.ratio * 100).toFixed(1)}%`)
  if (testCoverage.testFrameworks.length > 0) {
    lines.push(`  Frameworks: ${testCoverage.testFrameworks.join(', ')}`)
  }
  lines.push('')
  
  lines.push('Technical Debt (TODO/FIXME/HACK/XXX):')
  lines.push(`  Total: ${todoDebt.totalCount}`)
  lines.push(`  TODO: ${todoDebt.todoCount}, FIXME: ${todoDebt.fixmeCount}, HACK: ${todoDebt.hackCount}, XXX: ${todoDebt.xxxCount}`)
  if (todoDebt.perFile.length > 0) {
    lines.push('  Top files:')
    for (const pf of todoDebt.perFile.slice(0, 5)) {
      lines.push(`    ${pf.file}: ${pf.count}`)
    }
  }
  lines.push('')
  
  lines.push('Documentation:')
  lines.push(`  README: ${documentationHealth.readmeExists ? 'Yes' : 'No'}${documentationHealth.readmeAgeDays !== null ? ` (${documentationHealth.readmeAgeDays} days old)` : ''}`)
  lines.push(`  Docs dir: ${documentationHealth.docsDirExists ? 'Yes' : 'No'} (${documentationHealth.docsFileCount} files)`)
  lines.push('')
  
  lines.push('Configuration:')
  lines.push(`  Lint: ${configHealth.hasLintConfig ? 'Yes' : 'No'}`)
  lines.push(`  TypeCheck: ${configHealth.hasTypeCheck ? 'Yes' : 'No'}`)
  lines.push(`  Tests: ${configHealth.hasTests ? 'Yes' : 'No'}`)
  lines.push(`  CI: ${configHealth.hasCiConfig ? 'Yes' : 'No'}`)
  lines.push(`  .gitignore: ${configHealth.hasGitignore ? 'Yes' : 'No'}`)
  lines.push(`  License: ${configHealth.hasLicense ? 'Yes' : 'No'}`)
  lines.push(`  Dockerfile: ${configHealth.hasDockerfile ? 'Yes' : 'No'}`)
  if (configHealth.missingRecommended.length > 0) {
    lines.push(`  Missing: ${configHealth.missingRecommended.join(', ')}`)
  }
  lines.push('')
  
  if (summary.issues.length > 0) {
    lines.push('Issues:')
    for (const issue of summary.issues) {
      lines.push(`  [${issue.severity.toUpperCase()}] ${issue.category}: ${issue.message}`)
      if (issue.details) lines.push(`    ${issue.details}`)
    }
    lines.push('')
  }
  
  if (summary.strengths.length > 0) {
    lines.push('Strengths:')
    for (const strength of summary.strengths) {
      lines.push(`  - ${strength}`)
    }
  }
  
  return lines.join('\n')
}

function serializeSections(sections: PromptSection[]): string {
  return sections
    .map(sec => `${sec.title}\n\n${sec.content}`)
    .join('\n\n');
}

function trimPromptSections(sections: PromptSection[], maxChars: number): PromptSection[] {
  const fullPrompt = serializeSections(sections);
  if (fullPrompt.length <= maxChars) {
    return sections;
  }

  const optionalSections = sections.filter(s => !s.required);
  const sortedOptional = [...optionalSections].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  const keptOptionalTitles = new Set<string>();

  for (const opt of sortedOptional) {
    const candidateOptionalTitles = new Set(keptOptionalTitles);
    candidateOptionalTitles.add(opt.title);

    const candidateSections = sections.filter(s => s.required || candidateOptionalTitles.has(s.title));
    const candidatePrompt = serializeSections(candidateSections);

    if (candidatePrompt.length <= maxChars) {
      keptOptionalTitles.add(opt.title);
    }
  }

  return sections.filter(s => s.required || keptOptionalTitles.has(s.title));
}

export function createPromptBuilder(config: PromptBuilderConfig = DEFAULT_PROMPT_BUILDER_CONFIG): PromptBuilder {
  function build({ projectContext, relevantFiles, userQuestion, projectIntelligence, projectHealth }: PromptBuilderInput): string {
    debugLog('PromptBuilder.build -> input:', {
      projectName: projectContext.projectName,
      userQuestionLength: userQuestion.length,
      relevantFilesCount: relevantFiles.files.length,
      includeSystemInstructions: config.includeSystemInstructions,
      includeOutputRequirements: config.includeOutputRequirements,
      maxPromptChars: config.maxPromptChars,
      hasProjectIntelligence: !!projectIntelligence,
      hasProjectHealth: !!projectHealth,
    });

    const sections: PromptSection[] = [];
    
    if (config.includeSystemInstructions) {
      sections.push({
        title: SYSTEM_INSTRUCTIONS_TITLE,
        content: SYSTEM_INSTRUCTIONS_CONTENT,
        required: true,
      });
    }
    
    sections.push({
      title: 'PROJECT SUMMARY',
      content: buildProjectSummary(projectContext),
      required: true,
    });
    
    sections.push({
      title: 'TECHNOLOGY STACK',
      content: buildTechnologyStack(projectContext),
      required: false,
      priority: 1,
    });
    
    sections.push({
      title: 'IMPORTANT PROJECT DOCUMENTS',
      content: buildDocumentationContext(projectContext, relevantFiles.files),
      required: false,
      priority: 2,
    });
    
    sections.push({
      title: 'RELEVANT FILES',
      content: buildRelevantFiles(relevantFiles.files),
      required: false,
      priority: 3,
    });

    if (projectIntelligence) {
      sections.push({
        title: 'PROJECT INTELLIGENCE',
        content: buildProjectIntelligence(projectIntelligence),
        required: false,
        priority: 4,
      });
    }

    if (projectHealth) {
      sections.push({
        title: 'PROJECT HEALTH',
        content: buildProjectHealth(projectHealth),
        required: false,
        priority: 5,
      });
    }
    
    sections.push({
      title: 'USER QUESTION',
      content: userQuestion,
      required: true,
    });
    
    if (config.includeOutputRequirements) {
      sections.push({
        title: OUTPUT_REQUIREMENTS_TITLE,
        content: OUTPUT_REQUIREMENTS_CONTENT,
        required: true,
      });
    }
    
    const finalSections = trimPromptSections(sections, config.maxPromptChars);
    let prompt = serializeSections(finalSections);
    
    const initialOptionalCount = sections.filter(s => !s.required).length;
    const finalOptionalCount = finalSections.filter(s => !s.required).length;
    if (finalOptionalCount < initialOptionalCount) {
      prompt += '\n\n[trimmed: remaining sections omitted to fit size limit]';
    }
    
    debugLog('================ FINAL PROMPT BEGIN ==================');
    debugLog(prompt);
    debugLog('================ FINAL PROMPT END ====================');
    
    return prompt;
  }

  return { build };
}
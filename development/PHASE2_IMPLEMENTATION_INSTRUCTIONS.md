# Phase 2 Implementation Instructions: Intelligence & Workflows

## Overview

Implement two subsystems following the established patterns in `src/main/`. Each subsystem gets its own folder with `types.ts`, implementation file, `index.ts`, and test file. Use the same factory pattern (`createX(config)`) as existing subsystems.

---

## Subsystem 1: Project Intelligence (PI)

### Purpose
Tracks project goals, active focus areas, and progress over time. Lets the AI answer: "What are we working on?", "What was decided last session?", "What goals are active?"

### Files
```
src/main/project-intelligence/
  types.ts
  project-intelligence.ts
  index.ts
src/main/project-intelligence/project-intelligence.test.ts
```

### `types.ts`

```typescript
export interface Goal {
  id: string
  title: string
  description: string
  status: 'planned' | 'active' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface Focus {
  description: string
  startedAt: string
  relatedGoalId?: string
}

export interface ProjectIntelligenceState {
  goals: Goal[]
  activeFocus: Focus | null
  updatedAt: string
}

export interface ProjectIntelligence {
  getState(): ProjectIntelligenceState
  addGoal(goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Goal
  updateGoal(id: string, update: Partial<Goal>): Goal
  setFocus(focus: Focus | null): void
  load(): Promise<void>
  save(): Promise<void>
}
```

### `project-intelligence.ts` — Behavior

**Factory:** `export function createProjectIntelligence(projectRoot: string, dataRoot: string): ProjectIntelligence`

**State file:** `path.join(dataRoot, 'project-intelligence.json')` — same location pattern as Project State Store.

**In-memory cache:** Module-level `state: ProjectIntelligenceState` variable. `load()` reads from disk and caches it. Mutations modify the cached state. `save()` writes cached state to disk.

**`load()` behavior:**
- Read JSON from state file path
- If file missing: initialize with `{ goals: [], activeFocus: null, updatedAt: new Date().toISOString() }` and save immediately
- Validate shape with a type guard (matching `isProjectState` pattern from `project-state-store.ts`)
- Store in module-level `state` variable

**`save()` behavior:**
- Set `state.updatedAt = new Date().toISOString()`
- Write `JSON.stringify(state, null, 2)` to disk

**`addGoal()` behavior:**
- Generate `id` with `crypto.randomUUID()`
- Set `createdAt` and `updatedAt` to `new Date().toISOString()`
- Push to `state.goals`
- Return the new Goal object
- Does NOT auto-save (caller calls `save()` when ready)

**`updateGoal()` behavior:**
- Find goal by `id` in `state.goals`; throw if not found
- Merge `update` onto the goal
- Set `updatedAt = new Date().toISOString()`
- If status changed to `'completed'` and `completedAt` not set, set `completedAt = new Date().toISOString()`
- Return the updated goal
- Does NOT auto-save

**`setFocus()` behavior:**
- Set `state.activeFocus = focus` (can be null to clear)
- Does NOT auto-save

**`getState()` behavior:**
- Return the current in-memory state (direct reference)

### `index.ts`

```typescript
export { createProjectIntelligence } from './project-intelligence.js'
export type { ProjectIntelligence, ProjectIntelligenceState, Goal, Focus } from './types.js'
```

### Tests (`project-intelligence.test.ts`)

Use `vitest`. Mock `fs` module to avoid disk I/O. Use the same mock patterns as `project-state-store` tests.

**Test cases:**
1. `load` returns empty state when no file exists
2. `load` reads and caches existing state
3. `addGoal` creates a goal with correct fields
4. `addGoal` appends to existing goals list
5. `updateGoal` modifies goal fields
6. `updateGoal` sets completedAt when status changes to completed
7. `updateGoal` throws for unknown goal id
8. `setFocus` sets active focus
9. `setFocus` clears active focus when null
10. `save` writes correct JSON to disk
11. `getState` returns current state
12. Full lifecycle: load → addGoal → updateGoal → save → reload → verify

---

## Subsystem 2: Project Health Engine (PHE)

### Purpose
Assesses project quality heuristics: test coverage ratio, TODO/FIXME/HACK density, documentation freshness, config health.

### Files
```
src/main/project-health/
  types.ts
  project-health.ts
  index.ts
src/main/project-health/project-health.test.ts
```

### `types.ts`

```typescript
export interface ProjectHealthReport {
  assessedAt: string
  summary: HealthSummary
  testCoverage: TestCoverage
  todoDebt: TodoDebt
  documentationHealth: DocumentationHealth
  configHealth: ConfigHealth
}

export interface HealthSummary {
  score: number           // 0-100 overall health score
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  issues: HealthIssue[]
  strengths: string[]
}

export interface HealthIssue {
  severity: 'critical' | 'warning' | 'info'
  category: string
  message: string
  details?: string
}

export interface TestCoverage {
  testFileCount: number
  sourceFileCount: number
  ratio: number           // 0-1
  estimatedStatementCoverage: number | null  // 0-1 or null if can't estimate
  testFrameworks: string[]
}

export interface TodoDebt {
  totalCount: number
  todoCount: number
  fixmeCount: number
  hackCount: number
  xxxCount: number
  perFile: { file: string; count: number }[]  // top 10 files
}

export interface DocumentationHealth {
  readmeExists: boolean
  readmeAge: number | null        // days since last modified, null if no readme
  docsDirExists: boolean
  docsFileCount: number
  outdatedDocs: number            // docs not updated in 30+ days
}

export interface ConfigHealth {
  hasLintConfig: boolean
  hasTypeCheck: boolean
  hasTests: boolean
  hasCiConfig: boolean
  hasGitignore: boolean
  hasLicense: boolean
  hasDockerfile: boolean
  missingRecommended: string[]    // list of missing config files
}

export interface ProjectHealthEngine {
  assess(projectRoot: string): Promise<ProjectHealthReport>
}

export function createProjectHealthEngine(): ProjectHealthEngine
```

### `project-health.ts` — Behavior

**Factory:** `export function createProjectHealthEngine(): ProjectHealthEngine`

The engine is **stateless** — every call to `assess(projectRoot)` reads the filesystem fresh and returns a report.

**`assess()` implementation:**

1. **Discover files:** Walk the project directory (sync scan, max depth 5), filtering out `node_modules`, `.git`, `dist`, `build`, `.next`, `coverage`, `.vscode`, `.idea`. Collect:
   - All source files (`.ts`, `.tsx`, `.js`, `.jsx`, `.py`, `.go`, `.rs`, `.java`, `.rb`, `.php`)
   - All test files (ending in `.test.*`, `.spec.*`, `_test.*`, or in `__tests__/` directory)
   - All documentation files (`.md`, `.mdx`, `.txt`, `.rst`)

2. **Calculate test coverage:**
   - `testFileCount` / (`sourceFileCount + testFileCount`) — test file ratio
   - Detect test frameworks by checking `package.json` devDependencies for: `vitest`, `jest`, `mocha`, `ava`, `playwright`, `cypress`
   - `estimatedStatementCoverage` = null (can't estimate without running tests)

3. **Calculate TODO debt:**
   - Grep all source files for `TODO`, `FIXME`, `HACK`, `XXX` (case-insensitive comments only, skip node_modules/.git/dist)
   - Count totals per category
   - Track top 10 files by count

4. **Calculate documentation health:**
   - Check if `README.md` exists, get its age from `fs.statSync().mtime`
   - Check if `docs/` directory exists
   - Count files in `docs/`
   - Count doc files with mtime > 30 days ago as "outdated"

5. **Calculate config health:**
   - Check for: `.eslintrc*`, `.prettierrc*`, `tsconfig*.json`, test directory/config, `.github/workflows/`, `.gitignore`, `LICENSE*`, `Dockerfile`
   - Build `missingRecommended` array

6. **Compute summary score (0-100):**
   - Test coverage: up to 25 points (ratio * 25)
   - TODO debt: up to 20 points (deduct 2 per TODO, 3 per FIXME, 1 per HACK, cap at -20)
   - Documentation: up to 20 points (5 for readme, 5 for docs dir, 10 for <10% outdated)
   - Config: up to 20 points (3 per present config item, max 20)
   - Base: 15 points
   - Clamp to 0-100

7. **Assign grade:**
   - A: 90-100
   - B: 70-89
   - C: 50-69
   - D: 30-49
   - F: 0-29

8. **Generate issues and strengths:**
   - `score < 50` → critical issues
   - `testCoverage.ratio < 0.1` → "Very low test coverage"
   - `todoDebt.totalCount > 20` → "High technical debt from TODOs"
   - No README → "Missing README.md"
   - Strengths: good coverage (>0.3), clean code (<10 TODOs), good docs, good config

### `index.ts`

```typescript
export { createProjectHealthEngine } from './project-health.js'
export type { ProjectHealthEngine, ProjectHealthReport, HealthSummary, HealthIssue, TestCoverage, TodoDebt, DocumentationHealth, ConfigHealth } from './types.js'
```

### Tests (`project-health.test.ts`)

Mock the filesystem using `vi.mock('node:fs')` or `vi.mock('node:fs/promises')`. Test with a controlled directory structure.

**Test cases:**
1. `assess` returns a report for a healthy project
2. `assess` detects low test coverage
3. `assess` detects TODO debt
4. `assess` detects missing README
5. `assess` returns grade A for a well-maintained project
6. `assess` returns grade F for a project with no tests, many TODOs, no docs
7. `assess` handles empty project directory
8. `assess` handles project with only binary/config files (no source)
9. Test coverage ratio calculation is correct
10. TODO counts are correct per category
11. Grade boundaries are correct (A/B/C/D/F)
12. Issues and strengths are generated correctly
13. `createProjectHealthEngine` returns a valid object

---

## Wiring into Workspace Core

### Changes to `src/main/workspace-core/workspace-core.ts`

1. **Add imports:**
```typescript
import { createProjectIntelligence, type ProjectIntelligence, type ProjectIntelligenceState } from '../project-intelligence/index.js'
import { createProjectHealthEngine, type ProjectHealthEngine, type ProjectHealthReport } from '../project-health/index.js'
```

2. **Add variables** alongside existing subsystem vars:
```typescript
let projectIntelligence: ProjectIntelligence | null = null
let projectHealthEngine: ProjectHealthEngine | null = null
```

3. **In `openProject()`**, after creating other subsystems:
```typescript
projectIntelligence = createProjectIntelligence(projectRoot, config.dataRoot)
await projectIntelligence.load()
projectIntelligence.setFocus({ description: `Working on ${projectRoot.split(path.sep).pop()}`, startedAt: new Date().toISOString() })
projectHealthEngine = createProjectHealthEngine()
```

4. **In `sendMessage()`**, before building the prompt, enrich the context:
```typescript
const piState = projectIntelligence ? projectIntelligence.getState() : null
const healthReport = projectHealthEngine ? await projectHealthEngine.assess(activeProject) : null

// Pass piState and healthReport into the prompt via projectContext or a new mechanism
```

5. **After saving conversation** in `sendMessage()`:
```typescript
await projectIntelligence?.save()
```

6. **In `closeProject()`**:
```typescript
await projectIntelligence?.save()
projectIntelligence = null
projectHealthEngine = null
```

### Changes to `src/main/ai/prompt-builder.ts`

Add new optional input fields to `PromptBuilderInput`:
```typescript
import type { ProjectIntelligenceState } from '../project-intelligence/types.js'
import type { ProjectHealthReport } from '../project-health/types.js'

export interface PromptBuilderInput {
  projectContext: ProjectContext
  relevantFiles: RelevantFilesResult
  userQuestion: string
  projectIntelligence?: ProjectIntelligenceState  // new
  projectHealth?: ProjectHealthReport             // new
}
```

Add two new optional prompt sections in `build()`:

**PROJECT INTELLIGENCE section** (optional, priority 4):
```
ACTIVE GOALS
{goals list with status and priority}

ACTIVE FOCUS
{description or "None"}
```

**PROJECT HEALTH section** (optional, priority 5):
```
PROJECT HEALTH
Score: {score}/100 ({grade})
Test coverage: {ratio}% ({testFileCount} test files / {sourceFileCount} source files)
TODO debt: {totalCount} items ({todoCount} TODO, {fixmeCount} FIXME)
Missing configs: {missingRecommended.join(', ') || 'None'}
```

### Changes to `src/main/workspace-core/workspace-core.test.ts`

Update the mock setup and test cases:

1. Add mocks for the new subsystems (same pattern as engineering memory mock):
```typescript
const mockProjectIntelligence = {
  getState: vi.fn(() => ({ goals: [], activeFocus: null, updatedAt: '' })),
  addGoal: vi.fn(),
  updateGoal: vi.fn(),
  setFocus: vi.fn(),
  load: vi.fn(async () => {}),
  save: vi.fn(async () => {}),
}

vi.mock('../project-intelligence/index.js', () => ({
  createProjectIntelligence: vi.fn(() => mockProjectIntelligence),
}))

const mockProjectHealthEngine = {
  assess: vi.fn(async () => ({
    assessedAt: new Date().toISOString(),
    summary: { score: 85, grade: 'B', issues: [], strengths: ['Good test coverage'] },
    testCoverage: { testFileCount: 10, sourceFileCount: 40, ratio: 0.2, estimatedStatementCoverage: null, testFrameworks: ['vitest'] },
    todoDebt: { totalCount: 5, todoCount: 3, fixmeCount: 1, hackCount: 1, xxxCount: 0, perFile: [] },
    documentationHealth: { readmeExists: true, readmeAge: 10, docsDirExists: true, docsFileCount: 5, outdatedDocs: 0 },
    configHealth: { hasLintConfig: true, hasTypeCheck: true, hasTests: true, hasCiConfig: true, hasGitignore: true, hasLicense: true, hasDockerfile: false, missingRecommended: ['Dockerfile'] },
  })),
}

vi.mock('../project-health/index.js', () => ({
  createProjectHealthEngine: vi.fn(() => mockProjectHealthEngine),
}))
```

2. Add test assertions that verify:
   - `projectIntelligence.load()` is called during `openProject`
   - `projectIntelligence.setFocus()` is called during `openProject`
   - `projectIntelligence.save()` is called during `sendMessage`
   - `projectHealthEngine.assess()` is called during `sendMessage`
   - The health report and PI state are included in the prompt input

### Changes to `src/main/context-intelligence/types.ts`

Add optional health and intelligence fields to `ContextPackage`:
```typescript
export interface ContextPackage {
  projectName: string
  technologies: TechnologyInfo[]
  totalFiles: number
  totalSize: number
  importantDocuments: FileMetadata[]
  relevantFiles: SelectedFile[]
  recentObservations: StoredObservation[]
  conversationHistory: StoredConversation[]
  userQuestion: string
  tokenEstimate: number
  projectHealth?: ProjectHealthReport       // new
  projectIntelligence?: ProjectIntelligenceState  // new
}
```

```typescript
import type { ProjectHealthReport } from '../project-health/types.js'
import type { ProjectIntelligenceState } from '../project-intelligence/types.js'
```

---

## Verification

### Compilation
```bash
npx tsc -p tsconfig.electron.json --noEmit
```

### Test commands
```bash
npm run test:project-intelligence
npm run test:project-health
npm run test:workspace-core
npm run test:context-intelligence
```

### Expected output
- `npm run test:project-intelligence` — 13 tests passing
- `npm run test:project-health` — 14 tests passing
- `npm run test:workspace-core` — all existing + new assertions passing
- `npm run test:context-intelligence` — all existing tests still passing
- `npx tsc -p tsconfig.electron.json --noEmit` — 0 errors

### Manual verification
- Launch app, open a project, send a message
- Check that `{dataRoot}/project-intelligence.json` is created
- Check that the AI response references project health data

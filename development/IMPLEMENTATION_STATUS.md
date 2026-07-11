# Implementation Status & Tracker

**Last Updated:** 2026-07-11  
**Current Phase:** Phase 1 — Foundation (Building Engineering Memory)

---

## 1. Milestones At A Glance

```
Legend:  [ ] Not started   [~] In progress   [✓] Complete   [-] Blocked

Phase 1: Foundation
  [✓] 1.1 Event Bus               [✓] 1.4 Context Intelligence
  [✓] 1.2 Observation Engine       [~] 1.5 Workspace Core
  [✓] 1.3 Engineering Memory       [ ] 1.6 Refactor Conversation Flow

Phase 2: Intelligence & Workflows
  [ ] 2.1 Project Health Engine    [ ] 2.3 Workflow Engine
  [ ] 2.2 Project Intelligence     [ ] 2.4 Intent Engine

Phase 3: Guidance & Orchestration
  [ ] 3.1 Knowledge Engine         [ ] 3.4 AI Orchestrator
  [ ] 3.2 Engineering GPS          [ ] 3.5 MVP Integration & Release
  [ ] 3.3 Recommendation Engine
```

---

## 2. Detailed Per-Subsystem Status

### Phase 1: Foundation (Milestone 1)

| # | Subsystem | Status | Design Doc | Depends On |
|---|-----------|--------|------------|------------|
| 1.1 | **Event Bus** | [✓] Complete | — | Nothing |
| 1.2 | **Observation Engine** | [✓] Complete | `OBSERVATION_ENGINE.md` | 1.1 |
| 1.3 | **Engineering Memory** | [✓] Complete | `ENGINEERING_MEMORY.md` | 1.1 |
| 1.4 | **Context Intelligence** | [✓] Complete | `CONTEXT_INTELLIGENCE.md` | 1.2, 1.3 |
| 1.5 | **Workspace Core** | [~] In progress | `RUNTIME_ARCHITECTURE.md` | 1.4 |
| 1.6 | **Refactor Conversation Flow** | [ ] Not started | — | 1.2–1.5 |

#### 1.1 Event Bus

**Status:** ✓ Complete

**Files created:**
- `src/main/event-bus/events.ts` — 9 event types + `AppEvent` union
- `src/main/event-bus/event-bus.ts` — `EventBus` class + singleton `eventBus` + factory `createEventBus()`
- `src/main/event-bus/index.ts` — barrel exports
- `tests/event-bus.test.ts` — 14 tests (all passing)

**What was built:**
- Typed EventEmitter with `emit`, `emitAsync`, `on`, `off`, `once`, `clear`, `listenerCount`, `eventTypes`
- Error isolation — throwing handlers don't crash the bus
- `on()` returns an unsubscribe function
- Factory for testability, singleton for production

**Tests:** 14/14 passing. `npm run test:event-bus`

#### 1.2 Observation Engine

**Status:** ✓ Complete

**Files created:**
- `src/main/observation-engine/types.ts` — config + interface + defaults
- `src/main/observation-engine/observation-engine.ts` — chokidar watcher, debouncing, git detection, exclusion filtering
- `src/main/observation-engine/index.ts` — barrel exports
- `tests/observation-engine.test.ts` — 11 tests (all passing)

**What was built:**
- `chokidar` watcher on project root with exclude pattern filtering (reuses `DEFAULT_EXCLUDE_PATTERNS` from Project Scanner)
- Event types: `file:created`, `file:modified`, `file:deleted`, `git:commit`
- Debouncing — rapid consecutive saves to same file within `debounceMs` emit one event
- Git detection — watches `.git/HEAD` + `.git/refs/heads/` + `.git/COMMIT_EDITMSG`
- Error isolation — watcher errors logged, don't crash
- Graceful `start()` / `stop()` lifecycle
- `watchGit` config flag to toggle git detection

**Tests:** 11/11 passing. `npm run test:observation-engine`
**TypeScript:** Clean compile.

#### 1.3 Engineering Memory

**What needs to be built:**
- SQLite database via `better-sqlite3`
- Schema: `observations` table, `decisions` table, `conversations` table
- CRUD operations for each table
- Migration of existing `decisions.jsonl` → SQLite on first launch
- Query interface: get by ID, get by date range, get by file path, get recent
- No vector/embedding storage in MVI v0.1

**MVI v0.1 scope (per roadmap):**
- **Included:** Local JSON/SQLite storage of decisions, rationale, and raw logs
- **Excluded:** Cloud-based memory sync; vector search clustering

**Acceptance criteria:**
- Observations from the Observation Engine are persisted to the `observations` table
- AI conversation replies are persisted to the `conversations` table (with message, response, timestamp)
- Decisions are persisted to the `decisions` table
- Existing `decisions.jsonl` records are migrated on first startup
- Query by file path returns all related observations
- Query by date range returns filtered results
- DB file lives in `userData` directory for packaged builds

#### 1.4 Context Intelligence

**What needs to be built:**
- ContextPackage type definition (scoped slice of project knowledge)
- Query engine: given a user question, assemble a ContextPackage from:
  - Recent observations (from Engineering Memory)
  - Current project state (from Project State Store)
  - Technology stack (from Project Scanner)
  - Relevant files (from Relevant File Selector)
- Token budget enforcement (trim/summarize to fit model context window)
- Stateless — no persistence of context packages (per roadmap invariant #4)

**MVI v0.1 scope (per roadmap):**
- **Included:** Local file content query and history retrieval
- **Excluded:** Semantic multi-file context compression/embeddings

**Acceptance criteria:**
- User asks "what dependencies did I add recently?" → ContextPackage includes relevant observations from memory
- User asks "explain my architecture" → ContextPackage includes tech stack + important files
- ContextPackage always fits within a configurable token budget
- ContextPackage is a read-only snapshot — does not modify any state

#### 1.5 Workspace Core

**What needs to be built:**
- **Project folder picker** — "Open Project" / "Select Folder" button in the React UI that opens Electron's native folder dialog
- **IPC handler** — preload bridge exposes `selectProject()` that returns the selected path
- **Project switching** — when a new project is selected:
  - Observation Engine stops watching old project, starts watching new one
  - Project Scanner rescans the new project
  - Project State Store updates with new root path
  - Engineering Memory persists (it's per-app, shared across projects)
- **Session lifecycle** — manage active project, start/stop lifecycle
- **Subsystem routing** — directs data between engines
- **No domain-specific intelligence** (per roadmap invariant #8)
- **IPC support** — `getProjectRoot()` to let the UI know which project is active

**MVI v0.1 scope (per roadmap):**
- **Included:** Single-project session management; local routing
- **Excluded:** Multi-workspace sessions; workspace sync

**Acceptance criteria:**
- App launches with no project selected (shows "Open Project" prompt)
- Clicking "Open Project" opens the native folder dialog
- Selecting a folder starts Observation Engine watching that folder
- Project Scanner scans the selected folder
- Chat uses the selected project's context for answers
- Previously selected project persists across app restarts (stored in Project State)
- User can switch to a different project (replaces the watched project)
- Routes events from Observation Engine → Engineering Memory
- Routes queries from UI → Context Intelligence → AI Provider → Engineering Memory

#### 1.6 Refactor Conversation Flow

**What needs to be done:**
- Rewire `ConversationManager` to flow through: User Message → Workspace Core → Context Intelligence → Prompt Builder → AI Provider → Engineering Memory → Response
- Remove direct dependency on Decision Log (replaced by Engineering Memory)
- Keep existing UI intact — only change backend wiring

**Acceptance criteria:**
- Existing chat UI works identically but is backed by the new subsystem pipeline
- Conversation history is stored in Engineering Memory (SQLite)
- Context from observed file changes enriches AI responses

---

### Phase 2: Intelligence & Workflows (Milestone 2)

| # | Subsystem | Status | Design Doc | Depends On |
|---|-----------|--------|------------|------------|
| 2.1 | **Project Health Engine** | [ ] Not started | `PROJECT_HEALTH_ENGINE.md` | 1.5 |
| 2.2 | **Project Intelligence** | [ ] Not started | `PROJECT_INTELLIGENCE.md` | 1.5 |
| 2.3 | **Workflow Engine** | [ ] Not started | `WORKFLOW_ENGINE.md` | 2.1, 2.2 |
| 2.4 | **Intent Engine** | [ ] Not started | `INTENT_ENGINE.md` | 1.5 |

*(Phase 2 details to be expanded when Phase 1 is complete)*

---

### Phase 3: Guidance & Orchestration (Milestone 3 — MVI v0.1 Release)

| # | Subsystem | Status | Design Doc | Depends On |
|---|-----------|--------|------------|------------|
| 3.1 | **Knowledge Engine** | [ ] Not started | `KNOWLEDGE_ENGINE.md` | 1.3, 2.2 |
| 3.2 | **Engineering GPS** | [ ] Not started | `ENGINEERING_GPS.md` | 2.2 |
| 3.3 | **Recommendation Engine** | [ ] Not started | `RECOMMENDATION_ENGINE.md` | 1.4, 2.3, 3.1 |
| 3.4 | **AI Orchestrator** | [ ] Not started | `AI_ORCHESTRATION.md` | 3.3 |
| 3.5 | **MVP Integration** | [ ] Not started | `PRODUCT_BLUEPRINT.md` | 3.4 |

*(Phase 3 details to be expanded when Phase 2 is complete)*

---

## 3. Existing Code Inventory

### Keep (integrate into new architecture)

| Module | Location | Role in New Architecture |
|--------|----------|-------------------------|
| **AI Provider Types** | `src/main/ai/provider-types.ts` | Core types — no changes needed |
| **Provider Registry** | `src/main/ai/provider-registry.ts` | Keep — registers available providers |
| **Provider HTTP Transport** | `src/main/ai/provider-http.ts` | Keep — HTTP layer with retries/timeouts |
| **Provider Adapters** | `src/main/ai/provider-adapters.ts` | Keep — Gemini + OpenRouter working; Ollama needs implementation |
| **Provider Manager** | `src/main/ai/provider-manager.ts` | Keep — orchestrates config → adapter → validation |
| **React UI** | `src/renderer/main.tsx` | Keep — chat UI, structured response display, dark mode |
| **React Styles** | `src/renderer/styles.css` | Keep — full stylesheet |
| **Preload Bridge** | `src/preload/index.ts` | Keep — may need new API methods for new subsystems |
| **Electron Main** | `src/main/main.ts` | Keep — will need updates for new subsystem wiring |
| **Project Scanner** | `src/main/project-scanner/` | Keep — feeds into Context Intelligence |
| **Project State Store** | `src/main/project-state/` | Keep — feeds into Context Intelligence |
| **Prompt Builder** | `src/main/ai/prompt-builder.ts` | Refactor to consume ContextPackage instead of raw parts |

### Refactor

| Module | Change Required |
|--------|----------------|
| **Conversation Manager** | `src/main/conversation/conversation-manager.ts` — Rewire to use new pipeline (Workspace Core → Context Intelligence → Prompt Builder → AI Provider → Engineering Memory) |
| **Prompt Builder** | `src/main/ai/prompt-builder.ts` — Accept a ContextPackage object rather than assembling from raw project state + files |
| **Relevant File Selector** | `src/main/relevant-file-selector/` — Absorb into Context Intelligence as the file relevance component |

### Replace

| Module | Replaced By |
|--------|-------------|
| **Decision Log** | `src/main/decision-log/` → Engineering Memory (SQLite) |
| **Conversation Types** | `src/main/conversation/types.ts` — Will be simplified; Core types live in Engineering Memory |

### Delete

| Item | Reason |
|------|--------|
| `development/RUNTIME_ARCHITECTURE.md` | Documents old Milestone 1 runtime — superseded by new architecture |
| `decisions.jsonl` | Data migrates to SQLite; file no longer needed |
| Ad-hoc test scripts (`*.dev-test.ts`) | Replace with proper Vitest test suite |

---

## 4. Open Decisions

| # | Decision | Status | Notes |
|---|----------|--------|-------|
| D01 | SQLite library | Pending | Recommend `better-sqlite3` (synchronous, fast, Electron-friendly) |
| D02 | Event bus library | Decided | Use built-in Node.js `EventEmitter` — no extra dependency needed |
| D03 | File watcher library | Decided | `chokidar` — already listed in package.json as dep |
| D04 | DB file location | TBD | App root during dev, `userData` in production (follow existing pattern from Project State Store) |
| D05 | Observation Engine — Git detection | TBD | Two options: watch `.git/HEAD` for changes, or run `git log` periodically |
| D06 | Engine invariant enforcement | TBD | How do we prevent subsystems from violating the 8 invariants? Linting? Runtime checks? |

---

## 5. Session Log

| Date | Session | Summary |
|------|---------|---------|
| 2026-07-11 | 01 | Initial repo exploration + created `IMPLEMENTATION_STATUS.md`. Reconciled roadmap with existing codebase. Defined Phase 1 build order. |
| 2026-07-11 | 02 | Built Event Bus + installed deps (better-sqlite3, chokidar, vitest). 14 tests passing. |
| 2026-07-11 | 03 | Built Observation Engine — chokidar file watcher with debouncing, git detection, exclusion filtering. 11 tests passing. |
| 2026-07-11 | 04 | Built Engineering Memory — SQLite store with WAL mode, observations & conversations tables, decision log migration, event emission. Fixed EventBus type narrowing. Reviewed + fixed event emission & schema mismatch. All 39 tests passing. |
| 2026-07-11 | 05 | Built Context Intelligence — stateless query layer assembling ContextPackages from ProjectScanner, EngineeringMemory, RelevantFileSelector, with token budget enforcement. Fixed agent implementation (wrong API, missing tests, in-memory cache). 12 tests, all 51 passing across all modules. |
| 2026-07-11 | 06 | Built Workspace Core — session lifecycle, subsystem wiring (ObservationEngine → EM, ContextIntelligence → PromptBuilder → ProviderManager), event subscriptions with cleanup, folder picker with native dialog. Fixed duplicate IPC handlers, stub sendMessage, event subscription leaks. All 62 tests passing across 5 modules. |

---

## 6. How To Update This File

1. At the end of a session, update section status checkboxes (`[ ]` / `[~]` / `[✓]`)
2. Add a row to the Session Log
3. If new decisions are made, add to Open Decisions
4. If scope changes, update MVI v0.1 scope notes
5. Update "Last Updated" date at the top

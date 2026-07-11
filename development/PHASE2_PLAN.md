# Phase 2 – Intelligence & Workflows Plan

**Goal:** Build the intelligence layer that turns raw observations into actionable guidance.

## Incremental Milestones (recommended order)

1. **Project Health Engine**
   - Implements `assess(rootPath): ProjectHealthReport`.
   - Returns coverage, TODO count, docs‑age, lint errors, composite score.
   - Integrated into `WorkspaceCore.sendMessage` and exposed via an EventBus event `project:health`.
   - UI shows a health badge in the sidebar.

2. **Project Intelligence (Goal Tracking)**
   - Persists a simple `project‑goals.json` in the project root.
   - IPC handlers: `workspace:set-goal`, `workspace:get-goals`, `workspace:remove-goal`.
   - Goals are added to the ContextPackage for prompt building.

3. **Intent Engine + Engineering GPS**
   - Rule‑based intent detection on recent observations + current goal.
   - Produces `{ intent: string, confidence: number }`.
   - GPS consumes intent + health report to suggest next concrete step (`{ action, description }`).
   - Both values are fed to the Prompt Builder.

4. **Workflow Engine, Recommendation Engine & AI Orchestrator**
   - Playbook format (`steps: [{type:'health'}, {type:'intent'}, {type:'recommend'}]`).
   - Workflow Engine executes steps sequentially, emitting `workflow:step`/`workflow:complete` events.
   - Recommendation Engine builds richer prompts (health + intent + GPS) and returns a full `StructuredProviderResponse` (recommendation, reasoning, alternatives, trade‑offs, follow‑ups).
   - AI Orchestrator decides when to be proactive (e.g., after a low health score) and triggers the workflow automatically.

## Why this staged approach?
- **Risk reduction** – each milestone is a self‑contained, testable unit; failures are isolated.
- **Fast feedback** – after Milestone 1 you already get a visible health badge and a usable chat answer about project health.
- **Re‑use of data** – health data feeds intent, GPS, and later recommendation, ensuring a clean data flow.
- **Alignment with MVI v0.1** – all steps respect the “single‑project, stateless core” invariant.

## Next concrete task
- Create `src/main/project-health` implementation, tests, and wire it into `WorkspaceCore` (as described in Milestone 1).
- Update UI to display the health badge.

Once that passes the full test suite, type‑check, and manual run, proceed to Milestone 2.

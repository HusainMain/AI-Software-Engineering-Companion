import { eventBus } from '../event-bus/event-bus.js';

type WorkflowStep = { name: string; data?: unknown };

type Workflow = {
  name: string;
  steps: WorkflowStep[];
  currentIndex: number;
};

/** Minimal sequential workflow engine.
 *  - start(name, steps) creates a workflow and emits `workflow:start`.
 *  - next() advances to the next step, emitting `workflow:step`.
 *  - when all steps are done, emits `workflow:complete`.
 */
export function createWorkflowEngine() {
  let workflow: Workflow | null = null;

  function start(name: string, steps: WorkflowStep[]): void {
    workflow = { name, steps, currentIndex: -1 };
    eventBus.emit({ type: 'workflow:start', payload: { name, totalSteps: steps.length } });
    next(); // automatically move to first step
  }

  function next(): void {
    if (!workflow) return;
    workflow.currentIndex += 1;
    if (workflow.currentIndex < workflow.steps.length) {
      const step = workflow.steps[workflow.currentIndex];
      eventBus.emit({ type: 'workflow:step', payload: { name: workflow.name, step: step.name, index: workflow.currentIndex } });
    } else {
      // completed
      eventBus.emit({ type: 'workflow:complete', payload: { name: workflow.name } });
      workflow = null;
    }
  }

  function getCurrentStep(): WorkflowStep | null {
    if (!workflow) return null;
    return workflow.steps[workflow.currentIndex] ?? null;
  }

  return { start, next, getCurrentStep };
}

import { describe, it, expect, vi } from 'vitest';
import { createWorkflowEngine } from './workflow-engine.js';

vi.mock('../event-bus/event-bus.js', () => ({
  eventBus: {
    emit: vi.fn(),
    on: vi.fn(() => ({ unsubscribe: vi.fn() })),
    off: vi.fn(),
  },
}));
import { eventBus } from '../event-bus/event-bus.js';

describe('WorkflowEngine', () => {
  it('executes steps sequentially and emits events', () => {
    const engine = createWorkflowEngine();
    const steps = [{ name: 'step1' }, { name: 'step2' }];


    engine.start('testFlow', steps);
    expect(eventBus.emit).toHaveBeenCalledWith({ type: 'workflow:start', payload: { name: 'testFlow', totalSteps: 2 } });
    expect(eventBus.emit).toHaveBeenCalledWith({ type: 'workflow:step', payload: { name: 'testFlow', step: 'step1', index: 0 } });
    // advance to second step
    engine.next();
    expect(eventBus.emit).toHaveBeenCalledWith({ type: 'workflow:step', payload: { name: 'testFlow', step: 'step2', index: 1 } });
    // finish workflow
    engine.next();
    expect(eventBus.emit).toHaveBeenCalledWith({ type: 'workflow:complete', payload: { name: 'testFlow' } });
  });
});

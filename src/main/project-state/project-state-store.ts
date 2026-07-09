import fs from 'node:fs/promises';
import path from 'node:path';
import type { ProjectState, ProjectStateUpdate } from './types.js';

const PROJECT_STATE_FILE = 'project.json';

export interface ProjectStateStore {
  load(): Promise<ProjectState>;
  update(update: ProjectStateUpdate): Promise<ProjectState>;
  save(state: ProjectState): Promise<void>;
}

function createDefaultProjectState(): ProjectState {
  return {
    projectName: 'AI Software Engineering Companion',
    currentMilestone: 'Milestone 1',
    updatedAt: new Date().toISOString(),
    conversationCount: 0,
  };
}

function isProjectState(value: unknown): value is ProjectState {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const state = value as Record<string, unknown>;
  return (
    typeof state.projectName === 'string' &&
    typeof state.currentMilestone === 'string' &&
    typeof state.updatedAt === 'string' &&
    typeof state.conversationCount === 'number'
  );
}

export function createProjectStateStore(projectRoot: string): ProjectStateStore {
  const filePath = path.join(projectRoot, PROJECT_STATE_FILE);

  async function load(): Promise<ProjectState> {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const state = JSON.parse(content) as unknown;

      if (!isProjectState(state)) {
        throw new Error(`${PROJECT_STATE_FILE} does not match the expected project state shape.`);
      }

      return state;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }

      const state = createDefaultProjectState();
      await save(state);
      return state;
    }
  }

  async function save(state: ProjectState): Promise<void> {
    await fs.writeFile(filePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
  }

  async function update(update: ProjectStateUpdate): Promise<ProjectState> {
    const currentState = await load();
    const nextState: ProjectState = {
      ...currentState,
      ...update,
      updatedAt: new Date().toISOString(),
    };

    await save(nextState);
    return nextState;
  }

  return { load, update, save };
}

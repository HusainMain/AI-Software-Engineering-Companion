import { assess } from './project-health.js';
import type { ProjectHealthReport } from './types.js';

/**
 * Simple factory – keeps the API consistent with other subsystems.
 */
export function createProjectHealthEngine() {
  return { assess };
}

export type { ProjectHealthReport };

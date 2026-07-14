import type { ProjectHealthReport } from '../project-health/types.js';
import type { Goal } from '../project-intelligence/types.js';

/** Minimal representation of current project position */
export interface Position {
  /** Aggregated health score (0‑100) */
  healthScore: number;
  /** Id of the currently active goal, if any */
  activeGoalId?: string;
}

/** Destination representation – goals the project wants to achieve */
export interface Destination {
  goals: Goal[];
}

/** Navigation suggestion returned by the GPS */
export interface NavigationSuggestion {
  /** Short description of the next step */
  step: string;
  /** Reason why this step is chosen */
  reason: string;
}

export interface EngineeringGPS {
  /** Compute a navigation suggestion based on health and intelligence */
  suggest(health: ProjectHealthReport, intelligence: Destination): NavigationSuggestion;
}

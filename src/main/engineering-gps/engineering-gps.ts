import type { EngineeringGPS, NavigationSuggestion } from './types.js';
import type { ProjectHealthReport } from '../project-health/types.js';
import type { Destination, Goal } from '../project-intelligence/types.js';

/** Simple Engineering GPS implementation.
 *  - Uses health summary score to detect low‑health situations.
 *  - Looks at goals to suggest work on an active or planned goal.
 *  - Falls back to a generic "maintain" suggestion.
 */
export function createEngineeringGPS(): EngineeringGPS {
  function suggest(health: ProjectHealthReport, destination: Destination): NavigationSuggestion {
    const healthScore = health.summary.score;
    // 1️⃣ Low health → prioritize health improvement
    if (healthScore < 70) {
      return {
        step: 'improve health',
        reason: `Health score ${healthScore} is below acceptable threshold`,
      };
    }
    // 2️⃣ Active goal – continue work
    const activeGoal = destination.goals.find((g) => g.status === 'active');
    if (activeGoal) {
      return {
        step: `work on goal: ${activeGoal.title}`,
        reason: 'Goal is currently active',
      };
    }
    // 3️⃣ Planned goal – start the highest‑priority planned goal
    const plannedGoals = destination.goals.filter((g) => g.status === 'planned');
    if (plannedGoals.length) {
      // prioritize higher priority (high > medium > low)
      const priorityOrder = { high: 3, medium: 2, low: 1 } as const;
      const best = plannedGoals.reduce((best, cur) =>
        priorityOrder[cur.priority] > priorityOrder[best.priority] ? cur : best,
      );
      return {
        step: `start goal: ${best.title}`,
        reason: `Highest‑priority planned goal (${best.priority})`,
      };
    }
    // 4️⃣ Default – maintain current state
    return { step: 'maintain', reason: 'No active or planned goals and health is acceptable' };
  }

  return { suggest };
}

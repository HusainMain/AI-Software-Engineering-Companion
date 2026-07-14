import type { RecommendationEngine, Recommendation } from './types.js';
import type { KnowledgeEngine, KnowledgeCategory, KnowledgePattern } from '../knowledge-engine/types.js';
import type { ProjectHealthReport } from '../project-health/types.js';
import type { Goal } from '../project-intelligence/types.js';

/** Simple Recommendation Engine.
 *  - Consumes a KnowledgeEngine (provides patterns per category).
 *  - Optionally integrates GPS suggestions (outside this minimal impl).
 *  - For each active knowledge category that has at least one validated pattern, it creates a recommendation.
 */
export function createRecommendationEngine(knowledge: KnowledgeEngine): RecommendationEngine {
  const domainMap: Record<KnowledgeCategory, string> = {
    architecture: 'Architecture',
    security: 'Security',
    cost: 'Cost Optimization',
    tool: 'Tool Selection',
    deployment: 'Deployment',
    documentation: 'Documentation',
  };

  function buildRec(pattern: KnowledgePattern, category: KnowledgeCategory): Recommendation {
    const confidence = pattern.validated ? 'High' as const : ('Medium' as const);
    return {
      recommendation: `Consider applying pattern "${pattern.title}"`,
      reasoning: `Based on validated knowledge pattern from ${category} category: ${pattern.description}`,
      alternativesConsidered: [],
      tradeoffs: 'N/A',
      confidence,
      domain: domainMap[category] ?? category,
      knowledgeSource: category,
    };
  }

  function getRecommendations(healthScore: number, destinationGoals: string[]): Recommendation[] {
    // For simplicity, ignore healthScore & destinationGoals for now – they could drive prioritisation.
    const recs: Recommendation[] = [];
    // Iterate over each knowledge category and generate recommendation if patterns exist.
    (Object.keys(domainMap) as KnowledgeCategory[]).forEach((cat) => {
      const patterns = knowledge.getPatterns(cat);
      if (patterns.length) {
        // Use the first pattern for demo purposes
        const rec = buildRec(patterns[0], cat);
        recs.push(rec);
      }
    });
    return recs;
  }

  return { getRecommendations };
}

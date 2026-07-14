import { KnowledgeEngine, KnowledgePattern, KnowledgeCategory } from './types.js';

/** Simple in‑memory Knowledge Engine.
 *  Stores patterns for the active MVI categories. No persistence is required for the
 *  current MVP – patterns live only for the process lifetime.
 */
export function createKnowledgeEngine(): KnowledgeEngine {
  const patterns: KnowledgePattern[] = [];

  function getPatterns(category: KnowledgeCategory): KnowledgePattern[] {
    return patterns.filter(p => p.category === category);
  }

  function addPattern(p: Omit<KnowledgePattern, 'id'>): KnowledgePattern {
    const pattern: KnowledgePattern = { ...p, id: crypto.randomUUID() };
    patterns.push(pattern);
    return pattern;
  }

  function validatePattern(id: string): void {
    const idx = patterns.findIndex(p => p.id === id);
    if (idx !== -1) {
      patterns[idx].validated = true;
    }
  }

  return { getPatterns, addPattern, validatePattern };
}

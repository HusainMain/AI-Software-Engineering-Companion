export type KnowledgeCategory =
  | 'architecture'
  | 'security'
  | 'cost'
  | 'tool'
  | 'deployment'
  | 'documentation';

export interface KnowledgePattern {
  id: string;
  category: KnowledgeCategory;
  title: string;
  description: string;
  validated: boolean;
}

export interface KnowledgeEngine {
  /** Get all patterns for a category */
  getPatterns(category: KnowledgeCategory): KnowledgePattern[];
  /** Add a new pattern (id generated internally) */
  addPattern(pattern: Omit<KnowledgePattern, 'id'>): KnowledgePattern;
  /** Mark a pattern as validated */
  validatePattern(id: string): void;
}

export const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'been',
  'but',
  'by',
  'can',
  'could',
  'did',
  'do',
  'does',
  'for',
  'from',
  'had',
  'has',
  'have',
  'he',
  'her',
  'here',
  'him',
  'his',
  'how',
  'i',
  'if',
  'in',
  'is',
  'it',
  'its',
  'me',
  'my',
  'of',
  'on',
  'or',
  'our',
  'she',
  'so',
  'that',
  'the',
  'their',
  'them',
  'then',
  'there',
  'these',
  'they',
  'this',
  'those',
  'to',
  'was',
  'we',
  'were',
  'what',
  'when',
  'where',
  'which',
  'who',
  'will',
  'with',
  'would',
  'you',
  'your',
  'about',
  'above',
  'after',
  'again',
  'against',
  'all',
  'am',
  'any',
  'because',
  'before',
  'below',
  'between',
  'both',
  'during',
  'each',
  'few',
  'further',
  'had',
  'having',
  'he',
  'her',
  'here',
  'hers',
  'herself',
  'him',
  'himself',
  'how',
  'i',
  'if',
  'in',
  'into',
  'is',
  'it',
  'its',
  'itself',
  'me',
  'more',
  'most',
  'my',
  'myself',
  'no',
  'nor',
  'not',
  'now',
  'of',
  'off',
  'on',
  'once',
  'only',
  'or',
  'other',
  'ought',
  'our',
  'ours',
  'ourselves',
  'out',
  'over',
  'own',
  'same',
  'she',
  'should',
  'so',
  'some',
  'such',
  'than',
  'that',
  'the',
  'their',
  'theirs',
  'themselves',
  'then',
  'there',
  'these',
  'they',
  'this',
  'those',
  'through',
  'to',
  'too',
  'under',
  'until',
  'up',
  'very',
  'was',
  'we',
  'were',
  'what',
  'when',
  'where',
  'which',
  'while',
  'who',
  'whom',
  'why',
  'will',
  'with',
  'would',
  'you',
  'your',
  'yours',
  'yourself',
  'yourselves',
]);

const PLURAL_RULES: [RegExp, string][] = [
  [/ies$/i, 'y'],
  [/ves$/i, 'f'],
  [/es$/i, 'e'],
  [/s$/i, ''],
];

const SINGULAR_EXCEPTIONS = new Set([
  'process',
  'address',
  'success',
  'access',
  'excess',
  'press',
  'stress',
  'bless',
  'dress',
  'guess',
  'series',
  'species',
  'means',
  'news',
  'physics',
  'mathematics',
  'scripts',
  'configs',
  'settings',
  'options',
  'dependencies',
  'devDependencies',
  'peerDependencies',
]);

function singularize(word: string): string {
  if (SINGULAR_EXCEPTIONS.has(word)) {
    return word;
  }
  for (const [pattern, replacement] of PLURAL_RULES) {
    if (pattern.test(word) && word.length > 3) {
      return word.replace(pattern, replacement);
    }
  }
  return word;
}

function splitCamelCase(word: string): string[] {
  return word
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(/\s+/)
    .filter(w => w.length > 0);
}

function normalizeWord(word: string): string {
  return word.toLowerCase().replace(/[^\w]/g, '');
}

export function extractKeywords(query: string): string[] {
  const words = query
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .flatMap(splitCamelCase)
    .map(normalizeWord)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word));

  const uniqueWords = [...new Set(words)];
  return uniqueWords.map(singularize);
}

export function extractKeywordsWithContext(query: string): {
  keywords: string[];
  originalWords: string[];
} {
  const originalWords = query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word));

  const keywords = [...new Set(originalWords.map(singularize))];
  return { keywords, originalWords };
}
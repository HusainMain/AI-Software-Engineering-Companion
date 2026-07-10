import type { ProjectFile } from './types.js';

export interface ParsedMarkdown {
  title: string | undefined;
  firstHeading: string | undefined;
  headings: string[];
  sectionCount: number;
  wordCount: number;
  codeBlockCount: number;
  linkCount: number;
}

export function parseMarkdown(content: string): ParsedMarkdown {
  const lines = content.split('\n');
  const headings: string[] = [];
  let firstHeading: string | undefined;
  let title: string | undefined;
  let codeBlockCount = 0;
  let inCodeBlock = false;
  let linkCount = 0;
  let wordCount = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('```') || trimmed.startsWith('~~~')) {
      if (!inCodeBlock) {
        codeBlockCount++;
      }
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) continue;

    if (trimmed.startsWith('#')) {
      const heading = trimmed.replace(/^#+\s*/, '');
      headings.push(heading);
      if (!firstHeading) {
        firstHeading = heading;
      }
      if (!title && heading.length > 0) {
        title = heading;
      }
    }

    wordCount += trimmed.split(/\s+/).filter(w => w.length > 0).length;

    const linkMatches = trimmed.match(/\[([^\]]+)\]\([^)]+\)/g);
    if (linkMatches) {
      linkCount += linkMatches.length;
    }
  }

  return {
    title,
    firstHeading,
    headings,
    sectionCount: headings.length,
    wordCount,
    codeBlockCount,
    linkCount,
  };
}

export function parseMarkdownFile(file: ProjectFile, content: string): {
  title?: string;
  firstHeading?: string;
  sectionCount: number;
} {
  const parsed = parseMarkdown(content);
  return {
    title: parsed.title,
    firstHeading: parsed.firstHeading,
    sectionCount: parsed.sectionCount,
  };
}
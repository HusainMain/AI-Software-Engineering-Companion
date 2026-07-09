import fs from 'node:fs/promises';
import path from 'node:path';
import type { DecisionRecord } from './types.js';

const DECISION_LOG_FILE = 'decisions.jsonl';

export interface DecisionLog {
  append(decision: Omit<DecisionRecord, 'id' | 'createdAt'>): Promise<DecisionRecord>;
  read(): Promise<DecisionRecord[]>;
  queryRecent(limit: number): Promise<DecisionRecord[]>;
}

export function createDecisionLog(projectRoot: string): DecisionLog {
  const filePath = path.join(projectRoot, DECISION_LOG_FILE);

  async function append(
    decision: Omit<DecisionRecord, 'id' | 'createdAt'>,
  ): Promise<DecisionRecord> {
    const record: DecisionRecord = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...decision,
    };

    await fs.appendFile(filePath, `${JSON.stringify(record)}\n`, 'utf8');
    return record;
  }

  async function read(): Promise<DecisionRecord[]> {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return content
        .split('\n')
        .filter(Boolean)
        .map((line) => JSON.parse(line) as DecisionRecord);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }

      throw error;
    }
  }

  async function queryRecent(limit: number): Promise<DecisionRecord[]> {
    const decisions = await read();
    return decisions.slice(-limit).reverse();
  }

  return { append, read, queryRecent };
}

import fs from 'node:fs/promises'
import { createEngineeringMemory } from './engineering-memory.js'
import type { DecisionLogRecord } from './types.js'

export async function migrateDecisionLog(dbPath: string, decisionsJsonlPath: string): Promise<{ migrated: number; skipped: number }> {
  try {
    const content = await fs.readFile(decisionsJsonlPath, 'utf-8')
    const lines = content.split('\n').filter(Boolean)
    const records: DecisionLogRecord[] = lines.map(line => JSON.parse(line))
    
    const memory = await createEngineeringMemory(dbPath)
    const result = memory.migrateFromDecisionLog(records)
    memory.close()
    
    return result
  } catch (error) {
    const err = error as NodeJS.ErrnoException
    if (err.code === 'ENOENT') {
      return { migrated: 0, skipped: 0 }
    }
    throw error
  }
}
import { eventBus } from '../event-bus/event-bus.js'
import { createDatabase, saveDatabase } from './database.js'
import type { SqlJsDatabase } from './database.js'
import type {
  StoredObservation,
  StoredConversation,
  DecisionLogRecord,
  EngineeringMemory,
} from './types.js'

function rowsToObjects<T>(columns: string[], values: unknown[][]): T[] {
  return values.map(row => {
    const obj: Record<string, unknown> = {}
    for (let i = 0; i < columns.length; i++) {
      obj[columns[i]] = row[i]
    }
    return obj as T
  })
}

export async function createEngineeringMemory(dbPath: string): Promise<EngineeringMemory> {
  const db: SqlJsDatabase = await createDatabase(dbPath)

  function recordObservation(observation: Omit<StoredObservation, 'id'>): StoredObservation {
    const id = crypto.randomUUID()
    const full: StoredObservation = { id, ...observation }
    try {
      db.run(
        'INSERT INTO observations (id, event_type, file_path, size, message, timestamp, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [full.id, full.eventType, full.filePath, full.size, full.message, full.timestamp, full.createdAt],
      )
      eventBus.emit({
        type: 'memory:observation-recorded',
        timestamp: new Date().toISOString(),
        observationId: full.id,
      })
    } catch (error) {
      console.error('[EngineeringMemory] Failed to record observation:', error)
    }
    return full
  }

  function getObservation(id: string): StoredObservation | null {
    try {
      const result = db.exec('SELECT id, event_type AS "eventType", file_path AS "filePath", size, message, timestamp, created_at AS "createdAt" FROM observations WHERE id = ?', [id])
      if (result.length === 0 || result[0].values.length === 0) return null
      const rows = rowsToObjects<StoredObservation>(result[0].columns, result[0].values)
      return rows[0] ?? null
    } catch (error) {
      console.error('[EngineeringMemory] Failed to get observation:', error)
      return null
    }
  }

  function getObservationsByFile(filePath: string, limit = 50): StoredObservation[] {
    try {
      const result = db.exec('SELECT id, event_type AS "eventType", file_path AS "filePath", size, message, timestamp, created_at AS "createdAt" FROM observations WHERE file_path = ? ORDER BY timestamp DESC LIMIT ?', [filePath, limit])
      if (result.length === 0) return []
      return rowsToObjects<StoredObservation>(result[0].columns, result[0].values)
    } catch (error) {
      console.error('[EngineeringMemory] Failed to get observations by file:', error)
      return []
    }
  }

  function getRecentObservations(limit = 50): StoredObservation[] {
    try {
      const result = db.exec('SELECT id, event_type AS "eventType", file_path AS "filePath", size, message, timestamp, created_at AS "createdAt" FROM observations ORDER BY timestamp DESC LIMIT ?', [limit])
      if (result.length === 0) return []
      return rowsToObjects<StoredObservation>(result[0].columns, result[0].values)
    } catch (error) {
      console.error('[EngineeringMemory] Failed to get recent observations:', error)
      return []
    }
  }

  function getObservationsSince(since: string): StoredObservation[] {
    try {
      const result = db.exec('SELECT id, event_type AS "eventType", file_path AS "filePath", size, message, timestamp, created_at AS "createdAt" FROM observations WHERE timestamp >= ? ORDER BY timestamp ASC', [since])
      if (result.length === 0) return []
      return rowsToObjects<StoredObservation>(result[0].columns, result[0].values)
    } catch (error) {
      console.error('[EngineeringMemory] Failed to get observations since:', error)
      return []
    }
  }

  function recordConversation(conversation: Omit<StoredConversation, 'id'>): StoredConversation {
    const id = crypto.randomUUID()
    const full: StoredConversation = { id, ...conversation }
    try {
      db.run(
        'INSERT INTO conversations (id, user_message, response, timestamp) VALUES (?, ?, ?, ?)',
        [full.id, full.userMessage, full.response, full.timestamp],
      )
      eventBus.emit({
        type: 'memory:decision-recorded',
        timestamp: new Date().toISOString(),
        decisionId: full.id,
      })
    } catch (error) {
      console.error('[EngineeringMemory] Failed to record conversation:', error)
    }
    return full
  }

  function getConversation(id: string): StoredConversation | null {
    try {
      const result = db.exec('SELECT id, user_message AS "userMessage", response, timestamp FROM conversations WHERE id = ?', [id])
      if (result.length === 0 || result[0].values.length === 0) return null
      const rows = rowsToObjects<StoredConversation>(result[0].columns, result[0].values)
      return rows[0] ?? null
    } catch (error) {
      console.error('[EngineeringMemory] Failed to get conversation:', error)
      return null
    }
  }

  function getRecentConversations(limit = 50): StoredConversation[] {
    try {
      const result = db.exec('SELECT id, user_message AS "userMessage", response, timestamp FROM conversations ORDER BY timestamp DESC LIMIT ?', [limit])
      if (result.length === 0) return []
      return rowsToObjects<StoredConversation>(result[0].columns, result[0].values)
    } catch (error) {
      console.error('[EngineeringMemory] Failed to get recent conversations:', error)
      return []
    }
  }

  function migrateFromDecisionLog(records: DecisionLogRecord[]): { migrated: number; skipped: number } {
    let migrated = 0
    let skipped = 0

    for (const record of records) {
      try {
        const existing = db.exec('SELECT id FROM conversations WHERE id = ?', [record.id])
        if (existing.length > 0 && existing[0].values.length > 0) {
          skipped++
          continue
        }
        db.run(
          'INSERT INTO conversations (id, user_message, response, timestamp) VALUES (?, ?, ?, ?)',
          [record.id, record.userMessage, record.response, record.createdAt],
        )
        migrated++
      } catch (error) {
        console.error('[EngineeringMemory] Failed to migrate:', record.id, error)
      }
    }

    return { migrated, skipped }
  }

  function close(): void {
    try {
      saveDatabase(db, dbPath)
    } catch (error) {
      console.error('[EngineeringMemory] Failed to save database:', error)
    }
    try {
      db.close()
    } catch (error) {
      console.error('[EngineeringMemory] Failed to close database:', error)
    }
  }

  return {
    recordObservation,
    getObservation,
    getObservationsByFile,
    getRecentObservations,
    getObservationsSince,
    recordConversation,
    getConversation,
    getRecentConversations,
    migrateFromDecisionLog,
    close,
  }
}

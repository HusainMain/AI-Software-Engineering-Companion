import initSqlJs from 'sql.js'
import * as fs from 'node:fs'
import type { SqlJsStatic, Database as SqlJsDatabase } from 'sql.js'

let sqlJsPromise: Promise<SqlJsStatic> | undefined

function getSqlJs(): Promise<SqlJsStatic> {
  if (!sqlJsPromise) {
    sqlJsPromise = initSqlJs()
  }
  return sqlJsPromise
}

export async function createDatabase(dbPath: string): Promise<SqlJsDatabase> {
  const SQL = await getSqlJs()
  let db: SqlJsDatabase

  try {
    const buffer = fs.readFileSync(dbPath)
    db = new SQL.Database(buffer)
  } catch {
    db = new SQL.Database()
  }

  db.run('PRAGMA journal_mode = MEMORY')

  db.run(`
    CREATE TABLE IF NOT EXISTS observations (
      id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      file_path TEXT,
      size INTEGER,
      message TEXT,
      timestamp TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `)
  db.run('CREATE INDEX IF NOT EXISTS idx_observations_timestamp ON observations(timestamp)')
  db.run('CREATE INDEX IF NOT EXISTS idx_observations_file_path ON observations(file_path)')
  db.run('CREATE INDEX IF NOT EXISTS idx_observations_event_type ON observations(event_type)')

  db.run(`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      user_message TEXT NOT NULL,
      response TEXT NOT NULL,
      timestamp TEXT NOT NULL
    )
  `)
  db.run('CREATE INDEX IF NOT EXISTS idx_conversations_timestamp ON conversations(timestamp)')

  return db
}

export function saveDatabase(db: SqlJsDatabase, dbPath: string): void {
  const data = db.export()
  const buffer = Buffer.from(data)
  fs.writeFileSync(dbPath, buffer)
}

export type { SqlJsDatabase }

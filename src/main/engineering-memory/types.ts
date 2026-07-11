export interface StoredObservation {
  id: string
  eventType: string
  filePath: string | null
  size: number | null
  message: string | null
  timestamp: string
  createdAt: string
}

export interface StoredConversation {
  id: string
  userMessage: string
  response: string
  timestamp: string
}

export interface DecisionLogRecord {
  id: string
  userMessage: string
  response: string
  createdAt: string
}

export interface EngineeringMemory {
  recordObservation(observation: Omit<StoredObservation, 'id'>): StoredObservation
  getObservation(id: string): StoredObservation | null
  getObservationsByFile(filePath: string, limit?: number): StoredObservation[]
  getRecentObservations(limit?: number): StoredObservation[]
  getObservationsSince(since: string, limit?: number): StoredObservation[]
  recordConversation(conversation: Omit<StoredConversation, 'id'>): StoredConversation
  getConversation(id: string): StoredConversation | null
  getRecentConversations(limit?: number): StoredConversation[]
  migrateFromDecisionLog(records: DecisionLogRecord[]): { migrated: number; skipped: number }
  close(): void
}
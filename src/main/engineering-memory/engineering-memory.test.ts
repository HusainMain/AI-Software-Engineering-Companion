import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createEngineeringMemory } from './engineering-memory.js'
import { eventBus } from '../event-bus/event-bus.js'
import type { EngineeringMemory } from './types.js'

describe('EngineeringMemory', () => {
  let memory: EngineeringMemory

  beforeEach(async () => {
    memory = await createEngineeringMemory(':memory:')
  })
  
  afterEach(() => {
    memory.close()
  })
  
  it('record and retrieve observation', () => {
    const observation = memory.recordObservation({
      eventType: 'file:created',
      filePath: '/test/file.txt',
      size: 100,
      message: null,
      timestamp: '2024-01-01T00:00:00.000Z',
      createdAt: '2024-01-01T00:00:00.000Z',
    })
    
    expect(observation.id).toBeDefined()
    expect(observation.eventType).toBe('file:created')
    expect(observation.filePath).toBe('/test/file.txt')
    
    const retrieved = memory.getObservation(observation.id)
    expect(retrieved).not.toBeNull()
    expect(retrieved?.id).toBe(observation.id)
  })
  
  it('get observations by file path', () => {
    memory.recordObservation({
      eventType: 'file:created',
      filePath: '/test/file.txt',
      size: 100,
      message: null,
      timestamp: '2024-01-01T00:00:00.000Z',
      createdAt: '2024-01-01T00:00:00.000Z',
    })
    
    memory.recordObservation({
      eventType: 'file:modified',
      filePath: '/test/file.txt',
      size: 200,
      message: null,
      timestamp: '2024-01-01T01:00:00.000Z',
      createdAt: '2024-01-01T01:00:00.000Z',
    })
    
    memory.recordObservation({
      eventType: 'file:created',
      filePath: '/test/other.txt',
      size: 50,
      message: null,
      timestamp: '2024-01-01T02:00:00.000Z',
      createdAt: '2024-01-01T02:00:00.000Z',
    })
    
    const fileObservations = memory.getObservationsByFile('/test/file.txt')
    expect(fileObservations).toHaveLength(2)
    expect(fileObservations[0].size).toBe(200)
    expect(fileObservations[1].size).toBe(100)
  })
  
  it('get recent observations', () => {
    for (let i = 0; i < 5; i++) {
      memory.recordObservation({
        eventType: 'file:created',
        filePath: `/test/file${i}.txt`,
        size: 100 + i,
        message: null,
        timestamp: `2024-01-01T0${i}:00:00.000Z`,
        createdAt: `2024-01-01T0${i}:00:00.000Z`,
      })
    }
    
    const recent = memory.getRecentObservations(3)
    expect(recent).toHaveLength(3)
    expect(recent[0].size).toBe(104)
  })
  
  it('get observations since timestamp', () => {
    memory.recordObservation({
      eventType: 'file:created',
      filePath: '/test/old.txt',
      size: 100,
      message: null,
      timestamp: '2024-01-01T00:00:00.000Z',
      createdAt: '2024-01-01T00:00:00.000Z',
    })
    
    memory.recordObservation({
      eventType: 'file:created',
      filePath: '/test/new.txt',
      size: 200,
      message: null,
      timestamp: '2024-01-01T12:00:00.000Z',
      createdAt: '2024-01-01T12:00:00.000Z',
    })
    
    const since = memory.getObservationsSince('2024-01-01T06:00:00.000Z')
    expect(since).toHaveLength(1)
    expect(since[0].filePath).toBe('/test/new.txt')
  })
  
  it('record and retrieve conversation', () => {
    const conversation = memory.recordConversation({
      userMessage: 'Hello',
      response: 'Hi there!',
      timestamp: '2024-01-01T00:00:00.000Z',
    })
    
    expect(conversation.id).toBeDefined()
    expect(conversation.userMessage).toBe('Hello')
    expect(conversation.response).toBe('Hi there!')
    
    const retrieved = memory.getConversation(conversation.id)
    expect(retrieved).not.toBeNull()
    expect(retrieved?.id).toBe(conversation.id)
  })
  
  it('get recent conversations', () => {
    for (let i = 0; i < 5; i++) {
      memory.recordConversation({
        userMessage: `Message ${i}`,
        response: `Response ${i}`,
        timestamp: `2024-01-01T0${i}:00:00.000Z`,
      })
    }
    
    const recent = memory.getRecentConversations(3)
    expect(recent).toHaveLength(3)
    expect(recent[0].userMessage).toBe('Message 4')
  })
  
  it('migrate from decision log', () => {
    const records: DecisionLogRecord[] = [
      { id: 'dec-1', userMessage: 'Q1', response: 'A1', createdAt: '2024-01-01T00:00:00.000Z' },
      { id: 'dec-2', userMessage: 'Q2', response: 'A2', createdAt: '2024-01-01T01:00:00.000Z' },
      { id: 'dec-3', userMessage: 'Q3', response: 'A3', createdAt: '2024-01-01T02:00:00.000Z' },
    ]
    
    const result = memory.migrateFromDecisionLog(records)
    expect(result.migrated).toBe(3)
    expect(result.skipped).toBe(0)
    
    const conv1 = memory.getConversation('dec-1')
    expect(conv1).not.toBeNull()
    expect(conv1?.userMessage).toBe('Q1')
    expect(conv1?.response).toBe('A1')
  })
  
  it('migration deduplication', () => {
    const records: DecisionLogRecord[] = [
      { id: 'dec-1', userMessage: 'Q1', response: 'A1', createdAt: '2024-01-01T00:00:00.000Z' },
    ]
    
    memory.migrateFromDecisionLog(records)
    const result = memory.migrateFromDecisionLog(records)
    
    expect(result.migrated).toBe(0)
    expect(result.skipped).toBe(1)
  })
  
  it('migration with empty array', () => {
    const result = memory.migrateFromDecisionLog([])
    expect(result.migrated).toBe(0)
    expect(result.skipped).toBe(0)
  })
  
  it('nonexistent observation returns null', () => {
    const result = memory.getObservation('nonexistent-id')
    expect(result).toBeNull()
  })
  
  it('nonexistent conversation returns null', () => {
    const result = memory.getConversation('nonexistent-id')
    expect(result).toBeNull()
  })

  it('recording observation emits memory:observation-recorded event', () => {
    const events: string[] = []
    const sub = eventBus.on('memory:observation-recorded', (e) => {
      events.push(e.observationId)
    })

    const obs = memory.recordObservation({
      eventType: 'file:created',
      filePath: '/test/event.txt',
      size: 100,
      message: null,
      timestamp: '2024-01-01T00:00:00.000Z',
      createdAt: '2024-01-01T00:00:00.000Z',
    })

    expect(events).toHaveLength(1)
    expect(events[0]).toBe(obs.id)
    sub.unsubscribe()
  })

  it('recording conversation emits memory:decision-recorded event', () => {
    const events: string[] = []
    const sub = eventBus.on('memory:decision-recorded', (e) => {
      events.push(e.decisionId)
    })

    const conv = memory.recordConversation({
      userMessage: 'Hello',
      response: 'Hi',
      timestamp: '2024-01-01T00:00:00.000Z',
    })

    expect(events).toHaveLength(1)
    expect(events[0]).toBe(conv.id)
    sub.unsubscribe()
  })
  
  it('close and reopen with file database', async () => {
    const fs = require('fs')
    const path = require('path')
    const tmpPath = path.join(process.cwd(), 'test-memory.db')
    
    try {
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath)
      
      const mem1 = await createEngineeringMemory(tmpPath)
      mem1.recordObservation({
        eventType: 'file:created',
        filePath: '/test/persist.txt',
        size: 100,
        message: null,
        timestamp: '2024-01-01T00:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
      })
      mem1.close()
      
      const mem2 = await createEngineeringMemory(tmpPath)
      const obs = mem2.getObservationsByFile('/test/persist.txt')
      expect(obs).toHaveLength(1)
      mem2.close()
    } finally {
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath)
    }
  })
})
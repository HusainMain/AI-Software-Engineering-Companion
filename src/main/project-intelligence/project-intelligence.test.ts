import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createProjectIntelligence } from './project-intelligence.js'
import type { ProjectIntelligence, ProjectIntelligenceState, Goal } from './types.js'

const mockFs = vi.hoisted(() => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
}))

vi.mock('node:fs/promises', () => ({
  readFile: mockFs.readFile,
  writeFile: mockFs.writeFile,
}))

vi.mock('node:path', () => ({
  join: (...args: string[]) => args.join('/'),
}))

describe('ProjectIntelligence', () => {
  let intelligence: ProjectIntelligence

  beforeEach(() => {
    vi.resetAllMocks()
    mockFs.readFile.mockRejectedValue({ code: 'ENOENT' })
    mockFs.writeFile.mockResolvedValue(undefined)
    intelligence = createProjectIntelligence('/project', '/data')
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('load returns empty state when file does not exist', async () => {
    await intelligence.load()
    const state = intelligence.getState()
    expect(state.goals).toEqual([])
    expect(state.activeFocus).toBeNull()
    expect(typeof state.updatedAt).toBe('string')
  })

  it('load returns existing state from file', async () => {
    const existingState: ProjectIntelligenceState = {
      goals: [{ id: 'g1', title: 'Goal 1', description: 'Desc', status: 'active', priority: 'high', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' }],
      activeFocus: { description: 'Focus on testing', startedAt: '2024-01-01T00:00:00.000Z', relatedGoalId: 'g1' },
      updatedAt: '2024-01-01T00:00:00.000Z',
    }
    mockFs.readFile.mockResolvedValue(JSON.stringify(existingState))
    const intelligence2 = createProjectIntelligence('/project', '/data')
    await intelligence2.load()
    const state = intelligence2.getState()
    expect(state.goals).toHaveLength(1)
    expect(state.activeFocus?.description).toBe('Focus on testing')
  })

  it('addGoal generates id, createdAt, updatedAt', async () => {
    await intelligence.load()
    const goal = intelligence.addGoal('Test Goal', 'Description', 'high')
    expect(goal.id).toBeDefined()
    expect(goal.title).toBe('Test Goal')
    expect(goal.description).toBe('Description')
    expect(goal.status).toBe('planned')
    expect(goal.priority).toBe('high')
    expect(goal.createdAt).toBeDefined()
    expect(goal.updatedAt).toBeDefined()
    expect(goal.completedAt).toBeUndefined()
  })

  it('addGoal appends to goals array', async () => {
    await intelligence.load()
    intelligence.addGoal('Goal 1', 'Desc', 'low')
    intelligence.addGoal('Goal 2', 'Desc', 'medium')
    const state = intelligence.getState()
    expect(state.goals).toHaveLength(2)
  })

  it('updateGoal modifies existing goal', async () => {
    await intelligence.load()
    const goal = intelligence.addGoal('Original', 'Desc', 'low')
    const updated = intelligence.updateGoal(goal.id, { title: 'Updated', priority: 'high' })
    expect(updated).not.toBeNull()
    expect(updated?.title).toBe('Updated')
    expect(updated?.priority).toBe('high')
    expect(updated?.updatedAt).toBeDefined()
  })

  it('updateGoal sets completedAt when status becomes completed', async () => {
    await intelligence.load()
    const goal = intelligence.addGoal('Goal', 'Desc', 'medium')
    const updated = intelligence.updateGoal(goal.id, { status: 'completed' })
    expect(updated?.status).toBe('completed')
    expect(updated?.completedAt).toBeDefined()
  })

  it('updateGoal preserves existing completedAt when updating other fields', async () => {
    await intelligence.load()
    const goal = intelligence.addGoal('Goal', 'Desc', 'medium')
    // First complete the goal
    const firstComplete = intelligence.updateGoal(goal.id, { status: 'completed' })
    expect(firstComplete?.completedAt).toBeDefined()
    const completedAtValue = firstComplete?.completedAt
    // Then update another field
    const secondUpdate = intelligence.updateGoal(goal.id, { title: 'New Title' })
    expect(secondUpdate?.completedAt).toBe(completedAtValue)
  })

  it('updateGoal returns null for unknown id', async () => {
    await intelligence.load()
    const result = intelligence.updateGoal('unknown-id', { title: 'New' })
    expect(result).toBeNull()
  })

  it('setFocus sets active focus', async () => {
    await intelligence.load()
    intelligence.setFocus('Working on auth', 'g1')
    const state = intelligence.getState()
    expect(state.activeFocus).not.toBeNull()
    expect(state.activeFocus?.description).toBe('Working on auth')
    expect(state.activeFocus?.relatedGoalId).toBe('g1')
    expect(state.activeFocus?.startedAt).toBeDefined()
  })

  it('setFocus clears active focus with empty string', async () => {
    await intelligence.load()
    intelligence.setFocus('Focus 1')
    intelligence.setFocus('')
    const state = intelligence.getState()
    expect(state.activeFocus).toBeNull()
  })

  it('save writes correct JSON', async () => {
    await intelligence.load()
    intelligence.addGoal('Goal', 'Desc', 'high')
    await intelligence.save()
    expect(mockFs.writeFile).toHaveBeenCalled()
    const written = mockFs.writeFile.mock.calls[0][1] as string
    const parsed = JSON.parse(written)
    expect(parsed.goals).toHaveLength(1)
    expect(parsed.goals[0].title).toBe('Goal')
  })

  it('getState returns cached state', async () => {
    await intelligence.load()
    intelligence.addGoal('Goal', 'Desc', 'low')
    const state1 = intelligence.getState()
    const state2 = intelligence.getState()
    expect(state1).toBe(state2)
  })

  it('full lifecycle: load, add, update, focus, save', async () => {
    await intelligence.load()
    const g1 = intelligence.addGoal('Feature A', 'Implement auth', 'high')
    intelligence.setFocus('Implementing login', g1.id)
    intelligence.updateGoal(g1.id, { status: 'active' })
    await intelligence.save()

    const state = intelligence.getState()
    expect(state.goals[0].status).toBe('active')
    expect(state.activeFocus?.relatedGoalId).toBe(g1.id)
  })
})
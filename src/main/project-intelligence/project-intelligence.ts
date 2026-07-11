import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import type { Goal, Focus, ProjectIntelligenceState, ProjectIntelligence } from './types.js'

const STATE_FILE = 'project-intelligence.json'

function isProjectIntelligenceState(obj: unknown): obj is ProjectIntelligenceState {
  if (!obj || typeof obj !== 'object') return false
  const state = obj as Record<string, unknown>
  return (
    Array.isArray(state.goals) &&
    (state.activeFocus === null || (typeof state.activeFocus === 'object' && state.activeFocus !== null)) &&
    typeof state.updatedAt === 'string'
  )
}

export function createProjectIntelligence(projectRoot: string, dataRoot: string): ProjectIntelligence {
  const statePath = path.join(dataRoot, STATE_FILE)
  let state: ProjectIntelligenceState = { goals: [], activeFocus: null, updatedAt: new Date().toISOString() }
  let loaded = false

  async function load(): Promise<void> {
    if (loaded) return
    try {
      const content = await fs.readFile(statePath, 'utf-8')
      const parsed = JSON.parse(content)
      if (isProjectIntelligenceState(parsed)) {
        state = parsed
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.error('[ProjectIntelligence] Failed to load state:', error)
      }
    }
    loaded = true
  }

  async function save(): Promise<void> {
    state.updatedAt = new Date().toISOString()
    try {
      await fs.writeFile(statePath, JSON.stringify(state, null, 2), 'utf-8')
    } catch (error) {
      console.error('[ProjectIntelligence] Failed to save state:', error)
    }
  }

  function getState(): ProjectIntelligenceState {
    return state
  }

  function addGoal(title: string, description: string, priority: Goal['priority']): Goal {
    const now = new Date().toISOString()
    const goal: Goal = {
      id: crypto.randomUUID(),
      title,
      description,
      status: 'planned',
      priority,
      createdAt: now,
      updatedAt: now,
    }
    state.goals.push(goal)
    return goal
  }

  function updateGoal(id: string, updates: Partial<Omit<Goal, 'id' | 'createdAt'>>): Goal | null {
    const index = state.goals.findIndex(g => g.id === id)
    if (index === -1) return null
    const goal = state.goals[index]
    const updated: Goal = { ...goal, ...updates, updatedAt: new Date().toISOString() }
    if (updates.status === 'completed' && !goal.completedAt) {
      updated.completedAt = new Date().toISOString()
    }
    state.goals[index] = updated
    return updated
  }

  function setFocus(description: string, relatedGoalId?: string): void {
    if (description.trim() === '') {
      state.activeFocus = null
    } else {
      state.activeFocus = {
        description: description.trim(),
        startedAt: new Date().toISOString(),
        relatedGoalId,
      }
    }
  }

  return {
    getState,
    addGoal,
    updateGoal,
    setFocus,
    load,
    save,
  }
}
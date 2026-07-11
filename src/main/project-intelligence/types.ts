export interface Goal {
  id: string
  title: string
  description: string
  status: 'planned' | 'active' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface Focus {
  description: string
  startedAt: string
  relatedGoalId?: string
}

export interface ProjectIntelligenceState {
  goals: Goal[]
  activeFocus: Focus | null
  updatedAt: string
}

export interface ProjectIntelligence {
  getState(): ProjectIntelligenceState
  addGoal(title: string, description: string, priority: Goal['priority']): Goal
  updateGoal(id: string, updates: Partial<Omit<Goal, 'id' | 'createdAt'>>): Goal | null
  setFocus(description: string, relatedGoalId?: string): void
  load(): Promise<void>
  save(): Promise<void>
}
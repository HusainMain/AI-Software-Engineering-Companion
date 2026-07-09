export interface ProjectState {
  projectName: string;
  currentMilestone: string;
  updatedAt: string;
  conversationCount: number;
}

export type ProjectStateUpdate = Partial<Omit<ProjectState, 'updatedAt'>>;

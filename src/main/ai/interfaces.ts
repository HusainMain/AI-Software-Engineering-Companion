export interface ResponseValidator {
  validate(response: string): Promise<boolean>;
}

export interface Cache {
  get(key: string): Promise<string | undefined>;
  set(key: string, value: string): Promise<void>;
}

export interface CostTracker {
  recordUsage(inputTokens: number, outputTokens: number): Promise<void>;
}

export interface ModelRouter {
  selectModel(prompt: string): Promise<string>;
}

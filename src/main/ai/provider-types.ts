export type AIProviderName = string;

export interface ProviderConfiguration {
  provider: AIProviderName;
  model: string;
  apiKey: string;
  baseUrl?: string;
  timeoutMs: number;
  maxRetries: number;
}

export interface ProviderConfigurationInput {
  provider?: AIProviderName;
  model?: string;
  apiKey?: string;
  baseUrl?: string;
  timeoutMs?: number;
  maxRetries?: number;
}

export interface StructuredProviderResponse {
  message: string;
  reasoning?: string;
  confidence?: number;
  followUps?: string[];
}

export type ProviderErrorCode =
  | 'missing_configuration'
  | 'unsupported_provider'
  | 'invalid_api_key'
  | 'timeout'
  | 'network_failure'
  | 'provider_unavailable'
  | 'rate_limited'
  | 'malformed_response'
  | 'request_failed';

export interface ProviderError {
  code: ProviderErrorCode;
  message: string;
  provider?: AIProviderName;
  status?: number;
  retryable: boolean;
}

export interface ProviderCompletionSuccess {
  ok: true;
  provider: AIProviderName;
  model: string;
  response: StructuredProviderResponse;
}

export interface ProviderCompletionFailure {
  ok: false;
  error: ProviderError;
}

export type ProviderCompletionResult = ProviderCompletionSuccess | ProviderCompletionFailure;

export interface ProviderManager {
  complete(prompt: string): Promise<string>;
  completeStructured(prompt: string): Promise<ProviderCompletionResult>;
}

export interface ProviderAdapter {
  provider: AIProviderName;
  complete(prompt: string, configuration: ProviderConfiguration): Promise<string | ProviderError>;
}

export interface ProviderRegistration {
  provider: AIProviderName;
  defaultModel: string;
  createAdapter(): ProviderAdapter;
}

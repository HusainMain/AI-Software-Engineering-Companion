import type { AIProviderName, ProviderConfiguration, ProviderConfigurationInput } from './provider-types.js';

const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_RETRIES = 2;

export function loadProviderConfiguration(
  input: ProviderConfigurationInput = {},
  defaultModel?: string,
): ProviderConfiguration | undefined {
  const provider = input.provider ?? readProviderName(process.env.AI_PROVIDER);
  const apiKey = input.apiKey ?? process.env.AI_API_KEY;

  if (provider === undefined || apiKey === undefined || apiKey.trim().length === 0) {
    return undefined;
  }

  return {
    provider,
    model: input.model ?? process.env.AI_MODEL ?? defaultModel ?? '',
    apiKey,
    baseUrl: input.baseUrl ?? process.env.AI_BASE_URL,
    timeoutMs: input.timeoutMs ?? readPositiveInteger(process.env.AI_TIMEOUT_MS, DEFAULT_TIMEOUT_MS),
    maxRetries: input.maxRetries ?? readNonNegativeInteger(process.env.AI_MAX_RETRIES, DEFAULT_MAX_RETRIES),
  };
}

function readProviderName(value: string | undefined): AIProviderName | undefined {
  const trimmed = value?.trim();
  return trimmed !== undefined && trimmed.length > 0 ? trimmed : undefined;
}

function readPositiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function readNonNegativeInteger(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

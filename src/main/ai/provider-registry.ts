import {
  createGeminiAdapter,
  createGroqAdapter,
  createOllamaAdapter,
  createOpenRouterAdapter,
} from './provider-adapters.js';
import type { ProviderHttpTransport } from './provider-http.js';
import type { AIProviderName, ProviderAdapter, ProviderError, ProviderRegistration } from './provider-types.js';

export interface ProviderRegistry {
  resolve(provider: AIProviderName): ProviderAdapter | ProviderError;
  getDefaultModel(provider: AIProviderName): string | undefined;
}

export function createProviderRegistry(transport?: ProviderHttpTransport): ProviderRegistry {
  const registrations = new Map<AIProviderName, ProviderRegistration>([
    [
      'grog',
      {
        provider: 'grog',
        defaultModel: 'llama-3.3-70b-versatile',
        createAdapter: () => createGroqAdapter(transport),
      },
    ],
    [
      'gemini',
      {
        provider: 'gemini',
        defaultModel: 'gemini-2.5-flash',
        createAdapter: () => createGeminiAdapter(transport),
      },
    ],
    [
      'openrouter',
      {
        provider: 'openrouter',
        defaultModel: 'openai/gpt-4.1-mini',
        createAdapter: () => createOpenRouterAdapter(transport),
      },
    ],
    [
      'ollama',
      {
        provider: 'ollama',
        defaultModel: 'llama3.1',
        createAdapter: createOllamaAdapter,
      },
    ],
  ]);

  function resolve(provider: AIProviderName): ProviderAdapter | ProviderError {
    const registration = registrations.get(provider);

    if (registration === undefined) {
      return {
        code: 'unsupported_provider',
        message: `AI provider "${provider}" is not registered.`,
        provider,
        retryable: false,
      };
    }

    return registration.createAdapter();
  }

  function getDefaultModel(provider: AIProviderName): string | undefined {
    return registrations.get(provider)?.defaultModel;
  }

  return { resolve, getDefaultModel };
}

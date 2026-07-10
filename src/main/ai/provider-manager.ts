import { validateStructuredProviderResponse } from './provider-adapters.js';
import { loadProviderConfiguration } from './provider-config.js';
import type { ProviderHttpTransport } from './provider-http.js';
import { createProviderRegistry } from './provider-registry.js';
import type {
  ProviderCompletionResult,
  ProviderConfigurationInput,
  ProviderError,
  ProviderManager,
} from './provider-types.js';

export type { ProviderCompletionResult, ProviderConfigurationInput, ProviderManager } from './provider-types.js';

export interface ProviderManagerDependencies {
  transport?: ProviderHttpTransport;
}

export function createProviderManager(
  configurationInput: ProviderConfigurationInput = {},
  dependencies: ProviderManagerDependencies = {},
): ProviderManager {
  const registry = createProviderRegistry(dependencies.transport);

  async function complete(prompt: string): Promise<string> {
    const result = await completeStructured(prompt);

    if (result.ok) {
      return result.response.message;
    }

    return JSON.stringify({ error: result.error });
  }

  async function completeStructured(prompt: string): Promise<ProviderCompletionResult> {
    const providerName = configurationInput.provider ?? process.env.AI_PROVIDER;
    const defaultModel = providerName === undefined ? undefined : registry.getDefaultModel(providerName);
    const configuration = loadProviderConfiguration(configurationInput, defaultModel);

    if (configuration === undefined) {
      return failure({
        code: 'missing_configuration',
        message: 'AI provider configuration is missing. Set AI_PROVIDER, AI_MODEL, and AI_API_KEY.',
        retryable: false,
      });
    }

    const adapter = registry.resolve(configuration.provider);

    if ('code' in adapter) {
      return failure(adapter);
    }

    const rawResponse = await adapter.complete(prompt, configuration);

    if (typeof rawResponse !== 'string') {
      return failure(rawResponse);
    }

    const validatedResponse = validateStructuredProviderResponse(rawResponse);

    if ('code' in validatedResponse) {
      return failure({
        ...validatedResponse,
        provider: configuration.provider,
      });
    }

    return {
      ok: true,
      provider: configuration.provider,
      model: configuration.model,
      response: validatedResponse,
    };
  }

  return { complete, completeStructured };
}

function failure(error: ProviderError): ProviderCompletionResult {
  return {
    ok: false,
    error,
  };
}

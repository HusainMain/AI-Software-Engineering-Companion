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

const isDevelopment = process.env.NODE_ENV === 'development';

function debugLog(...args: unknown[]): void {
  if (isDevelopment) {
    console.log('[DEBUG]', ...args);
  }
}

export type { ProviderCompletionResult, ProviderConfigurationInput, ProviderManager } from './provider-types.js';

export interface ProviderManagerDependencies {
  transport?: ProviderHttpTransport;
}

export function createProviderManager(
  configurationInput: ProviderConfigurationInput = {},
  dependencies: ProviderManagerDependencies = {},
): ProviderManager {
  const registry = createProviderRegistry(dependencies.transport);

  async function complete(prompt: string, signal?: AbortSignal): Promise<string> {
    debugLog('ProviderManager.complete -> prompt length:', prompt.length);
    const result = await completeStructured(prompt, signal);
    debugLog('ProviderManager.complete -> result ok:', result.ok);

    if (result.ok) {
      return result.response.recommendation;
    }

    return JSON.stringify({ error: result.error });
  }

  async function completeStructured(prompt: string, signal?: AbortSignal): Promise<ProviderCompletionResult> {
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

    debugLog('ProviderManager.completeStructured -> provider:', configuration.provider, 'model:', configuration.model);
    debugLog('ProviderManager.completeStructured -> prompt length:', prompt.length);

    const adapter = registry.resolve(configuration.provider);

    if ('code' in adapter) {
      return failure(adapter);
    }

    debugLog('ProviderManager.completeStructured -> calling adapter.complete');
    const rawResponse = await adapter.complete(prompt, configuration, signal);

    debugLog('ProviderManager.completeStructured -> adapter response type:', typeof rawResponse);
    if (typeof rawResponse !== 'string') {
      debugLog('ProviderManager.completeStructured -> adapter returned error:', rawResponse);
      return failure(rawResponse);
    }

    debugLog('ProviderManager.completeStructured -> raw response length:', rawResponse.length);
    debugLog('ProviderManager.completeStructured -> raw response preview:', rawResponse.substring(0, 200));

    const validatedResponse = validateStructuredProviderResponse(rawResponse);

    if ('code' in validatedResponse) {
      debugLog('ProviderManager.completeStructured -> validation failed:', validatedResponse);
      return failure({
        ...validatedResponse,
        provider: configuration.provider,
      });
    }

    debugLog('ProviderManager.completeStructured -> validation passed');
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

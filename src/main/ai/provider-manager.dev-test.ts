import { createProviderManager } from './provider-manager.js';
import type { ProviderHttpTransport } from './provider-http.js';
import type { ProviderConfigurationInput } from './provider-types.js';

async function runProviderDeveloperTest(): Promise<void> {
  const provider = readProviderName(process.env.AI_PROVIDER) ?? 'gemini';
  const hasRealCredentials = process.env.AI_API_KEY !== undefined && process.env.AI_API_KEY.trim().length > 0;
  const configuration: ProviderConfigurationInput = {
    provider,
    model: process.env.AI_MODEL,
    apiKey: hasRealCredentials ? process.env.AI_API_KEY : 'developer-test-key',
    timeoutMs: 5_000,
    maxRetries: 1,
  };

  const providerManager = createProviderManager(configuration, hasRealCredentials ? {} : { transport: mockTransport });
  const result = await providerManager.completeStructured(
    'Reply with a concise confirmation that the provider integration contract is valid.',
  );

  if (!result.ok) {
    throw new Error(`Provider developer test failed: ${result.error.code} - ${result.error.message}`);
  }

  if (result.response.recommendation.trim().length === 0) {
    throw new Error('Provider developer test failed: recommendation was empty.');
  }

  console.log(
    `Provider developer test passed (${hasRealCredentials ? 'real provider' : 'mock transport'}: ${result.provider}/${result.model}).`,
  );
}

const mockTransport: ProviderHttpTransport = ({
  url,
}) => {
  if (url.includes('/chat/completions')) {
    return Promise.resolve({
      status: 200,
      body: {
        choices: [
          {
            message: {
              content: JSON.stringify({
                recommendation: 'Provider contract is valid.',
                reasoning: 'The mock OpenRouter envelope returned structured JSON.',
                confidence: 1,
                alternatives: [],
                tradeOffs: [],
                followUps: [],
              }),
            },
          },
        ],
      },
    });
  }

  return Promise.resolve({
    status: 200,
    body: {
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  recommendation: 'Provider contract is valid.',
                  reasoning: 'The mock Gemini envelope returned structured JSON.',
                  confidence: 1,
                  alternatives: [],
                  tradeOffs: [],
                  followUps: [],
                }),
              },
            ],
          },
        },
      ],
    },
  });
};

function readProviderName(value: string | undefined): ProviderConfigurationInput['provider'] | undefined {
  if (value === 'gemini' || value === 'openrouter' || value === 'ollama' || value === 'grog') {
    return value;
  }

  return undefined;
}

void runProviderDeveloperTest().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

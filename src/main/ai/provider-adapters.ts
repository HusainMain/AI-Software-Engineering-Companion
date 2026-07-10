import { classifyHttpStatus, postJson, type ProviderHttpTransport } from './provider-http.js';
import type { AIProviderName, ProviderAdapter, ProviderError, StructuredProviderResponse } from './provider-types.js';

export function buildStructuredResponsePrompt(prompt: string): string {
  return [
    'Return only valid JSON. Do not use Markdown fences or explanatory text.',
    'The JSON object must match this shape:',
    '{"message":"string","reasoning":"string","confidence":0.0,"followUps":["string"]}',
    'Use confidence as a number from 0 to 1. Use followUps as an empty array when none are needed.',
    '',
    'Developer prompt:',
    prompt,
  ].join('\n');
}

export function validateStructuredProviderResponse(rawResponse: string): StructuredProviderResponse | ProviderError {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawResponse);
  } catch {
    return {
      code: 'malformed_response',
      message: 'The provider did not return valid JSON.',
      retryable: false,
    };
  }

  if (!isRecord(parsed)) {
    return malformed('The provider JSON response must be an object.');
  }

  if (typeof parsed.message !== 'string' || parsed.message.trim().length === 0) {
    return malformed('The provider JSON response must include a non-empty message string.');
  }

  if (parsed.reasoning !== undefined && typeof parsed.reasoning !== 'string') {
    return malformed('The provider JSON response reasoning field must be a string when present.');
  }

  if (
    parsed.confidence !== undefined &&
    (typeof parsed.confidence !== 'number' || parsed.confidence < 0 || parsed.confidence > 1)
  ) {
    return malformed('The provider JSON response confidence field must be a number from 0 to 1.');
  }

  if (
    parsed.followUps !== undefined &&
    (!Array.isArray(parsed.followUps) || parsed.followUps.some((item) => typeof item !== 'string'))
  ) {
    return malformed('The provider JSON response followUps field must be an array of strings when present.');
  }

  return {
    message: parsed.message,
    reasoning: parsed.reasoning,
    confidence: parsed.confidence,
    followUps: parsed.followUps,
  };
}

export function createGeminiAdapter(transport?: ProviderHttpTransport): ProviderAdapter {
  return {
    provider: 'gemini',
    async complete(prompt, configuration) {
      const baseUrl = configuration.baseUrl ?? 'https://generativelanguage.googleapis.com/v1beta';
      const url = `${baseUrl}/models/${encodeURIComponent(configuration.model)}:generateContent`;
      const response = await postJson(
        {
          url,
          provider: 'gemini',
          timeoutMs: configuration.timeoutMs,
          maxRetries: configuration.maxRetries,
          headers: {
            'x-goog-api-key': configuration.apiKey,
          },
          body: {
            contents: [
              {
                role: 'user',
                parts: [{ text: buildStructuredResponsePrompt(prompt) }],
              },
            ],
            generationConfig: {
              responseMimeType: 'application/json',
            },
          },
        },
        transport,
      );

      if ('code' in response) {
        return response;
      }

      const statusError = classifyHttpStatus(response.status, 'gemini');
      if (statusError !== undefined) {
        return statusError;
      }

      return parseGeminiText(response.body);
    },
  };
}

export function createOpenRouterAdapter(transport?: ProviderHttpTransport): ProviderAdapter {
  return {
    provider: 'openrouter',
    async complete(prompt, configuration) {
      const baseUrl = configuration.baseUrl ?? 'https://openrouter.ai/api/v1';
      const response = await postJson(
        {
          url: `${baseUrl}/chat/completions`,
          provider: 'openrouter',
          timeoutMs: configuration.timeoutMs,
          maxRetries: configuration.maxRetries,
          headers: {
            Authorization: `Bearer ${configuration.apiKey}`,
            'HTTP-Referer': 'https://local.ai-software-engineering-companion',
            'X-Title': 'AI Software Engineering Companion',
          },
          body: {
            model: configuration.model,
            messages: [{ role: 'user', content: buildStructuredResponsePrompt(prompt) }],
            response_format: { type: 'json_object' },
          },
        },
        transport,
      );

      if ('code' in response) {
        return response;
      }

      const statusError = classifyHttpStatus(response.status, 'openrouter');
      if (statusError !== undefined) {
        return statusError;
      }

      return parseOpenRouterText(response.body);
    },
  };
}

export function createOllamaAdapter(): ProviderAdapter {
  return {
    provider: 'ollama',
    complete() {
      return Promise.resolve({
        code: 'unsupported_provider',
        message: 'Ollama is reserved as a future provider and is not implemented in Milestone 2A.',
        provider: 'ollama',
        retryable: false,
      });
    },
  };
}

function parseGeminiText(body: unknown): string | ProviderError {
  if (!isRecord(body) || !Array.isArray(body.candidates)) {
    return malformed('Gemini returned an unexpected response envelope.', 'gemini');
  }

  const candidates: unknown[] = body.candidates;
  const firstCandidate = candidates[0];
  if (!isRecord(firstCandidate) || !isRecord(firstCandidate.content) || !Array.isArray(firstCandidate.content.parts)) {
    return malformed('Gemini returned no candidate text.', 'gemini');
  }

  const parts: unknown[] = firstCandidate.content.parts;
  const text = parts
    .filter(isRecord)
    .map((part) => part.text)
    .filter((value): value is string => typeof value === 'string')
    .join('');

  return text.trim().length > 0 ? text : malformed('Gemini returned an empty response.', 'gemini');
}

function parseOpenRouterText(body: unknown): string | ProviderError {
  if (!isRecord(body) || !Array.isArray(body.choices)) {
    return malformed('OpenRouter returned an unexpected response envelope.', 'openrouter');
  }

  const choices: unknown[] = body.choices;
  const firstChoice = choices[0];
  if (!isRecord(firstChoice) || !isRecord(firstChoice.message)) {
    return malformed('OpenRouter returned no message content.', 'openrouter');
  }

  const content = firstChoice.message.content;

  if (typeof content === 'string') {
    return content;
  }

  return malformed('OpenRouter returned non-string message content.', 'openrouter');
}

function malformed(message: string, provider?: AIProviderName): ProviderError {
  return {
    code: 'malformed_response',
    message,
    provider,
    retryable: false,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

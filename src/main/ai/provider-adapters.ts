import { classifyHttpStatus, postJson, type ProviderHttpTransport } from './provider-http.js';
import type { AIProviderName, ProviderAdapter, ProviderError, StructuredProviderResponse } from './provider-types.js';

const isDevelopment = process.env.NODE_ENV === 'development';

function debugLog(...args: unknown[]): void {
  if (isDevelopment) {
    console.log('[DEBUG]', ...args);
  }
}

function extractJsonObject(text: string): string | null {
  const start = text.indexOf('{');
  if (start === -1) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escapeNext = false;

  for (let i = start; i < text.length; i++) {
    const char = text[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === '\\' && inString) {
      escapeNext = true;
      continue;
    }

    if (char === '"' && !escapeNext) {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === '{') {
        depth++;
      } else if (char === '}') {
        depth--;
        if (depth === 0) {
          return text.slice(start, i + 1);
        }
      }
    }
  }

  return null;
}

function extractJsonFromText(text: string): string | null {
  const trimmed = text.trim();

  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenceMatch) {
    const extracted = extractJsonObject(fenceMatch[1]);
    if (extracted) {
      return extracted;
    }
  }

  const extracted = extractJsonObject(trimmed);
  if (extracted) {
    return extracted;
  }

  return null;
}

export function buildStructuredResponsePrompt(prompt: string): string {
  return [
    'You are an AI software engineering companion. Produce a JSON response that DIRECTLY ANSWERS the user\'s request.',
    '',
    'CRITICAL: The "recommendation" field IS the complete response to the user. It is NOT a summary or plan. It must contain the full answer with all requested formatting.',
    '',
    'For informational questions (explanations, tutorials, comparisons):',
    '- recommendation = the complete answer, fully formatted with Markdown (headings, lists, tables, code blocks, inline code)',
    '',
    'For engineering decision questions (architecture, technology choices, design patterns):',
    '- recommendation = the recommended decision with justification',
    '',
    'The "reasoning" field explains WHY this answer or recommendation was chosen.',
    'The "alternatives" field lists legitimate alternative approaches when applicable.',
    'The "tradeOffs" field explains disadvantages or caveats of the recommendation.',
    'The "followUps" field suggests useful follow-up questions for the user.',
    '',
    'Return ONLY valid JSON. No Markdown fences. No explanatory text.',
    'Schema:',
    '{"recommendation":"string","reasoning":"string","confidence":0.0,"alternatives":["string"],"tradeOffs":["string"],"followUps":["string"]}',
    'Confidence must be a number 0-1. Use empty arrays when no alternatives/tradeoffs/followups apply.',
    '',
    'User request:',
    prompt,
  ].join('\n');
}

export function validateStructuredProviderResponse(rawResponse: string): StructuredProviderResponse | ProviderError {
  let parsed: unknown;

  debugLog('Provider Adapter -> raw response type:', typeof rawResponse);
  debugLog('Provider Adapter -> raw response (first 300 chars):', rawResponse.substring(0, 300));

  const extractedJson = extractJsonFromText(rawResponse);
  if (!extractedJson) {
    debugLog('Provider Adapter -> JSON extraction failed');
    debugLog('Provider Adapter -> raw response:', rawResponse);
    return {
      code: 'malformed_response',
      message: 'The provider did not return valid JSON.',
      retryable: false,
    };
  }

  try {
    parsed = JSON.parse(extractedJson);
  } catch (error) {
    debugLog('Provider Adapter -> JSON validation failed');
    debugLog('Provider Adapter -> raw response:', rawResponse);
    debugLog('Provider Adapter -> extracted JSON:', extractedJson);
    debugLog('Provider Adapter -> validation error:', error instanceof Error ? error.message : String(error));
    return {
      code: 'malformed_response',
      message: 'The provider did not return valid JSON.',
      retryable: false,
    };
  }

  if (!isRecord(parsed)) {
    return malformed('The provider JSON response must be an object.');
  }

  if (typeof parsed.recommendation !== 'string' || parsed.recommendation.trim().length === 0) {
    return malformed('The provider JSON response must include a non-empty recommendation string.');
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
    parsed.alternatives !== undefined &&
    (!Array.isArray(parsed.alternatives) || parsed.alternatives.some((item) => typeof item !== 'string'))
  ) {
    return malformed('The provider JSON response alternatives field must be an array of strings when present.');
  }

  if (
    parsed.tradeOffs !== undefined &&
    (!Array.isArray(parsed.tradeOffs) || parsed.tradeOffs.some((item) => typeof item !== 'string'))
  ) {
    return malformed('The provider JSON response tradeOffs field must be an array of strings when present.');
  }

  if (
    parsed.followUps !== undefined &&
    (!Array.isArray(parsed.followUps) || parsed.followUps.some((item) => typeof item !== 'string'))
  ) {
    return malformed('The provider JSON response followUps field must be an array of strings when present.');
  }

  return {
    recommendation: parsed.recommendation,
    reasoning: parsed.reasoning,
    confidence: parsed.confidence,
    alternatives: (parsed.alternatives ?? []) as string[],
    tradeOffs: (parsed.tradeOffs ?? []) as string[],
    followUps: parsed.followUps,
  };
}

export function createGeminiAdapter(transport?: ProviderHttpTransport): ProviderAdapter {
  return {
    provider: 'gemini',
    async complete(prompt, configuration, signal) {
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
        signal,
      );

      if ('code' in response) {
        return response;
      }

      const statusError = classifyHttpStatus(response.status, 'gemini');
      if (statusError !== undefined) {
        return statusError;
      }

      const rawResponse = parseGeminiText(response.body);
      debugLog('Provider Adapter -> raw provider response type:', typeof rawResponse);
      debugLog('Provider Adapter -> raw response (first 300 chars):', typeof rawResponse === 'string' ? rawResponse.substring(0, 300) : 'non-string');
      return rawResponse;
    },
  };
}

export function createOpenRouterAdapter(transport?: ProviderHttpTransport): ProviderAdapter {
  return {
    provider: 'openrouter',
    async complete(prompt, configuration, signal) {
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
        signal,
      );

      if ('code' in response) {
        return response;
      }

      const statusError = classifyHttpStatus(response.status, 'openrouter');
      if (statusError !== undefined) {
        return statusError;
      }

      const rawResponse = parseOpenRouterText(response.body);
      return rawResponse;
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
    debugLog('OpenRouter: unexpected response envelope', body);
    return malformed('OpenRouter returned an unexpected response envelope.', 'openrouter');
  }

  const choices: unknown[] = body.choices;
  const firstChoice = choices[0];
  if (!isRecord(firstChoice) || !isRecord(firstChoice.message)) {
    debugLog('OpenRouter: no message content', firstChoice);
    return malformed('OpenRouter returned no message content.', 'openrouter');
  }

  const content = firstChoice.message.content;

  debugLog('OpenRouter raw response body:', body);
  debugLog('OpenRouter content type:', typeof content);
  debugLog('OpenRouter content isArray:', Array.isArray(content));
  debugLog('OpenRouter content value:', content);

  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    const textParts = content
      .filter(isRecord)
      .map((part) => part.text)
      .filter((value): value is string => typeof value === 'string');
    if (textParts.length > 0) {
      return textParts.join('');
    }
  }

  debugLog('OpenRouter: non-string message content', content);
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

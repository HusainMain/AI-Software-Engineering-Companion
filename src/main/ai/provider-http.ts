import type { AIProviderName, ProviderError } from './provider-types.js';

export interface ProviderHttpRequest {
  url: string;
  headers: Record<string, string>;
  body: unknown;
  timeoutMs: number;
  maxRetries: number;
  provider: AIProviderName;
}

export interface ProviderHttpResponse {
  status: number;
  body: unknown;
}

export type ProviderHttpTransport = (
  request: Omit<ProviderHttpRequest, 'timeoutMs' | 'maxRetries' | 'provider'> & { signal: AbortSignal },
) => Promise<ProviderHttpResponse>;

export async function postJson(
  request: ProviderHttpRequest,
  transport: ProviderHttpTransport = fetchJson,
): Promise<ProviderHttpResponse | ProviderError> {
  for (let attempt = 0; attempt <= request.maxRetries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), request.timeoutMs);

    try {
      const response = await transport({
        url: request.url,
        headers: request.headers,
        body: request.body,
        signal: controller.signal,
      });

      if (shouldRetryStatus(response.status) && attempt < request.maxRetries) {
        await delay(retryDelayMs(attempt));
        continue;
      }

      return response;
    } catch (error) {
      const providerError = classifyTransportError(error, request.provider);

      if (providerError.retryable && attempt < request.maxRetries) {
        await delay(retryDelayMs(attempt));
        continue;
      }

      return providerError;
    } finally {
      clearTimeout(timeout);
    }
  }

  return {
    code: 'network_failure',
    message: 'Provider request failed after retries.',
    provider: request.provider,
    retryable: true,
  };
}

export function classifyHttpStatus(status: number, provider: AIProviderName): ProviderError | undefined {
  if (status >= 200 && status < 300) {
    return undefined;
  }

  if (status === 401 || status === 403) {
    return {
      code: 'invalid_api_key',
      message: 'The provider rejected the API key or credentials.',
      provider,
      status,
      retryable: false,
    };
  }

  if (status === 429) {
    return {
      code: 'rate_limited',
      message: 'The provider rate limit was reached.',
      provider,
      status,
      retryable: true,
    };
  }

  if (status >= 500) {
    return {
      code: 'provider_unavailable',
      message: 'The provider is temporarily unavailable.',
      provider,
      status,
      retryable: true,
    };
  }

  return {
    code: 'request_failed',
    message: 'The provider request failed.',
    provider,
    status,
    retryable: status >= 500,
  };
}

async function fetchJson({
  url,
  headers,
  body,
  signal,
}: Omit<ProviderHttpRequest, 'timeoutMs' | 'maxRetries' | 'provider'> & {
  signal: AbortSignal;
}): Promise<ProviderHttpResponse> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal,
  });

  const text = await response.text();

  try {
    return {
      status: response.status,
      body: text.length > 0 ? JSON.parse(text) : undefined,
    };
  } catch {
    return {
      status: response.status,
      body: text,
    };
  }
}

function classifyTransportError(error: unknown, provider: AIProviderName): ProviderError {
  if (error instanceof Error && error.name === 'AbortError') {
    return {
      code: 'timeout',
      message: 'The provider request timed out.',
      provider,
      retryable: true,
    };
  }

  return {
    code: 'network_failure',
    message: 'The provider could not be reached.',
    provider,
    retryable: true,
  };
}

function shouldRetryStatus(status: number): boolean {
  return status === 429 || status === 502 || status === 503 || status === 504 || status >= 500;
}

function retryDelayMs(attempt: number): number {
  return 250 * 2 ** attempt;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Typed fetch wrapper for the newton backend. Injects the bearer token from the
 * auth store, serializes JSON, and throws `ApiError` on non-2xx.
 *
 * Note: we intentionally do NOT auto-clear the session on 401 here — newton's
 * OnboardingGuard returns 401 for not-yet-onboarded users, so clearing would log
 * them out mid-onboarding. Session invalidation is handled by the auth/boot layer.
 */
import {API_BASE_URL} from '../../config/env';
import {useAuthStore} from '../../app/store/authStore';

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** set false to skip the Authorization header (e.g. login, /ptn) */
  auth?: boolean;
  headers?: Record<string, string>;
};

function parse(text: string): unknown {
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text; // some endpoints return a plain string, e.g. "OTP sent!"
  }
}

/**
 * newton error envelope: { timestamp, status_code, error: { message, error } }
 * where `message` is a string or string[] (validation). Pull a human message.
 */
function extractErrorMessage(data: unknown, status: number): string {
  if (data && typeof data === 'object') {
    const inner = (data as {error?: unknown}).error;
    if (inner && typeof inner === 'object') {
      const msg = (inner as {message?: unknown}).message;
      if (Array.isArray(msg)) {
        return msg.join('\n');
      }
      if (typeof msg === 'string') {
        return msg;
      }
    }
    if (typeof inner === 'string') {
      return inner;
    }
    const flat = (data as {message?: unknown}).message;
    if (typeof flat === 'string') {
      return flat;
    }
  }
  return `Request failed (${status})`;
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const {method = 'GET', body, auth = true, headers = {}} = options;
  const token = useAuthStore.getState().token;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth && token ? {Authorization: `Bearer ${token}`} : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = parse(await response.text());

  if (!response.ok) {
    throw new ApiError(
      extractErrorMessage(data, response.status),
      response.status,
      data,
    );
  }

  // newton wraps every response as { statusCode, message, data } (and adds
  // `meta` for paged endpoints). Unwrap to the payload. TODO: expose `meta`
  // when we wire paginated lists.
  if (
    data &&
    typeof data === 'object' &&
    'data' in data &&
    'statusCode' in data
  ) {
    return (data as {data: T}).data;
  }
  return data as T;
}

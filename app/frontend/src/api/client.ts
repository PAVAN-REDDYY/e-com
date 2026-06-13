/**
 * Thin fetch wrapper that gives us:
 *  - one client per microservice (each bound to its own base URL)
 *  - structured errors the UI can render with actionable messages
 *  - network-failure detection that is distinct from HTTP errors (helps debug CORS)
 *
 * This is deliberately framework-free so it can be reused by a v2 mobile app or
 * server component without dragging React along.
 */

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    /** Machine-readable code from the backend, if provided. */
    readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Thrown when the request never reached the server (DNS, CORS, server down). */
export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

async function request<T>(baseUrl: string, path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  const { body, headers, ...rest } = options;

  let response: Response;
  try {
    response = await fetch(url, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (cause) {
    // A thrown fetch (vs a non-2xx response) almost always means the request
    // never completed: server down, wrong VITE_API_BASE_URL, or a CORS block.
    throw new NetworkError(
      `Could not reach the API at ${url}. Check that the backend is running and ` +
        `that VITE_API_BASE_URL / CORS are configured. (${(cause as Error).message})`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await response.json().catch(() => null) : await response.text();

  if (!response.ok) {
    const message =
      (isJson && payload && (payload.detail || payload.message)) ||
      `Request to ${path} failed with status ${response.status}.`;
    const code = isJson && payload ? payload.code : undefined;
    throw new ApiError(message, response.status, code);
  }

  return payload as T;
}

export interface ApiClient {
  get<T>(path: string, options?: RequestOptions): Promise<T>;
  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
  delete<T>(path: string, options?: RequestOptions): Promise<T>;
}

/**
 * Build a client bound to one service's base URL. Each microservice gets its own
 * client (see api/products.ts → catalog, api/orders.ts → orders), which keeps the
 * service boundaries explicit and makes adding per-service concerns (auth, retries)
 * a localised change.
 */
export function createClient(baseUrl: string): ApiClient {
  return {
    get: (path, options) => request(baseUrl, path, { ...options, method: 'GET' }),
    post: (path, body, options) => request(baseUrl, path, { ...options, method: 'POST', body }),
    put: (path, body, options) => request(baseUrl, path, { ...options, method: 'PUT', body }),
    delete: (path, options) => request(baseUrl, path, { ...options, method: 'DELETE' }),
  };
}

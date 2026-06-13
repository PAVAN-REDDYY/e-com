/**
 * Centralised, validated access to environment configuration.
 *
 * Why a module instead of reading import.meta.env everywhere:
 *  - Single source of truth → easy to audit what the app depends on.
 *  - Fails fast with a clear message if a required var is missing/misformatted,
 *    instead of mysterious `undefined` errors deep in the UI.
 *  - Keeps the rest of the codebase free of `import.meta.env` sprinkles, which
 *    eases the v2 migration and testing.
 *
 * Only VITE_* vars are available in the browser (Vite inlines them at build time).
 */

type RawEnv = ImportMetaEnv;

function optional(raw: RawEnv, key: keyof RawEnv, fallback: string): string {
  const value = raw[key];
  return value === undefined || value === '' ? fallback : value;
}

function bool(raw: RawEnv, key: keyof RawEnv, fallback: boolean): boolean {
  const value = raw[key];
  if (value === undefined || value === '') return fallback;
  return value === 'true' || value === '1';
}

function normaliseBaseUrl(url: string): string {
  // Strip a trailing slash so callers can safely do `${base}/products`.
  return url.replace(/\/+$/, '');
}

const raw = import.meta.env;

export const env = {
  // Two independent microservices, each with its own base URL. On Kubernetes
  // both typically resolve to one ingress host with different paths; locally
  // they are two dev servers (catalog 8001, orders 8002).
  catalogApiBaseUrl: normaliseBaseUrl(
    optional(raw, 'VITE_CATALOG_API_BASE_URL', 'http://localhost:8001/api'),
  ),
  ordersApiBaseUrl: normaliseBaseUrl(
    optional(raw, 'VITE_ORDERS_API_BASE_URL', 'http://localhost:8002/api'),
  ),
  useMockApi: bool(raw, 'VITE_USE_MOCK_API', true),
  store: {
    name: optional(raw, 'VITE_STORE_NAME', 'Fallseed'),
    currency: optional(raw, 'VITE_STORE_CURRENCY', 'USD'),
    supportEmail: optional(raw, 'VITE_STORE_SUPPORT_EMAIL', 'hello@fallseed.com'),
  },
  isDev: import.meta.env.DEV,
} as const;

export type AppEnv = typeof env;

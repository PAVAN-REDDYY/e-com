/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CATALOG_API_BASE_URL?: string;
  readonly VITE_ORDERS_API_BASE_URL?: string;
  readonly VITE_USE_MOCK_API?: string;
  readonly VITE_STORE_NAME?: string;
  readonly VITE_STORE_CURRENCY?: string;
  readonly VITE_STORE_SUPPORT_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

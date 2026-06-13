import { env } from '@/config/env';
import { createClient } from './client';
import { MOCK_PRODUCTS } from '@/data/products';
import type { Product, ProductCategory } from '@/types/product';

// Bound to the catalog microservice.
const catalog = createClient(env.catalogApiBaseUrl);

/**
 * Product service. The rest of the app imports from here and never touches the
 * mock data or the HTTP client directly. Flip VITE_USE_MOCK_API to "false" to
 * route every call to the FastAPI backend with zero component changes.
 */

// Simulate latency so loading states are exercised during mock development.
const MOCK_DELAY_MS = 250;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ProductQuery {
  category?: ProductCategory;
}

export async function listProducts(query: ProductQuery = {}): Promise<Product[]> {
  if (env.useMockApi) {
    await delay(MOCK_DELAY_MS);
    return query.category
      ? MOCK_PRODUCTS.filter((p) => p.category === query.category)
      : MOCK_PRODUCTS;
  }

  const params = new URLSearchParams();
  if (query.category) params.set('category', query.category);
  const qs = params.toString();
  return catalog.get<Product[]>(`/products${qs ? `?${qs}` : ''}`);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (env.useMockApi) {
    await delay(MOCK_DELAY_MS);
    return MOCK_PRODUCTS.filter((p) => p.featured);
  }
  return catalog.get<Product[]>('/products?featured=true');
}

export async function getProductBySlug(slug: string): Promise<Product> {
  if (env.useMockApi) {
    await delay(MOCK_DELAY_MS);
    const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
    if (!product) {
      // Mirror the backend's 404 contract so UI handling is identical in both modes.
      throw new Error(`Product "${slug}" was not found.`);
    }
    return product;
  }
  return catalog.get<Product>(`/products/${slug}`);
}

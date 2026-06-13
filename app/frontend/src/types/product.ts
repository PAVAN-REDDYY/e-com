/**
 * Domain types for the catalogue. These mirror the contract the FastAPI backend
 * will expose, so the frontend can switch from mock data to the real API with no
 * component changes. Keep these in sync with the backend Pydantic schemas in v2.
 */

/** Product categories. Open-ended by design — new categories ship in future releases. */
export type ProductCategory = 'tshirts' | 'shirts' | 'hoodies' | 'jackets';

export interface ProductSize {
  /** e.g. "S", "M", "L", "XL" */
  label: string;
  /** Whether this size is currently purchasable. */
  inStock: boolean;
}

export interface ProductImage {
  url: string;
  alt: string;
}

export interface Product {
  /** Stable identifier (slug-friendly). */
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  /** Short marketing line shown on cards. */
  tagline: string;
  /** Long description shown on the product page. */
  description: string;
  /** Price in integer minor units (cents) to avoid float errors. */
  priceCents: number;
  currency: string;
  images: ProductImage[];
  sizes: ProductSize[];
  /** Surface badges like "New" or "Last few". */
  badge?: string;
  /** Featured products appear on the home page. */
  featured?: boolean;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  tshirts: 'T-Shirts',
  shirts: 'Shirts',
  hoodies: 'Hoodies',
  jackets: 'Jackets',
};

/** Ordered list used to render filters/nav consistently. */
export const CATEGORY_ORDER: ProductCategory[] = ['tshirts', 'shirts', 'hoodies', 'jackets'];

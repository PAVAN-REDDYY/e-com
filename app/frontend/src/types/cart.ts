import type { Product } from './product';

/** A single line in the cart: a product + chosen size + quantity. */
export interface CartItem {
  /** Composite key: `${productId}:${size}` — lets the same product appear in two sizes. */
  key: string;
  product: Product;
  size: string;
  quantity: number;
}

export interface CartTotals {
  itemCount: number;
  subtotalCents: number;
  /** Shipping is computed at checkout; kept here for a single totals shape. */
  shippingCents: number;
  totalCents: number;
}

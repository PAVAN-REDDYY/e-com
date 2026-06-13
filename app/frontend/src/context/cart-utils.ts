import type { CartItem, CartTotals } from '@/types/cart';

/** Free shipping over this threshold; otherwise a flat fee. Tune per business rules. */
export const FREE_SHIPPING_THRESHOLD_CENTS = 15000;
export const FLAT_SHIPPING_CENTS = 700;

export function lineKey(productId: string, size: string): string {
  return `${productId}:${size}`;
}

export function computeTotals(items: CartItem[]): CartTotals {
  const subtotalCents = items.reduce(
    (sum, item) => sum + item.product.priceCents * item.quantity,
    0,
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const shippingCents =
    subtotalCents === 0 || subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS
      ? 0
      : FLAT_SHIPPING_CENTS;

  return {
    itemCount,
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
  };
}

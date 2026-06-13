import { env } from '@/config/env';

/**
 * Money is stored as integer minor units (cents) everywhere in the app to avoid
 * floating-point rounding bugs. Format only at the display boundary.
 */
export function formatMoney(amountInCents: number, currency = env.store.currency): string {
  const amount = amountInCents / 100;
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
    }).format(amount);
  } catch {
    // Fallback if an unsupported currency code is configured.
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/** Capitalise the first letter — used for category labels etc. */
export function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

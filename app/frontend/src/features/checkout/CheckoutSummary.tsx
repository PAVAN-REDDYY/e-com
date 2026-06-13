import type { CartItem, CartTotals } from '@/types/cart';
import { formatMoney } from '@/lib/format';
import { Button } from '@/components/ui/Button';

interface CheckoutSummaryProps {
  items: CartItem[];
  totals: CartTotals;
  submitting: boolean;
  /** Submit error surfaced from the order API (network/CORS/server). */
  submitError?: string | null;
}

/** Right-rail order summary + place-order button. Submits the parent form by id. */
export function CheckoutSummary({ items, totals, submitting, submitError }: CheckoutSummaryProps) {
  return (
    <aside className="h-fit surface p-6 lg:sticky lg:top-24">
      <h2 className="text-lg font-semibold text-ink">Order summary</h2>

      <ul className="mt-5 space-y-4">
        {items.map((item) => (
          <li key={item.key} className="flex gap-3">
            <img
              src={item.product.images[0]?.url}
              alt={item.product.name}
              className="h-16 w-14 rounded-lg object-cover"
            />
            <div className="flex flex-1 justify-between">
              <div className="text-sm">
                <p className="font-medium text-ink">{item.product.name}</p>
                <p className="text-stone-500">
                  Size {item.size} · Qty {item.quantity}
                </p>
              </div>
              <p className="text-sm font-medium tabular-nums">
                {formatMoney(item.product.priceCents * item.quantity)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-5 space-y-3 border-t border-stone-200 pt-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-stone-500">Subtotal</dt>
          <dd className="font-medium tabular-nums">{formatMoney(totals.subtotalCents)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-stone-500">Shipping</dt>
          <dd className="font-medium tabular-nums">
            {totals.shippingCents === 0 ? 'Free' : formatMoney(totals.shippingCents)}
          </dd>
        </div>
        <div className="flex justify-between border-t border-stone-200 pt-3 text-base">
          <dt className="font-semibold">Total</dt>
          <dd className="font-semibold tabular-nums">{formatMoney(totals.totalCents)}</dd>
        </div>
      </dl>

      {submitError && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p>
      )}

      <Button type="submit" form="checkout-form" fullWidth size="lg" loading={submitting} className="mt-6">
        {submitting ? 'Placing order…' : 'Place order'}
      </Button>
      <p className="mt-3 text-center text-xs text-stone-400">
        This is a demo checkout — no real payment is taken.
      </p>
    </aside>
  );
}

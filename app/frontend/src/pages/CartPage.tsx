import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { formatMoney } from '@/lib/format';
import { CartItemRow } from '@/components/cart/CartItemRow';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export function CartPage() {
  const { items, totals, clear } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container-content py-12">
        <EmptyState
          title="Your cart is empty"
          description="Browse the collection and add something you'll keep for years."
          icon="🧺"
          action={
            <Link to="/shop">
              <Button>Shop the collection</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-content py-12">
      <h1 className="mb-8 text-3xl font-semibold text-ink">Your cart</h1>

      <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <div>
          <div className="divide-y divide-stone-200 border-y border-stone-200">
            {items.map((item) => (
              <CartItemRow key={item.key} item={item} />
            ))}
          </div>
          <button
            onClick={clear}
            className="mt-4 text-sm text-stone-400 hover:text-red-600 hover:underline"
          >
            Clear cart
          </button>
        </div>

        {/* Summary */}
        <aside className="h-fit surface p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold text-ink">Order summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
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

          <Button fullWidth size="lg" className="mt-6" onClick={() => navigate('/checkout')}>
            Proceed to checkout
          </Button>
          <Link
            to="/shop"
            className="mt-4 block text-center text-sm text-stone-500 hover:text-clay"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

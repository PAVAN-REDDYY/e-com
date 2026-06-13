import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { formatMoney } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { CartItemRow } from './CartItemRow';
import { FREE_SHIPPING_THRESHOLD_CENTS } from '@/context/cart-utils';

/**
 * Slide-over cart. Driven entirely by cart context (`isOpen`), so any
 * "add to cart" anywhere in the app opens it. Closes on Escape and locks body
 * scroll while open for a polished feel.
 */
export function CartDrawer() {
  const { isOpen, closeCart, items, totals } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeCart();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeCart]);

  const goToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD_CENTS - totals.subtotalCents;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-ink/30 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeCart}
        aria-hidden
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-bone shadow-xl transition-transform duration-300 ease-soft ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
          <h2 className="text-lg font-semibold">Your cart ({totals.itemCount})</h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="text-2xl leading-none text-stone-400 hover:text-ink"
          >
            ×
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-3xl">🧺</p>
            <p className="font-medium text-ink">Your cart is empty</p>
            <p className="text-sm text-stone-500">Add something you'll wear for years.</p>
            <Button variant="secondary" size="sm" onClick={closeCart} className="mt-2">
              Continue shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-stone-200 overflow-y-auto px-6">
              {items.map((item) => (
                <CartItemRow key={item.key} item={item} compact />
              ))}
            </div>

            <footer className="border-t border-stone-200 px-6 py-5">
              {remainingForFreeShipping > 0 ? (
                <p className="mb-3 text-center text-xs text-stone-500">
                  Add {formatMoney(remainingForFreeShipping)} more for free shipping.
                </p>
              ) : (
                <p className="mb-3 text-center text-xs text-moss">You've unlocked free shipping 🎉</p>
              )}
              <div className="mb-4 flex items-center justify-between">
                <span className="text-stone-600">Subtotal</span>
                <span className="text-lg font-semibold tabular-nums">
                  {formatMoney(totals.subtotalCents)}
                </span>
              </div>
              <Button fullWidth size="lg" onClick={goToCheckout}>
                Checkout
              </Button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}

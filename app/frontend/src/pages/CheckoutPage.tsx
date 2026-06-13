import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { createOrder } from '@/api/orders';
import { ApiError, NetworkError } from '@/api/client';
import type { Address, DeliveryMode, GiftDetails } from '@/types/order';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { DeliveryModeToggle } from '@/features/checkout/DeliveryModeToggle';
import { AddressFields } from '@/features/checkout/AddressFields';
import { GiftFields } from '@/features/checkout/GiftFields';
import { CheckoutSummary } from '@/features/checkout/CheckoutSummary';
import {
  EMPTY_ADDRESS,
  EMPTY_GIFT,
  hasErrors,
  validateCheckout,
  type CheckoutErrors,
} from '@/features/checkout/validation';

/**
 * Checkout. Holds the form state and delegates each section to a focused
 * component. On submit it validates locally, builds the API payload, and posts
 * to the order service — translating any API/network error into a clear message.
 */
export function CheckoutPage() {
  const { items, totals, clear } = useCart();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('self');
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS);
  const [gift, setGift] = useState<GiftDetails>(EMPTY_GIFT);

  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="container-content py-12">
        <EmptyState
          title="Your cart is empty"
          description="Add something before heading to checkout."
          icon="🛒"
          action={
            <Link to="/shop">
              <Button>Back to shop</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const nextErrors = validateCheckout({ email, deliveryMode, address, gift });
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      // Move focus to the first invalid field for accessibility.
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const order = await createOrder({
        contact: { email },
        deliveryMode,
        shippingAddress: address,
        gift: deliveryMode === 'gift' ? gift : undefined,
        items: items.map((item) => ({
          productId: item.product.id,
          size: item.size,
          quantity: item.quantity,
        })),
      });

      clear();
      navigate(`/order/${order.id}`, {
        state: { deliveryMode, recipientName: gift.recipientName, email },
      });
    } catch (err) {
      // Translate each failure class into something the shopper can act on.
      if (err instanceof NetworkError) {
        setSubmitError(
          "We couldn't reach our servers. Check your connection and try again — your cart is safe.",
        );
      } else if (err instanceof ApiError) {
        setSubmitError(err.message);
      } else {
        setSubmitError('Something unexpected happened while placing your order. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-content py-12">
      <h1 className="mb-8 text-3xl font-semibold text-ink">Checkout</h1>

      <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-10" noValidate>
          {/* Contact */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-ink">Contact</h2>
            <Input
              label="Email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              error={errors.email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </section>

          {/* Delivery mode */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-ink">Delivery</h2>
            <DeliveryModeToggle value={deliveryMode} onChange={setDeliveryMode} />
          </section>

          {/* Gift details (conditional) */}
          {deliveryMode === 'gift' && (
            <section>
              <GiftFields value={gift} errors={errors} onChange={(patch) => setGift((g) => ({ ...g, ...patch }))} />
            </section>
          )}

          {/* Shipping address */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-ink">
              {deliveryMode === 'gift' ? 'Ship to recipient' : 'Shipping address'}
            </h2>
            <AddressFields
              value={address}
              errors={errors}
              deliveryMode={deliveryMode}
              onChange={(patch) => setAddress((a) => ({ ...a, ...patch }))}
            />
          </section>
        </form>

        <CheckoutSummary
          items={items}
          totals={totals}
          submitting={submitting}
          submitError={submitError}
        />
      </div>
    </div>
  );
}

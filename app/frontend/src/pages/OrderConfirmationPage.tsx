import { Link, useLocation, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import type { DeliveryMode } from '@/types/order';
import { env } from '@/config/env';

interface ConfirmationState {
  deliveryMode?: DeliveryMode;
  recipientName?: string;
  email?: string;
}

/**
 * Post-checkout thank-you. Reads light context passed via router state so it can
 * tailor the message for gift orders without another API round-trip.
 */
export function OrderConfirmationPage() {
  const { orderId } = useParams();
  const { state } = useLocation();
  const { deliveryMode, recipientName, email } = (state as ConfirmationState) ?? {};

  const isGift = deliveryMode === 'gift';

  return (
    <div className="container-content flex flex-col items-center py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-moss/15 text-3xl">
        ✓
      </span>
      <h1 className="mt-6 text-3xl font-semibold text-ink">Thank you — order confirmed</h1>
      <p className="mt-3 max-w-md text-stone-500">
        {isGift && recipientName
          ? `We're getting your gift ready for ${recipientName}. We'll keep the prices off the packing slip.`
          : 'We’re getting your order ready. A confirmation is on its way.'}
      </p>

      <div className="mt-8 surface px-8 py-6">
        <p className="text-sm text-stone-500">Order number</p>
        <p className="mt-1 text-xl font-semibold tracking-wide text-ink">{orderId}</p>
        {email && (
          <p className="mt-3 text-sm text-stone-500">
            A receipt was sent to <span className="text-ink">{email}</span>.
          </p>
        )}
      </div>

      <p className="mt-6 text-sm text-stone-400">
        Questions? Email{' '}
        <a href={`mailto:${env.store.supportEmail}`} className="text-clay hover:underline">
          {env.store.supportEmail}
        </a>
      </p>

      <Link to="/shop" className="mt-8">
        <Button size="lg" variant="secondary">
          Continue shopping
        </Button>
      </Link>
    </div>
  );
}

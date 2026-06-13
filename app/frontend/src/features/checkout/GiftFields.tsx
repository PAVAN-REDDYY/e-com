import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import type { GiftDetails } from '@/types/order';
import type { CheckoutErrors } from './validation';

interface GiftFieldsProps {
  value: GiftDetails;
  errors: CheckoutErrors;
  onChange: (patch: Partial<GiftDetails>) => void;
}

const MESSAGE_MAX = 200;

/** Gift-specific fields: who it's from/to, a message, and the hide-prices toggle. */
export function GiftFields({ value, errors, onChange }: GiftFieldsProps) {
  return (
    <div className="grid gap-4 rounded-2xl border border-clay/30 bg-clay/5 p-5">
      <p className="text-sm font-medium text-stone-700">🎁 Gift details</p>

      <Input
        label="Who is it from?"
        placeholder="e.g. Pavan"
        required
        value={value.recipientName}
        error={errors['gift.recipientName']}
        onChange={(e) => onChange({ recipientName: e.target.value })}
      />

      <Textarea
        label="Gift message (optional)"
        placeholder="Add a personal note — we'll print it on the card."
        maxLength={MESSAGE_MAX}
        hint={`${value.message?.length ?? 0}/${MESSAGE_MAX} characters`}
        value={value.message ?? ''}
        onChange={(e) => onChange({ message: e.target.value })}
      />

      <label className="flex cursor-pointer items-center gap-3 text-sm text-stone-700">
        <input
          type="checkbox"
          checked={value.hidePrices}
          onChange={(e) => onChange({ hidePrices: e.target.checked })}
          className="h-4 w-4 rounded border-stone-300 text-clay focus:ring-clay"
        />
        Hide prices on the packing slip
      </label>
    </div>
  );
}

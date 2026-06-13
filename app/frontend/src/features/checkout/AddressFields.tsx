import { Input } from '@/components/ui/Input';
import type { Address, DeliveryMode } from '@/types/order';
import type { CheckoutErrors } from './validation';

interface AddressFieldsProps {
  value: Address;
  errors: CheckoutErrors;
  deliveryMode: DeliveryMode;
  onChange: (patch: Partial<Address>) => void;
}

/** Shipping address form. Label adapts to whether the order is a gift. */
export function AddressFields({ value, errors, deliveryMode, onChange }: AddressFieldsProps) {
  const nameLabel = deliveryMode === 'gift' ? "Recipient's full name" : 'Full name';

  return (
    <div className="grid gap-4">
      <Input
        label={nameLabel}
        required
        autoComplete="name"
        value={value.fullName}
        error={errors['address.fullName']}
        onChange={(e) => onChange({ fullName: e.target.value })}
      />
      <Input
        label="Street address"
        required
        autoComplete="address-line1"
        value={value.line1}
        error={errors['address.line1']}
        onChange={(e) => onChange({ line1: e.target.value })}
      />
      <Input
        label="Apartment, suite, etc. (optional)"
        autoComplete="address-line2"
        value={value.line2 ?? ''}
        onChange={(e) => onChange({ line2: e.target.value })}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="City"
          required
          autoComplete="address-level2"
          value={value.city}
          error={errors['address.city']}
          onChange={(e) => onChange({ city: e.target.value })}
        />
        <Input
          label="State / region"
          required
          autoComplete="address-level1"
          value={value.state}
          error={errors['address.state']}
          onChange={(e) => onChange({ state: e.target.value })}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Postal code"
          required
          autoComplete="postal-code"
          value={value.postalCode}
          error={errors['address.postalCode']}
          onChange={(e) => onChange({ postalCode: e.target.value })}
        />
        <Input
          label="Country"
          required
          autoComplete="country-name"
          value={value.country}
          error={errors['address.country']}
          onChange={(e) => onChange({ country: e.target.value })}
        />
      </div>
      <Input
        label="Phone (optional)"
        type="tel"
        autoComplete="tel"
        value={value.phone ?? ''}
        onChange={(e) => onChange({ phone: e.target.value })}
      />
    </div>
  );
}

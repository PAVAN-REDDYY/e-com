import type { Address, DeliveryMode, GiftDetails } from '@/types/order';

/**
 * Pure, framework-free validation for the checkout form. Returns a map of
 * field → error message (empty map = valid). Kept separate from the component so
 * it is trivially unit-testable and reusable by the backend's contract in v2.
 */

export interface CheckoutFormState {
  email: string;
  deliveryMode: DeliveryMode;
  address: Address;
  gift: GiftDetails;
}

export type CheckoutErrors = Partial<{
  email: string;
  'address.fullName': string;
  'address.line1': string;
  'address.city': string;
  'address.state': string;
  'address.postalCode': string;
  'address.country': string;
  'gift.recipientName': string;
}>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCheckout(state: CheckoutFormState): CheckoutErrors {
  const errors: CheckoutErrors = {};

  if (!state.email.trim()) errors.email = 'Email is required.';
  else if (!EMAIL_RE.test(state.email)) errors.email = 'Enter a valid email address.';

  const a = state.address;
  if (!a.fullName.trim()) errors['address.fullName'] = 'Recipient name is required.';
  if (!a.line1.trim()) errors['address.line1'] = 'Street address is required.';
  if (!a.city.trim()) errors['address.city'] = 'City is required.';
  if (!a.state.trim()) errors['address.state'] = 'State / region is required.';
  if (!a.postalCode.trim()) errors['address.postalCode'] = 'Postal code is required.';
  if (!a.country.trim()) errors['address.country'] = 'Country is required.';

  if (state.deliveryMode === 'gift' && !state.gift.recipientName.trim()) {
    errors['gift.recipientName'] = "Recipient's name is required for a gift.";
  }

  return errors;
}

export function hasErrors(errors: CheckoutErrors): boolean {
  return Object.keys(errors).length > 0;
}

export const EMPTY_ADDRESS: Address = {
  fullName: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  phone: '',
};

export const EMPTY_GIFT: GiftDetails = {
  recipientName: '',
  message: '',
  hidePrices: true,
};

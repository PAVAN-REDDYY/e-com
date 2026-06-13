/**
 * Delivery mode is the crux of the checkout flow:
 *  - "self"  → ship to the buyer.
 *  - "gift"  → ship to a recipient, optionally with a gift message and hidden prices.
 */
export type DeliveryMode = 'self' | 'gift';

export interface Address {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface GiftDetails {
  recipientName: string;
  message?: string;
  /** Hide prices on the packing slip when sending as a gift. */
  hidePrices: boolean;
}

export interface CheckoutContact {
  email: string;
}

/** Payload posted to the backend `POST /orders` endpoint. */
export interface CreateOrderRequest {
  contact: CheckoutContact;
  deliveryMode: DeliveryMode;
  shippingAddress: Address;
  gift?: GiftDetails;
  items: Array<{
    productId: string;
    size: string;
    quantity: number;
  }>;
}

/** A priced line on a confirmed order (snapshot taken at purchase time). */
export interface OrderLineItem {
  productId: string;
  name: string;
  size: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
}

/** Mirrors the order-service `OrderRead` response. */
export interface Order {
  id: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  deliveryMode: DeliveryMode;
  email?: string;
  currency: string;
  subtotalCents?: number;
  shippingCents?: number;
  totalCents: number;
  items: OrderLineItem[];
  gift?: GiftDetails;
  createdAt: string;
}

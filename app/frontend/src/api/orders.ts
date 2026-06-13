import { env } from '@/config/env';
import { createClient } from './client';
import type { CreateOrderRequest, Order } from '@/types/order';

// Bound to the orders microservice.
const orders = createClient(env.ordersApiBaseUrl);

/**
 * Order service. In mock mode it fabricates a confirmed order so the full
 * checkout flow is demoable end-to-end before the backend exists.
 */

const MOCK_DELAY_MS = 600;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function createOrder(payload: CreateOrderRequest): Promise<Order> {
  if (env.useMockApi) {
    await delay(MOCK_DELAY_MS);
    return {
      id: `FS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      status: 'confirmed',
      deliveryMode: payload.deliveryMode,
      items: [],
      totalCents: 0,
      currency: env.store.currency,
      createdAt: new Date().toISOString(),
    };
  }
  return orders.post<Order>('/orders', payload);
}

import { createContext } from 'react';
import type { CartItem, CartTotals } from '@/types/cart';
import type { Product } from '@/types/product';

/**
 * The context object lives in its own file (separate from the Provider component)
 * so fast-refresh stays happy and consumers can import the type without pulling
 * in the provider implementation.
 */
export interface CartContextValue {
  items: CartItem[];
  totals: CartTotals;
  /** Drawer open/close state lives with the cart for a single source of truth. */
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, size: string, quantity?: number) => void;
  removeItem: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

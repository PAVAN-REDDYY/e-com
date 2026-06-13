import { useContext } from 'react';
import { CartContext, type CartContextValue } from '@/context/cart-context';

/** Typed cart accessor that throws a clear error if used outside the provider. */
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a <CartProvider>. Check your component tree.');
  }
  return ctx;
}

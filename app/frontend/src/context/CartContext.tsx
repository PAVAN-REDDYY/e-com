import { useCallback, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import type { CartItem } from '@/types/cart';
import type { Product } from '@/types/product';
import { CartContext, type CartContextValue } from './cart-context';
import { computeTotals, lineKey } from './cart-utils';

const STORAGE_KEY = 'fallseed.cart.v1';

type Action =
  | { type: 'ADD'; product: Product; size: string; quantity: number }
  | { type: 'REMOVE'; key: string }
  | { type: 'SET_QTY'; key: string; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; items: CartItem[] };

function cartReducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case 'ADD': {
      const key = lineKey(action.product.id, action.size);
      const existing = state.find((item) => item.key === key);
      if (existing) {
        return state.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + action.quantity } : item,
        );
      }
      return [
        ...state,
        { key, product: action.product, size: action.size, quantity: action.quantity },
      ];
    }
    case 'REMOVE':
      return state.filter((item) => item.key !== action.key);
    case 'SET_QTY':
      return state
        .map((item) =>
          item.key === action.key ? { ...item, quantity: Math.max(0, action.quantity) } : item,
        )
        .filter((item) => item.quantity > 0);
    case 'CLEAR':
      return [];
    case 'HYDRATE':
      return action.items;
    default:
      return state;
  }
}

/** Read persisted cart once on mount. Guards against malformed/old storage. */
function loadInitial(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadInitial);
  const [isOpen, setIsOpen] = useState(false);

  // Persist on every change so a refresh never loses the cart.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage can fail in private mode / when full — non-fatal, just skip.
    }
  }, [items]);

  const addItem = useCallback((product: Product, size: string, quantity = 1) => {
    dispatch({ type: 'ADD', product, size, quantity });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((key: string) => dispatch({ type: 'REMOVE', key }), []);
  const setQuantity = useCallback(
    (key: string, quantity: number) => dispatch({ type: 'SET_QTY', key, quantity }),
    [],
  );
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totals = useMemo(() => computeTotals(items), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totals,
      isOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      setQuantity,
      clear,
    }),
    [items, totals, isOpen, openCart, closeCart, addItem, removeItem, setQuantity, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

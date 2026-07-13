import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import type { Grind } from '../data/products';

// Позиция корзины = товар + вариант (помол, вес). Ключ: "productId|grind|weightG".
export type CartItems = Record<string, number>;

export interface CartVariant {
  grind?: Grind;
  weightG?: number;
}

export interface CartLineKey extends CartVariant {
  productId: string;
}

export const makeKey = (productId: string, v?: CartVariant): string =>
  `${productId}|${v?.grind ?? ''}|${v?.weightG ?? ''}`;

export function parseKey(key: string): CartLineKey {
  const [productId, grind, weightG] = key.split('|');
  return {
    productId,
    grind: (grind || undefined) as Grind | undefined,
    weightG: weightG ? Number(weightG) : undefined,
  };
}

type Action =
  | { type: 'add'; key: string }
  | { type: 'remove'; key: string }
  | { type: 'setQty'; key: string; qty: number }
  | { type: 'clear' };

// v2: ключи с вариантами (несовместимо со старым форматом)
const STORAGE_KEY = 'krema-cart-v2';

function reducer(state: CartItems, action: Action): CartItems {
  switch (action.type) {
    case 'add':
      return { ...state, [action.key]: (state[action.key] ?? 0) + 1 };
    case 'setQty': {
      if (action.qty <= 0) {
        const next = { ...state };
        delete next[action.key];
        return next;
      }
      return { ...state, [action.key]: action.qty };
    }
    case 'remove': {
      const next = { ...state };
      delete next[action.key];
      return next;
    }
    case 'clear':
      return {};
    default:
      return state;
  }
}

function init(): CartItems {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItems) : {};
  } catch {
    return {};
  }
}

interface CartValue {
  items: CartItems;
  count: number;
  add: (productId: string, variant?: CartVariant) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, undefined, init);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage недоступен — корзина живёт в памяти */
    }
  }, [items]);

  const value = useMemo<CartValue>(() => {
    const count = Object.values(items).reduce((sum, q) => sum + q, 0);
    return {
      items,
      count,
      add: (productId, variant) => dispatch({ type: 'add', key: makeKey(productId, variant) }),
      remove: (key) => dispatch({ type: 'remove', key }),
      setQty: (key, qty) => dispatch({ type: 'setQty', key, qty }),
      clear: () => dispatch({ type: 'clear' }),
    };
  }, [items]);

  return <CartContext value={value}>{children}</CartContext>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

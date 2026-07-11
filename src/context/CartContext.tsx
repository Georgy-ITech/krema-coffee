import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';

export type CartItems = Record<string, number>; // productId -> qty

type Action =
  | { type: 'add'; id: string }
  | { type: 'remove'; id: string }
  | { type: 'setQty'; id: string; qty: number }
  | { type: 'clear' };

const STORAGE_KEY = 'overlay-cart';

function reducer(state: CartItems, action: Action): CartItems {
  switch (action.type) {
    case 'add': {
      const qty = (state[action.id] ?? 0) + 1;
      return { ...state, [action.id]: qty };
    }
    case 'setQty': {
      if (action.qty <= 0) {
        const next = { ...state };
        delete next[action.id];
        return next;
      }
      return { ...state, [action.id]: action.qty };
    }
    case 'remove': {
      const next = { ...state };
      delete next[action.id];
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
  add: (id: string) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, undefined, init);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable — cart stays in-memory */
    }
  }, [items]);

  const value = useMemo<CartValue>(() => {
    const count = Object.values(items).reduce((sum, q) => sum + q, 0);
    return {
      items,
      count,
      add: (id) => dispatch({ type: 'add', id }),
      remove: (id) => dispatch({ type: 'remove', id }),
      setQty: (id, qty) => dispatch({ type: 'setQty', id, qty }),
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

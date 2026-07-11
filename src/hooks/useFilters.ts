import { useMemo, useState } from 'react';
import { products, type Category, type Product } from '../data/products';

export type SortKey = 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
export type PriceMode = 'all' | 'free' | 'paid';

export const SORTS: { id: SortKey; label: string }[] = [
  { id: 'popular', label: 'Most popular' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'rating', label: 'Top rated' },
];

export const PRICE_MAX = 60;

export interface FilterState {
  search: string;
  categories: Set<Category>;
  priceMode: PriceMode;
  maxPrice: number;
  minRating: number;
  sort: SortKey;
}

const DEFAULTS: FilterState = {
  search: '',
  categories: new Set(),
  priceMode: 'all',
  maxPrice: PRICE_MAX,
  minRating: 0,
  sort: 'popular',
};

function sortProducts(list: Product[], sort: SortKey): Product[] {
  const copy = [...list];
  switch (sort) {
    case 'newest':
      return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price);
    case 'rating':
      return copy.sort((a, b) => b.rating - a.rating);
    case 'popular':
    default:
      return copy.sort((a, b) => b.sales - a.sales);
  }
}

export function useFilters() {
  const [state, setState] = useState<FilterState>(DEFAULTS);

  const set = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const toggleCategory = (id: Category) =>
    setState((s) => {
      const next = new Set(s.categories);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...s, categories: next };
    });

  const reset = () => setState({ ...DEFAULTS, categories: new Set() });

  const results = useMemo(() => {
    const q = state.search.trim().toLowerCase();
    const filtered = products.filter((p) => {
      if (state.categories.size && !state.categories.has(p.category)) return false;
      if (state.priceMode === 'free' && p.price !== 0) return false;
      if (state.priceMode === 'paid' && p.price === 0) return false;
      if (p.price > state.maxPrice) return false;
      if (p.rating < state.minRating) return false;
      if (q) {
        const hay = `${p.title} ${p.author} ${p.tags.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    return sortProducts(filtered, state.sort);
  }, [state]);

  const activeCount =
    (state.search ? 1 : 0) +
    state.categories.size +
    (state.priceMode !== 'all' ? 1 : 0) +
    (state.maxPrice < PRICE_MAX ? 1 : 0) +
    (state.minRating > 0 ? 1 : 0);

  return { state, set, toggleCategory, reset, results, activeCount };
}

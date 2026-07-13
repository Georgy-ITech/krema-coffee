import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../data/catalog';
import type { Category, Method, Product, Roast } from '../data/products';

export type SortKey = 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
export type RoastFilter = 'any' | Roast;
export type MethodFilter = 'any' | Method;

export const SORTS: { id: SortKey; label: string }[] = [
  { id: 'popular', label: 'Популярные' },
  { id: 'newest', label: 'Новинки' },
  { id: 'price-asc', label: 'Сначала дешёвые' },
  { id: 'price-desc', label: 'Сначала дорогие' },
  { id: 'rating', label: 'По рейтингу' },
];

export const PRICE_MAX = 3500;

export interface FilterState {
  search: string;
  categories: Set<Category>;
  roast: RoastFilter;
  method: MethodFilter;
  maxPrice: number;
  minRating: number;
  sort: SortKey;
}

const CATEGORY_IDS: Category[] = ['beans', 'drip', 'equipment', 'sets'];
const ROAST_IDS: RoastFilter[] = ['any', 'light', 'medium', 'dark'];
const METHOD_IDS: MethodFilter[] = ['any', 'espresso', 'filter', 'universal'];
const SORT_IDS: SortKey[] = SORTS.map((s) => s.id);

// Состояние фильтров живёт в URL (ТЗ §6.3): ссылка с выборкой шарится и переживает refresh
function parseParams(params: URLSearchParams): FilterState {
  const cats = (params.get('cat') ?? '')
    .split(',')
    .filter((c): c is Category => CATEGORY_IDS.includes(c as Category));
  const roast = params.get('roast') as RoastFilter | null;
  const method = params.get('method') as MethodFilter | null;
  const max = Number(params.get('max'));
  const rating = Number(params.get('rating'));
  const sort = params.get('sort') as SortKey | null;

  return {
    search: params.get('q') ?? '',
    categories: new Set(cats),
    roast: roast && ROAST_IDS.includes(roast) ? roast : 'any',
    method: method && METHOD_IDS.includes(method) ? method : 'any',
    maxPrice: max > 0 && max < PRICE_MAX ? max : PRICE_MAX,
    minRating: rating > 0 ? rating : 0,
    sort: sort && SORT_IDS.includes(sort) ? sort : 'popular',
  };
}

function serialize(s: FilterState): URLSearchParams {
  const p = new URLSearchParams();
  if (s.search) p.set('q', s.search);
  if (s.categories.size) p.set('cat', [...s.categories].join(','));
  if (s.roast !== 'any') p.set('roast', s.roast);
  if (s.method !== 'any') p.set('method', s.method);
  if (s.maxPrice < PRICE_MAX) p.set('max', String(s.maxPrice));
  if (s.minRating > 0) p.set('rating', String(s.minRating));
  if (s.sort !== 'popular') p.set('sort', s.sort);
  return p;
}

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
  const [params, setParams] = useSearchParams();

  const state = useMemo(() => parseParams(params), [params]);

  const update = (patch: Partial<FilterState>) =>
    setParams(serialize({ ...state, ...patch }), { replace: true });

  const set = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    update({ [key]: value } as Partial<FilterState>);

  const toggleCategory = (id: Category) => {
    const next = new Set(state.categories);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    update({ categories: next });
  };

  const reset = () => setParams(new URLSearchParams(), { replace: true });

  const results = useMemo(() => {
    const q = state.search.trim().toLowerCase();
    const filtered = getProducts().filter((p) => {
      if (state.categories.size && !state.categories.has(p.category)) return false;
      if (state.roast !== 'any' && p.roast !== state.roast) return false;
      if (state.method !== 'any' && p.method !== state.method) return false;
      if (p.price > state.maxPrice) return false;
      if (p.rating < state.minRating) return false;
      if (q) {
        const hay = `${p.title} ${p.origin} ${p.tags.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    return sortProducts(filtered, state.sort);
  }, [state]);

  const activeCount =
    (state.search ? 1 : 0) +
    state.categories.size +
    (state.roast !== 'any' ? 1 : 0) +
    (state.method !== 'any' ? 1 : 0) +
    (state.maxPrice < PRICE_MAX ? 1 : 0) +
    (state.minRating > 0 ? 1 : 0);

  return { state, set, toggleCategory, reset, results, activeCount };
}

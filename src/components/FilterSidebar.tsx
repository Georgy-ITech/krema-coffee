import { useMemo, type CSSProperties } from 'react';
import { CATEGORIES, products, type Category } from '../data/products';
import { PRICE_MAX, type FilterState, type PriceMode } from '../hooks/useFilters';
import styles from './FilterSidebar.module.scss';

interface Props {
  state: FilterState;
  set: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  toggleCategory: (id: Category) => void;
  reset: () => void;
  activeCount: number;
}

const PRICE_MODES: { id: PriceMode; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'free', label: 'Free' },
  { id: 'paid', label: 'Paid' },
];

const RATINGS = [0, 4, 4.5];

export default function FilterSidebar({ state, set, toggleCategory, reset, activeCount }: Props) {
  const counts = useMemo(() => {
    const map = {} as Record<Category, number>;
    for (const c of CATEGORIES) map[c.id] = 0;
    for (const p of products) map[p.category]++;
    return map;
  }, []);

  return (
    <aside className={styles.sidebar} aria-label="Filters">
      <div className={styles.search}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4-4" />
        </svg>
        <input
          type="search"
          placeholder="Search assets…"
          value={state.search}
          onChange={(e) => set('search', e.target.value)}
          aria-label="Search assets"
        />
      </div>

      <section className={styles.group}>
        <h4 className={styles.label}>Category</h4>
        <ul className={styles.checks}>
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <label className={styles.check}>
                <input
                  type="checkbox"
                  checked={state.categories.has(c.id)}
                  onChange={() => toggleCategory(c.id)}
                />
                <span className={styles.box} aria-hidden="true" />
                <span className={styles.checkLabel}>{c.label}</span>
                <span className={styles.count}>{counts[c.id]}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.group}>
        <h4 className={styles.label}>Price</h4>
        <div className={styles.segment} role="tablist">
          {PRICE_MODES.map((m) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={state.priceMode === m.id}
              className={state.priceMode === m.id ? styles.segActive : ''}
              onClick={() => set('priceMode', m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className={styles.slider}>
          <div className={styles.sliderTop}>
            <span>Max price</span>
            <b>{state.maxPrice >= PRICE_MAX ? 'Any' : `$${state.maxPrice}`}</b>
          </div>
          <input
            type="range"
            min={0}
            max={PRICE_MAX}
            step={1}
            value={state.maxPrice}
            onChange={(e) => set('maxPrice', Number(e.target.value))}
            aria-label="Maximum price"
            style={{ '--fill': `${(state.maxPrice / PRICE_MAX) * 100}%` } as CSSProperties}
          />
        </div>
      </section>

      <section className={styles.group}>
        <h4 className={styles.label}>Rating</h4>
        <div className={styles.pills}>
          {RATINGS.map((r) => (
            <button
              key={r}
              className={state.minRating === r ? styles.pillActive : styles.pill}
              onClick={() => set('minRating', r)}
            >
              {r === 0 ? 'Any' : `${r}+`}
            </button>
          ))}
        </div>
      </section>

      <button className={styles.reset} onClick={reset} disabled={activeCount === 0}>
        Clear filters{activeCount > 0 ? ` (${activeCount})` : ''}
      </button>
    </aside>
  );
}

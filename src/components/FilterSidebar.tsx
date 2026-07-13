import { useMemo, type CSSProperties } from 'react';
import { CATEGORIES, products, ROASTS, type Category } from '../data/products';
import { PRICE_MAX, type FilterState, type MethodFilter, type RoastFilter } from '../hooks/useFilters';
import styles from './FilterSidebar.module.scss';

interface Props {
  state: FilterState;
  set: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  toggleCategory: (id: Category) => void;
  reset: () => void;
  activeCount: number;
}

const ROAST_OPTIONS: { id: RoastFilter; label: string }[] = [
  { id: 'any', label: 'Любая' },
  ...ROASTS.map((r) => ({ id: r.id as RoastFilter, label: r.label })),
];

const METHOD_OPTIONS: { id: MethodFilter; label: string }[] = [
  { id: 'any', label: 'Любой' },
  { id: 'espresso', label: 'Эспрессо' },
  { id: 'filter', label: 'Фильтр' },
  { id: 'universal', label: 'Универсал' },
];

const RATINGS = [0, 4.5, 4.8];

export default function FilterSidebar({ state, set, toggleCategory, reset, activeCount }: Props) {
  const counts = useMemo(() => {
    const map = {} as Record<Category, number>;
    for (const c of CATEGORIES) map[c.id] = 0;
    for (const p of products) map[p.category]++;
    return map;
  }, []);

  return (
    <aside className={styles.sidebar} aria-label="Фильтры">
      <div className={styles.search}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4-4" />
        </svg>
        <input
          type="search"
          placeholder="Поиск кофе…"
          value={state.search}
          onChange={(e) => set('search', e.target.value)}
          aria-label="Поиск по каталогу"
        />
      </div>

      <section className={styles.group}>
        <h4 className={styles.label}>Категория</h4>
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
        <h4 className={styles.label}>Обжарка</h4>
        <div className={styles.segment} role="tablist">
          {ROAST_OPTIONS.map((m) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={state.roast === m.id}
              className={state.roast === m.id ? styles.segActive : ''}
              onClick={() => set('roast', m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.group}>
        <h4 className={styles.label}>Метод заваривания</h4>
        <div className={styles.segment} role="tablist">
          {METHOD_OPTIONS.map((m) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={state.method === m.id}
              className={state.method === m.id ? styles.segActive : ''}
              onClick={() => set('method', m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.group}>
        <div className={styles.sliderTop}>
          <h4 className={styles.label}>Цена до</h4>
          <b>{state.maxPrice >= PRICE_MAX ? 'любая' : `${state.maxPrice.toLocaleString('ru-RU')} ₽`}</b>
        </div>
        <input
          className={styles.range}
          type="range"
          min={0}
          max={PRICE_MAX}
          step={50}
          value={state.maxPrice}
          onChange={(e) => set('maxPrice', Number(e.target.value))}
          aria-label="Максимальная цена"
          style={{ '--fill': `${(state.maxPrice / PRICE_MAX) * 100}%` } as CSSProperties}
        />
      </section>

      <section className={styles.group}>
        <h4 className={styles.label}>Рейтинг</h4>
        <div className={styles.pills}>
          {RATINGS.map((r) => (
            <button
              key={r}
              className={state.minRating === r ? styles.pillActive : styles.pill}
              onClick={() => set('minRating', r)}
            >
              {r === 0 ? 'Любой' : `${r.toString().replace('.', ',')}+`}
            </button>
          ))}
        </div>
      </section>

      <button className={styles.reset} onClick={reset} disabled={activeCount === 0}>
        Сбросить фильтры{activeCount > 0 ? ` (${activeCount})` : ''}
      </button>
    </aside>
  );
}

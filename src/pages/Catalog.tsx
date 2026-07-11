import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { SORTS, useFilters, type SortKey } from '../hooks/useFilters';
import styles from './Catalog.module.scss';

export default function Catalog() {
  const { state, set, toggleCategory, reset, results, activeCount } = useFilters();

  return (
    <>
      <section className={styles.hero}>
        <div className="wrap">
          <span className={styles.eyebrow}>Creative assets marketplace</span>
          <h1 className={styles.title}>
            Ship faster with <span className={styles.g}>ready-made</span> design.
          </h1>
          <p className={styles.sub}>
            UI kits, icon sets, presets, fonts and 3D — handpicked, production-ready, and yours in one click.
          </p>
        </div>
      </section>

      <section className={`wrap ${styles.layout}`} id="catalog">
        <FilterSidebar
          state={state}
          set={set}
          toggleCategory={toggleCategory}
          reset={reset}
          activeCount={activeCount}
        />

        <div className={styles.main}>
          <div className={styles.toolbar}>
            <span className={styles.resultCount}>
              <b>{results.length}</b> {results.length === 1 ? 'asset' : 'assets'}
            </span>
            <label className={styles.sort}>
              <span>Sort</span>
              <select value={state.sort} onChange={(e) => set('sort', e.target.value as SortKey)}>
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </label>
          </div>

          {results.length > 0 ? (
            <div className={styles.grid}>
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <h3>No assets match those filters</h3>
              <p>Try widening the price range or clearing a category.</p>
              <button onClick={reset}>Clear all filters</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

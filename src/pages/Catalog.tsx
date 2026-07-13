import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { SORTS, useFilters, type SortKey } from '../hooks/useFilters';
import { plural } from '../lib/format';
import styles from './Catalog.module.scss';

const ORIGINS = ['Эфиопия', 'Кения', 'Колумбия', 'Бразилия', 'Гватемала', 'Перу', 'Свежая обжарка'];

export default function Catalog() {
  const { state, set, toggleCategory, reset, results, activeCount } = useFilters();

  return (
    <>
      <Hero />

      <div className={styles.strip}>
        <Marquee items={ORIGINS} />
      </div>

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
            <h2 className={styles.heading}>
              Каталог<span> · {results.length} {plural(results.length, ['товар', 'товара', 'товаров'])}</span>
            </h2>
            <label className={styles.sort}>
              <span>Сортировка</span>
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
              <h3>Ничего не найдено</h3>
              <p>Попробуйте расширить диапазон цены или снять фильтр по обжарке.</p>
              <button onClick={reset}>Сбросить фильтры</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

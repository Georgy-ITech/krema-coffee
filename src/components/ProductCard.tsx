import { Link } from 'react-router-dom';
import type { Product } from '../data/products';
import { categoryLabel } from '../data/products';
import { defaultVariant } from '../data/catalog';
import { formatPrice } from '../lib/format';
import { useCart } from '../context/CartContext';
import FreshnessBadge from './FreshnessBadge';
import RoastMeter from './RoastMeter';
import Stars from './Stars';
import styles from './ProductCard.module.scss';

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <article className={styles.card}>
      <Link to={`/product/${product.id}`} className={styles.coverLink} aria-label={product.title}>
        <div className={styles.cover}>
          <img className={styles.img} src={product.image} alt={product.title} loading="lazy" />
          <span className={styles.cat}>{categoryLabel(product.category)}</span>
          {product.roast && (
            <div className={styles.roast}>
              <RoastMeter roast={product.roast} />
            </div>
          )}
          {product.tags.length > 0 && (
            <div className={styles.notes}>
              <span className={styles.notesLabel}>Во вкусе</span>
              <div className={styles.noteTags}>
                {product.tags.slice(0, 3).map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className={styles.body}>
        <div className={styles.head}>
          <h3 className={styles.title}>
            <Link to={`/product/${product.id}`}>{product.title}</Link>
          </h3>
          <span className={styles.rate}>
            <Stars rating={product.rating} />
            <b>{product.rating.toFixed(1)}</b>
          </span>
        </div>
        <p className={styles.origin}>{product.origin}</p>
        {product.roastDate && (
          <div className={styles.freshness}>
            <FreshnessBadge roastDate={product.roastDate} />
          </div>
        )}

        <div className={styles.buy}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          <button className={styles.add} onClick={() => add(product.id, defaultVariant(product))} aria-label={`Добавить «${product.title}» в корзину`}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

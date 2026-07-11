import { Link } from 'react-router-dom';
import type { Product } from '../data/products';
import { categoryLabel } from '../data/products';
import { formatCount, formatPrice } from '../lib/format';
import { useCart } from '../context/CartContext';
import ProductCover from './ProductCover';
import Stars from './Stars';
import styles from './ProductCard.module.scss';

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <article className={styles.card}>
      <Link to={`/product/${product.id}`} className={styles.coverLink} aria-label={product.title}>
        <div className={styles.cover}>
          <ProductCover id={product.id} category={product.category} colors={product.colors} className={styles.svg} />
          <span className={styles.cat}>{categoryLabel(product.category)}</span>
          {product.price === 0 && <span className={styles.free}>Free</span>}
        </div>
      </Link>

      <div className={styles.body}>
        <div className={styles.top}>
          <h3 className={styles.title}>
            <Link to={`/product/${product.id}`}>{product.title}</Link>
          </h3>
          <span className={styles.price}>{formatPrice(product.price)}</span>
        </div>
        <p className={styles.author}>{product.author}</p>

        <div className={styles.meta}>
          <span className={styles.rating}>
            <Stars rating={product.rating} />
            <b>{product.rating.toFixed(1)}</b>
          </span>
          <span className={styles.sales}>{formatCount(product.sales)} sales</span>
        </div>

        <button className={styles.add} onClick={() => add(product.id)}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add to cart
        </button>
      </div>
    </article>
  );
}

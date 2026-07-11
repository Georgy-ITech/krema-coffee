import { Link, useParams } from 'react-router-dom';
import { products, categoryLabel } from '../data/products';
import { formatCount, formatPrice } from '../lib/format';
import { useCart } from '../context/CartContext';
import ProductCover from '../components/ProductCover';
import ProductCard from '../components/ProductCard';
import Stars from '../components/Stars';
import styles from './ProductDetail.module.scss';

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { add, items } = useCart();

  if (!product) {
    return (
      <div className={`wrap ${styles.notFound}`}>
        <h1>Asset not found</h1>
        <p>This item may have been moved or unpublished.</p>
        <Link to="/" className={styles.back}>← Back to catalog</Link>
      </div>
    );
  }

  const inCart = (items[product.id] ?? 0) > 0;
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className={`wrap ${styles.page}`}>
      <nav className={styles.crumbs}>
        <Link to="/">Catalog</Link>
        <span>/</span>
        <Link to="/#catalog">{categoryLabel(product.category)}</Link>
        <span>/</span>
        <b>{product.title}</b>
      </nav>

      <div className={styles.hero}>
        <div className={styles.coverWrap}>
          <ProductCover id={product.id} category={product.category} colors={product.colors} className={styles.cover} />
        </div>

        <div className={styles.info}>
          <span className={styles.cat}>{categoryLabel(product.category)}</span>
          <h1 className={styles.title}>{product.title}</h1>
          <p className={styles.author}>by {product.author}</p>

          <div className={styles.stats}>
            <span className={styles.rating}>
              <Stars rating={product.rating} size={15} />
              <b>{product.rating.toFixed(1)}</b>
            </span>
            <span className={styles.dot} />
            <span>{formatCount(product.sales)} sales</span>
          </div>

          <p className={styles.desc}>
            {product.title} is a {categoryLabel(product.category).toLowerCase().replace(/s$/, '')} crafted by{' '}
            {product.author}. Drop it into your workflow and ship in minutes — thoughtfully organized,
            fully editable, and ready for production.
          </p>

          <div className={styles.formats}>
            <span className={styles.formatsLabel}>Includes</span>
            <div className={styles.chips}>
              {product.formats.map((f) => (
                <span key={f} className={styles.chip}>{f}</span>
              ))}
            </div>
          </div>

          <div className={styles.tags}>
            {product.tags.map((t) => (
              <span key={t} className={styles.tag}>#{t}</span>
            ))}
          </div>

          <div className={styles.buy}>
            <span className={styles.price}>{formatPrice(product.price)}</span>
            <button className={styles.add} onClick={() => add(product.id)}>
              {inCart ? 'Added ✓  Add another' : 'Add to cart'}
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className={styles.related}>
          <h2>More from {categoryLabel(product.category)}</h2>
          <div className={styles.relatedGrid}>
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

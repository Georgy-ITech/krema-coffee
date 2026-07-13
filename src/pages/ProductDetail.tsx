import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  categoryLabel,
  grindLabel,
  methodLabel,
  processLabel,
  roastLabel,
  GRINDS,
  type Grind,
  type Product,
} from '../data/products';
import { getProduct, getRelated, variantPrice } from '../data/catalog';
import { formatCount, formatPrice } from '../lib/format';
import { nextRoastDate, roastedAgo } from '../lib/freshness';
import { makeKey, useCart } from '../context/CartContext';
import { useMeta } from '../hooks/useMeta';
import FlavorProfile from '../components/FlavorProfile';
import FreshnessBadge from '../components/FreshnessBadge';
import ProductCard from '../components/ProductCard';
import Stars from '../components/Stars';
import styles from './ProductDetail.module.scss';

export default function ProductDetail() {
  const { id } = useParams();
  const product = getProduct(id ?? '');

  useMeta(
    product ? `${product.title} — купить у обжарщиков | КРЕМА` : 'Товар не найден | КРЕМА',
    product?.description,
  );

  if (!product) {
    return (
      <div className={`wrap ${styles.notFound}`}>
        <h1>Товар не найден</h1>
        <p>Возможно, его сняли с продажи или ссылка устарела.</p>
        <Link to="/" className={styles.back}>← Вернуться в каталог</Link>
      </div>
    );
  }

  // key сбрасывает выбор помола/веса при переходе между товарами
  return <Detail key={product.id} product={product} />;
}

function Detail({ product }: { product: Product }) {
  const { add, items } = useCart();
  const [grind, setGrind] = useState<Grind | undefined>(product.grinds?.[0]);
  const [weightG, setWeightG] = useState<number | undefined>(product.weights?.[0]?.g);

  const price = variantPrice(product, weightG);
  const inCart = (items[makeKey(product.id, { grind, weightG })] ?? 0) > 0;
  const related = getRelated(product);

  const specs = [
    roastLabel(product.roast),
    methodLabel(product.method),
    processLabel(product.process),
    product.altitude,
    product.producer,
    product.weight,
  ].filter(Boolean) as string[];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.image,
    description: product.description ?? product.origin,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.sales,
    },
  };

  return (
    <div className={`wrap ${styles.page}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className={styles.crumbs}>
        <Link to="/">Каталог</Link>
        <span>/</span>
        <Link to={`/?cat=${product.category}#catalog`}>{categoryLabel(product.category)}</Link>
        <span>/</span>
        <b>{product.title}</b>
      </nav>

      <div className={styles.hero}>
        <div className={styles.coverWrap}>
          <img src={product.image} alt={product.title} className={styles.cover} />
        </div>

        <div className={styles.info}>
          <div className={styles.topRow}>
            <span className={styles.cat}>{categoryLabel(product.category)}</span>
            {product.roastDate && <FreshnessBadge roastDate={product.roastDate} size="md" />}
          </div>
          <h1 className={styles.title}>{product.title}</h1>
          <p className={styles.origin}>{product.origin}</p>

          <div className={styles.stats}>
            <span className={styles.rating}>
              <Stars rating={product.rating} size={15} />
              <b>{product.rating.toFixed(1)}</b>
            </span>
            <span className={styles.dot} />
            <span>{formatCount(product.sales)} продаж</span>
          </div>

          <p className={styles.desc}>
            {product.description ??
              `${product.title} — ${product.origin.toLowerCase()}. Обжариваем небольшими партиями и отправляем в течение суток после обжарки.`}
          </p>

          {product.profile && (
            <div className={styles.profileBox}>
              <span className={styles.blockLabel}>Профиль вкуса</span>
              <FlavorProfile profile={product.profile} />
              <div className={styles.notes}>
                {product.tags.map((t) => (
                  <span key={t} className={styles.note}>{t}</span>
                ))}
              </div>
            </div>
          )}

          {product.grinds && (
            <div className={styles.variant}>
              <span className={styles.blockLabel}>
                Помол · <b>{grindLabel(grind)}</b>
              </span>
              <div className={styles.grinds} role="radiogroup" aria-label="Выбор помола">
                {GRINDS.filter((g) => product.grinds!.includes(g.id)).map((g) => (
                  <button
                    key={g.id}
                    role="radio"
                    aria-checked={grind === g.id}
                    className={grind === g.id ? styles.grindOn : styles.grind}
                    onClick={() => setGrind(g.id)}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.weights && (
            <div className={styles.variant}>
              <span className={styles.blockLabel}>Вес</span>
              <div className={styles.weights} role="radiogroup" aria-label="Выбор веса">
                {product.weights.map((wo) => (
                  <button
                    key={wo.g}
                    role="radio"
                    aria-checked={weightG === wo.g}
                    className={weightG === wo.g ? styles.weightOn : styles.weight}
                    onClick={() => setWeightG(wo.g)}
                  >
                    <b>{wo.g === 1000 ? '1 кг' : `${wo.g} г`}</b>
                    <span>{formatPrice(wo.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {specs.length > 0 && (
            <div className={styles.formats}>
              <span className={styles.blockLabel}>Характеристики</span>
              <div className={styles.chips}>
                {specs.map((s) => (
                  <span key={s} className={styles.chip}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {product.roastDate && (
            <p className={styles.roastLine}>
              {roastedAgo(product.roastDate)} · ближайшая обжарка — {nextRoastDate()}
            </p>
          )}

          <div className={styles.buy}>
            <span className={styles.price}>{formatPrice(price)}</span>
            <button className={styles.add} onClick={() => add(product.id, { grind, weightG })}>
              {inCart ? 'В корзине ✓  Добавить ещё' : 'В корзину'}
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className={styles.related}>
          <h2>Ещё из категории «{categoryLabel(product.category)}»</h2>
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

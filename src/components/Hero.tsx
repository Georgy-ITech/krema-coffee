import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/format';
import RoastMeter from './RoastMeter';
import styles from './Hero.module.scss';

export default function Hero() {
  const { add } = useCart();
  const featured = products.find((p) => p.featured) ?? products[0];

  return (
    <section className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.content}>
          <span className={`${styles.eyebrow} reveal`}>Обжарка по вторникам · доставка по РФ</span>
          <h1 className={`${styles.title} reveal`}>
            Кофе, который <span className={styles.g}>раскрывается</span> в чашке
          </h1>
          <p className={`${styles.sub} reveal`}>
            Обжариваем небольшими партиями под фильтр и эспрессо. Зерно, дрип-пакеты, наборы и техника —
            свежими, с доставкой за 2–3 дня.
          </p>
          <div className={`${styles.cta} reveal`}>
            <a href="#catalog" className={styles.primary} data-magnetic>
              В каталог
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <Link to="/info/about" className={styles.ghost}>Как мы обжариваем</Link>
          </div>
          <div className={`${styles.stats} reveal`}>
            <div><b>12</b><span>сортов и наборов</span></div>
            <div><b>4,8★</b><span>средняя оценка</span></div>
            <div><b>48ч</b><span>от обжарки до отправки</span></div>
          </div>
        </div>

        <div className={`${styles.visual} reveal`}>
          <div className={styles.frame}>
            <img
              src="/img/hero.jpg"
              alt="Свежеобжаренный кофе КРЕМА"
              width={1400}
              height={1750}
              loading="eager"
              fetchPriority="high"
            />
            <span className={styles.stamp}>freshly<br />roasted</span>
          </div>

          <div className={styles.tag}>
            <span className={styles.tagHit}>Хит продаж</span>
            <Link to={`/product/${featured.id}`} className={styles.tagTitle}>{featured.title}</Link>
            <div className={styles.tagMeta}>{featured.origin}</div>
            {featured.roast && (
              <div className={styles.tagRoast}>
                <RoastMeter roast={featured.roast} showLabel />
              </div>
            )}
            <div className={styles.tagBuy}>
              <span className={styles.tagPrice}>{formatPrice(featured.price)}</span>
              <button onClick={() => add(featured.id)}>В корзину</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

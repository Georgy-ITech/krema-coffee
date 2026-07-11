import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/format';
import ProductCover from './ProductCover';
import styles from './CartDrawer.module.scss';

interface Props {
  open: boolean;
  onClose: () => void;
}

const byId = new Map(products.map((p) => [p.id, p]));

export default function CartDrawer({ open, onClose }: Props) {
  const { items, setQty, remove, clear } = useCart();

  const lines = useMemo(
    () =>
      Object.entries(items)
        .map(([id, qty]) => ({ product: byId.get(id)!, qty }))
        .filter((l) => l.product),
    [items],
  );

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) {
      window.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <div className={`${styles.root} ${open ? styles.open : ''}`} aria-hidden={!open}>
      <div className={styles.scrim} onClick={onClose} />
      <aside className={styles.panel} role="dialog" aria-label="Shopping cart" aria-modal="true">
        <header className={styles.head}>
          <h2>Your cart</h2>
          <button className={styles.close} onClick={onClose} aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        {lines.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="20" r="1.4" />
                <circle cx="18" cy="20" r="1.4" />
                <path d="M2 3h2.2l2.3 12.4a1.6 1.6 0 0 0 1.6 1.3h8.5a1.6 1.6 0 0 0 1.6-1.3L21 7H6" />
              </svg>
            </div>
            <p>Your cart is empty</p>
            <span>Browse the catalog and add a few assets.</span>
            <button className={styles.browse} onClick={onClose}>Browse assets</button>
          </div>
        ) : (
          <>
            <ul className={styles.lines}>
              {lines.map(({ product, qty }) => (
                <li key={product.id} className={styles.line}>
                  <Link to={`/product/${product.id}`} onClick={onClose} className={styles.thumb}>
                    <ProductCover id={product.id} category={product.category} colors={product.colors} className={styles.thumbSvg} />
                  </Link>
                  <div className={styles.lineBody}>
                    <div className={styles.lineTop}>
                      <span className={styles.lineTitle}>{product.title}</span>
                      <button className={styles.lineRemove} onClick={() => remove(product.id)} aria-label={`Remove ${product.title}`}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                      </button>
                    </div>
                    <span className={styles.lineAuthor}>{product.author}</span>
                    <div className={styles.lineBottom}>
                      <div className={styles.qty}>
                        <button onClick={() => setQty(product.id, qty - 1)} aria-label="Decrease quantity">–</button>
                        <span>{qty}</span>
                        <button onClick={() => setQty(product.id, qty + 1)} aria-label="Increase quantity">+</button>
                      </div>
                      <span className={styles.linePrice}>{formatPrice(product.price)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className={styles.foot}>
              <div className={styles.subtotal}>
                <span>Subtotal</span>
                <b>${subtotal}</b>
              </div>
              <button className={styles.checkout}>Checkout →</button>
              <button className={styles.clear} onClick={clear}>Clear cart</button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FREE_SHIPPING_FROM, useCartLines } from '../hooks/useCartLines';
import { formatPrice } from '../lib/format';
import styles from './CartDrawer.module.scss';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: Props) {
  const { setQty, remove, clear } = useCart();
  const { lines, subtotal, untilFree } = useCartLines();
  const navigate = useNavigate();

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

  const goCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <div className={`${styles.root} ${open ? styles.open : ''}`} aria-hidden={!open}>
      <div className={styles.scrim} onClick={onClose} />
      <aside className={styles.panel} role="dialog" aria-label="Корзина" aria-modal="true">
        <header className={styles.head}>
          <h2>Корзина</h2>
          <button className={styles.close} onClick={onClose} aria-label="Закрыть корзину">
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
            <p>Корзина пуста</p>
            <span>Загляните в каталог и добавьте немного кофе.</span>
            <button className={styles.browse} onClick={onClose}>В каталог</button>
          </div>
        ) : (
          <>
            <div className={styles.shipping} aria-live="polite">
              {untilFree > 0 ? (
                <>
                  <span>
                    До бесплатной доставки ещё <b>{formatPrice(untilFree)}</b>
                  </span>
                  <div className={styles.shipBar}>
                    <i style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_FROM) * 100)}%` }} />
                  </div>
                </>
              ) : (
                <span className={styles.shipFree}>🎉 Доставка бесплатная</span>
              )}
            </div>

            <ul className={styles.lines}>
              {lines.map(({ key, product, qty, variantLabel, lineTotal }) => (
                <li key={key} className={styles.line}>
                  <Link to={`/product/${product.id}`} onClick={onClose} className={styles.thumb}>
                    <img src={product.image} alt={product.title} className={styles.thumbImg} />
                  </Link>
                  <div className={styles.lineBody}>
                    <div className={styles.lineTop}>
                      <span className={styles.lineTitle}>{product.title}</span>
                      <button className={styles.lineRemove} onClick={() => remove(key)} aria-label={`Убрать «${product.title}»`}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                      </button>
                    </div>
                    <span className={styles.lineOrigin}>{variantLabel || product.origin}</span>
                    <div className={styles.lineBottom}>
                      <div className={styles.qty}>
                        <button onClick={() => setQty(key, qty - 1)} aria-label="Уменьшить количество">–</button>
                        <span>{qty}</span>
                        <button onClick={() => setQty(key, qty + 1)} aria-label="Увеличить количество">+</button>
                      </div>
                      <span className={styles.linePrice}>{formatPrice(lineTotal)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className={styles.foot}>
              <div className={styles.subtotal}>
                <span>Итого</span>
                <b>{formatPrice(subtotal)}</b>
              </div>
              <button className={styles.checkout} onClick={goCheckout}>Оформить заказ</button>
              <button className={styles.clear} onClick={clear}>Очистить корзину</button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

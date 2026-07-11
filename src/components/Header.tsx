import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './Header.module.scss';

interface Props {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenCart: () => void;
}

export default function Header({ theme, onToggleTheme, onOpenCart }: Props) {
  const { count } = useCart();

  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.inner}`}>
        <Link to="/" className={styles.brand}>
          <span className={styles.mark}>O</span>
          Overlay
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <a href="#catalog">Browse</a>
          <a href="#catalog">Categories</a>
          <a href="#catalog">Authors</a>
        </nav>

        <div className={styles.actions}>
          <button
            className={styles.icon}
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? (
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4.5" />
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
              </svg>
            ) : (
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            )}
          </button>

          <button className={styles.cart} onClick={onOpenCart} aria-label={`Open cart, ${count} items`}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="18" cy="20" r="1.4" />
              <path d="M2 3h2.2l2.3 12.4a1.6 1.6 0 0 0 1.6 1.3h8.5a1.6 1.6 0 0 0 1.6-1.3L21 7H6" />
            </svg>
            <span>Cart</span>
            {count > 0 && <span className={styles.badge}>{count}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}

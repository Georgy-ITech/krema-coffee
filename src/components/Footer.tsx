import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.brandCol}>
          <div className={styles.brand}>
            <span className={styles.mark}>O</span>
            Overlay
          </div>
          <p>A curated marketplace for design assets — kits, icons, presets, fonts and 3D.</p>
        </div>
        <div className={styles.cols}>
          <div>
            <h5>Marketplace</h5>
            <a href="#catalog">Browse</a>
            <a href="#catalog">New releases</a>
            <a href="#catalog">Free assets</a>
          </div>
          <div>
            <h5>Company</h5>
            <a href="#catalog">About</a>
            <a href="#catalog">Authors</a>
            <a href="#catalog">Licensing</a>
          </div>
          <div>
            <h5>Support</h5>
            <a href="#catalog">Help center</a>
            <a href="#catalog">Contact</a>
            <a href="#catalog">Status</a>
          </div>
        </div>
      </div>
      <div className={`wrap ${styles.bottom}`}>
        <span>© 2026 Overlay · concept by Georgy</span>
        <span>Built with React + Vite</span>
      </div>
    </footer>
  );
}

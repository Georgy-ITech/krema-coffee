import { Link } from 'react-router-dom';
import BeanMark from './BeanMark';
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.brandCol}>
          <div className={styles.brand}>
            <BeanMark className={styles.mark} />
            <span className={styles.word}>КРЕМА</span>
          </div>
          <p>Обжарщики спешелти-кофе. Свежая обжарка небольшими партиями и доставка по всей России.</p>
        </div>
        <div className={styles.cols}>
          <div>
            <h5>Магазин</h5>
            <Link to="/#catalog">Каталог</Link>
            <Link to="/?sort=newest#catalog">Новинки</Link>
            <Link to="/?cat=sets#catalog">Наборы</Link>
          </div>
          <div>
            <h5>Компания</h5>
            <Link to="/info/about">Как обжариваем</Link>
            <Link to="/info/about">О нас</Link>
            <Link to="/info/about">Оптом</Link>
          </div>
          <div>
            <h5>Помощь</h5>
            <Link to="/info/delivery">Доставка</Link>
            <Link to="/info/delivery">Оплата</Link>
            <Link to="/info/delivery">Контакты</Link>
          </div>
        </div>
      </div>
      <div className={`wrap ${styles.bottom}`}>
        <span>© 2026 КРЕМА · обжарщики кофе</span>
        <span>Концепт: Georgy · React + Vite</span>
      </div>
    </footer>
  );
}

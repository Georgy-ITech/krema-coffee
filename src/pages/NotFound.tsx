import { Link } from 'react-router-dom';
import { useMeta } from '../hooks/useMeta';
import styles from './Info.module.scss';

export default function NotFound() {
  useMeta('Страница не найдена | КРЕМА');
  return (
    <div className={`wrap ${styles.notFound}`}>
      <h1>404 — страница не найдена</h1>
      <Link to="/" className={styles.back}>← Вернуться в каталог</Link>
    </div>
  );
}

import { Link, useParams } from 'react-router-dom';
import { INFO_PAGES } from '../data/pages';
import { useMeta } from '../hooks/useMeta';
import styles from './Info.module.scss';

export default function Info() {
  const { slug } = useParams();
  const page = slug ? INFO_PAGES[slug] : undefined;

  useMeta(
    page ? `${page.title} | КРЕМА` : 'Страница не найдена | КРЕМА',
    page?.lead,
  );

  if (!page) {
    return (
      <div className={`wrap ${styles.notFound}`}>
        <h1>Страница не найдена</h1>
        <Link to="/" className={styles.back}>← В каталог</Link>
      </div>
    );
  }

  return (
    <div className={`wrap ${styles.page}`}>
      <nav className={styles.crumbs}>
        <Link to="/">Каталог</Link>
        <span>/</span>
        <b>{page.title}</b>
      </nav>

      <header className={styles.head}>
        <h1>{page.title}</h1>
        <p>{page.lead}</p>
      </header>

      <div className={styles.blocks}>
        {page.blocks.map((b, i) => (
          <section key={i} className={styles.block}>
            {b.h && <h2>{b.h}</h2>}
            {b.p && <p>{b.p}</p>}
            {b.list && (
              <ul>
                {b.list.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <Link to="/" className={styles.cta}>Перейти в каталог →</Link>
    </div>
  );
}

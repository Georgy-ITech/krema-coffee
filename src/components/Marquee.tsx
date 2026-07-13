import styles from './Marquee.module.scss';

interface Props {
  items: string[];
  duration?: number; // сек на полный цикл
}

export default function Marquee({ items, duration = 32 }: Props) {
  const row = [...items, ...items];
  return (
    <div className={styles.marquee} aria-hidden="true">
      <div className={styles.track} style={{ animationDuration: `${duration}s` }}>
        {row.map((item, i) => (
          <span key={i} className={styles.item}>
            {item}
            <svg className={styles.sep} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

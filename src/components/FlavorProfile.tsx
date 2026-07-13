import type { FlavorProfile as Profile } from '../data/products';
import styles from './FlavorProfile.module.scss';

const SCALES: { key: keyof Profile; label: string }[] = [
  { key: 'acidity', label: 'Кислотность' },
  { key: 'body', label: 'Плотность' },
  { key: 'sweetness', label: 'Сладость' },
];

// Профиль вкуса (ТЗ §5.3): три шкалы 1–5 в фирменных барах
export default function FlavorProfile({ profile }: { profile: Profile }) {
  return (
    <div className={styles.root}>
      {SCALES.map(({ key, label }) => (
        <div key={key} className={styles.row}>
          <span className={styles.label}>{label}</span>
          <div
            className={styles.dots}
            role="img"
            aria-label={`${label}: ${profile[key]} из 5`}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <i key={i} className={i <= profile[key] ? styles.on : ''} />
            ))}
          </div>
          <b className={styles.value}>{profile[key]}/5</b>
        </div>
      ))}
    </div>
  );
}

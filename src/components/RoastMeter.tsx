import type { Roast } from '../data/products';
import { ROASTS } from '../data/products';
import styles from './RoastMeter.module.scss';

const LEVEL: Record<Roast, number> = { light: 1, medium: 2, dark: 3 };

export default function RoastMeter({ roast, showLabel = false }: { roast: Roast; showLabel?: boolean }) {
  const level = LEVEL[roast];
  const label = ROASTS.find((r) => r.id === roast)?.label ?? '';
  return (
    <span className={styles.meter} title={`${label} обжарка`}>
      <span className={styles.beans}>
        {[0, 1, 2].map((i) => (
          <svg key={i} width="13" height="13" viewBox="0 0 24 24" className={i < level ? styles.on : styles.off}>
            <g transform="rotate(35 12 12)">
              <ellipse cx="12" cy="12" rx="6" ry="9" fill="currentColor" />
              <path d="M12 4.5 C 9 8, 9 10, 12 12 C 15 14, 15 16, 12 19.5" fill="none" stroke="var(--panel)" strokeWidth="1.4" strokeLinecap="round" />
            </g>
          </svg>
        ))}
      </span>
      {showLabel && <span className={styles.label}>{label}</span>}
    </span>
  );
}

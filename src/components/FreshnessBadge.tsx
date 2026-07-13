import { isFresh, roastedAgo } from '../lib/freshness';
import styles from './FreshnessBadge.module.scss';

interface Props {
  roastDate?: string;
  size?: 'sm' | 'md';
}

// «Свежесть как фича» (ТЗ §5.1): бейдж на карточке и строка на странице товара
export default function FreshnessBadge({ roastDate, size = 'sm' }: Props) {
  if (!roastDate) return null;
  const fresh = isFresh(roastDate);
  return (
    <span className={`${styles.badge} ${fresh ? styles.fresh : ''} ${size === 'md' ? styles.md : ''}`}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2a7 7 0 0 1 7 7c0 6-7 13-7 13S5 15 5 9a7 7 0 0 1 7-7z" transform="rotate(180 12 12)" opacity="0" />
        <path d="M12 22c5 0 8-3.5 8-8 0-2-1-4-2-5l-6-7-6 7c-1 1-2 3-2 5 0 4.5 3 8 8 8z" />
      </svg>
      {roastedAgo(roastDate)}
    </span>
  );
}

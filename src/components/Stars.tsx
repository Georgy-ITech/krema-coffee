import { useId } from 'react';

interface Props {
  rating: number;
  size?: number;
}

// Five stars with a single gradient clipped at the rating percentage,
// so fractional ratings (4.7) render a partial last star.
export default function Stars({ rating, size = 14 }: Props) {
  const uid = useId();
  const gid = `star-${uid}`;
  const pid = `starpath-${uid}`;
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <svg
      width={size * 5 + 8}
      height={size}
      viewBox="0 0 108 20"
      role="img"
      aria-label={`Rating ${rating} out of 5`}
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={gid}>
          <stop offset={`${pct}%`} stopColor="var(--accent)" />
          <stop offset={`${pct}%`} stopColor="var(--hair)" />
        </linearGradient>
        <path id={pid} d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
      </defs>
      {[0, 1, 2, 3, 4].map((i) => (
        <use key={i} href={`#${pid}`} x={i * 22} fill={`url(#${gid})`} />
      ))}
    </svg>
  );
}

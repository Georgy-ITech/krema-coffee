import { useId } from 'react';

// Coffee-bean logo mark: a copper bean with the signature centre crease.
export default function BeanMark({ className }: { className?: string }) {
  const id = useId();
  const gid = `bean-${id}`;
  return (
    <svg viewBox="0 0 32 32" className={className} role="img" aria-label="КРЕМА">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--accent-2)" />
          <stop offset="1" stopColor="var(--accent-deep, #a76a2c)" />
        </linearGradient>
      </defs>
      <g transform="rotate(35 16 16)">
        <ellipse cx="16" cy="16" rx="8" ry="12" fill={`url(#${gid})`} />
        <path
          d="M16 5.5 C 12.4 9.5, 12.4 12.5, 16 16 C 19.6 19.5, 19.6 22.5, 16 26.5"
          fill="none"
          stroke="rgba(28,18,6,0.9)"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

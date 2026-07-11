import type { Category } from '../data/products';

interface Props {
  id: string;
  category: Category;
  colors: [string, string];
  className?: string;
}

// Deterministic pseudo-random from a string seed (stable per product).
function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Motif({ category, id, colors }: { category: Category; id: string; colors: [string, string] }) {
  const w = 'rgba(255,255,255,0.9)';
  const wf = 'rgba(255,255,255,0.16)';
  const rand = seeded(id);

  switch (category) {
    case 'ui-kits':
      return (
        <g>
          <rect x="150" y="70" width="200" height="160" rx="14" fill={wf} stroke={w} strokeOpacity="0.5" />
          <rect x="150" y="70" width="54" height="160" rx="14" fill="rgba(255,255,255,0.14)" />
          <circle cx="177" cy="96" r="7" fill={w} />
          <rect x="166" y="120" width="22" height="6" rx="3" fill={w} opacity="0.7" />
          <rect x="166" y="140" width="22" height="6" rx="3" fill={w} opacity="0.5" />
          <rect x="166" y="160" width="22" height="6" rx="3" fill={w} opacity="0.5" />
          <rect x="222" y="92" width="110" height="10" rx="5" fill={w} opacity="0.85" />
          <rect x="222" y="120" width="52" height="40" rx="9" fill="rgba(255,255,255,0.22)" />
          <rect x="286" y="120" width="46" height="40" rx="9" fill="rgba(255,255,255,0.22)" />
          <rect x="222" y="176" width="110" height="34" rx="9" fill="rgba(255,255,255,0.16)" />
        </g>
      );
    case 'icons': {
      const cells = [];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 4; c++) {
          const x = 118 + c * 48;
          const y = 92 + r * 44;
          const kind = Math.floor(rand() * 3);
          cells.push(
            <g key={`${r}-${c}`} opacity={0.55 + rand() * 0.4}>
              {kind === 0 && <circle cx={x} cy={y} r="13" fill="none" stroke={w} strokeWidth="3" />}
              {kind === 1 && <rect x={x - 12} y={y - 12} width="24" height="24" rx="6" fill="none" stroke={w} strokeWidth="3" />}
              {kind === 2 && <path d={`M${x} ${y - 14} L${x + 13} ${y + 10} L${x - 13} ${y + 10} Z`} fill="none" stroke={w} strokeWidth="3" strokeLinejoin="round" />}
            </g>,
          );
        }
      }
      return <g>{cells}</g>;
    }
    case 'presets': {
      const bars = [];
      for (let i = 0; i < 5; i++) {
        const h = 40 + rand() * 120;
        bars.push(<rect key={i} x={132 + i * 30} y={230 - h} width="18" height={h} rx="6" fill={w} opacity={0.35 + i * 0.12} />);
      }
      return (
        <g>
          <circle cx="300" cy="96" r="34" fill="rgba(255,255,255,0.9)" opacity="0.9" />
          <circle cx="320" cy="112" r="34" fill={colors[0]} opacity="0.55" style={{ mixBlendMode: 'overlay' }} />
          {bars}
        </g>
      );
    }
    case 'fonts':
      return (
        <g>
          <text x="200" y="212" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="188" fill={w} letterSpacing="-8">
            Ag
          </text>
        </g>
      );
    case '3d': {
      return (
        <g>
          <ellipse cx="205" cy="245" rx="78" ry="16" fill="rgba(0,0,0,0.25)" />
          <path d="M200 96 L280 142 L280 210 L200 256 L120 210 L120 142 Z" fill="rgba(255,255,255,0.22)" stroke={w} strokeOpacity="0.6" strokeWidth="2" />
          <path d="M200 96 L280 142 L200 188 L120 142 Z" fill="rgba(255,255,255,0.4)" />
          <path d="M200 188 L280 142 L280 210 L200 256 Z" fill="rgba(255,255,255,0.14)" />
          <circle cx="300" cy="86" r="22" fill={w} opacity="0.85" />
        </g>
      );
    }
    case 'wallpapers': {
      const paths = [];
      for (let i = 0; i < 4; i++) {
        const y = 120 + i * 34;
        paths.push(
          <path
            key={i}
            d={`M0 ${y} C 100 ${y - 34 - rand() * 20}, 300 ${y + 34 + rand() * 20}, 400 ${y}`}
            fill="none"
            stroke={w}
            strokeWidth="2.5"
            opacity={0.5 - i * 0.08}
          />,
        );
      }
      return <g>{paths}</g>;
    }
    default:
      return null;
  }
}

export default function ProductCover({ id, category, colors, className }: Props) {
  const gid = `g-${id}`;
  const rid = `r-${id}`;
  return (
    <svg viewBox="0 0 400 300" className={className} preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={colors[0]} />
          <stop offset="1" stopColor={colors[1]} />
        </linearGradient>
        <radialGradient id={rid} cx="0.7" cy="0.2" r="0.9">
          <stop offset="0" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${gid})`} />
      <rect width="400" height="300" fill={`url(#${rid})`} />
      <Motif category={category} id={id} colors={colors} />
    </svg>
  );
}

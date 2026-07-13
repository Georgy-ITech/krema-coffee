import { plural } from './format';

const DAY = 86_400_000;

export const daysSince = (iso: string): number =>
  Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / DAY));

export const isFresh = (iso?: string): boolean =>
  iso != null && daysSince(iso) <= 14;

// «Обжарено сегодня / вчера / N дней назад»
export function roastedAgo(iso: string): string {
  const d = daysSince(iso);
  if (d === 0) return 'Обжарено сегодня';
  if (d === 1) return 'Обжарено вчера';
  return `Обжарено ${d} ${plural(d, ['день', 'дня', 'дней'])} назад`;
}

// Ближайший вторник (день обжарки) от текущей даты
export function nextRoastDate(): string {
  const now = new Date();
  const shift = (9 - now.getDay()) % 7 || 7; // 2 = вторник
  const next = new Date(now.getTime() + shift * DAY);
  return next.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

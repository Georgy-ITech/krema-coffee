export const formatPrice = (price: number): string =>
  price === 0 ? 'Free' : `$${price}`;

export const formatCount = (n: number): string =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(n);

export const formatPrice = (price: number): string =>
  `${price.toLocaleString('ru-RU')} ₽`;

export const formatCount = (n: number): string =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '').replace('.', ',')} тыс.` : String(n);

// Russian plural: forms = [1, 2–4, 5–0]. plural(3, ['товар','товара','товаров']) → 'товара'
export const plural = (n: number, forms: [string, string, string]): string => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
};

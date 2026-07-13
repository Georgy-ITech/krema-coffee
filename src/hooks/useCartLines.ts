import { useMemo } from 'react';
import { getProduct, variantPrice } from '../data/catalog';
import { grindLabel, type Product } from '../data/products';
import { parseKey, useCart, type CartLineKey } from '../context/CartContext';

export const FREE_SHIPPING_FROM = 2000; // ₽ — порог бесплатной доставки

export interface CartLine {
  key: string;
  product: Product;
  variant: CartLineKey;
  qty: number;
  unitPrice: number;
  lineTotal: number;
  variantLabel: string; // «Фильтр · 250 г»
}

export function useCartLines() {
  const { items } = useCart();

  const lines = useMemo<CartLine[]>(
    () =>
      Object.entries(items)
        .map(([key, qty]) => {
          const variant = parseKey(key);
          const product = getProduct(variant.productId);
          if (!product) return null;
          const unitPrice = variantPrice(product, variant.weightG);
          const parts = [grindLabel(variant.grind), variant.weightG ? `${variant.weightG} г` : '']
            .filter(Boolean);
          return {
            key,
            product,
            variant,
            qty,
            unitPrice,
            lineTotal: unitPrice * qty,
            variantLabel: parts.join(' · '),
          };
        })
        .filter((l): l is CartLine => l !== null),
    [items],
  );

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const untilFree = Math.max(0, FREE_SHIPPING_FROM - subtotal);

  return { lines, subtotal, untilFree };
}

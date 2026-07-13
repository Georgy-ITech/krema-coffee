// Единая точка доступа к каталогу. Сейчас — статические данные;
// при переходе на API/CMS меняется только этот модуль, UI не трогаем.
import { products, type Product } from './products';

export const getProducts = (): Product[] => products;

export const getProduct = (id: string): Product | undefined =>
  products.find((p) => p.id === id);

export const getRelated = (product: Product, limit = 3): Product[] =>
  products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit);

export const getFeatured = (): Product =>
  products.find((p) => p.featured) ?? products[0];

// Цена конкретного варианта (вес) либо базовая
export const variantPrice = (product: Product, weightG?: number): number =>
  product.weights?.find((w) => w.g === weightG)?.price ?? product.price;

// Вариант «по умолчанию» для быстрого добавления с карточки: зерно 250 г, в зёрнах
export const defaultVariant = (product: Product) => ({
  grind: product.grinds?.[0],
  weightG: product.weights?.[0]?.g,
});

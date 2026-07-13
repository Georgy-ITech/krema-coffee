export type Category = 'beans' | 'drip' | 'equipment' | 'sets';
export type Roast = 'light' | 'medium' | 'dark';
export type Method = 'espresso' | 'filter' | 'universal';
export type Grind = 'whole' | 'espresso' | 'filter' | 'turkish' | 'geyser';
export type Process = 'washed' | 'natural' | 'honey';

export interface WeightOption {
  g: number;
  price: number;
}

export interface FlavorProfile {
  acidity: number; // 1–5
  body: number; // 1–5
  sweetness: number; // 1–5
}

export interface Product {
  id: string;
  title: string;
  origin: string; // страна / регион или тип
  category: Category;
  roast?: Roast;
  method?: Method;
  price: number; // базовая цена, ₽ (для зерна — 250 г)
  weights?: WeightOption[]; // варианты веса (зерно)
  grinds?: Grind[]; // доступные помолы (зерно)
  roastDate?: string; // ISO — последняя обжарка
  profile?: FlavorProfile; // шкалы вкуса
  process?: Process; // обработка
  altitude?: string; // высота произрастания
  producer?: string; // ферма / кооператив
  description?: string; // 2–4 предложения о вкусе
  rating: number;
  sales: number;
  createdAt: string; // ISO — сортировка «новинки»
  weight?: string; // отображаемый вес (дрип/наборы)
  tags: string[]; // ноты вкуса / признаки — идут в поиск и на карточку
  image: string;
  featured?: boolean;
}

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'beans', label: 'Зерно' },
  { id: 'drip', label: 'Дрип-пакеты' },
  { id: 'equipment', label: 'Техника' },
  { id: 'sets', label: 'Наборы' },
];

export const ROASTS: { id: Roast; label: string }[] = [
  { id: 'light', label: 'Светлая' },
  { id: 'medium', label: 'Средняя' },
  { id: 'dark', label: 'Тёмная' },
];

export const GRINDS: { id: Grind; label: string }[] = [
  { id: 'whole', label: 'В зёрнах' },
  { id: 'espresso', label: 'Эспрессо' },
  { id: 'filter', label: 'Фильтр' },
  { id: 'turkish', label: 'Турка' },
  { id: 'geyser', label: 'Гейзер' },
];

export const categoryLabel = (id: Category): string =>
  CATEGORIES.find((c) => c.id === id)?.label ?? id;

export const roastLabel = (id?: Roast): string =>
  id ? (ROASTS.find((r) => r.id === id)?.label ?? id) + ' обжарка' : '';

export const methodLabel = (m?: Method): string =>
  m === 'espresso' ? 'Эспрессо' : m === 'filter' ? 'Фильтр' : m === 'universal' ? 'Универсальный' : '';

export const grindLabel = (g?: Grind): string =>
  g ? (GRINDS.find((x) => x.id === g)?.label ?? g) : '';

export const processLabel = (p?: Process): string =>
  p === 'washed' ? 'Мытая обработка' : p === 'natural' ? 'Натуральная обработка' : p === 'honey' ? 'Хани-обработка' : '';

const BEAN_GRINDS: Grind[] = ['whole', 'espresso', 'filter', 'turkish', 'geyser'];
// 1000 г ≈ ×3.6 от цены 250 г, округляем до десятков
const w = (base: number): WeightOption[] => [
  { g: 250, price: base },
  { g: 1000, price: Math.round((base * 3.6) / 10) * 10 },
];

export const products: Product[] = [
  {
    id: 'ethiopia-yirgacheffe',
    title: 'Эфиопия Иргачефф',
    origin: 'Эфиопия · регион Йиргачефф',
    category: 'beans',
    roast: 'light',
    method: 'filter',
    price: 940,
    weights: w(940),
    grinds: BEAN_GRINDS,
    roastDate: '2026-07-07',
    profile: { acidity: 5, body: 2, sweetness: 4 },
    process: 'washed',
    altitude: '1900–2200 м',
    producer: 'кооператив Konga',
    description:
      'Классика светлой обжарки: сок цитруса, жасмин и чайная лёгкость. В воронке раскрывается ярче всего — берите под фильтр и наслаждайтесь длинным сладким послевкусием.',
    rating: 4.9,
    sales: 1840,
    createdAt: '2026-06-28',
    tags: ['цитрус', 'жасмин', 'фильтр'],
    image: '/img/c8.jpg',
    featured: true,
  },
  {
    id: 'kenya-aa',
    title: 'Кения AA',
    origin: 'Кения · Ньери',
    category: 'beans',
    roast: 'light',
    method: 'filter',
    price: 990,
    weights: w(990),
    grinds: BEAN_GRINDS,
    roastDate: '2026-07-07',
    profile: { acidity: 5, body: 3, sweetness: 3 },
    process: 'washed',
    altitude: '1700–1900 м',
    producer: 'фабрика Gatomboya',
    description:
      'Сортировка AA — самое крупное зерно лота. Плотная ягодная кислотность, чёрная смородина и томатная сладость. Кофе с характером: для тех, кто любит ярко.',
    rating: 4.8,
    sales: 1210,
    createdAt: '2026-06-12',
    tags: ['чёрная смородина', 'ягоды', 'фильтр'],
    image: '/img/c1.jpg',
  },
  {
    id: 'colombia-supremo',
    title: 'Колумбия Супремо',
    origin: 'Колумбия · Уила',
    category: 'beans',
    roast: 'medium',
    method: 'filter',
    price: 820,
    weights: w(820),
    grinds: BEAN_GRINDS,
    roastDate: '2026-06-30',
    profile: { acidity: 3, body: 3, sweetness: 4 },
    process: 'washed',
    altitude: '1500–1800 м',
    producer: 'семейные фермы Уилы',
    description:
      'Сбалансированный и понятный: карамель, жареный орех, мягкая кислотность. Универсальный герой — хорош и в воронке, и в гейзере. Идеальный «каждодневный» кофе.',
    rating: 4.7,
    sales: 2560,
    createdAt: '2026-05-20',
    tags: ['карамель', 'орех', 'фильтр'],
    image: '/img/c9.jpg',
  },
  {
    id: 'brazil-santos',
    title: 'Бразилия Сантос',
    origin: 'Бразилия · Серрадо',
    category: 'beans',
    roast: 'medium',
    method: 'espresso',
    price: 760,
    weights: w(760),
    grinds: BEAN_GRINDS,
    roastDate: '2026-07-07',
    profile: { acidity: 2, body: 4, sweetness: 4 },
    process: 'natural',
    altitude: '900–1200 м',
    description:
      'Молочный шоколад, фундук и почти нулевая кислотность. База для эспрессо и напитков с молоком: капучино на Сантосе получается десертным без сиропов.',
    rating: 4.6,
    sales: 3120,
    createdAt: '2026-04-30',
    tags: ['шоколад', 'фундук', 'эспрессо'],
    image: '/img/c12.jpg',
  },
  {
    id: 'guatemala-antigua',
    title: 'Гватемала Антигуа',
    origin: 'Гватемала · Антигуа',
    category: 'beans',
    roast: 'medium',
    method: 'universal',
    price: 880,
    weights: w(880),
    grinds: BEAN_GRINDS,
    roastDate: '2026-06-30',
    profile: { acidity: 3, body: 4, sweetness: 4 },
    process: 'washed',
    altitude: '1500–1700 м',
    producer: 'вулканические почвы Антигуа',
    description:
      'Выращен на вулканических склонах: какао, пряности и лёгкая дымность. Один из тех сортов, что одинаково хороши под любой способ заваривания.',
    rating: 4.8,
    sales: 1440,
    createdAt: '2026-06-05',
    tags: ['какао', 'специи', 'универсал'],
    image: '/img/c14.jpg',
  },
  {
    id: 'espresso-blend-dark',
    title: 'Эспрессо-бленд «Тёмная»',
    origin: 'Бленд · Бразилия / Индия',
    category: 'beans',
    roast: 'dark',
    method: 'espresso',
    price: 790,
    weights: w(790),
    grinds: BEAN_GRINDS,
    roastDate: '2026-07-07',
    profile: { acidity: 1, body: 5, sweetness: 3 },
    process: 'natural',
    description:
      'Плотный, тягучий, с горьким шоколадом и долгим послевкусием. Собран для классического эспрессо: густая крема и никакой кислинки. Любимец кофеен-партнёров.',
    rating: 4.7,
    sales: 4020,
    createdAt: '2026-06-22',
    tags: ['горький шоколад', 'плотный', 'эспрессо'],
    image: '/img/c11.jpg',
    featured: true,
  },
  {
    id: 'peru-la-libertad',
    title: 'Перу Ла-Либертад',
    origin: 'Перу · Ла-Либертад',
    category: 'beans',
    roast: 'medium',
    method: 'filter',
    price: 850,
    weights: w(850),
    grinds: BEAN_GRINDS,
    roastDate: '2026-06-23',
    profile: { acidity: 3, body: 3, sweetness: 5 },
    process: 'honey',
    altitude: '1800–2000 м',
    producer: 'органик-сертификат',
    description:
      'Органический лот хани-обработки: мёд, жёлтые фрукты, шелковистое тело. Мягкий и сладкий — отличный выбор, если только начинаете знакомство со спешелти.',
    rating: 4.5,
    sales: 720,
    createdAt: '2026-05-08',
    tags: ['органик', 'мёд', 'фильтр'],
    image: '/img/c4.jpg',
  },
  {
    id: 'drip-morning',
    title: 'Дрип-пакеты «Утро»',
    origin: 'Ассорти · 7 шт',
    category: 'drip',
    roast: 'medium',
    price: 590,
    roastDate: '2026-07-07',
    weight: '7 × 12 г',
    description:
      'Семь дрипов из разных лотов недели — заваривается прямо в чашке за три минуты. Кофе в командировке, офисе и походе без турки и кофемолки.',
    rating: 4.6,
    sales: 2870,
    createdAt: '2026-06-18',
    tags: ['в дорогу', 'ассорти', 'быстро'],
    image: '/img/c10.jpg',
  },
  {
    id: 'drip-espresso',
    title: 'Дрип-пакеты «Крепкие»',
    origin: 'Тёмная обжарка · 10 шт',
    category: 'drip',
    roast: 'dark',
    price: 720,
    roastDate: '2026-06-30',
    weight: '10 × 12 г',
    description:
      'Десять дрипов тёмной обжарки для тех, кому нужен плотный и бодрящий старт. Шоколадный профиль, минимум кислотности.',
    rating: 4.4,
    sales: 980,
    createdAt: '2026-04-14',
    tags: ['в дорогу', 'крепкий'],
    image: '/img/c3.jpg',
  },
  {
    id: 'coldbrew-kit',
    title: 'Набор для колд-брю',
    origin: 'Графин 1 л + зерно',
    category: 'sets',
    price: 1690,
    weight: 'графин + 250 г',
    description:
      'Всё для холодного кофе дома: графин с фильтром на литр и лот Бразилии под колд-брю. Залили вечером — утром готово. Хит лета и удачный подарок.',
    rating: 4.7,
    sales: 640,
    createdAt: '2026-06-25',
    tags: ['лето', 'подарок', 'холодный'],
    image: '/img/c5.jpg',
    featured: true,
  },
  {
    id: 'chemex-6',
    title: 'Кемекс, 6 чашек',
    origin: 'Пуровер · боросиликат',
    category: 'equipment',
    price: 2490,
    description:
      'Классика пуровера с 1941 года: боросиликатное стекло, деревянная манжета. Чистая, прозрачная чашка и красивый ритуал заваривания.',
    rating: 4.9,
    sales: 410,
    createdAt: '2026-05-28',
    tags: ['пуровер', 'фильтр', 'стекло'],
    image: '/img/c2.jpg',
  },
  {
    id: 'hand-grinder',
    title: 'Ручная кофемолка',
    origin: 'Керамические жернова',
    category: 'equipment',
    price: 3200,
    description:
      'Керамические жернова, стальной корпус, 18 кликов настройки помола — от турки до френч-пресса. Компактная: помещается в карман рюкзака.',
    rating: 4.8,
    sales: 530,
    createdAt: '2026-06-02',
    tags: ['помол', 'сталь', 'в дорогу'],
    image: '/img/c13.jpg',
  },
  {
    id: 'tasting-set',
    title: 'Набор «Три помола»',
    origin: 'Дегустация · 3 × 100 г',
    category: 'sets',
    roast: 'light',
    price: 1290,
    roastDate: '2026-07-07',
    weight: '3 × 100 г',
    description:
      'Три лота недели по 100 г — Эфиопия, Кения и Колумбия. Лучший способ найти «свой» кофе и понять, чем светлая обжарка отличается по-настоящему.',
    rating: 4.6,
    sales: 1180,
    createdAt: '2026-06-15',
    tags: ['подарок', 'дегустация', 'ассорти'],
    image: '/img/c7.jpg',
  },
];

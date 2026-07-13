import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FREE_SHIPPING_FROM, useCartLines } from '../hooks/useCartLines';
import { formatPrice, plural } from '../lib/format';
import { useMeta } from '../hooks/useMeta';
import styles from './Checkout.module.scss';

type Delivery = 'cdek' | 'post' | 'pickup';

const DELIVERIES: { id: Delivery; label: string; note: string; cost: number }[] = [
  { id: 'cdek', label: 'СДЭК', note: 'до пункта выдачи, 2–4 дня', cost: 350 },
  { id: 'post', label: 'Почта России', note: 'до отделения, 4–8 дней', cost: 300 },
  { id: 'pickup', label: 'Самовывоз', note: 'Москва, Солнцево — завтра', cost: 0 },
];

const PROMOS: Record<string, number> = { KREMA10: 0.1 }; // код → скидка

interface Form {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  comment: string;
}

const EMPTY: Form = { name: '', phone: '', email: '', city: '', address: '', comment: '' };

function validate(form: Form, delivery: Delivery): Partial<Record<keyof Form, string>> {
  const errors: Partial<Record<keyof Form, string>> = {};
  if (form.name.trim().length < 2) errors.name = 'Укажите имя';
  if (!/^[+\d][\d\s()-]{9,17}$/.test(form.phone.trim())) errors.phone = 'Телефон в формате +7 900 000-00-00';
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errors.email = 'Похоже, в почте опечатка';
  if (delivery !== 'pickup') {
    if (form.city.trim().length < 2) errors.city = 'Укажите город';
    if (form.address.trim().length < 5) errors.address = 'Укажите адрес доставки';
  }
  return errors;
}

export default function Checkout() {
  useMeta('Оформление заказа | КРЕМА', 'Оформление заказа: доставка СДЭК, Почтой России или самовывоз.');
  const { clear } = useCart();
  const { lines, subtotal } = useCartLines();

  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [delivery, setDelivery] = useState<Delivery>('cdek');
  const [payment, setPayment] = useState<'online' | 'cash'>('online');
  const [promoInput, setPromoInput] = useState('');
  const [promo, setPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const field = (key: keyof Form) => ({
    value: form[key],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
    },
  });

  const discount = promo ? Math.round(subtotal * PROMOS[promo]) : 0;
  const deliveryDef = DELIVERIES.find((d) => d.id === delivery)!;
  const shippingCost = delivery !== 'pickup' && subtotal - discount >= FREE_SHIPPING_FROM ? 0 : deliveryDef.cost;
  const total = subtotal - discount + shippingCost;

  const itemsCount = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (PROMOS[code]) {
      setPromo(code);
      setPromoError('');
    } else {
      setPromo(null);
      setPromoError('Такого промокода нет. Попробуйте KREMA10');
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(form, delivery);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      // фокус на первое поле с ошибкой
      const first = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      first?.focus();
      return;
    }
    setOrderId(`KR-${Math.floor(10000 + Math.random() * 90000)}`);
    clear();
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  // ── Экран успеха ──
  if (orderId) {
    return (
      <div className={`wrap ${styles.success}`}>
        <div className={styles.successIcon} aria-hidden="true">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h1>Заказ оформлен</h1>
        <p className={styles.successNum}>Номер заказа — <b>{orderId}</b></p>
        <p className={styles.successText}>
          Это демо-режим: оплата не списывалась, заказ никуда не отправлен. В боевой версии здесь
          будет подтверждение на почту и трек-номер.
        </p>
        <Link to="/" className={styles.successBack}>← Вернуться в каталог</Link>
      </div>
    );
  }

  // ── Пустая корзина ──
  if (lines.length === 0) {
    return (
      <div className={`wrap ${styles.emptyPage}`}>
        <h1>В корзине пусто</h1>
        <p>Добавьте кофе из каталога — и возвращайтесь оформлять заказ.</p>
        <Link to="/" className={styles.successBack}>← В каталог</Link>
      </div>
    );
  }

  return (
    <div className={`wrap ${styles.page}`}>
      <nav className={styles.crumbs}>
        <Link to="/">Каталог</Link>
        <span>/</span>
        <b>Оформление заказа</b>
      </nav>
      <h1 className={styles.heading}>Оформление заказа</h1>

      <div className={styles.layout}>
        <form ref={formRef} className={styles.form} onSubmit={submit} noValidate>
          <section className={styles.section}>
            <h2>1 · Контакты</h2>
            <div className={styles.grid2}>
              <label className={styles.field}>
                <span>Имя</span>
                <input type="text" autoComplete="name" placeholder="Георгий"
                  aria-invalid={!!errors.name} {...field('name')} />
                {errors.name && <em role="alert">{errors.name}</em>}
              </label>
              <label className={styles.field}>
                <span>Телефон</span>
                <input type="tel" autoComplete="tel" placeholder="+7 900 000-00-00"
                  aria-invalid={!!errors.phone} {...field('phone')} />
                {errors.phone && <em role="alert">{errors.phone}</em>}
              </label>
            </div>
            <label className={styles.field}>
              <span>Почта</span>
              <input type="email" autoComplete="email" placeholder="you@mail.ru"
                aria-invalid={!!errors.email} {...field('email')} />
              {errors.email && <em role="alert">{errors.email}</em>}
            </label>
          </section>

          <section className={styles.section}>
            <h2>2 · Доставка</h2>
            <div className={styles.deliveries} role="radiogroup" aria-label="Способ доставки">
              {DELIVERIES.map((d) => (
                <button
                  type="button"
                  key={d.id}
                  role="radio"
                  aria-checked={delivery === d.id}
                  className={delivery === d.id ? styles.deliveryOn : styles.delivery}
                  onClick={() => setDelivery(d.id)}
                >
                  <b>{d.label}</b>
                  <span>{d.note}</span>
                  <i>{d.cost === 0 ? 'бесплатно' : formatPrice(d.cost)}</i>
                </button>
              ))}
            </div>
            {delivery !== 'pickup' && (
              <div className={styles.grid2}>
                <label className={styles.field}>
                  <span>Город</span>
                  <input type="text" autoComplete="address-level2" placeholder="Москва"
                    aria-invalid={!!errors.city} {...field('city')} />
                  {errors.city && <em role="alert">{errors.city}</em>}
                </label>
                <label className={styles.field}>
                  <span>Адрес / пункт выдачи</span>
                  <input type="text" autoComplete="street-address" placeholder="ул. Кофейная, 12"
                    aria-invalid={!!errors.address} {...field('address')} />
                  {errors.address && <em role="alert">{errors.address}</em>}
                </label>
              </div>
            )}
          </section>

          <section className={styles.section}>
            <h2>3 · Оплата</h2>
            <div className={styles.payments} role="radiogroup" aria-label="Способ оплаты">
              <button type="button" role="radio" aria-checked={payment === 'online'}
                className={payment === 'online' ? styles.deliveryOn : styles.delivery}
                onClick={() => setPayment('online')}>
                <b>Картой онлайн</b>
                <span>демо — ничего не списывается</span>
              </button>
              <button type="button" role="radio" aria-checked={payment === 'cash'}
                className={payment === 'cash' ? styles.deliveryOn : styles.delivery}
                onClick={() => setPayment('cash')}>
                <b>При получении</b>
                <span>наличными или картой</span>
              </button>
            </div>
            <label className={styles.field}>
              <span>Комментарий к заказу (необязательно)</span>
              <textarea rows={3} placeholder="Например: позвоните за час до доставки" {...field('comment')} />
            </label>
          </section>

          <button type="submit" className={styles.submit}>
            Подтвердить заказ · {formatPrice(total)}
          </button>
          <p className={styles.demoNote}>
            Демо-режим: реальная оплата не подключена, данные никуда не отправляются.
          </p>
        </form>

        <aside className={styles.summary} aria-label="Состав заказа">
          <h2>
            Ваш заказ <span>· {itemsCount} {plural(itemsCount, ['товар', 'товара', 'товаров'])}</span>
          </h2>
          <ul className={styles.items}>
            {lines.map((l) => (
              <li key={l.key}>
                <img src={l.product.image} alt="" />
                <div>
                  <b>{l.product.title}</b>
                  <span>{l.variantLabel || l.product.origin} · ×{l.qty}</span>
                </div>
                <i>{formatPrice(l.lineTotal)}</i>
              </li>
            ))}
          </ul>

          <div className={styles.promo}>
            <input
              type="text"
              placeholder="Промокод"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              aria-label="Промокод"
              aria-invalid={!!promoError}
            />
            <button type="button" onClick={applyPromo}>ОК</button>
          </div>
          {promoError && <em className={styles.promoError} role="alert">{promoError}</em>}
          {promo && <em className={styles.promoOk}>Промокод {promo} применён ✓</em>}

          <dl className={styles.totals}>
            <div><dt>Товары</dt><dd>{formatPrice(subtotal)}</dd></div>
            {discount > 0 && (
              <div className={styles.discount}><dt>Скидка</dt><dd>−{formatPrice(discount)}</dd></div>
            )}
            <div>
              <dt>Доставка</dt>
              <dd>{shippingCost === 0 ? 'бесплатно' : formatPrice(shippingCost)}</dd>
            </div>
            <div className={styles.grand}><dt>Итого</dt><dd>{formatPrice(total)}</dd></div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

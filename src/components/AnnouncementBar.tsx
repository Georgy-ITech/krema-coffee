import styles from './AnnouncementBar.module.scss';

export default function AnnouncementBar() {
  return (
    <div className={styles.bar}>
      <span>Обжарка по вторникам</span>
      <i />
      <span>Бесплатная доставка от 2000 ₽</span>
      <i />
      <span>Самовывоз в Москве</span>
    </div>
  );
}

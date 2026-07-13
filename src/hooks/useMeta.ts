import { useEffect } from 'react';

// Уникальные title/description на страницу (ТЗ §8 SEO) без внешних зависимостей
export function useMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title;
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    }
  }, [title, description]);
}

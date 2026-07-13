import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import AnnouncementBar from './components/AnnouncementBar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Info from './pages/Info';
import NotFound from './pages/NotFound';
import { useTheme } from './hooks/useTheme';

function useEnhancements(pathname: string, hash: string) {
  useEffect(() => {
    const target = hash ? document.querySelector(hash) : null;
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el));

    // Safety: never leave content hidden if the observer can't fire (background tab, etc.)
    const fallback = window.setTimeout(() => {
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => el.classList.add('in'));
    }, 1400);

    const cleanups: (() => void)[] = [];
    if (matchMedia('(hover: hover)').matches && !reduce) {
      document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((btn) => {
        const move = (e: MouseEvent) => {
          const r = btn.getBoundingClientRect();
          btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px,${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
        };
        const leave = () => {
          btn.style.transform = '';
        };
        btn.addEventListener('mousemove', move);
        btn.addEventListener('mouseleave', leave);
        cleanups.push(() => {
          btn.removeEventListener('mousemove', move);
          btn.removeEventListener('mouseleave', leave);
        });
      });
    }

    return () => {
      io.disconnect();
      clearTimeout(fallback);
      cleanups.forEach((c) => c());
    };
  }, [pathname, hash]);
}

export default function App() {
  const { theme, toggle } = useTheme();
  const [cartOpen, setCartOpen] = useState(false);
  const { pathname, hash } = useLocation();
  useEnhancements(pathname, hash);

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <AnnouncementBar />
      <Header theme={theme} onToggleTheme={toggle} onOpenCart={() => setCartOpen(true)} />
      <main>
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/info/:slug" element={<Info />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

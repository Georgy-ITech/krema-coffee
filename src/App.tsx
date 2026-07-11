import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import { useTheme } from './hooks/useTheme';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  const { theme, toggle } = useTheme();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <ScrollToTop />
      <Header theme={theme} onToggleTheme={toggle} onOpenCart={() => setCartOpen(true)} />
      <main>
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="*" element={<ProductDetail />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

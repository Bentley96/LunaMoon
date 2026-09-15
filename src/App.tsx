import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import Spinner from './components/ui/Spinner';

// Everything past the homepage is code-split, so a first visit only downloads
// the landing page. The chunks resolve relative to the entry script's URL (see
// the `base` note in vite.config.ts), which is what lets them load from inside
// a WordPress theme folder.
const TreatmentsPage = lazy(() => import('./pages/TreatmentsPage'));
const TreatmentPage = lazy(() => import('./pages/TreatmentPage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FaqsPage = lazy(() => import('./pages/FaqsPage'));
const PolicyPage = lazy(() => import('./pages/PolicyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Layout>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/treatments" element={<TreatmentsPage />} />
            <Route path="/treatments/category/:category" element={<TreatmentsPage />} />
            <Route path="/treatments/:slug" element={<TreatmentPage />} />

            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/:slug" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-received" element={<OrderConfirmationPage />} />

            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faqs" element={<FaqsPage />} />

            <Route
              path="/privacy-policy"
              element={<PolicyPage slug="privacy-policy" fallbackTitle="Privacy policy" />}
            />
            <Route
              path="/terms-conditions"
              element={<PolicyPage slug="terms-conditions" fallbackTitle="Terms & conditions" />}
            />
            <Route
              path="/cancellation-policy"
              element={<PolicyPage slug="cancellation-policy" fallbackTitle="Cancellation policy" />}
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </>
  );
}

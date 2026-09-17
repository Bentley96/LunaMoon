import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Seo from './components/Seo';
import HomePage from './pages/HomePage';
import Spinner from './components/ui/Spinner';
import { treatmentPages } from './content/treatments';

// Everything past the homepage is code-split, so a first visit only downloads
// the landing page. The chunks resolve relative to the entry script's own URL
// (see the `base` note in vite.config.ts), which is what lets them load from
// inside a WordPress theme folder.
const TreatmentPage = lazy(() => import('./pages/TreatmentPage'));
const BookOnlinePage = lazy(() => import('./pages/BookOnlinePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FaqsPage = lazy(() => import('./pages/FaqsPage'));
const ClinicPolicyPage = lazy(() => import('./pages/ClinicPolicyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

/** /shop/<slug> is the same product as /product/<slug> on some Woo setups. */
function ShopRedirect() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/product/${slug ?? ''}`} replace />;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Seo />
      <Layout>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* The four treatment pages share one template; the paths mirror the
                existing site's URLs so inbound links and SEO carry over. */}
            {treatmentPages.map((t) => (
              <Route key={t.slug} path={`/${t.slug}`} element={<TreatmentPage slug={t.slug} />} />
            ))}

            <Route path="/book-online" element={<BookOnlinePage />} />

            <Route path="/products" element={<ShopPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            {/* WooCommerce's own links — "Return to shop" on an empty basket,
                breadcrumbs, category archives — point at the shop page and the
                product taxonomies, which this app doesn't have pages for. They
                resolve to the shell, so without these they'd 404 inside a site
                that does have the products. */}
            <Route path="/shop" element={<Navigate to="/products" replace />} />
            <Route path="/shop/:slug" element={<ShopRedirect />} />
            <Route path="/product-category/*" element={<Navigate to="/products" replace />} />
            <Route path="/product-tag/*" element={<Navigate to="/products" replace />} />
            <Route path="/cart" element={<CartPage />} />
            {/* /checkout and /my-account are served by WooCommerce, not React —
                see wordpress/lunamoon/inc/commerce.php. */}

            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faqs" element={<FaqsPage />} />
            <Route
              path="/clinic-policy"
              element={<ClinicPolicyPage slug="clinic-policy" fallbackTitle="Clinic Policy" />}
            />
            <Route
              path="/privacy-policy"
              element={<ClinicPolicyPage slug="privacy-policy" fallbackTitle="Privacy Policy" />}
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </>
  );
}

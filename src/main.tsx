import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { bootstrap } from './lib/bootstrap';
import { CartProvider } from './store/CartContext';
import CartDrawer from './components/CartDrawer';
import './index.css';

// Mount once, even if this module is evaluated twice. Some WordPress caching /
// JS-optimization plugins duplicate or combine the entry script, which would
// otherwise create two React roots on the same #root element and corrupt the
// DOM (React error #321, "removeChild/insertBefore is not a child of this node").
const container = document.getElementById('root') as
  | (HTMLElement & { _lunamoonRoot?: boolean })
  | null;

if (container && !container._lunamoonRoot) {
  container._lunamoonRoot = true;
  createRoot(container).render(
    <StrictMode>
      {/* basename is non-empty only when WordPress lives in a subdirectory. */}
      <BrowserRouter basename={bootstrap.basename || undefined}>
        <CartProvider>
          <App />
          <CartDrawer />
        </CartProvider>
      </BrowserRouter>
    </StrictMode>
  );
}

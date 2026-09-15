import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { bootstrap } from '../lib/bootstrap';
import * as woo from '../lib/woo';

interface CartContextValue {
  cart: woo.WooCart | null;
  /** True while the first cart fetch is in flight. */
  loading: boolean;
  /** True while a mutation (add/update/remove) is in flight. */
  busy: boolean;
  error: string | null;
  count: number;
  /** Mini-cart drawer visibility. */
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  add: (productId: number, quantity?: number) => Promise<void>;
  setQuantity: (key: string, quantity: number) => Promise<void>;
  remove: (key: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: (code: string) => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

const noop = async () => {};

const CartContext = createContext<CartContextValue>({
  cart: null,
  loading: false,
  busy: false,
  error: null,
  count: 0,
  drawerOpen: false,
  openDrawer: () => {},
  closeDrawer: () => {},
  add: noop,
  setQuantity: noop,
  remove: noop,
  applyCoupon: noop,
  removeCoupon: noop,
  refresh: noop,
  clearError: () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<woo.WooCart | null>(null);
  const [loading, setLoading] = useState(bootstrap.hasWoo);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    if (!bootstrap.hasWoo) return;
    try {
      const next = await woo.getCart();
      if (mounted.current) setCart(next);
    } catch (err) {
      // A failed *read* shouldn't show an error banner — the shop may simply be
      // unreachable on this page. Mutations report their failures instead.
      if (import.meta.env.DEV) console.warn('Cart fetch failed', err);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Wraps a cart mutation: serialises busy state and surfaces the Store API's
  // own message (stock limits, coupon rules) to the UI.
  const mutate = useCallback(async (run: () => Promise<woo.WooCart>) => {
    setBusy(true);
    setError(null);
    try {
      const next = await run();
      if (mounted.current) setCart(next);
    } catch (err) {
      if (mounted.current) {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      }
      throw err;
    } finally {
      if (mounted.current) setBusy(false);
    }
  }, []);

  const add = useCallback(
    async (productId: number, quantity = 1) => {
      await mutate(() => woo.addToCart(productId, quantity));
      if (mounted.current) setDrawerOpen(true);
    },
    [mutate],
  );

  const setQuantity = useCallback(
    async (key: string, quantity: number) => {
      if (quantity < 1) {
        await mutate(() => woo.removeCartItem(key));
        return;
      }
      await mutate(() => woo.updateCartItem(key, quantity));
    },
    [mutate],
  );

  const remove = useCallback((key: string) => mutate(() => woo.removeCartItem(key)), [mutate]);
  const applyCoupon = useCallback(
    (code: string) => mutate(() => woo.applyCoupon(code)),
    [mutate],
  );
  const removeCoupon = useCallback(
    (code: string) => mutate(() => woo.removeCoupon(code)),
    [mutate],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      loading,
      busy,
      error,
      count: cart?.items_count ?? 0,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      add,
      setQuantity,
      remove,
      applyCoupon,
      removeCoupon,
      refresh,
      clearError: () => setError(null),
    }),
    [cart, loading, busy, error, drawerOpen, add, setQuantity, remove, applyCoupon, removeCoupon, refresh],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);

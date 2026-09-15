import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { preloadRecaptcha } from '../lib/recaptcha';

interface BookingContextValue {
  open: boolean;
  /** Pre-selects a treatment in the enquiry form when opened from a card. */
  treatment: string;
  openBooking: (treatment?: string) => void;
  closeBooking: () => void;
  toggleBooking: () => void;
}

const BookingContext = createContext<BookingContextValue>({
  open: false,
  treatment: '',
  openBooking: () => {},
  closeBooking: () => {},
  toggleBooking: () => {},
});

// Strip a lingering #book hash so the same link can re-trigger the flyout.
const stripHash = () => {
  if (window.location.hash === '#book') {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }
};

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [treatment, setTreatment] = useState('');

  const openBooking = useCallback((forTreatment = '') => {
    setTreatment(forTreatment);
    setOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setOpen(false);
    stripHash();
  }, []);

  const toggleBooking = useCallback(() => {
    setOpen((prev) => {
      if (prev) stripHash();
      return !prev;
    });
  }, []);

  useEffect(() => {
    preloadRecaptcha();
  }, []);

  // Open the flyout in place for any "Book now" link (href="#book" or "/#book")
  // anywhere on the site, instead of navigating to the homepage and jumping to
  // the top. Delegated so every current and future booking link works.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const anchor = (e.target as Element | null)?.closest('a');
      const href = anchor?.getAttribute('href');
      if (href === '#book' || href === '/#book') {
        e.preventDefault();
        setTreatment(anchor?.getAttribute('data-treatment') ?? '');
        setOpen(true);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Lock body scroll while the flyout is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const value = useMemo(
    () => ({ open, treatment, openBooking, closeBooking, toggleBooking }),
    [open, treatment, openBooking, closeBooking, toggleBooking],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBooking = () => useContext(BookingContext);

import { useEffect, useState, type ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

/**
 * Shared page chrome.
 *
 * The header is fixed, so the page needs top padding equal to its height. That
 * used to be a hardcoded value, which silently hid the top of every page
 * whenever the header changed (a taller logo, an extra row). It's measured
 * instead, from the two fixed bars only — the mobile menu panel is excluded, or
 * opening it would shove the page content down.
 */
export default function Layout({ children }: { children: ReactNode }) {
  const [offset, setOffset] = useState<number | null>(null);

  useEffect(() => {
    const bars = document.querySelector('[data-header-bars]');
    if (!bars) return;
    const apply = () => setOffset(bars.getBoundingClientRect().height);
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(bars);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header />
      {/* The Tailwind padding is the first-paint fallback, replaced as soon as
          the real height is known. */}
      <main
        className={offset === null ? 'pt-[116px] sm:pt-[140px]' : undefined}
        style={offset === null ? undefined : { paddingTop: offset }}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}

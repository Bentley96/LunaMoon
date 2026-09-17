import { useEffect, useRef, useState, type ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

/**
 * Shared page chrome.
 *
 * The header is fixed, so the page needs top padding to clear it. That padding
 * is measured rather than hardcoded, because a hardcoded value silently hid the
 * top of every page whenever the header changed (a taller logo, an extra row).
 *
 * What's measured is the distance between where the header ends and where <main>
 * starts — not simply the header's height. Those are the same number only when
 * <main> starts at the very top of the viewport, which is true in dev and false
 * inside WordPress: the admin bar adds `margin-top` to <html>, and anything
 * hooked onto wp_body_open renders above the app's root. Either pushes <main>
 * down while the fixed header stays put, and the difference showed as a white
 * band under the header.
 *
 * Both sides of the sum are scroll-independent — a fixed element's viewport
 * rect doesn't move, and <main>'s document position doesn't either — so this
 * holds wherever the page happens to be scrolled when it runs.
 */
export default function Layout({ children }: { children: ReactNode }) {
  const [offset, setOffset] = useState<number | null>(null);
  const main = useRef<HTMLElement>(null);

  useEffect(() => {
    // Only the two fixed bars: the mobile menu panel is excluded, or opening it
    // would shove the page content down.
    const bars = document.querySelector('[data-header-bars]');
    if (!bars || !main.current) return;

    const apply = () => {
      const headerBottom = bars.getBoundingClientRect().bottom;
      const mainTop = main.current!.getBoundingClientRect().top + window.scrollY;
      setOffset(Math.max(0, headerBottom - mainTop));
    };
    apply();

    const observer = new ResizeObserver(apply);
    observer.observe(bars);
    observer.observe(main.current);
    // The admin bar changes height at 782px, and with it where <main> starts.
    window.addEventListener('resize', apply);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', apply);
    };
  }, []);

  return (
    <>
      <Header />
      {/* The Tailwind padding is the first-paint fallback, replaced as soon as
          the real distance is known. */}
      <main
        ref={main}
        className={offset === null ? 'pt-[116px] sm:pt-[140px]' : undefined}
        style={offset === null ? undefined : { paddingTop: offset }}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}

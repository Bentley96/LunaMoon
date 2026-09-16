import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Start each new page at the top, the way a full page load would.
 *
 * Unless the URL carries a hash: that names where the visitor asked to land,
 * and whatever owns that anchor scrolls to it. Jumping to the top first would
 * fight that, and lose.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

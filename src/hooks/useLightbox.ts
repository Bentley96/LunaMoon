import { useCallback, useRef, useState } from 'react';

/**
 * Open/close state for a lightbox, kept out of the component so the page that
 * owns the thumbnails can say which one was clicked and get focus back.
 */
export default function useLightbox(count: number) {
  const [index, setIndex] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const openAt = useCallback((trigger: HTMLElement | null, i: number) => {
    opener.current = trigger;
    setIndex(i);
  }, []);

  const close = useCallback(() => {
    setIndex(null);
    // Back to the thumbnail that opened it, so a keyboard user doesn't land at
    // the top of the document.
    opener.current?.focus();
  }, []);

  const step = useCallback(
    (by: number) => setIndex((i) => (i === null ? i : (i + by + count) % count)),
    [count],
  );

  return { index, openAt, close, step };
}

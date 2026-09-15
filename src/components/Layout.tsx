import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

/**
 * Shared page chrome. Pages render their own <main> content; the fixed header
 * needs top padding beneath it, which `pt-*` supplies (the utility bar plus the
 * nav row).
 */
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-[104px] sm:pt-[108px]">{children}</main>
      <Footer />
    </>
  );
}

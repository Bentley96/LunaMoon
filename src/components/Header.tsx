import { useEffect, useRef, useState } from 'react';
import { Link, NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Facebook, Instagram, Mail, Menu, Phone, ShoppingBag, X } from 'lucide-react';
import { business, navLinks } from '../config/site';
import Logo from './Logo';
import { bootstrap } from '../lib/bootstrap';
import { useCart } from '../store/CartContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const { count, openDrawer } = useCart();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Navigating away should always close both menus.
  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
    setMobileSubmenu(null);
  }, [pathname]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-lg' : ''}`}>
      {/* Utility bar — phone, email, socials */}
      <div className="bg-ink-950 text-white">
        <div className="container-xl flex items-center justify-between gap-4 px-4 py-2 text-sm sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <a
              href={`tel:${business.phoneHref}`}
              className="flex items-center gap-1.5 transition-colors hover:text-blush-300"
            >
              <Phone className="h-3.5 w-3.5 text-blush-400" aria-hidden="true" />
              <span className="font-medium">{business.phone}</span>
            </a>
            <a
              href={`mailto:${business.email}`}
              className="hidden items-center gap-1.5 transition-colors hover:text-blush-300 sm:flex"
            >
              <Mail className="h-3.5 w-3.5 text-blush-400" aria-hidden="true" />
              <span>{business.email}</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            {business.social.facebook && (
              <a href={business.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"
                 className="text-ink-300 transition-colors hover:text-blush-300">
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {business.social.instagram && (
              <a href={business.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"
                 className="text-ink-300 transition-colors hover:text-blush-300">
                <Instagram className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur">
        <div className="container-xl flex items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="shrink-0" aria-label={`${business.name} — home`}>
            <Logo showTagline={false} className="text-[1.5rem] sm:text-[1.7rem]" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" ref={navRef}>
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenMenu((p) => (p === link.label ? null : link.label))}
                    aria-expanded={openMenu === link.label}
                    className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold uppercase tracking-wide text-ink-800 transition-colors hover:text-blush-700"
                  >
                    {link.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${openMenu === link.label ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  {openMenu === link.label && (
                    <div className="absolute left-0 top-full w-72 overflow-hidden rounded-xl border border-ink-100 bg-white py-2 shadow-xl">
                      {link.children.map((child) => (
                        <Link key={child.to} to={child.to}
                              className="block px-4 py-2.5 text-sm text-ink-700 transition-colors hover:bg-blush-50 hover:text-blush-700">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <RouterNavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `rounded-full px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-colors ${
                      isActive ? 'text-blush-700' : 'text-ink-800 hover:text-blush-700'
                    }`
                  }
                >
                  {link.label}
                </RouterNavLink>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            {bootstrap.hasWoo && (
              <button
                type="button"
                onClick={openDrawer}
                className="relative rounded-full p-2.5 text-ink-800 transition-colors hover:bg-blush-50 hover:text-blush-700"
                aria-label={`Basket${count ? ` — ${count} item${count === 1 ? '' : 's'}` : ' — empty'}`}
              >
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                {count > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-blush-600 px-1 text-[11px] font-bold text-white">
                    {count}
                  </span>
                )}
              </button>
            )}

            <Link to="/book-online" className="btn-primary hidden sm:inline-flex">
              Book now
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((p) => !p)}
              className="rounded-full p-2.5 text-ink-800 transition-colors hover:bg-blush-50 lg:hidden"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="max-h-[calc(100vh-7rem)] overflow-y-auto border-t border-ink-100 bg-white lg:hidden">
          <nav className="container-xl flex flex-col px-4 py-4 sm:px-6">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="border-b border-ink-50">
                  <button
                    type="button"
                    onClick={() => setMobileSubmenu((p) => (p === link.label ? null : link.label))}
                    aria-expanded={mobileSubmenu === link.label}
                    className="flex w-full items-center justify-between py-3 text-left font-semibold uppercase tracking-wide text-ink-900"
                  >
                    {link.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${mobileSubmenu === link.label ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  {mobileSubmenu === link.label && (
                    <div className="pb-2 pl-4">
                      {link.children.map((child) => (
                        <Link key={child.to} to={child.to}
                              className="block py-2 text-sm text-ink-600 hover:text-blush-700">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={link.to} to={link.to}
                      className="border-b border-ink-50 py-3 font-semibold uppercase tracking-wide text-ink-900 hover:text-blush-700">
                  {link.label}
                </Link>
              ),
            )}
            <Link to="/book-online" className="btn-primary mt-4">
              Book now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

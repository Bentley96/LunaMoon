// Anchors that links point at, kept apart from the content they refer to.
//
// The nav lives in config/site.ts and the service list in content/services.ts.
// Sharing the constant through either one would pull that whole module into
// the other's bundle — and the service list is 147 entries that only the
// booking page needs. A file with one string in it costs nothing.

/** The "IPL Laser Hair Removal" menu item's target on /book-online. */
export const IPL_ANCHOR = 'ipl-laser-hair-removal';

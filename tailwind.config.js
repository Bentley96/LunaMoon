/** @type {import('tailwindcss').Config} */

// Luna Moon Aesthetics brand tokens.
//
// Three families drive the whole site, so a rebrand is a change here and
// nowhere else:
//   ink    — the deep aubergine "night" used for headers, footers and type.
//   blush  — the rose primary; buttons, links and active states.
//   gold   — the champagne secondary; accents, rules and price/offer badges.
export default {
  // The PHP templates are in here too: header.php, footer.php and page.php
  // render WooCommerce's checkout and account pages with the same classes, and
  // without this every one of them would be purged out of the stylesheet.
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './wordpress/lunamoon/**/*.php',
  ],
  theme: {
    extend: {
      colors: {
        // ink — warm near-black, taken from the logo's tagline lettering.
        // Used for body copy, headings and the dark bands.
        ink: {
          950: '#110e0d',
          900: '#1c1817',
          // The header's contact bar. Visually near-identical to ink-900, but
          // it's a brand-specified value so it keeps its own slot.
          850: '#201d1c',
          800: '#2b2422',
          700: '#3f3431',
          600: '#524440',
          500: '#6b5a53',
          400: '#8f7e77',
          300: '#b9aba5',
          200: '#d9cfcb',
          100: '#ede7e5',
          50: '#f7f4f3',
        },
        // blush — the brand rose. blush-400 is #E4C3BA exactly, the colour the
        // logo sits on; the darker steps exist so text and buttons drawn from
        // the same family still clear WCAG AA.
        blush: {
          950: '#38241f',
          900: '#5a3a31',
          800: '#7a4e42',
          700: '#9a6354',
          600: '#b87f6e',
          500: '#d2a294',
          400: '#e4c3ba',
          300: '#edd3cb',
          200: '#f4e2dc',
          100: '#faf0ed',
          50: '#fdf8f7',
        },
        // gold — the metallic lettering from the logo, flattened into a usable
        // scale. gold-400/500 read as the metal; gold-700 is the darkest step
        // that still passes on a light background.
        gold: {
          800: '#5f512a',
          700: '#7d6b36',
          600: '#9c8642',
          500: '#b8a051',
          400: '#cdb667',
          300: '#decc8a',
          200: '#ebdfb4',
          100: '#f5efd8',
          50: '#fbf8ee',
        },
      },
      fontFamily: {
        // Display serif for headings, clean sans for everything else.
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 35s linear infinite',
        'fade-up': 'fade-up 0.5s ease-out both',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */

// Luna Moon Aesthetics brand tokens.
//
// Three families drive the whole site, so a rebrand is a change here and
// nowhere else:
//   ink    — the deep aubergine "night" used for headers, footers and type.
//   blush  — the rose primary; buttons, links and active states.
//   gold   — the champagne secondary; accents, rules and price/offer badges.
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#14101c',
          900: '#1e1729',
          800: '#2c2039',
          700: '#3d2d4f',
          600: '#523d68',
          500: '#6b5185',
          400: '#8a6ea5',
          300: '#ad96c2',
          200: '#cfc1dc',
          100: '#e8e0ef',
          50: '#f5f1f8',
        },
        blush: {
          900: '#6d2435',
          800: '#8c2f44',
          700: '#ab3a54',
          600: '#c74e69',
          500: '#dd6f87',
          400: '#e895a7',
          300: '#f0b6c3',
          200: '#f6d3db',
          100: '#fae8ed',
          50: '#fdf4f6',
        },
        gold: {
          800: '#7d6231',
          700: '#9a7b3f',
          600: '#b8934c',
          500: '#d0ab63',
          400: '#ddc088',
          300: '#e8d3ab',
          200: '#f1e4cc',
          100: '#f8f1e4',
          50: '#fdfaf4',
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

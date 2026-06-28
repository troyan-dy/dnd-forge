/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dark-fantasy palette: dark stone + parchment + gold/deep crimson accents
        ink: {
          900: '#0b0a08',
          800: '#13110d',
          700: '#1c1813',
          600: '#272019',
          500: '#352b21',
        },
        parchment: {
          50: '#f7f0df',
          100: '#efe4c8',
          200: '#e3d3a8',
          300: '#cdb884',
        },
        gold: {
          300: '#e8cf8a',
          400: '#d4af37',
          500: '#b8902a',
          600: '#8f6d1f',
        },
        blood: {
          400: '#a3382f',
          500: '#7f2620',
          600: '#5c1a16',
        },
      },
      fontFamily: {
        display: ['"Cinzel"', 'Georgia', 'serif'],
        body: ['"EB Garamond"', 'Georgia', 'serif'],
      },
      boxShadow: {
        glow: '0 0 18px 0 rgba(212, 175, 55, 0.35)',
        'glow-strong': '0 0 28px 2px rgba(212, 175, 55, 0.5)',
      },
      backgroundImage: {
        'stone-texture':
          'radial-gradient(circle at 20% 10%, rgba(212,175,55,0.05), transparent 40%), radial-gradient(circle at 80% 90%, rgba(127,38,32,0.08), transparent 45%)',
      },
    },
  },
  plugins: [],
}

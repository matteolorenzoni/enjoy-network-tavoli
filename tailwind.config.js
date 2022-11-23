/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}', './src/app/components/*.ts'],
  theme: {
    extend: {
      colors: {
        blackPalette: {
          100: '#ffffff',
          200: '#dfdfdf',
          300: '#bfbfbf',
          400: '#9f9f9f',
          500: '#808080',
          600: '#606060',
          700: '#404040',
          800: '#202020',
          900: '#000000',
          DEFAULT: '#000000'
        },
        orangePalette: {
          100: '#ffe0b2',
          200: '#ffcc80',
          300: '#ffb74d',
          400: '#ffa726',
          500: '#ff9800',
          600: '#fb8c00',
          700: '#f57c00',
          800: '#ef6c00',
          900: '#e65100',
          DEFAULT: '#ff8a08'
        }
      },
      flexGrow: {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        10: 10
      }
    },
    fontFamily: {
      gruppo: ['Gruppo']
    }
  },
  plugins: []
};

// Breakpoint
// - sm: '640px',
// - md: '768px',
// - lg: '1024px',
// - xl: '1280px',
// - 2xl: '1536px',

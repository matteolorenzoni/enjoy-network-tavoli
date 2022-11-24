/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}', './src/app/components/*.ts'],
  theme: {
    extend: {
      colors: {
        black: {
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
        }
      },
      textColor: {
        primary: 'var(--en-color-primary)',
        secondary: 'var(--en-color-secondary)'
      },
      backgroundColor: {
        primary: 'var(--en-color-primary)',
        secondary: 'var(--en-color-secondary)'
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

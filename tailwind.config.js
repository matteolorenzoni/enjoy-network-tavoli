/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}', './src/app/components/*.ts'],
  theme: {
    extend: {
      colors: {
        primary: {
          0: 'hsl(25, 95%, 0%)',
          1: 'hsl(25, 95%, 1%)',
          2: 'hsl(25, 95%, 2%)',
          3: 'hsl(25, 95%, 3%)',
          4: 'hsl(25, 95%, 4%)',
          5: 'hsl(25, 95%, 5%)',
          10: 'hsl(25, 95%, 10%)',
          15: 'hsl(25, 95%, 15%)',
          20: 'hsl(25, 95%, 20%)',
          25: 'hsl(25, 95%, 25%)',
          30: 'hsl(25, 95%, 30%)',
          35: 'hsl(25, 95%, 35%)',
          40: 'hsl(25, 95%, 40%)',
          45: 'hsl(25, 95%, 45%)',
          50: 'hsl(25, 95%, 50%)',
          55: 'hsl(25, 95%, 55%)',
          60: 'hsl(25, 95%, 60%)',
          65: 'hsl(25, 95%, 65%)',
          70: 'hsl(25, 95%, 70%)',
          75: 'hsl(25, 95%, 75%)',
          80: 'hsl(25, 95%, 80%)',
          85: 'hsl(25, 95%, 85%)',
          90: 'hsl(25, 95%, 90%)',
          95: 'hsl(25, 95%, 95%)',
          96: 'hsl(25, 95%, 96%)',
          97: 'hsl(25, 95%, 97%)',
          98: 'hsl(25, 95%, 98%)',
          99: 'hsl(25, 95%, 99%)',
          100: 'hsl(25, 95%, 100%)'
        }
      },
      textColor: {
        palette: 'var(--en-color)',
        paletteHover: 'var(--en-color-hover)',
        paletteActive: 'var(--en-color-active)'
      },
      backgroundColor: {
        palette: 'var(--en-background-color)',
        paletteHover: 'var(--en-background-color-hover)',
        paletteActive: 'var(--en-background-color-active)'
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

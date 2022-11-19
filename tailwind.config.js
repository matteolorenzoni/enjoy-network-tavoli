/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
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
      RobotoMono: ['Roboto Mono']
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

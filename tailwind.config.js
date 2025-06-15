/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      pizza: 'Roboto Mono, monospace',
    },
    extend: {
      colors: {
        pizza: '#123456',
      },
      fontSize: {
        big: ['80rem', { lineHeight: '1' }],
      },
      height: {
        screen: '100dvh',
      },
    },
  },
  plugins: [],
};

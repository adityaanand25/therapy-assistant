/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    {
      pattern: /^(bg|text|border)-(blue|green|purple|orange|red|indigo|gray)-(100|400|500|600|700|800|900)/,
    },
  ],
};

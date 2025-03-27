/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#00224D',
        secondary: '#5D0E41',
        accent: '#A0153E',
        highlight: '#FF204E',
        dark: {
          DEFAULT: '#000000',
          100: '#0A0A0A',
          200: '#121212',
          300: '#1A1A1A',
          400: '#242424'
        }
      },
      animation: {
        'color-shift': 'color-shift 8s ease infinite',
      },
      keyframes: {
        'color-shift': {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
      },
    },
  },
  plugins: [],
};
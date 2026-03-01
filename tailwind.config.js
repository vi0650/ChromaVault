/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        primary: {
          light: '#f3e8ff', // purple-50
          dark: '#3b0764', // purple-900
        },
        secondary: {
          light: '#e9d5ff', // purple-200
          dark: '#581c87', // purple-800
        },
        accent: {
          DEFAULT: '#d946ef', // fuchsia-500
          hover: '#c026d3', // fuchsia-600
        },
        highlight: '#8b5cf6', // violet-500
        base: {
          dark: '#0a0a0c', // Deep web3 dark background
          light: '#fafafa', // Light background
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
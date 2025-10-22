/** @type {import('tailwindcss').Config} */
import scrollbarHide from 'tailwind-scrollbar-hide'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'light-gray': '#6B7280',
        'gradient-start': '#FFD200',
        'gradient-end': '#DC2626'
      }
    }
  },
  plugins: [scrollbarHide]
}

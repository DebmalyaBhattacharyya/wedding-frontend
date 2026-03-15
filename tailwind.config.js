/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#FFF8F0',   // Creamy background
          DEFAULT: '#C08552', // Warm tan/gold for primary accents
          medium: '#8C5A3C',  // Copper/rust for hover states or secondary elements
          dark: '#4B2E2B',    // Deep maroon/brown for text and headings
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
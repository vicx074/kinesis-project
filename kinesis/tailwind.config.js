/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00f3ff',
        'neon-pink': '#ff00ff',
        'dark-bg': '#050505',
      },
      fontFamily: {
        mono: ['Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize:{
        xxs: '0.55rem',
        'xxs-xs': '0.65rem'
      },
      backgroundColor: {
        'sea-200': '#C4DFDF',
        'sea-100': '#D2E9E9',
        'sea-50': '#E3F4F4',
        'sea-5': '#F8F6F4',
      }
    },
  },
  plugins: [],
}


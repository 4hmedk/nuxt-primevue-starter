/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./presets/**/*.{js,vue,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require('tailwindcss-primeui')],
}


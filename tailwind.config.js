/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'custom-green': '#3e735b',
        'custom-brown': '#997562'
      },
      ringColor: {
        'custom-green': '#3e735b',
      },
    },
  },
  plugins: [],
}


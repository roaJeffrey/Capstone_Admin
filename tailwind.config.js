/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class', // Enable dark mode using class-based toggle
  theme: {
    extend: {
      colors: {
        'custom-green': '#3e735b',
        'custom-brown': '#997562',
        'dark-green': '#1b3b32', // Darker green for dark mode
        'dark-brown': '#5e3d2d', // Darker brown for dark mode
      },
      ringColor: {
        'custom-green': '#3e735b',
        'dark-green': '#1b3b32', // Darker ring color for dark mode
      },
      backgroundColor: {
        'dark-bg': '#121212', // Dark background for dark mode
      },
      textColor: {
        'dark-text': '#eaeaea', // Light gray text for dark mode
        'dark-green': '#a2d8a2', // Light green text for dark mode
      },
    },
  },
  plugins: [],
}

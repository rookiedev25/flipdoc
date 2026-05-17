/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',           // Pure black - headings, main text
        'dark-gray': '#1A1A1A',       // Very dark gray - dark backgrounds
        'medium-gray': '#404040',     // Medium gray - borders, secondary
        'light-gray': '#909090',      // Light gray - muted text
        'bg-light': '#F5F5F5',        // Off-white - subtle backgrounds
        secondary: '#F5F5F5',
        success: '#2A2A2A',           // Dark gray for success state
        danger: '#404040',            // Medium gray for danger state
        warning: '#606060',           // Muted gray for warning state
      },
    },
  },
  plugins: [],
}

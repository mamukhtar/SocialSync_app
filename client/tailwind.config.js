/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pearl: '#e6e1c5',
        sage: '#d4cb92',
        'paynes-gray': '#395c6b',
        'vista-blue': '#80a4ed',
        'columbia-blue': '#bcd3f2',
      },
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};



/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      height: {
        headerLg: '64px',
        headerSm: '60px',
      },
      fontSize:{
        'ant':'10px',
        'super-small' : '12px',
        'big-size': '1.6rem'
      },
      top: {
        headerLg: '64px',
        headerSm: '60px',
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}


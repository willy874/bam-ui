const colors = require('windicss/colors')
const typography = require('windicss/plugin/typography')

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  variants: {
    extend: {},
  },
  plugins: [],
  theme: {
    extend: {
      zIndex: {
        '-1': '-1',
      },
      screens: {
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px',
        '2xl': '1600px',
      },
    },
  },
}
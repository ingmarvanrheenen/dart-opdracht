/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        // Brand palette derived from HSL(14,98%,50%) -> #FC3D03
        brand: {
          50: '#fff0e6',
          100: '#ffd4bf',
          200: '#ffb289',
          300: '#ff8a5b',
          400: '#ff6a3f',
          500: '#7a1b00', // much darker base
          600: '#5f1500',
          700: '#431000',
          800: '#2f0a00',
          900: '#170400'
        },

        // Replace commonly-used indigo/blue/sky with the brand tones so no green remains
        indigo: {
          50: '#fff0e6',
          100: '#ffd4bf',
          200: '#ffb289',
          300: '#ff8a5b',
          400: '#ff6a3f',
          500: '#7a1b00',
          600: '#5f1500',
          700: '#431000',
          800: '#2f0a00',
          900: '#170400'
        },
        blue: {
          50: '#fff0e6',
          100: '#ffd4bf',
          200: '#ffb289',
          300: '#ff8a5b',
          400: '#ff6a3f',
          500: '#7a1b00',
          600: '#5f1500',
          700: '#431000',
          800: '#2f0a00',
          900: '#170400'
        },
        sky: {
          50: '#fff0e6',
          100: '#ffd4bf',
          200: '#ffb289'
        }
      }
    }
  },
  plugins: [],
}

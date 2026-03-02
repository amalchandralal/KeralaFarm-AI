/** @type {import('tailwindcss').Config} */
export default {
  content: ['./client/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0faf0',
          100: '#dcf5dc',
          200: '#bbebbb',
          300: '#86d986',
          400: '#4ec24e',
          500: '#2da82d',
          600: '#1f8a1f',
          700: '#1a6e1a',
          800: '#175717',
          900: '#134813',
        },
        earth: {
          50: '#fdf8f0',
          100: '#faeedd',
          200: '#f4d9b0',
          300: '#ecbe7a',
          400: '#e29f42',
          500: '#d4851f',
          600: '#b96a15',
          700: '#9a5114',
          800: '#7d4117',
          900: '#673717',
        },
        leaf: '#2da82d',
        soil: '#8B5E3C',
        sky: '#87CEEB',
        paddy: '#C8B560',
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['system-ui', 'sans-serif'],
        mal: ['Noto Sans Malayalam', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

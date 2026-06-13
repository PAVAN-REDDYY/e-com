/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Fallseed palette — warm, earthy, minimalist.
        ink: '#1a1a18', // near-black for text
        bone: '#f7f5f0', // off-white background
        clay: '#b8865b', // warm accent (autumn / "fall")
        moss: '#6b7355', // secondary accent
        stone: {
          50: '#f7f5f0',
          100: '#eceae3',
          200: '#d9d5c9',
          300: '#bdb8a8',
          400: '#9a9384',
          500: '#7c7565',
          600: '#615b4e',
          700: '#4a463c',
          800: '#34312a',
          900: '#1a1a18',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
      },
      maxWidth: {
        content: '1200px',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

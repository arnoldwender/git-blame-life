/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blame: {
          bg: '#000000',
          dark: '#05000a',
          primary: '#cc44ff',
          glow: 'rgba(204, 68, 255, 0.4)',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scandown: {
          '0%': { top: '-5%' },
          '100%': { top: '105%' },
        },
        fadein: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        blink: 'blink 0.8s infinite',
        scandown: 'scandown 7s linear infinite',
        fadein: 'fadein 0.25s ease',
      },
    },
  },
  plugins: [],
};

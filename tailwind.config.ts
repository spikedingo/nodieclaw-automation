import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        slideInFromTop: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideOutFade: {
          '0%': { opacity: '1', maxHeight: '100px' },
          '100%': { opacity: '0', maxHeight: '0' },
        },
      },
      animation: {
        'slide-in': 'slideInFromTop 200ms ease-out',
        'slide-out': 'slideOutFade 200ms ease-in forwards',
      },
    },
  },
  plugins: [],
}
export default config

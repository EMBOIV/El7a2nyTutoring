import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          navy: '#1B2A44',
          navyDeep: '#162238',
          orange: '#F27405',
          orangeSoft: '#E66A00',
          gray: '#E6E6E6',
          grayMuted: '#CFCFCF',
          green: '#7BBF2A',
        },
        dark: {
          bg:      '#E6E6E6',
          surface: '#F4F4F4',
          card:    '#FFFFFF',
          border:  '#CFCFCF',
        },
      },
      animation: {
        'float':          'float 7s ease-in-out infinite',
        'float-delayed':  'float 7s ease-in-out 3.5s infinite',
        'float-slow':     'float 10s ease-in-out 1.5s infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'pulse-glow':     'pulse-glow 3s ease-in-out infinite',
        'slide-up':       'slide-up 0.6s ease-out both',
        'fade-in':        'fade-in 0.5s ease-out both',
        'bounce-slow':    'bounce 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-22px)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.35', transform: 'scale(1)' },
          '50%':      { opacity: '0.65', transform: 'scale(1.06)' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

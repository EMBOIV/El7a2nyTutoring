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
          navy:       '#1B2A44',
          navyDeep:   '#1B2A44',
          navyMid:    '#2A3F5F',
          orange:     '#F27405',
          orangeSoft: '#FF8A1F',
          gray:       '#E2E8F0',
          grayMuted:  '#CBD5E1',
          green:      '#22C55E',
        },
        light: {
          bg:      '#FFFFFF',
          surface: '#F5F7FA',
          card:    '#FFFFFF',
          border:  '#E2E8F0',
        },
        dark: {
          bg:      '#0F1C30',
          surface: 'rgba(255,255,255,0.04)',
          card:    'rgba(255,255,255,0.06)',
          border:  'rgba(255,255,255,0.09)',
        },
      },
      animation: {
        'float':         'float 7s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 3.5s infinite',
        'float-slow':    'float 10s ease-in-out 1.5s infinite',
        'orb-a':         'orb-drift-a 18s ease-in-out infinite',
        'orb-b':         'orb-drift-b 22s ease-in-out infinite',
        'orb-c':         'orb-drift-a 26s ease-in-out 4s infinite',
        'pulse-glow':    'pulse-glow 3s ease-in-out infinite',
        'slide-up':      'slide-up 0.6s ease-out both',
        'fade-in':       'fade-in 0.5s ease-out both',
        'bounce-slow':   'bounce 2s ease-in-out infinite',
        'spin-slow':     'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-24px)' },
        },
        'orb-drift-a': {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '33%':      { transform: 'translate(30px,-40px) scale(1.05)' },
          '66%':      { transform: 'translate(-20px,20px) scale(0.97)' },
        },
        'orb-drift-b': {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '40%':      { transform: 'translate(-40px,30px) scale(1.08)' },
          '70%':      { transform: 'translate(20px,-20px) scale(0.95)' },
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
      backgroundImage: {
        'hero-radial': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(242,116,5,0.15) 0%, transparent 60%)',
        'card-shine':  'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)',
      },
      boxShadow: {
        'glow-orange': '0 4px 24px rgba(242,116,5,0.20)',
        'glow-orange-lg': '0 8px 32px rgba(242,116,5,0.18)',
        'card-dark': '0 2px 16px rgba(27,42,68,0.08)',
        'card-hover': '0 8px 32px rgba(27,42,68,0.12), 0 0 0 1px rgba(242,116,5,0.10)',
      },
    },
  },
  plugins: [],
};

export default config;

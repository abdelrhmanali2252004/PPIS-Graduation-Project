/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        page: 'rgb(var(--color-page) / <alpha-value>)',
        offwhite: 'rgb(var(--color-page) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        body: 'rgb(var(--color-foreground) / <alpha-value>)',
        divider: 'rgb(var(--color-divider) / <alpha-value>)',
        slateMuted: 'rgb(var(--color-muted) / <alpha-value>)',
        footer: 'rgb(var(--color-footer) / <alpha-value>)',
        heading: 'rgb(var(--color-heading) / <alpha-value>)',
        nile: { DEFAULT: '#1B4C8C', dark: '#0D2F5E' },
        gold: '#C9A05D',
        success: '#059669',
        warning: '#D97706',
        danger: '#DC2626',
      },
      fontFamily: {
        cairo: ['Cairo', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 0 0 rgba(201, 160, 93, 0.55)',
          },
          '50%': {
            boxShadow: '0 0 22px 6px rgba(201, 160, 93, 0.35)',
          },
        },
        'pulse-ring': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.85' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        float: 'float 5s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.2s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 1.8s ease-in-out infinite',
        blink: 'blink 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

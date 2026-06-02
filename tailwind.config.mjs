/** @type {import('tailwindcss').Config} */

// Helper: reference a CSS variable as an RGB channel triplet so that
// Tailwind opacity modifiers (e.g. bg-gold-primary/30) keep working.
const withVar = (name) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: withVar('--color-background'),
        surface: withVar('--color-surface'),
        card: withVar('--color-card'),
        border: withVar('--color-border'),
        'gold-primary': withVar('--color-gold-primary'),
        'gold-light': withVar('--color-gold-light'),
        'text-primary': withVar('--color-text-primary'),
        'text-secondary': withVar('--color-text-secondary'),
        'accent-green': withVar('--color-accent-green'),
        'chart-blue': withVar('--color-chart-blue'),
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 8px 32px -8px rgb(var(--color-gold-primary) / 0.35)',
        'gold-lg': '0 0 40px -4px rgb(var(--color-gold-primary) / 0.25), 0 12px 40px -8px rgb(0 0 0 / 0.45)',
        soft: '0 4px 24px -6px rgb(var(--color-shadow) / 0.5)',
      },
      animation: {
        shimmer: 'shimmer 5s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'rgb(var(--color-text-secondary))',
            maxWidth: 'none',
            'h1, h2, h3, h4': {
              color: 'rgb(var(--color-text-primary))',
              fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
              fontWeight: '700',
            },
            h2: { marginTop: '2rem', marginBottom: '1rem' },
            h3: { marginTop: '1.5rem', marginBottom: '0.75rem' },
            a: {
              color: 'rgb(var(--color-gold-primary))',
              textDecoration: 'none',
              '&:hover': { color: 'rgb(var(--color-gold-light))' },
            },
            strong: { color: 'rgb(var(--color-text-primary))', fontWeight: '600' },
            blockquote: {
              borderLeftColor: 'rgb(var(--color-gold-primary))',
              borderLeftWidth: '4px',
              color: 'rgb(var(--color-text-secondary))',
              fontStyle: 'italic',
              paddingLeft: '1.5rem',
            },
            code: {
              color: 'rgb(var(--color-gold-primary))',
              backgroundColor: 'rgb(var(--color-card))',
              borderRadius: '4px',
              padding: '2px 6px',
              fontWeight: '400',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            pre: {
              backgroundColor: 'rgb(var(--color-card))',
              border: '1px solid rgb(var(--color-border))',
            },
            hr: { borderColor: 'rgb(var(--color-border))' },
            li: { color: 'rgb(var(--color-text-secondary))', marginTop: '0.375rem', marginBottom: '0.375rem' },
            'ul > li::marker': { color: 'rgb(var(--color-gold-primary))' },
            'ol > li::marker': { color: 'rgb(var(--color-gold-primary))' },
            p: { lineHeight: '1.8' },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

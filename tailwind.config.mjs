/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#111111',
        card: '#1a1a1a',
        border: '#2a2a2a',
        'gold-primary': '#D4AF37',
        'gold-light': '#F0CC5A',
        'text-primary': '#F5F5F5',
        'text-secondary': '#A0A0A0',
        'accent-green': '#22c55e',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Oswald', 'sans-serif'],
      },
      animation: {
        shimmer: 'shimmer 5s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#A0A0A0',
            maxWidth: 'none',
            'h1, h2, h3, h4': {
              color: '#F5F5F5',
              fontFamily: '"Oswald", sans-serif',
              fontWeight: '700',
            },
            h2: { marginTop: '2rem', marginBottom: '1rem' },
            h3: { marginTop: '1.5rem', marginBottom: '0.75rem' },
            a: {
              color: '#D4AF37',
              textDecoration: 'none',
              '&:hover': { color: '#F0CC5A' },
            },
            strong: { color: '#F5F5F5', fontWeight: '600' },
            blockquote: {
              borderLeftColor: '#D4AF37',
              borderLeftWidth: '4px',
              color: '#A0A0A0',
              fontStyle: 'italic',
              paddingLeft: '1.5rem',
            },
            code: {
              color: '#D4AF37',
              backgroundColor: '#1a1a1a',
              borderRadius: '4px',
              padding: '2px 6px',
              fontWeight: '400',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            pre: {
              backgroundColor: '#1a1a1a',
              border: '1px solid #2a2a2a',
            },
            hr: { borderColor: '#2a2a2a' },
            li: { color: '#A0A0A0', marginTop: '0.375rem', marginBottom: '0.375rem' },
            'ul > li::marker': { color: '#D4AF37' },
            'ol > li::marker': { color: '#D4AF37' },
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

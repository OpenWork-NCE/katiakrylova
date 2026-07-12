import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
        },
        text: {
          primary: 'var(--text-primary)',
          muted: 'var(--text-muted)',
        },
        accent: 'var(--accent)',
        border: 'var(--border)',
      },
      fontFamily: {
        sans: ['var(--font-body)'],
        body: ['var(--font-body)'],
        hand: ['var(--font-hand)'],
        display: ['var(--font-hand)'],
      },
      fontWeight: {
        regular: 'var(--font-weight-regular)',
        bold: 'var(--font-weight-bold)',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '32px',
        xl: '64px',
        '2xl': '128px',
      },
    },
  },
  plugins: [typography],
}

export default config

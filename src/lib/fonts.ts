import { Architects_Daughter } from 'next/font/google'
import localFont from 'next/font/local'

/** Display / titles — self-hosted via next/font (no Google CSS @import waterfall). */
export const fontHand = Architects_Daughter({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-hand',
})

/** Body — Prestige Elite (local WOFF). */
export const fontBody = localFont({
  src: [
    {
      path: '../../public/fonts/PrestigeEliteStd.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/PrestigeEliteStd-Bd.woff',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-body',
  fallback: ['Courier New', 'Courier', 'monospace'],
})

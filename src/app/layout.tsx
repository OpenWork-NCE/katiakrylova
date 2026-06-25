import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Katia Krylova',
  description: 'Réalisatrice / artiste visuelle',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}

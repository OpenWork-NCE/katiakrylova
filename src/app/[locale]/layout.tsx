import '../globals.css'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FilmGrain } from '@/components/ui/FilmGrain'
import { DiaphragmTransition } from '@/components/3d/DiaphragmTransition'

const locales = ['fr', 'en'] as const

export const metadata: Metadata = {
  title: 'Katia Krylova',
  description: 'Réalisatrice / artiste visuelle',
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!locales.includes(locale as any)) notFound()
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale} />
          <main className="pt-16">
            <DiaphragmTransition>{children}</DiaphragmTransition>
          </main>
          <Footer locale={locale} />
          <FilmGrain />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

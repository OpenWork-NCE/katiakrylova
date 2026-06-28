import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ConditionalFooter } from '@/components/layout/ConditionalFooter'
import { FilmGrain } from '@/components/ui/FilmGrain'
import { PageTransitionProvider } from '@/components/transitions/PageTransitionProvider'

const locales = ['fr', 'en'] as const

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('title'),
    description: t('description'),
  }
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
          <PageTransitionProvider>
            <Header locale={locale} />
            <main className="pt-16">{children}</main>
            <ConditionalFooter locale={locale}>
              <Footer locale={locale} />
            </ConditionalFooter>
            <FilmGrain />
          </PageTransitionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

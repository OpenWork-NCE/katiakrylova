import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FilmGrain } from '@/components/ui/FilmGrain'

const locales = ['fr', 'en'] as const

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!locales.includes(locale as any)) notFound()

  return (
    <>
      <Header locale={locale} />
      <main className="pt-16">{children}</main>
      <Footer locale={locale} />
      <FilmGrain />
    </>
  )
}

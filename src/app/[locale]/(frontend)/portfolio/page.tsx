import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPortfolioCategories } from '@/lib/payload'
import { PortfolioHub, type HubCategory } from '@/components/portfolio/PortfolioHub'

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, categories] = await Promise.all([
    getTranslations('portfolio'),
    getPortfolioCategories(locale as 'fr' | 'en'),
  ])

  const hubCategories: HubCategory[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }))

  return <PortfolioHub locale={locale} title={t('title')} categories={hubCategories} />
}

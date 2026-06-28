import { Suspense } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPortfolio, getPortfolioCategories } from '@/lib/payload'
import { Section } from '@/components/ui/Section'
import { CategoryFilter } from '@/components/portfolio/CategoryFilter'
import { PortfolioGrid } from '@/components/3d/PortfolioGrid'

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, items, categories] = await Promise.all([
    getTranslations('portfolio'),
    getPortfolio(locale as 'fr' | 'en'),
    getPortfolioCategories(locale as 'fr' | 'en'),
  ])

  return (
    <Section>
      <h1 className="font-hand text-5xl mb-xl">{t('title')}</h1>
      <div className="mb-xl">
        <Suspense fallback={null}>
          <CategoryFilter categories={categories as any} />
        </Suspense>
      </div>
      <Suspense fallback={<p className="text-text-muted text-sm">{t('loading')}</p>}>
        <PortfolioGrid items={items} categories={categories as any} locale={locale} />
      </Suspense>
    </Section>
  )
}
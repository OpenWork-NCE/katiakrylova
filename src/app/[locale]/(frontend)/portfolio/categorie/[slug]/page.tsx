import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPortfolioByCategory, getPortfolioCategories } from '@/lib/payload'
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid'
import { PortfolioCategoryNav } from '@/components/portfolio/PortfolioCategoryNav'
import { HUB_CATEGORY_SLUGS, type HubCategory } from '@/components/portfolio/PortfolioHub'
import { Suspense } from 'react'
import '@/styles/portfolio-category.css'

const FALLBACK_BG = '/images/Fond Portfolio.jpg'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export const revalidate = 600

export function generateStaticParams() {
  return ['fr', 'en'].flatMap((locale) =>
    HUB_CATEGORY_SLUGS.map((slug) => ({ locale, slug })),
  )
}

export default async function PortfolioCategoryPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  if (!(HUB_CATEGORY_SLUGS as readonly string[]).includes(slug)) {
    notFound()
  }

  const [t, categories] = await Promise.all([
    getTranslations('portfolio'),
    getPortfolioCategories(locale as 'fr' | 'en'),
  ])

  const category = categories.find((c) => c.slug === slug)
  if (!category) notFound()

  // Category-scoped fetch only (not entire portfolio)
  const filtered = await getPortfolioByCategory(category.id, locale as 'fr' | 'en')

  const hubCategories: HubCategory[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }))

  return (
    <div className="portfolio-category">
      <div
        className="portfolio-category__bg"
        style={{ backgroundImage: `url('${FALLBACK_BG}')` }}
        aria-hidden
      />
      <div className="portfolio-category__scrim" aria-hidden />
      <div className="portfolio-category__vignette" aria-hidden />

      <div className="portfolio-category__inner">
        <PortfolioCategoryNav
          locale={locale}
          categories={hubCategories}
          activeSlug={slug}
          backLabel={t('backToHub')}
        />
        <h1 className="portfolio-category__title">{category.name}</h1>
        {filtered.length === 0 ? (
          <p className="portfolio-category__empty">{t('emptyCategory')}</p>
        ) : (
          <Suspense fallback={<p className="portfolio-category__empty text-sm">{t('loading')}</p>}>
            {/* ?view= is read client-side so the route stays ISR-cacheable */}
            <PortfolioGrid items={filtered} />
          </Suspense>
        )}
      </div>
    </div>
  )
}

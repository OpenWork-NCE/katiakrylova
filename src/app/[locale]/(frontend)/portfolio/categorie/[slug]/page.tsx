import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPortfolio, getPortfolioCategories } from '@/lib/payload'
import type { Portfolio, PortfolioCategory } from '@/payload-types'
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid'
import { PortfolioCategoryNav } from '@/components/portfolio/PortfolioCategoryNav'
import { HUB_CATEGORY_SLUGS, type HubCategory } from '@/components/portfolio/PortfolioHub'
import { Suspense } from 'react'
import '@/styles/portfolio-category.css'

const FALLBACK_BG = '/images/Fond Portfolio.jpg'

type Props = {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ view?: string }>
}

function categorySlugOf(item: Portfolio): string {
  const cat = item.category
  if (typeof cat === 'object' && cat !== null) return (cat as PortfolioCategory).slug
  return ''
}

export default async function PortfolioCategoryPage({ params, searchParams }: Props) {
  const { locale, slug } = await params
  const { view } = await searchParams
  setRequestLocale(locale)

  if (!(HUB_CATEGORY_SLUGS as readonly string[]).includes(slug)) {
    notFound()
  }

  const [t, items, categories] = await Promise.all([
    getTranslations('portfolio'),
    getPortfolio(locale as 'fr' | 'en'),
    getPortfolioCategories(locale as 'fr' | 'en'),
  ])

  const category = categories.find((c) => c.slug === slug)
  if (!category) notFound()

  const filtered = items.filter((p) => categorySlugOf(p) === slug)

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
            <PortfolioGrid items={filtered} initialViewSlug={view ?? null} />
          </Suspense>
        )}
      </div>
    </div>
  )
}

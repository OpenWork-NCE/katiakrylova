import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPortfolio, getPortfolioCategories } from '@/lib/payload'
import type { Portfolio, PortfolioCategory } from '@/payload-types'
import { Section } from '@/components/ui/Section'
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid'
import { PortfolioCategoryNav } from '@/components/portfolio/PortfolioCategoryNav'
import { HUB_CATEGORY_SLUGS, type HubCategory } from '@/components/portfolio/PortfolioHub'
import { Suspense } from 'react'

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
    <Section>
      <PortfolioCategoryNav
        locale={locale}
        categories={hubCategories}
        activeSlug={slug}
        backLabel={t('backToHub')}
      />
      <h1 className="font-hand text-5xl mb-xl">{category.name}</h1>
      {filtered.length === 0 ? (
        <p className="text-text-muted">{t('emptyCategory')}</p>
      ) : (
        <Suspense fallback={<p className="text-text-muted text-sm">{t('loading')}</p>}>
          <PortfolioGrid items={filtered} initialViewSlug={view ?? null} />
        </Suspense>
      )}
    </Section>
  )
}

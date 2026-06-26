import { getPortfolio, getPortfolioCategories } from '@/lib/payload'
import { Section } from '@/components/ui/Section'
import { CategoryFilter } from '@/components/portfolio/CategoryFilter'
import { PortfolioGrid } from '@/components/3d/PortfolioGrid'

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [items, categories] = await Promise.all([
    getPortfolio(locale as 'fr' | 'en'),
    getPortfolioCategories(locale as 'fr' | 'en'),
  ])

  return (
    <Section>
      <h1 className="font-hand text-5xl mb-xl">Portfolio</h1>
      <div className="mb-xl">
        <CategoryFilter categories={categories as any} />
      </div>
      <PortfolioGrid items={items} categories={categories as any} locale={locale} />
    </Section>
  )
}

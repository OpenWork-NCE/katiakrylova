import { redirect } from 'next/navigation'
import { getPortfolio } from '@/lib/payload'
import type { PortfolioCategory } from '@/payload-types'

type Props = { params: Promise<{ locale: string; slug: string }> }

/** Legacy detail URLs → category page with viewer open on that work. */
export default async function PortfolioItemPage({ params }: Props) {
  const { locale, slug } = await params
  const items = await getPortfolio(locale as 'fr' | 'en')
  const item = items.find((p) => p.slug === slug)
  const cat =
    item && typeof item.category === 'object' && item.category
      ? (item.category as PortfolioCategory).slug
      : null

  if (cat) {
    redirect(`/${locale}/portfolio/categorie/${cat}?view=${slug}`)
  }
  redirect(`/${locale}/portfolio`)
}
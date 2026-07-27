import { redirect } from 'next/navigation'
import { getPortfolioBySlug } from '@/lib/payload'
import type { PortfolioCategory } from '@/payload-types'

type Props = { params: Promise<{ locale: string; slug: string }> }

export const revalidate = 600

/** Legacy detail URLs → category page with viewer open on that work. */
export default async function PortfolioItemPage({ params }: Props) {
  const { locale, slug } = await params
  const item = await getPortfolioBySlug(slug, locale as 'fr' | 'en')
  const cat =
    item && typeof item.category === 'object' && item.category
      ? (item.category as PortfolioCategory).slug
      : null

  if (cat) {
    redirect(`/${locale}/portfolio/categorie/${cat}?view=${slug}`)
  }
  redirect(`/${locale}/portfolio`)
}

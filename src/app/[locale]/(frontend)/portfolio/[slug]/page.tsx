import { redirect } from 'next/navigation'

type Props = { params: Promise<{ locale: string; slug: string }> }

/** Legacy detail URLs open the in-page gallery viewer instead. */
export default async function PortfolioItemPage({ params }: Props) {
  const { locale, slug } = await params
  redirect(`/${locale}/portfolio?view=${slug}`)
}
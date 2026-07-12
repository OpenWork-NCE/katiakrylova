import Link from 'next/link'
import '@/styles/portfolio-hub.css'

export type HubCategory = {
  id: string | number
  name: string
  slug: string
}

const BACKDROP = '/images/bg_portfolio.jpg'

/** Rubriques affichées sur le hub (ordre d’intention). Letter exclu volontairement. */
export const HUB_CATEGORY_SLUGS = ['acryliques', 'collage', 'gravure', 'linos', 'identity'] as const

type Props = {
  locale: string
  title: string
  categories: HubCategory[]
}

export function PortfolioHub({ locale, title, categories }: Props) {
  const bySlug = new Map(categories.map((c) => [c.slug, c]))
  const ordered = HUB_CATEGORY_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (c): c is HubCategory => Boolean(c),
  )

  return (
    <div className="portfolio-hub">
      <div
        className="portfolio-hub__bg"
        style={{ backgroundImage: `url('${BACKDROP}')` }}
        aria-hidden
      />
      <div className="portfolio-hub__scrim" aria-hidden />
      <div className="portfolio-hub__vignette" aria-hidden />

      <div className="portfolio-hub__inner">
        <h1 className="portfolio-hub__title">{title}</h1>
        <ul className="portfolio-hub__list">
          {ordered.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/${locale}/portfolio/categorie/${cat.slug}`}
                className="portfolio-hub__link"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

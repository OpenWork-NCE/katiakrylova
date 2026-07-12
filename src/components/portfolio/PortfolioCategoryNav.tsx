import Link from 'next/link'
import { HUB_CATEGORY_SLUGS, type HubCategory } from './PortfolioHub'

type Props = {
  locale: string
  categories: HubCategory[]
  activeSlug: string
  backLabel: string
}

export function PortfolioCategoryNav({ locale, categories, activeSlug, backLabel }: Props) {
  const bySlug = new Map(categories.map((c) => [c.slug, c]))
  const ordered = HUB_CATEGORY_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (c): c is HubCategory => Boolean(c),
  )

  return (
    <div className="mb-xl space-y-md">
      <Link
        href={`/${locale}/portfolio`}
        className="inline-block text-sm uppercase tracking-widest text-text-muted transition hover:text-accent"
      >
        {backLabel}
      </Link>
      <nav
        className="flex flex-wrap gap-md text-sm uppercase tracking-widest"
        aria-label="Rubriques portfolio"
      >
        {ordered.map((cat) => {
          const active = cat.slug === activeSlug
          return (
            <Link
              key={cat.id}
              href={`/${locale}/portfolio/categorie/${cat.slug}`}
              className={
                active
                  ? 'text-accent'
                  : 'text-text-muted transition hover:text-text-primary'
              }
              aria-current={active ? 'page' : undefined}
            >
              {cat.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

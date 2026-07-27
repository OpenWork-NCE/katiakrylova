import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

type Adj = { slug: string; title: string; coverImage?: { url?: string | null } }

export async function ProjectNav({ prev, next, locale }: { prev?: Adj; next?: Adj; locale: string }) {
  const t = await getTranslations('projectNav')

  return (
    <nav className="mt-xl grid grid-cols-2 border-t border-border md:mt-2xl">
      {prev ? (
        <Link
          href={`/${locale}/projects/${prev.slug}`}
          className="group p-lg transition hover:bg-bg-secondary sm:p-xl"
        >
          <div className="mb-sm text-xs uppercase tracking-widest text-text-muted">{t('prev')}</div>
          <div className="font-hand text-xl sm:text-2xl">{prev.title}</div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/${locale}/projects/${next.slug}`}
          className="group p-lg text-right transition hover:bg-bg-secondary sm:p-xl"
        >
          <div className="mb-sm text-xs uppercase tracking-widest text-text-muted">{t('next')}</div>
          <div className="font-hand text-xl sm:text-2xl">{next.title}</div>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  )
}
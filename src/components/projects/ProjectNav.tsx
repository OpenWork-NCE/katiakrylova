import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

type Adj = { slug: string; title: string; coverImage?: { url?: string | null } }

export async function ProjectNav({ prev, next, locale }: { prev?: Adj; next?: Adj; locale: string }) {
  const t = await getTranslations('projectNav')

  return (
    <nav className="grid grid-cols-2 border-t border-border mt-2xl">
      {prev && (
        <Link href={`/${locale}/projects/${prev.slug}`} className="p-xl hover:bg-bg-secondary transition group">
          <div className="text-text-muted text-xs uppercase tracking-widest mb-sm">{t('prev')}</div>
          <div className="font-hand text-2xl">{prev.title}</div>
        </Link>
      )}
      {next && (
        <Link href={`/${locale}/projects/${next.slug}`} className="p-xl hover:bg-bg-secondary transition group text-right">
          <div className="text-text-muted text-xs uppercase tracking-widest mb-sm">{t('next')}</div>
          <div className="font-hand text-2xl">{next.title}</div>
        </Link>
      )}
    </nav>
  )
}
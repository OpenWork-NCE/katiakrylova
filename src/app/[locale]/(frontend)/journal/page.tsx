import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getJournal, getJournalEntries } from '@/lib/payload'
import { getMediaUrl } from '@/lib/utils'
import { Section } from '@/components/ui/Section'
import '@/styles/journal-page.css'

const FALLBACK_BG = '/images/Fond News.jpg'

export default async function JournalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const loc = locale as 'fr' | 'en'
  const [t, entries, journal] = await Promise.all([
    getTranslations('journal'),
    getJournalEntries(loc),
    getJournal(loc),
  ])
  /** CMS photo, sinon Fond News.jpg (même logique Contact / Portfolio catégorie) */
  const backgroundUrl = getMediaUrl(journal?.photo) ?? FALLBACK_BG

  return (
    <div className="journal-page">
      <div
        className="journal-page__bg"
        style={{ backgroundImage: `url('${backgroundUrl}')` }}
        aria-hidden
      />
      <div className="journal-page__scrim" aria-hidden />
      <div className="journal-page__vignette" aria-hidden />

      <Section className="journal-page__content">
        <h1 className="mb-lg font-hand text-[clamp(1.85rem,8vw,3rem)] md:mb-xl">{t('title')}</h1>
        {entries.length === 0 && <p className="text-text-muted">{t('empty')}</p>}
        <ul className="space-y-xl">
          {entries.map((e: any) => (
            <li key={e.id} className="border-b border-border pb-xl">
              <Link href={`/${locale}/journal/${e.slug}`} className="block group">
                <p className="text-text-muted text-xs uppercase tracking-widest">
                  {new Date(e.createdAt).toLocaleDateString(locale, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <h2 className="font-hand text-3xl mt-sm group-hover:text-accent transition">{e.title}</h2>
                {e.excerpt && <p className="mt-sm text-text-muted">{e.excerpt}</p>}
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}
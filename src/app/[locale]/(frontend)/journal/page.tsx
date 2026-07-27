import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getJournal, getJournalEntries } from '@/lib/payload'
import { getMediaUrl } from '@/lib/utils'
import { JournalListView, type JournalListItem } from '@/components/journal/JournalListView'

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

  const list: JournalListItem[] = entries.map((e) => ({
    id: e.id,
    slug: e.slug,
    title: e.title,
    excerpt: e.excerpt,
    createdAt: e.createdAt,
  }))

  return (
    <JournalListView
      locale={locale}
      backgroundUrl={backgroundUrl}
      title={t('title')}
      emptyLabel={t('empty')}
      entries={list}
    />
  )
}

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getJournal, getJournalEntries } from '@/lib/payload'
import { getMediaUrl } from '@/lib/utils'
import type { Media } from '@/payload-types'
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
  const backgroundUrl = getMediaUrl(journal?.photo) ?? FALLBACK_BG

  const list: JournalListItem[] = entries.map((e) => {
    const cover = e.coverImage
    const coverMedia = typeof cover === 'object' && cover !== null ? (cover as Media) : null
    return {
      id: e.id,
      slug: e.slug,
      title: e.title,
      excerpt: e.excerpt,
      coverUrl: getMediaUrl(cover),
      coverAlt: coverMedia?.alt?.trim() || e.title,
    }
  })

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

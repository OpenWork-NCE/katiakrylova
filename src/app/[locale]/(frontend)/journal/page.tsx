import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getJournal, getJournalEntries } from '@/lib/payload'
import { getMediaUrl } from '@/lib/utils'
import type { Media } from '@/payload-types'
import { JournalListView, type JournalListItem } from '@/components/journal/JournalListView'

/** Portrait poster — background-position is anchored bottom (see journal-page.css). */
const FALLBACK_BG = '/images/Plus-de-lait-affiche.jpg'

export const revalidate = 600

export default async function JournalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const loc = locale as 'fr' | 'en'
  // Entries are already newest-first (`sort: '-createdAt'` in getJournalEntries).
  const [t, entries, journal] = await Promise.all([
    getTranslations('journal'),
    getJournalEntries(loc),
    getJournal(loc),
  ])

  // Background = cover of the most recent news (hd for full-bleed).
  // Fallbacks: CMS journal photo → static Plus de lait affiche (empty list / no cover).
  const latestCoverUrl = entries[0] ? getMediaUrl(entries[0].coverImage, 'hd') : null
  const backgroundUrl =
    latestCoverUrl ?? getMediaUrl(journal?.photo, 'hd') ?? FALLBACK_BG

  const list: JournalListItem[] = entries.map((e) => {
    const cover = e.coverImage
    const coverMedia = typeof cover === 'object' && cover !== null ? (cover as Media) : null
    return {
      id: e.id,
      slug: e.slug,
      title: e.title,
      excerpt: e.excerpt,
      coverUrl: getMediaUrl(cover, 'card'),
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

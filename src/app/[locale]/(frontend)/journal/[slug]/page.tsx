import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getJournalEntryBySlug, getJournalEntrySlugs, getProjectBySlug } from '@/lib/payload'
import { getMediaUrl } from '@/lib/utils'
import type { Media, Project } from '@/payload-types'
import {
  JournalDetailView,
  type JournalDetailCover,
  type JournalDetailProject,
} from '@/components/journal/JournalDetailView'

type Props = { params: Promise<{ locale: string; slug: string }> }

export const revalidate = 600

export async function generateStaticParams() {
  const slugs = await getJournalEntrySlugs()
  return ['fr', 'en'].flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

/** News slug → project slug when CMS relationship not yet set. */
const RELATED_PROJECT_FALLBACK: Record<string, string> = {
  'plus-de-lait': 'plus-de-lait',
  'la-petite-faucheuse-news': 'la-petite-faucheuse',
}

export default async function JournalDetail({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const loc = locale as 'fr' | 'en'
  const [t, entry] = await Promise.all([
    getTranslations('journal'),
    getJournalEntryBySlug(slug, loc),
  ])
  if (!entry) notFound()

  const coverMedia =
    typeof entry.coverImage === 'object' && entry.coverImage !== null
      ? (entry.coverImage as Media)
      : null
  const coverUrl = getMediaUrl(entry.coverImage, 'hd')
  const cover: JournalDetailCover | null =
    coverUrl && coverMedia
      ? {
          url: coverUrl,
          alt: coverMedia.alt?.trim() || entry.title,
          width: coverMedia.width && coverMedia.width > 0 ? coverMedia.width : 1600,
          height: coverMedia.height && coverMedia.height > 0 ? coverMedia.height : 1200,
        }
      : coverUrl
        ? { url: coverUrl, alt: entry.title, width: 1600, height: 1200 }
        : null

  let project: JournalDetailProject | null = null
  const related =
    typeof entry.relatedProject === 'object' && entry.relatedProject !== null
      ? (entry.relatedProject as Project)
      : null

  if (related?.slug) {
    project = { slug: related.slug, title: related.title }
  } else {
    const fallbackSlug = RELATED_PROJECT_FALLBACK[entry.slug]
    if (fallbackSlug) {
      const p = await getProjectBySlug(fallbackSlug, loc)
      if (p) project = { slug: p.slug, title: p.title }
      else project = { slug: fallbackSlug, title: fallbackSlug === 'plus-de-lait' ? 'Plus de lait' : 'La petite faucheuse' }
    }
  }

  return (
    <JournalDetailView
      locale={locale}
      backLabel={t('back')}
      title={entry.title}
      cover={cover}
      body={entry.content ? <RichText data={entry.content} /> : null}
      project={project}
      viewProjectLabel={t('viewProject')}
    />
  )
}

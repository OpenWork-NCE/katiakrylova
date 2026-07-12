import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getJournalEntryBySlug } from '@/lib/payload'
import { getMediaUrl } from '@/lib/utils'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Section } from '@/components/ui/Section'

type Props = { params: Promise<{ locale: string; slug: string }> }

export default async function JournalDetail({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const [t, entry] = await Promise.all([
    getTranslations('journal'),
    getJournalEntryBySlug(slug, locale as 'fr' | 'en'),
  ])
  if (!entry) notFound()

  const cover = getMediaUrl(entry.coverImage)
  const coverAlt =
    typeof entry.coverImage === 'object' && entry.coverImage && 'alt' in entry.coverImage
      ? (entry.coverImage.alt ?? entry.title)
      : entry.title

  return (
    <article>
      <header className="relative pt-xl pb-lg">
        <div className="mx-auto w-full max-w-6xl px-md">
          <div className="mb-md">
            <Link
              href={`/${locale}/journal`}
              className="text-sm uppercase tracking-widest text-text-muted transition hover:text-accent"
            >
              {t('back')}
            </Link>
          </div>

          {cover && (
            <div className="relative mx-auto aspect-video w-full max-w-[min(100%,48rem)] overflow-hidden border border-white/10 bg-bg-secondary shadow-[0_16px_48px_rgba(0,0,0,0.45)]">
              <Image
                src={cover}
                alt={coverAlt}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 768px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/50 via-transparent to-transparent" />
            </div>
          )}
        </div>
      </header>

      <Section>
        <div className="max-w-prose mx-auto">
          <p className="text-text-muted text-xs uppercase tracking-widest">
            {new Date(entry.createdAt).toLocaleDateString(locale, {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <h1 className="font-hand text-5xl mt-sm leading-none">{entry.title}</h1>
          {entry.content && (
            <div className="mt-xl">
              <RichText data={entry.content} />
            </div>
          )}
        </div>
      </Section>
    </article>
  )
}
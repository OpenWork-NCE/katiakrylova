import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getJournalEntryBySlug } from '@/lib/payload'
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

  return (
    <Section>
      <Link href={`/${locale}/journal`} className="text-sm uppercase tracking-widest text-text-muted hover:text-accent">
        {t('back')}
      </Link>
      <article className="mt-xl max-w-prose mx-auto">
        <p className="text-text-muted text-xs uppercase tracking-widest">
          {new Date(entry.createdAt).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <h1 className="font-hand text-5xl mt-sm">{entry.title}</h1>
        {entry.content && <div className="mt-xl"><RichText data={entry.content} /></div>}
      </article>
    </Section>
  )
}
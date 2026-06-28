import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getJournalEntries } from '@/lib/payload'
import { Section } from '@/components/ui/Section'

export default async function JournalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, entries] = await Promise.all([
    getTranslations('journal'),
    getJournalEntries(locale as 'fr' | 'en'),
  ])

  return (
    <Section>
      <h1 className="font-hand text-5xl mb-xl">{t('title')}</h1>
      {entries.length === 0 && <p className="text-text-muted">{t('empty')}</p>}
      <ul className="space-y-xl">
        {entries.map((e: any) => (
          <li key={e.id} className="border-b border-border pb-xl">
            <Link href={`/${locale}/journal/${e.slug}`} className="block group">
              <p className="text-text-muted text-xs uppercase tracking-widest">
                {new Date(e.createdAt).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <h2 className="font-hand text-3xl mt-sm group-hover:text-accent transition">{e.title}</h2>
              {e.excerpt && <p className="mt-sm text-text-muted">{e.excerpt}</p>}
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  )
}
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getAbout } from '@/lib/payload'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Section } from '@/components/ui/Section'

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, about] = await Promise.all([
    getTranslations('about'),
    getAbout(locale as 'fr' | 'en'),
  ])

  return (
    <Section>
      <h1 className="font-hand text-5xl mb-xl">{t('title')}</h1>
      {about?.bio && (
        <div className="max-w-prose text-lg">
          <RichText data={about.bio} />
        </div>
      )}
    </Section>
  )
}
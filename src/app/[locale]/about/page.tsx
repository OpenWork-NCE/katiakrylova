import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getAbout } from '@/lib/payload'
import { getMediaUrl } from '@/lib/utils'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Section } from '@/components/ui/Section'
import '@/styles/about-page.css'

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, about] = await Promise.all([
    getTranslations('about'),
    getAbout(locale as 'fr' | 'en'),
  ])
  const backgroundUrl = getMediaUrl(about?.photo)

  return (
    <div className="about-page">
      {backgroundUrl && (
        <>
          <div
            className="about-page__bg"
            style={{ backgroundImage: `url('${backgroundUrl}')` }}
            aria-hidden
          />
          <div className="about-page__scrim" aria-hidden />
          <div className="about-page__vignette" aria-hidden />
        </>
      )}
      <Section className="about-page__content">
        <h1 className="font-hand text-5xl mb-xl">{t('title')}</h1>
        {about?.bio && (
          <div className="max-w-prose text-lg">
            <RichText data={about.bio} />
          </div>
        )}
      </Section>
    </div>
  )
}
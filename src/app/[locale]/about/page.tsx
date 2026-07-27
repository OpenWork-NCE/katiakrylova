import { getTranslations, setRequestLocale } from 'next-intl/server'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getAbout } from '@/lib/payload'
import { getMediaUrl } from '@/lib/utils'
import { AboutView } from '@/components/about/AboutView'

/** Static portrait — public/images/profilepicture.jpg (1125×1398). */
const PROFILE_STATIC = {
  url: '/images/profilepicture.jpg',
  width: 1125,
  height: 1398,
} as const

export const revalidate = 600

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, about] = await Promise.all([
    getTranslations('about'),
    getAbout(locale as 'fr' | 'en'),
  ])

  // Fixed portrait asset (public/images/profilepicture.jpg)
  const profileUrl = PROFILE_STATIC.url
  const profileAlt = t('title')

  /** Fond type page Projets — CMS `photo`, fallback public/images/maman.jpg */
  const backgroundUrl = getMediaUrl(about?.photo, 'hd') ?? '/images/maman.jpg'
  const visionUrl = getMediaUrl(about?.visionImage, 'hd')

  return (
    <AboutView
      title={t('title')}
      backgroundUrl={backgroundUrl}
      profileUrl={profileUrl}
      profileAlt={profileAlt}
      profileWidth={PROFILE_STATIC.width}
      profileHeight={PROFILE_STATIC.height}
      bio={about?.bio ? <RichText data={about.bio} /> : null}
      visionUrl={visionUrl}
      visionText={about?.visionText ?? null}
    />
  )
}

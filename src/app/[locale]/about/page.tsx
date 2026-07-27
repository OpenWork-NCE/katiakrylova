import { getTranslations, setRequestLocale } from 'next-intl/server'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getAbout } from '@/lib/payload'
import { getMediaUrl } from '@/lib/utils'
import type { Media } from '@/payload-types'
import { AboutView } from '@/components/about/AboutView'

/** Fallback when CMS media has no width/height (Profile Picture.png = 600×746). */
const PROFILE_FALLBACK = { width: 600, height: 746 }

export const revalidate = 600

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, about] = await Promise.all([
    getTranslations('about'),
    getAbout(locale as 'fr' | 'en'),
  ])

  const profile = about?.profileImage
  const profileUrl = getMediaUrl(profile, 'hd')
  const profileMedia = typeof profile === 'object' && profile !== null ? (profile as Media) : null
  const profileAlt = profileMedia?.alt?.trim() || t('title')

  /** Fond type page Projets — CMS `photo`, fallback public/images/maman.jpg */
  const backgroundUrl = getMediaUrl(about?.photo, 'hd') ?? '/images/maman.jpg'
  const visionUrl = getMediaUrl(about?.visionImage, 'hd')

  return (
    <AboutView
      title={t('title')}
      backgroundUrl={backgroundUrl}
      profileUrl={profileUrl}
      profileAlt={profileAlt}
      profileWidth={profileMedia?.width ?? PROFILE_FALLBACK.width}
      profileHeight={profileMedia?.height ?? PROFILE_FALLBACK.height}
      bio={about?.bio ? <RichText data={about.bio} /> : null}
      visionUrl={visionUrl}
      visionText={about?.visionText ?? null}
    />
  )
}

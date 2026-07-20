import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getAbout } from '@/lib/payload'
import { getMediaUrl } from '@/lib/utils'
import type { Media } from '@/payload-types'
import '@/styles/about-page.css'

/** Fallback when CMS media has no width/height (Profile Picture.png = 600×746). */
const PROFILE_FALLBACK = { width: 600, height: 746 }

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, about] = await Promise.all([
    getTranslations('about'),
    getAbout(locale as 'fr' | 'en'),
  ])

  const profile = about?.profileImage
  const profileUrl = getMediaUrl(profile)
  const profileMedia = typeof profile === 'object' && profile !== null ? (profile as Media) : null
  const profileAlt = profileMedia?.alt?.trim() || t('title')

  const gallery = (about?.gallery ?? [])
    .map((row) => {
      const url = getMediaUrl(row.image)
      if (!url) return null
      const media = typeof row.image === 'object' && row.image !== null ? (row.image as Media) : null
      return {
        id: row.id ?? url,
        url,
        alt: media?.alt?.trim() || '',
      }
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x))

  return (
    <div className="about-page">
      <div className="about-page__inner">
        <h1 className="about-page__title">{t('title')}</h1>

        <div className="about-page__main">
          <div className="about-page__bio">{about?.bio ? <RichText data={about.bio} /> : null}</div>

          {profileUrl ? (
            <aside className="about-page__aside" aria-hidden={false}>
              <div
                className="about-page__portrait"
                style={{
                  aspectRatio: `${profileMedia?.width ?? PROFILE_FALLBACK.width} / ${
                    profileMedia?.height ?? PROFILE_FALLBACK.height
                  }`,
                }}
              >
                <Image
                  src={profileUrl}
                  alt={profileAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top"
                  priority
                />
              </div>
            </aside>
          ) : null}
        </div>

        {gallery.length > 0 ? (
          <ul className="about-page__gallery">
            {gallery.map((item) => (
              <li key={item.id} className="about-page__frame">
                <Image
                  src={item.url}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}

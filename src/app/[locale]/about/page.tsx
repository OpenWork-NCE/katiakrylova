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

  /** Fond type page Projets — CMS `photo`, fallback public/images/maman.jpg */
  const backgroundUrl = getMediaUrl(about?.photo) ?? '/images/maman.jpg'
  const visionUrl = getMediaUrl(about?.visionImage)

  return (
    <div className="about-page">
      <section className="about-page__intro">
        <div className="about-page__intro-backdrop" aria-hidden>
          <div
            className="about-page__bg"
            style={{ backgroundImage: `url('${backgroundUrl}')` }}
          />
          <div className="about-page__scrim" />
          <div className="about-page__vignette" />
        </div>

        <div className="about-page__inner">
          <h1 className="about-page__title">{t('title')}</h1>

          <div className="about-page__main">
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

            <div className="about-page__bio">{about?.bio ? <RichText data={about.bio} /> : null}</div>
          </div>
        </div>
      </section>

      {visionUrl && about?.visionText ? (
        <section
          className="about-page__vision"
          style={{ backgroundImage: `url('${visionUrl}')` }}
        >
          <div className="about-page__vision-scrim" aria-hidden />
          <div className="about-page__vision-copy">
            <p>{about.visionText}</p>
          </div>
        </section>
      ) : null}
    </div>
  )
}

import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getHome } from '@/lib/payload'
import { getMediaUrl } from '@/lib/utils'
import { HomeHero } from '@/components/home/HomeHero'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const loc = locale as 'fr' | 'en'
  const [t, home, homeFr] = await Promise.all([
    getTranslations('home'),
    getHome(loc),
    loc === 'en' ? getHome('fr') : Promise.resolve(null),
  ])
  const heroUrl = getMediaUrl(home?.heroImage)
  if (!heroUrl) return null

  const cmsTagline = home?.tagline?.trim()
  const taglineIsLocalized = cmsTagline && (loc === 'fr' || cmsTagline !== homeFr?.tagline?.trim())
  const subtitle = taglineIsLocalized ? cmsTagline : t('subtitle')

  return (
    <HomeHero
      locale={locale}
      heroUrl={heroUrl}
      role={t('role')}
      subtitle={subtitle}
      enterLabel={t('enterGallery')}
      enterHref={`/${locale}/projects`}
      scrollHint={t('scrollHint')}
    />
  )
}
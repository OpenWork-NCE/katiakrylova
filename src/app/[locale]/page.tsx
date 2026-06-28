import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getHome } from '@/lib/payload'
import { getMediaUrl } from '@/lib/utils'
import { HomeHero } from '@/components/home/HomeHero'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, home] = await Promise.all([
    getTranslations('home'),
    getHome(locale as 'fr' | 'en'),
  ])
  const heroUrl = getMediaUrl(home?.heroImage)
  if (!heroUrl) return null

  return (
    <HomeHero
      locale={locale}
      heroUrl={heroUrl}
      role={t('role')}
      subtitle={home?.tagline || t('subtitle')}
      enterLabel={t('enterGallery')}
      enterHref={`/${locale}/projects`}
      scrollHint={t('scrollHint')}
    />
  )
}
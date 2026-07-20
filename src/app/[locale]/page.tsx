import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getHome } from '@/lib/payload'
import { getMediaUrl } from '@/lib/utils'
import { HomeHero } from '@/components/home/HomeHero'

const DEFAULT_INTRO_FR =
  "Une image, deux images, une séquence de lumière et d'ombre. Collant à la chose filmée ou s'en décollant. Toute en subjectivité, je les peins, les triture, les malaxe, les desserre de leur étreinte « collet monté »."

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const loc = locale as 'fr' | 'en'
  const [t, home] = await Promise.all([getTranslations('home'), getHome(loc)])
  const heroUrl = getMediaUrl(home?.heroImage)
  if (!heroUrl) return null

  const role = home?.role?.trim() || t('role')
  const intro = home?.intro?.trim() || (loc === 'fr' ? DEFAULT_INTRO_FR : t('intro'))
  const enterLabel = home?.ctaLabel?.trim() || t('enterGallery')

  return (
    <HomeHero
      locale={locale}
      heroUrl={heroUrl}
      role={role}
      intro={intro}
      enterLabel={enterLabel}
      enterHref={`/${locale}/projects`}
    />
  )
}

import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { getHome } from '@/lib/payload'
import { getMediaUrl } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [t, home] = await Promise.all([
    getTranslations('home'),
    getHome(locale as 'fr' | 'en'),
  ])
  const heroUrl = getMediaUrl(home?.heroImage)

  return (
    <section className="relative h-screen w-full">
      {heroUrl && (
        <Image
          src={heroUrl}
          alt=""
          fill
          priority
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/40 via-transparent to-bg-primary" />
      <div className="absolute bottom-xl left-0 right-0 px-md">
        <h1 className="font-hand text-[10vw] leading-none text-text-primary">Katia Krylova</h1>
        <p className="mt-md text-text-muted">{home?.tagline || t('tagline')}</p>
        <div className="mt-xl">
          <Button href={`/${locale}/projects`} variant="primary">{t('enter')}</Button>
        </div>
      </div>
    </section>
  )
}
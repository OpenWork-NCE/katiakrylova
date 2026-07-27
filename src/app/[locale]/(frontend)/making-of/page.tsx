import Link from 'next/link'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getMakingOfEntries } from '@/lib/payload'
import { Section } from '@/components/ui/Section'
import { getMediaDimensions, getMediaUrl } from '@/lib/utils'

export const revalidate = 600

export default async function MakingOfPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, items] = await Promise.all([
    getTranslations('makingOf'),
    getMakingOfEntries(locale as 'fr' | 'en'),
  ])

  return (
    <Section>
      <h1 className="font-hand text-5xl mb-xl">{t('title')}</h1>
      {items.length === 0 && <p className="text-text-muted">{t('empty')}</p>}
      <div className="grid md:grid-cols-2 gap-xl">
        {items.map((item) => {
          const cover = getMediaUrl(item.coverImage, 'card')
          const dims = getMediaDimensions(item.coverImage, 'card')
          return (
            <Link key={item.id} href={`/${locale}/making-of/${item.slug}`} className="group">
              {cover ? (
                <Image
                  src={cover}
                  alt={item.title}
                  width={dims.width ?? 800}
                  height={dims.height ?? 450}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={85}
                  className="w-full aspect-video object-cover"
                />
              ) : null}
              <h2 className="font-hand text-3xl mt-md group-hover:text-accent transition">{item.title}</h2>
              <p className="text-xs text-text-muted uppercase tracking-widest mt-xs">{item.year}</p>
            </Link>
          )
        })}
      </div>
    </Section>
  )
}

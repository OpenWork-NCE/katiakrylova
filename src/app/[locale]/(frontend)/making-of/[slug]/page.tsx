import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getMakingOfBySlug, getMakingOfSlugs } from '@/lib/payload'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Section } from '@/components/ui/Section'
import { ProjectGallery } from '@/components/projects/ProjectGallery'
import { getMediaUrl } from '@/lib/utils'
import type { Media } from '@/payload-types'

type Props = { params: Promise<{ locale: string; slug: string }> }

export const revalidate = 600

export async function generateStaticParams() {
  const slugs = await getMakingOfSlugs()
  return ['fr', 'en'].flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export default async function MakingOfDetail({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const t = await getTranslations('makingOf')
  const item = await getMakingOfBySlug(slug, locale as 'fr' | 'en')
  if (!item) notFound()

  const cover = getMediaUrl(item.coverImage, 'hd')

  const galleryImages =
    item.gallery
      ?.filter((g) => typeof g.image === 'object' && g.image !== null)
      .map((g) => ({
        image: g.image as Media,
      })) ?? []

  return (
    <article>
      <div className="relative h-[60vh] w-full">
        {cover ? (
          <Image
            src={cover}
            alt={item.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            quality={90}
          />
        ) : null}
        <Link
          href={`/${locale}/making-of`}
          className="absolute top-md right-md text-sm uppercase tracking-widest hover:text-accent"
        >
          {t('back')}
        </Link>
        <div className="absolute bottom-xl left-md right-md">
          <h1 className="font-hand text-5xl">{item.title}</h1>
          <p className="mt-md text-text-muted uppercase tracking-widest text-xs">{item.year}</p>
        </div>
      </div>

      {item.content ? (
        <Section>
          <div className="max-w-prose mx-auto">
            <RichText data={item.content} />
          </div>
        </Section>
      ) : null}

      {galleryImages.length > 0 ? (
        <Section>
          <ProjectGallery images={galleryImages} />
        </Section>
      ) : null}
    </article>
  )
}

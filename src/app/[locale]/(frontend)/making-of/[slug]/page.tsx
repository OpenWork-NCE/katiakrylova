import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPayloadClient } from '@/lib/payload'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Section } from '@/components/ui/Section'
import { ProjectGallery } from '@/components/projects/ProjectGallery'
import { getMediaUrl } from '@/lib/utils'

type Props = { params: Promise<{ locale: string; slug: string }> }

export default async function MakingOfDetail({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const t = await getTranslations('makingOf')
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'making-of',
    where: { slug: { equals: slug } },
locale: locale as 'fr' | 'en',
    limit: 1,
  })
  const item = docs[0] as any
  if (!item) notFound()

  const cover = getMediaUrl(item.coverImage)

  return (
    <article>
      <div className="relative h-[60vh] w-full">
        {cover && <Image src={cover} alt={item.title} fill className="object-cover" />}
        <Link href={`/${locale}/making-of`} className="absolute top-md right-md text-sm uppercase tracking-widest hover:text-accent">
          {t('back')}
        </Link>
        <div className="absolute bottom-xl left-md right-md">
          <h1 className="font-hand text-5xl">{item.title}</h1>
          <p className="mt-md text-text-muted uppercase tracking-widest text-xs">{item.year}</p>
        </div>
      </div>

      {item.content && (
        <Section>
          <div className="max-w-prose mx-auto"><RichText data={item.content} /></div>
        </Section>
      )}

      <Section>
        <ProjectGallery images={item.gallery?.map((g: any) => ({ image: g.image })) ?? []} />
      </Section>
    </article>
  )
}
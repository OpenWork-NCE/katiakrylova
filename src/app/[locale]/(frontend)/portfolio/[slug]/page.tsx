import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { Section } from '@/components/ui/Section'
import { ProjectGallery } from '@/components/projects/ProjectGallery'

type Props = { params: Promise<{ locale: string; slug: string }> }

export default async function PortfolioItemPage({ params }: Props) {
  const { locale, slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'portfolio',
    where: { slug: { equals: slug } },
    locale: locale as 'fr' | 'en',
    limit: 1,
  })
  const item = docs[0] as any
  if (!item) notFound()

  const cover = typeof item.coverImage === 'object' ? item.coverImage?.url : null

  return (
    <article>
      <div className="relative h-[70vh] w-full">
        {cover && <Image src={cover} alt={item.title} fill className="object-cover" />}
        <Link href={`/${locale}/portfolio`} className="absolute top-md right-md text-sm uppercase tracking-widest hover:text-accent">
          ← Retour
        </Link>
        <div className="absolute bottom-xl left-md right-md">
          <h1 className="font-hand text-6xl">{item.title}</h1>
          <p className="mt-md text-text-muted uppercase tracking-widest text-xs">{item.year}</p>
        </div>
      </div>

      {item.description && (
        <Section>
          <p className="max-w-prose mx-auto text-lg whitespace-pre-line">{item.description}</p>
        </Section>
      )}

      <Section>
        <ProjectGallery images={item.images?.map((g: any) => ({ image: g.image })) ?? []} />
      </Section>
    </article>
  )
}

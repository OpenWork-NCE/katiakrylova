import Link from 'next/link'
import Image from 'next/image'
import { getMakingOfEntries } from '@/lib/payload'
import { Section } from '@/components/ui/Section'

export default async function MakingOfPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const items = await getMakingOfEntries(locale as 'fr' | 'en')

  return (
    <Section>
      <h1 className="font-hand text-5xl mb-xl">Making Of</h1>
      {items.length === 0 && <p className="text-text-muted">Aucun contenu pour l'instant.</p>}
      <div className="grid md:grid-cols-2 gap-xl">
        {items.map((item: any) => {
          const cover = typeof item.coverImage === 'object' ? item.coverImage?.url : null
          return (
            <Link key={item.id} href={`/${locale}/making-of/${item.slug}`} className="group">
              {cover && <Image src={cover} alt={item.title} width={1200} height={800} className="w-full aspect-video object-cover" />}
              <h2 className="font-hand text-3xl mt-md group-hover:text-accent transition">{item.title}</h2>
              <p className="text-xs text-text-muted uppercase tracking-widest mt-xs">{item.year}</p>
            </Link>
          )
        })}
      </div>
    </Section>
  )
}
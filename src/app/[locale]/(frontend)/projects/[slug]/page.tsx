import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProjectBySlug, getAdjacentProjects } from '@/lib/payload'
import { Section } from '@/components/ui/Section'
import { ProjectGallery } from '@/components/projects/ProjectGallery'
import { ProjectCredits } from '@/components/projects/ProjectCredits'
import { ProjectNav } from '@/components/projects/ProjectNav'

type Props = { params: Promise<{ locale: string; slug: string }> }

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params
  const project = await getProjectBySlug(slug, locale as 'fr' | 'en')
  if (!project) notFound()

  const { prev, next } = await getAdjacentProjects(project.order, locale as 'fr' | 'en')
  const cover = typeof project.coverImage === 'object' ? (project.coverImage as any).url : null

  return (
    <article>
      <div className="relative h-screen w-full">
        {cover && <Image src={cover} alt={project.title} fill className="object-cover" priority />}
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/30 via-transparent to-bg-primary" />
        <Link href={`/${locale}/projects`} className="absolute top-md right-md text-sm uppercase tracking-widest hover:text-accent">
          ← Retour
        </Link>
        <div className="absolute bottom-xl left-md right-md">
          <h1 className="font-hand text-6xl md:text-[8vw] leading-none">{project.title}</h1>
          <p className="mt-md text-text-muted uppercase tracking-widest text-xs">
            {project.format} · {project.year}
          </p>
        </div>
      </div>

      <Section>
        {project.description && (
          <p className="max-w-prose mx-auto text-lg whitespace-pre-line">{project.description}</p>
        )}
      </Section>

      <Section>
        <ProjectGallery images={project.gallery?.map((g: any) => ({ image: g.image })) ?? []} />
      </Section>

      <Section>
        <ProjectCredits credits={project.credits as any} />
      </Section>

      {project.externalLinks && project.externalLinks.length > 0 && (
        <Section>
          <h2 className="text-sm uppercase tracking-widest text-text-muted mb-md">Voir aussi</h2>
          <div className="flex flex-col gap-sm">
            {project.externalLinks.map((l: any, i: number) => (
              <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                ▶ {l.platform}
              </a>
            ))}
          </div>
        </Section>
      )}

      <ProjectNav prev={prev as any} next={next as any} locale={locale} />
    </article>
  )
}
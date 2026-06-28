import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProjectBySlug, getAdjacentProjects } from '@/lib/payload'
import { Section } from '@/components/ui/Section'
import { ProjectGallery } from '@/components/projects/ProjectGallery'
import { ProjectCredits } from '@/components/projects/ProjectCredits'
import { ProjectNav } from '@/components/projects/ProjectNav'
import { VideoEmbed } from '@/components/projects/VideoEmbed'
import { parseVideoUrl } from '@/lib/video'
import { getMediaUrl } from '@/lib/utils'

type Props = { params: Promise<{ locale: string; slug: string }> }

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params
  const project = await getProjectBySlug(slug, locale as 'fr' | 'en')
  if (!project) notFound()

  const { prev, next } = await getAdjacentProjects(project.order, locale as 'fr' | 'en')
  const cover = getMediaUrl(project.coverImage)
  const links = project.externalLinks ?? []
  const [primaryVideo, ...secondaryVideos] = links

  return (
    <article>
      <header className="relative pt-xl pb-lg">
        <div className="mx-auto w-full max-w-6xl px-md">
          <div className="mb-md flex items-center justify-between">
            <Link
              href={`/${locale}/projects`}
              className="text-sm uppercase tracking-widest text-text-muted transition hover:text-accent"
            >
              ← Retour aux projets
            </Link>
            {primaryVideo?.platform && (
              <span className="text-xs uppercase tracking-widest text-text-muted">{primaryVideo.platform}</span>
            )}
          </div>

          {primaryVideo && parseVideoUrl(primaryVideo.url, primaryVideo.platform) ? (
            <VideoEmbed
              url={primaryVideo.url}
              platform={primaryVideo.platform ?? undefined}
              title={project.title}
              priority
              layout="contained"
            />
          ) : (
            <div className="relative mx-auto aspect-video w-full max-w-[min(100%,48rem)] overflow-hidden border border-white/10 bg-bg-secondary">
              {cover && (
                <Image src={cover} alt={project.title} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 768px" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/50 via-transparent to-transparent" />
            </div>
          )}
        </div>
      </header>

      <Section>
        <h1 className="font-hand text-5xl md:text-[6vw] leading-none">{project.title}</h1>
        <p className="mt-md text-text-muted uppercase tracking-widest text-xs">
          {project.format} · {project.year}
        </p>
        {project.description && (
          <p className="mt-xl max-w-prose text-lg whitespace-pre-line">{project.description}</p>
        )}
      </Section>

      <Section>
        <ProjectGallery
          images={
            project.gallery
              ?.filter((g) => typeof g.image === 'object' && g.image !== null)
              .map((g) => ({ image: g.image as { url?: string; alt?: string; width?: number; height?: number } })) ?? []
          }
        />
      </Section>

      <Section>
        <ProjectCredits credits={project.credits ?? undefined} />
      </Section>

      {secondaryVideos.length > 0 && (
        <Section>
          <h2 className="text-sm uppercase tracking-widest text-text-muted mb-md">Vidéos</h2>
          <div className="flex flex-col gap-xl">
            {secondaryVideos.map((link, i) =>
              parseVideoUrl(link.url, link.platform ?? undefined) ? (
                <div key={i}>
                  <p className="mb-sm text-xs uppercase tracking-widest text-text-muted">{link.platform}</p>
                  <VideoEmbed
                    url={link.url}
                    platform={link.platform ?? undefined}
                    title={`${project.title} — ${link.platform}`}
                    layout="contained"
                  />
                </div>
              ) : (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent"
                >
                  ▶ {link.platform}
                </a>
              ),
            )}
          </div>
        </Section>
      )}

      <ProjectNav
        prev={prev ? { slug: prev.slug, title: prev.title, coverImage: typeof prev.coverImage === 'object' ? prev.coverImage : undefined } : undefined}
        next={next ? { slug: next.slug, title: next.title, coverImage: typeof next.coverImage === 'object' ? next.coverImage : undefined } : undefined}
        locale={locale}
      />
    </article>
  )
}
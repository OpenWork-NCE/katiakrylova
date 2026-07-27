import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getProjectBySlug, getAdjacentProjects, getProjectSlugs } from '@/lib/payload'
import { ProjectGallery } from '@/components/projects/ProjectGallery'
import { ProjectCredits } from '@/components/projects/ProjectCredits'
import { ProjectNav } from '@/components/projects/ProjectNav'
import { VideoEmbed } from '@/components/projects/VideoEmbed'
import { parseVideoUrl } from '@/lib/video'
import { formatProjectFormats, getMediaUrl } from '@/lib/utils'
import '@/styles/project-detail.css'

type Props = { params: Promise<{ locale: string; slug: string }> }

export const revalidate = 600

export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return ['fr', 'en'].flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const [t, project] = await Promise.all([
    getTranslations('projects'),
    getProjectBySlug(slug, locale as 'fr' | 'en'),
  ])
  if (!project) notFound()

  const { prev, next } = await getAdjacentProjects(project.order, locale as 'fr' | 'en')
  // Cover when no video: HD derivative is enough for ~768px hero
  const cover = getMediaUrl(project.coverImage, 'hd')

  const links = (project.externalLinks ?? []).filter(
    (l) => l?.url && parseVideoUrl(l.url, l.platform ?? undefined),
  )
  const [primaryVideo, ...restVideos] = links
  // Secondaries: keep unique URLs, drop bare platform labels noise
  const secondaryVideos = restVideos.filter(
    (l, i, arr) => arr.findIndex((x) => x.url === l.url) === i,
  )

  const galleryImages =
    project.gallery
      ?.filter((g) => typeof g.image === 'object' && g.image !== null)
      .map((g) => ({
        image: g.image as { url?: string; alt?: string; width?: number; height?: number },
      })) ?? []

  const hasGallery = galleryImages.length > 0
  const hasCredits = (project.credits?.length ?? 0) > 0
  const hasSecondaryVideos = secondaryVideos.length > 0

  return (
    <article className="project-detail">
      <header className="project-detail__header">
        <div className="project-detail__header-inner">
          <div className="project-detail__toolbar">
            <Link href={`/${locale}/projects`} className="project-detail__back">
              {t('backToProjects')}
            </Link>
            {primaryVideo?.platform ? (
              <span className="project-detail__platform">{primaryVideo.platform}</span>
            ) : null}
          </div>

          <div className="project-detail__hero">
            {primaryVideo ? (
              <VideoEmbed
                url={primaryVideo.url}
                platform={primaryVideo.platform ?? undefined}
                title={project.title}
                priority
                layout="contained"
              />
            ) : (
              <div className="project-detail__cover">
                {cover ? (
                  <Image
                    src={cover}
                    alt={project.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                ) : null}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="project-detail__intro">
        <h1 className="project-detail__title">{project.title}</h1>
        <p className="project-detail__meta">
          {formatProjectFormats(project.format)} · {project.year}
        </p>
        {project.description ? (
          <p className="project-detail__desc">{project.description}</p>
        ) : null}
      </div>

      {hasGallery ? (
        <div className="project-detail__block project-detail__block--gallery">
          <ProjectGallery images={galleryImages} />
        </div>
      ) : null}

      {hasCredits ? (
        <div className="project-detail__block project-detail__block--credits">
          <ProjectCredits credits={project.credits ?? undefined} />
        </div>
      ) : null}

      {hasSecondaryVideos ? (
        <div className="project-detail__block project-detail__block--videos">
          <h2 className="project-detail__block-title">{t('videos')}</h2>
          <div className="project-detail__videos">
            {secondaryVideos.map((link, i) => (
              <div key={`${link.url}-${i}`} className="project-detail__video-item">
                <VideoEmbed
                  url={link.url}
                  platform={link.platform ?? undefined}
                  title={`${project.title} — ${link.platform ?? 'video'}`}
                  layout="contained"
                />
                {link.description ? (
                  <p className="project-detail__video-desc">{link.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <ProjectNav
        prev={prev}
        next={next}
        locale={locale}
      />
    </article>
  )
}

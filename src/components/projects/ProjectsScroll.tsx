'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { Project } from '@/payload-types'
import { getMediaUrl } from '@/lib/utils'
import { ProjectsIntroOverlay } from './ProjectsIntroOverlay'
import '@/styles/projects-scroll.css'

type Props = {
  projects: Project[]
  locale: string
}

function padIndex(n: number, total: number) {
  const width = Math.max(2, String(total).length)
  return String(n).padStart(width, '0')
}

export function ProjectsScroll({ projects, locale }: Props) {
  const t = useTranslations('projects')
  const [introOpen, setIntroOpen] = useState(true)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const root = listRef.current
    if (!root) return

    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-project-item]'))
    if (items.length === 0) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      items.forEach((el) => el.classList.add('projects-scroll__item--visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('projects-scroll__item--visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )

    items.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [projects, introOpen])

  return (
    <>
      {introOpen && <ProjectsIntroOverlay onDismiss={() => setIntroOpen(false)} />}

      <div className="projects-scroll" aria-hidden={introOpen || undefined}>
        <header className="projects-scroll__header">
          <h1 className="projects-scroll__title">{t('title')}</h1>
          <p className="projects-scroll__count">
            {padIndex(projects.length, projects.length)} · {t('galleryLabel')}
          </p>
        </header>

        <ul ref={listRef} className="projects-scroll__list">
          {projects.map((project, i) => {
            const cover = getMediaUrl(project.coverImage)
            const indexLabel = `${padIndex(i + 1, projects.length)} / ${padIndex(projects.length, projects.length)}`

            return (
              <li key={project.id} data-project-item className="projects-scroll__item">
                <Link
                  href={`/${locale}/projects/${project.slug}`}
                  className="projects-scroll__card"
                >
                  <div className="projects-scroll__media" aria-hidden={!cover}>
                    {cover && (
                      <Image
                        src={cover}
                        alt=""
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority={i < 2}
                      />
                    )}
                    <div className="projects-scroll__scrim" />
                  </div>

                  <div className="projects-scroll__body">
                    <div className="projects-scroll__meta">
                      <span className="projects-scroll__index">{indexLabel}</span>
                      <span>
                        {project.format} · {project.year}
                      </span>
                    </div>
                    <h2 className="projects-scroll__name">{project.title}</h2>
                    {project.description && (
                      <p className="projects-scroll__excerpt">{project.description}</p>
                    )}
                    <span className="projects-scroll__cta">{t('viewProject')}</span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

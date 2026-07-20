'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import type { Project } from '@/payload-types'
import { getMediaUrl } from '@/lib/utils'
import { ProjectsLanding } from './ProjectsLanding'
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
  const listRef = useRef<HTMLUListElement>(null)
  const total = projects.length

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
      { root: null, rootMargin: '0px 0px -6% 0px', threshold: 0.08 },
    )

    items.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [projects])

  return (
    <div className="projects-scroll">
      <ProjectsLanding />

      <div className="projects-scroll__filmography" id="filmographie">
        <div className="projects-scroll__inner">
          <header className="projects-scroll__header">
            <h2 className="projects-scroll__title">{t('title')}</h2>
            <p className="projects-scroll__count">
              {padIndex(total, total)} · {t('filmographyMeta')}
            </p>
          </header>

          <ul ref={listRef} className="projects-scroll__list">
            {projects.map((project, i) => {
              const cover = getMediaUrl(project.coverImage)
              const n = padIndex(i + 1, total)

              return (
                <li key={project.id} data-project-item className="projects-scroll__item">
                  <Link
                    href={`/${locale}/projects/${project.slug}`}
                    className="projects-scroll__row"
                  >
                    <div
                      className={`projects-scroll__still${cover ? '' : ' projects-scroll__still--empty'}`}
                      aria-hidden
                    >
                      {cover ? (
                        <Image
                          src={cover}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 14rem, 220px"
                          className="object-cover"
                          priority={i < 4}
                        />
                      ) : (
                        <span className="projects-scroll__still-placeholder">—</span>
                      )}
                    </div>

                    <div className="projects-scroll__copy">
                      <div className="projects-scroll__meta">
                        <span className="projects-scroll__index">{n}</span>
                        <span className="projects-scroll__dot" aria-hidden>
                          ·
                        </span>
                        <span>
                          {project.format} · {project.year}
                        </span>
                      </div>
                      <h3 className="projects-scroll__name">{project.title}</h3>
                      {project.description ? (
                        <p className="projects-scroll__excerpt">{project.description}</p>
                      ) : null}
                      <span className="projects-scroll__cta">{t('viewProject')}</span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

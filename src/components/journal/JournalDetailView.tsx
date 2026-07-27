'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, type ReactNode } from 'react'
import '@/styles/journal-detail.css'

export type JournalDetailCover = {
  url: string
  alt: string
  width: number
  height: number
}

export type JournalDetailProject = {
  slug: string
  title: string
}

type Props = {
  locale: string
  backLabel: string
  title: string
  cover: JournalDetailCover | null
  body: ReactNode
  project: JournalDetailProject | null
  viewProjectLabel: string
}

/** Fiche News — layout adaptatif portrait / paysage + CTA projet. */
export function JournalDetailView({
  locale,
  backLabel,
  title,
  cover,
  body,
  project,
  viewProjectLabel,
}: Props) {
  const [ready, setReady] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  const isPortrait = cover ? cover.height > cover.width : false
  const layout = cover ? (isPortrait ? 'portrait' : 'landscape') : 'text'

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReducedMotion(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), reducedMotion ? 0 : 80)
    return () => window.clearTimeout(timer)
  }, [reducedMotion])

  return (
    <article
      className={`journal-detail journal-detail--${layout}${ready ? ' journal-detail--ready' : ''}`}
    >
      <div className="journal-detail__inner">
        <Link href={`/${locale}/journal`} className="journal-detail__back">
          {backLabel}
        </Link>

        <div className="journal-detail__main">
          {cover ? (
            <aside className="journal-detail__media">
              <div
                className="journal-detail__frame"
                style={{
                  aspectRatio: `${cover.width} / ${cover.height}`,
                }}
              >
                <Image
                  src={cover.url}
                  alt={cover.alt}
                  fill
                  priority
                  quality={95}
                  sizes={
                    isPortrait
                      ? '(max-width: 768px) 100vw, 48vw'
                      : '(max-width: 768px) 100vw, 56rem'
                  }
                  className="object-cover"
                />
              </div>
            </aside>
          ) : null}

          <div className="journal-detail__copy">
            <h1 className="journal-detail__title">{title}</h1>
            {body ? <div className="journal-detail__body journal-entry__body">{body}</div> : null}

            {project ? (
              <Link
                href={`/${locale}/projects/${project.slug}`}
                className="journal-detail__project"
              >
                <span className="journal-detail__project-kicker">{project.title}</span>
                <span className="journal-detail__project-cta">{viewProjectLabel}</span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}

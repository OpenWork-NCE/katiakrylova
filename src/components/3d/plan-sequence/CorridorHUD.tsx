'use client'
import Link from 'next/link'
import type { Project } from '@/payload-types'

type Props = {
  project: Project
  locale: string
  index: number
  total: number
  showHint: boolean
}

export function CorridorHUD({ project, locale, index, total, showHint }: Props) {
  return (
    <>
      <div className="pointer-events-none absolute bottom-xl left-md right-md z-10 text-center">
        <p className="font-hand text-[clamp(1.8rem,5vw,4rem)] leading-none text-text-primary">{project.title}</p>
        <p className="mt-xs text-xs uppercase tracking-widest text-accent">
          {project.format} · {project.year}
        </p>
        <Link
          href={`/${locale}/projects/${project.slug}`}
          className="pointer-events-auto mt-md inline-block text-sm uppercase tracking-widest text-text-primary transition hover:text-accent duration-500"
        >
          Voir le projet →
        </Link>
      </div>

      <div className="pointer-events-none absolute bottom-md right-md z-10 font-body text-xs text-text-muted opacity-70">
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>

      {showHint && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 bg-accent/90 py-md text-center">
          <p className="animate-pulse text-sm uppercase tracking-[0.25em] text-text-primary">
            ↓ Scroller pour découvrir la galerie
          </p>
        </div>
      )}
    </>
  )
}
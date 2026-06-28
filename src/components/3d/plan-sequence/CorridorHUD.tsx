'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { Project } from '@/payload-types'

type Props = {
  project: Project
  locale: string
  index: number
  total: number
  showHint: boolean
}

export function CorridorHUD({ project, locale, index, total, showHint }: Props) {
  const t = useTranslations('projects')

  const hudBottom = showHint
    ? 'pb-[calc(3.75rem+env(safe-area-inset-bottom,0px))] sm:pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))]'
    : 'pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] sm:pb-0'

  return (
    <>
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 text-center sm:bottom-xl sm:left-md sm:right-md sm:px-0 ${hudBottom}`}
      >
        <p className="font-hand text-[clamp(1.25rem,7vw,4rem)] leading-[1.05] text-text-primary break-words">
          {project.title}
        </p>
        <p className="mt-xs text-[0.65rem] uppercase tracking-[0.2em] text-accent sm:text-xs sm:tracking-widest">
          {project.format} · {project.year}
        </p>
        <Link
          href={`/${locale}/projects/${project.slug}`}
          className="pointer-events-auto mt-sm inline-block text-xs uppercase tracking-[0.18em] text-text-primary transition duration-500 hover:text-accent sm:mt-md sm:text-sm sm:tracking-widest"
        >
          {t('viewProject')}
        </Link>
      </div>

      <div className="pointer-events-none absolute right-4 top-[4.25rem] z-10 font-body text-[0.65rem] text-text-muted opacity-70 sm:bottom-md sm:right-md sm:top-auto sm:text-xs">
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>

      {showHint && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[9] bg-accent/90 px-4 py-sm pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] text-center sm:py-md">
          <p className="animate-pulse text-[0.65rem] uppercase tracking-[0.16em] text-text-primary sm:text-sm sm:tracking-[0.25em]">
            {t('scrollHint')}
          </p>
        </div>
      )}
    </>
  )
}
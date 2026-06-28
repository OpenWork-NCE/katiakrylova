'use client'
import { useTranslations } from 'next-intl'

type Props = {
  atStart: boolean
  atEnd: boolean
  onGoToStart: () => void
  onGoToEnd: () => void
}

export function CorridorScrollNav({ atStart, atEnd, onGoToStart, onGoToEnd }: Props) {
  const t = useTranslations('projects')

  return (
    <nav
      aria-label={t('scrollNavLabel')}
      className="pointer-events-none absolute left-3 top-[5.25rem] z-10 flex flex-col gap-1.5 sm:left-5 sm:top-1/2 sm:-translate-y-1/2 sm:gap-2"
    >
      <button
        type="button"
        onClick={onGoToStart}
        disabled={atStart}
        aria-label={t('goToStart')}
        className="pointer-events-auto border border-text-primary/25 bg-bg-primary/35 px-2.5 py-1.5 text-[0.6rem] uppercase tracking-[0.16em] text-text-primary/80 backdrop-blur-sm transition duration-300 hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-35 sm:px-3 sm:py-2 sm:text-[0.65rem] sm:tracking-[0.2em]"
      >
        {t('goToStart')}
      </button>
      <button
        type="button"
        onClick={onGoToEnd}
        disabled={atEnd}
        aria-label={t('goToEnd')}
        className="pointer-events-auto border border-text-primary/25 bg-bg-primary/35 px-2.5 py-1.5 text-[0.6rem] uppercase tracking-[0.16em] text-text-primary/80 backdrop-blur-sm transition duration-300 hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-35 sm:px-3 sm:py-2 sm:text-[0.65rem] sm:tracking-[0.2em]"
      >
        {t('goToEnd')}
      </button>
    </nav>
  )
}
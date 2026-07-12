'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import '@/styles/projects-intro.css'

const LEAVE_MS = 550
const BACKDROP = '/images/img8.jpg'

type Props = {
  onDismiss: () => void
}

export function ProjectsIntroOverlay({ onDismiss }: Props) {
  const t = useTranslations('projects')
  const [leaving, setLeaving] = useState(false)
  const dismissed = useRef(false)
  const leaveTimer = useRef<number | null>(null)

  const paragraphs = t.raw('introBody') as string[]

  const dismiss = useCallback(() => {
    if (dismissed.current) return
    dismissed.current = true
    setLeaving(true)
    leaveTimer.current = window.setTimeout(() => {
      leaveTimer.current = null
      onDismiss()
    }, LEAVE_MS)
  }, [onDismiss])

  useEffect(() => {
    return () => {
      if (leaveTimer.current !== null) window.clearTimeout(leaveTimer.current)
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault()
        dismiss()
      }
    }

    /** Dismiss on intentional scroll gesture; ignore tiny trackpad noise. */
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 4 && Math.abs(e.deltaX) < 4) return
      e.preventDefault()
      dismiss()
    }

    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0
    }
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? 0
      if (Math.abs(y - touchStartY) > 28) dismiss()
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [dismiss])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="projects-intro-title"
      className={`projects-intro${leaving ? ' projects-intro--leaving' : ''}`}
      onClick={dismiss}
    >
      <div
        className="projects-intro__bg"
        style={{ backgroundImage: `url('${BACKDROP}')` }}
        aria-hidden
      />
      <div className="projects-intro__scrim" aria-hidden />
      <div className="projects-intro__vignette" aria-hidden />

      <div className="projects-intro__inner">
        <h1 id="projects-intro-title" className="projects-intro__title">
          {t('introTitle')}
        </h1>
        <div className="projects-intro__body">
          {Array.isArray(paragraphs)
            ? paragraphs.map((p, i) => <p key={i}>{p}</p>)
            : null}
        </div>
        <p className="projects-intro__hint">{t('introHint')}</p>
      </div>
    </div>
  )
}

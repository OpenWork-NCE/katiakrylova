'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import '@/styles/projects-intro.css'

const BACKDROP = '/images/FONDS%20page%20PROJECTS.jpg'

/** Atterrissage filmographie — en flux document (scroll page libre). */
export function ProjectsLanding() {
  const t = useTranslations('projects')
  const paragraphs = t.raw('introBody') as string[]
  const sectionRef = useRef<HTMLElement>(null)
  const [ready, setReady] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

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

  /** Fade / parallax léger du hero au scroll — style portfolio cinématique. */
  useEffect(() => {
    const section = sectionRef.current
    if (!section || reducedMotion) return

    const bg = section.querySelector<HTMLElement>('.projects-intro__bg')
    const inner = section.querySelector<HTMLElement>('.projects-intro__inner')
    if (!bg || !inner) return

    let frame = 0
    const update = () => {
      frame = 0
      const rect = section.getBoundingClientRect()
      // 0 en haut de page → 1 quand la section est scrolée hors du haut
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height * 0.85, 1)))

      // Laisser l’animation d’entrée CSS tant qu’on n’a pas scrolé
      if (progress < 0.01) {
        bg.style.opacity = ''
        bg.style.transform = ''
        inner.style.opacity = ''
        inner.style.transform = ''
        return
      }

      const fade = 1 - progress * 0.92
      const lift = progress * 36
      const scale = 1 + progress * 0.06

      bg.style.opacity = String(Math.max(0.35, 1 - progress * 0.45))
      bg.style.transform = `scale(${scale}) translate3d(0, ${progress * 4}%, 0)`
      inner.style.opacity = String(Math.max(0, fade))
      inner.style.transform = `translate3d(0, ${lift}px, 0)`
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [reducedMotion, ready])

  const scrollToFilmography = useCallback(() => {
    const target = document.getElementById('filmographie')
    if (!target) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`projects-intro${ready ? ' projects-intro--ready' : ''}`}
      aria-labelledby="projects-intro-title"
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
        <button
          type="button"
          className="projects-intro__hint"
          onClick={scrollToFilmography}
          aria-label={t('introHint')}
        >
          <span>{t('introHint')}</span>
          <span className="projects-intro__hint-chevron" aria-hidden />
        </button>
      </div>
    </section>
  )
}

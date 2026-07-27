'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import '@/styles/about-page.css'

type Props = {
  title: string
  backgroundUrl: string
  profileUrl: string | null
  profileAlt: string
  profileWidth: number
  profileHeight: number
  bio: ReactNode
  visionUrl: string | null
  visionText: string | null
}

/** À propos — entrée cinématique + révélations scroll (style Projets). */
export function AboutView({
  title,
  backgroundUrl,
  profileUrl,
  profileAlt,
  profileWidth,
  profileHeight,
  bio,
  visionUrl,
  visionText,
}: Props) {
  const introRef = useRef<HTMLElement>(null)
  const visionRef = useRef<HTMLElement>(null)
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

  /** Parallax / fade léger du fond intro au scroll. */
  useEffect(() => {
    const section = introRef.current
    if (!section || reducedMotion) return

    const bg = section.querySelector<HTMLElement>('.about-page__bg')
    if (!bg) return

    let frame = 0
    const update = () => {
      frame = 0
      const rect = section.getBoundingClientRect()
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height * 0.85, 1)))

      if (progress < 0.01) {
        bg.style.opacity = ''
        bg.style.transform = ''
        return
      }

      const scale = 1 + progress * 0.06
      bg.style.opacity = String(Math.max(0.4, 1 - progress * 0.4))
      bg.style.transform = `scale(${scale}) translate3d(0, ${progress * 3}%, 0)`
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

  /** Révélation de la section vision. */
  useEffect(() => {
    const vision = visionRef.current
    if (!vision) return

    if (reducedMotion) {
      vision.classList.add('about-page__vision--visible')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('about-page__vision--visible')
          observer.unobserve(entry.target)
        }
      },
      { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 },
    )

    observer.observe(vision)
    return () => observer.disconnect()
  }, [reducedMotion, visionUrl, visionText])

  return (
    <div className={`about-page${ready ? ' about-page--ready' : ''}`}>
      <section ref={introRef} className="about-page__intro">
        <div className="about-page__intro-backdrop" aria-hidden>
          <div
            className="about-page__bg"
            style={{ backgroundImage: `url('${backgroundUrl}')` }}
          />
          <div className="about-page__scrim" />
          <div className="about-page__vignette" />
        </div>

        <div className="about-page__inner">
          <h1 className="about-page__title">{title}</h1>

          <div className={`about-page__main${profileUrl ? '' : ' about-page__main--no-portrait'}`}>
            {profileUrl ? (
              <aside className="about-page__aside">
                <div
                  className="about-page__portrait"
                  style={{
                    aspectRatio: `${profileWidth} / ${profileHeight}`,
                  }}
                >
                  <Image
                    src={profileUrl}
                    alt={profileAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 55vw"
                    className="object-cover object-top"
                    priority
                    quality={92}
                  />
                </div>
              </aside>
            ) : null}

            <div className="about-page__bio">{bio}</div>
          </div>
        </div>
      </section>

      {visionUrl && visionText ? (
        <section
          ref={visionRef}
          className="about-page__vision"
          style={{ backgroundImage: `url('${visionUrl}')` }}
        >
          <div className="about-page__vision-scrim" aria-hidden />
          <div className="about-page__vision-copy">
            <p>{visionText}</p>
          </div>
        </section>
      ) : null}
    </div>
  )
}

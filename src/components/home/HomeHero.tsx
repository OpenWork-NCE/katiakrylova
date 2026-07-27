'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { HOME_BOOT_KEY } from '@/components/transitions/constants'
import { IrisEnterButton } from './IrisEnterButton'
import '@/styles/home-hero.css'

type Props = {
  locale: string
  heroUrl: string
  role: string
  intro: string
  enterLabel: string
  enterHref: string
}

/**
 * Home — cinematic entry.
 * First visit in session: iris-boot (dark → open) then content stagger.
 * Parallax via CSS variables (no React re-render per mousemove).
 */
export function HomeHero({ locale, heroUrl, role, intro, enterLabel, enterHref }: Props) {
  const [ready, setReady] = useState(false)
  const [entered, setEntered] = useState(false)
  const [boot, setBoot] = useState<'pending' | 'closed' | 'opening' | 'done'>('pending')
  const [reducedMotion, setReducedMotion] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReducedMotion(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  // Boot iris: once per session
  useEffect(() => {
    if (reducedMotion) {
      setBoot('done')
      setReady(true)
      setEntered(true)
      return
    }

    let played = false
    try {
      played = sessionStorage.getItem(HOME_BOOT_KEY) === '1'
    } catch {
      /* private mode */
    }

    if (played) {
      setBoot('done')
      const t = window.setTimeout(() => {
        setReady(true)
        setEntered(true)
      }, 80)
      return () => window.clearTimeout(t)
    }

    setBoot('closed')
    // Open iris + start content stagger mid-reveal
    const openTimer = window.setTimeout(() => {
      setBoot('opening')
      setReady(true)
    }, 280)
    const doneTimer = window.setTimeout(() => {
      setBoot('done')
      try {
        sessionStorage.setItem(HOME_BOOT_KEY, '1')
      } catch {
        /* ignore */
      }
    }, 280 + 900)
    const enteredTimer = window.setTimeout(() => setEntered(true), 280 + 1000)

    return () => {
      window.clearTimeout(openTimer)
      window.clearTimeout(doneTimer)
      window.clearTimeout(enteredTimer)
    }
  }, [reducedMotion])

  // Parallax via CSS vars + rAF (INP-friendly)
  useEffect(() => {
    if (reducedMotion) return
    const layer = parallaxRef.current
    const section = sectionRef.current
    if (!layer || !section) return

    let frame = 0
    let px = 0
    let py = 0

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      px = (e.clientX - rect.left) / rect.width - 0.5
      py = (e.clientY - rect.top) / rect.height - 0.5
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        layer.style.setProperty('--px', `${px * 2.2}px`)
        layer.style.setProperty('--py', `${py * 1.6}px`)
      })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [reducedMotion])

  const bootClass =
    boot === 'closed'
      ? ' home-hero--boot-closed'
      : boot === 'opening'
        ? ' home-hero--boot-opening'
        : boot === 'done'
          ? ' home-hero--boot-done'
          : ''

  return (
    <section
      ref={sectionRef}
      className={`home-hero relative -mt-16 h-[100dvh] min-h-[100svh] w-full overflow-hidden${
        ready ? ' home-hero--ready' : ''
      }${bootClass}`}
    >
      {/* Local boot iris (first visit) — same language as site wipe */}
      {!reducedMotion && boot !== 'done' && boot !== 'pending' ? (
        <div className="home-hero__boot-iris" aria-hidden data-boot={boot}>
          <div className="home-hero__boot-shutter" />
        </div>
      ) : null}

      <div className="absolute inset-0 overflow-hidden">
        <div
          ref={parallaxRef}
          className={`absolute inset-[-4%] ${reducedMotion ? '' : 'home-hero__parallax'}`}
          style={
            reducedMotion
              ? undefined
              : {
                  transform: ready
                    ? 'translate3d(var(--px, 0px), var(--py, 0px), 0) scale(1)'
                    : 'translate3d(0, 0, 0) scale(1.04)',
                  transition: entered ? undefined : 'transform 1.05s cubic-bezier(0.4, 0, 0.2, 1)',
                }
          }
        >
          <Image
            src={heroUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className={`object-cover ${reducedMotion ? '' : 'home-hero__image'}`}
          />
        </div>
      </div>

      <div className="home-hero__shade pointer-events-none absolute inset-0" aria-hidden />
      <div className="home-hero__vignette pointer-events-none absolute inset-0" aria-hidden />
      <div className="home-hero__gradient pointer-events-none absolute inset-0" aria-hidden />

      <div className="home-hero__content">
        <Link href={`/${locale}`} className="home-hero__logo">
          <Image
            src="/images/katia_krylova.png"
            alt="Katia Krylova"
            width={800}
            height={215}
            className="home-hero__logo-img"
            priority
          />
        </Link>

        {role ? <p className="home-hero__role">{role}</p> : null}

        {intro ? <p className="home-hero__intro">{intro}</p> : null}

        <div className="home-hero__cta">
          <IrisEnterButton href={enterHref} label={enterLabel} />
        </div>
      </div>
    </section>
  )
}

'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
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

export function HomeHero({ locale, heroUrl, role, intro, enterLabel, enterHref }: Props) {
  const [ready, setReady] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const timer = window.setTimeout(() => setReady(true), reducedMotion ? 0 : 120)
    return () => window.clearTimeout(timer)
  }, [reducedMotion])

  useEffect(() => {
    if (reducedMotion) return

    const onMove = (e: MouseEvent) => {
      const node = sectionRef.current
      if (!node) return
      const rect = node.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      setParallax({ x: px * 2.2, y: py * 1.6 })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [reducedMotion])

  const parallaxTransform = reducedMotion
    ? undefined
    : {
        transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
      }

  return (
    <section
      ref={sectionRef}
      className={`home-hero relative -mt-16 h-[100dvh] min-h-[100svh] w-full overflow-hidden ${ready ? 'home-hero--ready' : ''}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute inset-[-4%] ${reducedMotion ? '' : 'home-hero__parallax'}`}
          style={parallaxTransform}
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

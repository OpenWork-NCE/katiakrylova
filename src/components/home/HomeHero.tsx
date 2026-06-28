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
  subtitle?: string | null
  enterLabel: string
  enterHref: string
  scrollHint: string
}

export function HomeHero({ locale, heroUrl, role, subtitle, enterLabel, enterHref, scrollHint }: Props) {
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

      <div className="home-hero__content absolute inset-0 flex max-w-full flex-col items-center justify-end px-[max(1rem,env(safe-area-inset-left,0px))] pb-[max(clamp(2rem,8vh,6rem),env(safe-area-inset-bottom,0px))] text-center">
        <Link href={`/${locale}`} className="home-hero__logo mb-lg inline-block max-w-full sm:mb-xl">
          <Image
            src="/images/katia_krylova.png"
            alt="Katia Krylova"
            width={800}
            height={215}
            className="mx-auto h-auto w-[clamp(11rem,58vw,44rem)] max-w-[92vw]"
            priority
          />
        </Link>
        <p className="home-hero__role font-hand text-[clamp(1.1rem,4.5vw,2.4rem)] leading-tight text-text-primary">
          {role}
        </p>
        {subtitle && (
          <p className="home-hero__subtitle mt-sm max-w-[min(100%,20rem)] text-[0.7rem] uppercase tracking-[0.2em] text-text-primary/85 sm:max-w-xl sm:text-sm sm:tracking-[0.32em]">
            {subtitle}
          </p>
        )}
        <div className="home-hero__cta mt-lg sm:mt-xl">
          <IrisEnterButton href={enterHref} label={enterLabel} />
        </div>
        <p className="home-hero__hint mt-md text-[0.6rem] uppercase tracking-[0.28em] text-text-primary/55 sm:mt-lg sm:text-[0.65rem] sm:tracking-[0.35em]">
          {scrollHint}
        </p>
      </div>
    </section>
  )
}
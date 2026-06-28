'use client'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { IrisEnterButton } from './IrisEnterButton'
import '@/styles/home-hero.css'

type Props = {
  heroUrl: string
  role: string
  subtitle?: string | null
  enterLabel: string
  enterHref: string
  scrollHint: string
}

export function HomeHero({ heroUrl, role, subtitle, enterLabel, enterHref, scrollHint }: Props) {
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
      className={`home-hero relative -mt-16 h-screen w-full overflow-hidden ${ready ? 'home-hero--ready' : ''}`}
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

      <div className="home-hero__vignette pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg-primary/50 via-transparent to-bg-primary/90" />

      <div className="absolute inset-0 flex flex-col items-center justify-end px-md pb-[clamp(3rem,10vh,6rem)] text-center">
        <p className="home-hero__role font-hand text-[clamp(1.35rem,3.2vw,2.4rem)] leading-tight text-text-primary">
          {role}
        </p>
        {subtitle && (
          <p className="home-hero__subtitle mt-sm max-w-xl text-sm uppercase tracking-[0.32em] text-text-primary/75">
            {subtitle}
          </p>
        )}
        <div className="home-hero__cta mt-xl">
          <IrisEnterButton href={enterHref} label={enterLabel} />
        </div>
        <p className="home-hero__hint mt-lg text-[0.65rem] uppercase tracking-[0.35em] text-text-muted/80">{scrollHint}</p>
      </div>
    </section>
  )
}
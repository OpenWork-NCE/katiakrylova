'use client'

import { useState } from 'react'
import { usePageTransition } from '@/components/transitions/usePageTransition'

type Props = {
  href: string
  label: string
}

/**
 * CTA d’entrée — portail diaphragme (iris) + morph vers le wipe plein écran.
 * Métaphore cinéma : l’œil s’ouvre / cligne sur l’univers.
 */
export function IrisEnterButton({ href, label }: Props) {
  const { navigate } = usePageTransition()
  const [morphing, setMorphing] = useState(false)

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (morphing) return
    setMorphing(true)
    navigate(href, { intent: 'signature' })
  }

  return (
    <a
      href={href}
      className={`home-enter${morphing ? ' home-enter--morph' : ''}`}
      data-transition-intent="signature"
      onClick={onClick}
    >
      <span className="home-enter__aperture" aria-hidden>
        <span className="home-enter__ring home-enter__ring--a" />
        <span className="home-enter__ring home-enter__ring--b" />
        <span className="home-enter__ring home-enter__ring--c" />
        <span className="home-enter__pupil">
          <span className="home-enter__glint" />
        </span>
      </span>

      <span className="home-enter__copy">
        <span className="home-enter__label">{label}</span>
        <span className="home-enter__rule" />
      </span>

      <span className="home-enter__chevron" aria-hidden>
        <span className="home-enter__chevron-line" />
      </span>
    </a>
  )
}

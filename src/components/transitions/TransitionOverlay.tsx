'use client'
import type { TransitionPhase } from './PageTransitionContext'

type Props = {
  phase: TransitionPhase
}

export function TransitionOverlay({ phase }: Props) {
  if (phase === 'open') return null

  return (
    <div className={`cinema-transition cinema-transition--${phase}`} aria-hidden>
      <div className="cinema-transition__viewfinder" />
      <div className="cinema-transition__bar cinema-transition__bar--top" />
      <div className="cinema-transition__bar cinema-transition__bar--bottom" />
      <div className="cinema-transition__iris" />
      <div className="cinema-transition__ring" />
      <div className="cinema-transition__grain" />
      <div className="cinema-transition__leak" />
    </div>
  )
}
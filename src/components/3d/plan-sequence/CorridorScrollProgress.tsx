'use client'
import type { RefObject } from 'react'

type Props = {
  progressRef: RefObject<HTMLDivElement | null>
}

export function CorridorScrollProgress({ progressRef }: Props) {
  return (
    <div
      className="pointer-events-none absolute bottom-0 right-0 top-16 z-10 hidden w-5 lg:block"
      aria-hidden
    >
      <div className="absolute bottom-xl right-3 top-md w-px bg-white/8" />
      <div
        ref={progressRef}
        className="absolute right-3 top-md w-px origin-top bg-accent/75 will-change-transform"
        style={{ height: 'calc(100% - 5rem)', transform: 'scaleY(0.015)', opacity: 0.28 }}
      />
      <div className="absolute bottom-md right-5 font-body text-[0.6rem] uppercase tracking-[0.2em] text-text-muted/50 [writing-mode:vertical-rl]">
        Galerie
      </div>
    </div>
  )
}
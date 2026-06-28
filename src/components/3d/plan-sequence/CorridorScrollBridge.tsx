'use client'
import { useEffect, useRef, type MutableRefObject, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { bindCorridorScroll, type CorridorScrollHandle } from './corridor-scroll'

type Props = {
  progressRef: RefObject<HTMLDivElement | null>
  scrollHandleRef: MutableRefObject<CorridorScrollHandle | null>
  onOffsetChange?: (offset: number) => void
}

export function CorridorScrollBridge({ progressRef, scrollHandleRef, onOffsetChange }: Props) {
  const scroll = useScroll()
  const lastOffsetReported = useRef(-1)

  useEffect(() => {
    scroll.el.classList.add('corridor-scroll')
    scrollHandleRef.current = bindCorridorScroll(scroll.el)
    return () => {
      scroll.el.classList.remove('corridor-scroll')
      scrollHandleRef.current = null
    }
  }, [scroll.el, scrollHandleRef])

  useFrame(() => {
    const t = Math.max(0, Math.min(1, scroll.offset))
    const delta = Math.abs(t - lastOffsetReported.current)
    if (delta >= 0.02 || (t <= 0.02 && lastOffsetReported.current > 0.02) || (t >= 0.98 && lastOffsetReported.current < 0.98)) {
      lastOffsetReported.current = t
      onOffsetChange?.(t)
    }

    const bar = progressRef.current
    if (!bar) return
    bar.style.transform = `scaleY(${Math.max(0.015, t)})`
    bar.style.opacity = String(0.28 + t * 0.6)
  })

  return null
}
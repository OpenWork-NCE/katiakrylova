'use client'
import { useEffect, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'

type Props = {
  progressRef: RefObject<HTMLDivElement | null>
}

export function CorridorScrollBridge({ progressRef }: Props) {
  const scroll = useScroll()

  useEffect(() => {
    scroll.el.classList.add('corridor-scroll')
    return () => scroll.el.classList.remove('corridor-scroll')
  }, [scroll.el])

  useFrame(() => {
    const bar = progressRef.current
    if (!bar) return
    const t = Math.max(0, Math.min(1, scroll.offset))
    bar.style.transform = `scaleY(${Math.max(0.015, t)})`
    bar.style.opacity = String(0.28 + t * 0.6)
  })

  return null
}
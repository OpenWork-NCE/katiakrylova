'use client'
import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Diaphragm } from './Diaphragm'

function detectWebGL(): boolean {
  if (typeof document === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    return !!ctx
  } catch {
    return false
  }
}

export function DiaphragmTransition({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [webgl, setWebgl] = useState<boolean | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    setWebgl(detectWebGL())
    if (!mq.matches) {
      requestAnimationFrame(() => setOpen(true))
    } else {
      setOpen(true)
    }
  }, [])

  if (reduced) return <>{children}</>

  return (
    <>
      {webgl === true && !open && (
        <div className="fixed inset-0 z-[200] bg-bg-primary">
          <Canvas camera={{ position: [0, 0, 3], fov: 50 }} gl={{ alpha: true }}>
            <ambientLight intensity={0.5} />
            <Diaphragm open={open} />
          </Canvas>
        </div>
      )}
      {webgl === false && (
        <div
          aria-hidden
          className={`fixed inset-0 z-[200] bg-bg-primary transition-opacity duration-700 ease-out ${open ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
        />
      )}
      {children}
    </>
  )
}

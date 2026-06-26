'use client'
import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Diaphragm } from './Diaphragm'

export function DiaphragmTransition({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    if (!mq.matches) {
      requestAnimationFrame(() => setOpen(true))
    } else {
      setOpen(true)
    }
  }, [])

  if (reduced) return <>{children}</>

  return (
    <>
      {!open && (
        <div className="fixed inset-0 z-[200] bg-bg-primary">
          <Canvas camera={{ position: [0, 0, 3], fov: 50 }} gl={{ alpha: true }}>
            <ambientLight intensity={0.5} />
            <Diaphragm open={open} />
          </Canvas>
        </div>
      )}
      {children}
    </>
  )
}

'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, BufferGeometry, Float32BufferAttribute, PointsMaterial, AdditiveBlending } from 'three'

export function DustParticles({ count = 200 }: { count?: number }) {
  const ref = useRef<Points>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.02
  })

  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.03} color="#f5f1ea" transparent opacity={0.4} blending={AdditiveBlending} depthWrite={false} />
    </points>
  )
}
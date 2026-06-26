'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Mesh, MathUtils } from 'three'

type Props = { open: boolean; onComplete?: () => void }

const BLADE_COUNT = 8

export function Diaphragm({ open, onComplete }: Props) {
  const groupRef = useRef<Group>(null)
  const bladesRef = useRef<Mesh[]>([])

  useFrame((_, delta) => {
    const targetRotation = open ? -Math.PI / 8 : 0
    const targetOpacity = open ? 0 : 1
    bladesRef.current.forEach((blade, i) => {
      if (!blade) return
      const angle = (i / BLADE_COUNT) * Math.PI * 2
      const targetX = open ? Math.cos(angle) * 0.05 : Math.cos(angle) * 1.2
      const targetZ = open ? Math.sin(angle) * 0.05 : Math.sin(angle) * 1.2
      blade.position.x = MathUtils.lerp(blade.position.x, targetX, delta * 4)
      blade.position.z = MathUtils.lerp(blade.position.z, targetZ, delta * 4)
      blade.rotation.y = MathUtils.lerp(blade.rotation.y, targetRotation, delta * 4)
      const mat = blade.material as any
      if (mat?.opacity !== undefined) {
        mat.opacity = MathUtils.lerp(mat.opacity, targetOpacity, delta * 4)
      }
    })
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: BLADE_COUNT }).map((_, i) => {
        const angle = (i / BLADE_COUNT) * Math.PI * 2
        return (
          <mesh
            key={i}
            ref={(el) => { if (el) bladesRef.current[i] = el }}
            position={[Math.cos(angle) * 1.2, 0, Math.sin(angle) * 1.2]}
            rotation={[0, angle, 0]}
          >
            <coneGeometry args={[0.6, 1.5, 3]} />
            <meshStandardMaterial color="#0a0a0a" transparent opacity={1} />
          </mesh>
        )
      })}
    </group>
  )
}

'use client'
import { useMemo } from 'react'
import * as THREE from 'three'

export function DollyRails({ length = 30 }: { length?: number }) {
  const points = useMemo(() => {
    const arr: THREE.Vector3[] = []
    for (let i = 0; i <= 50; i++) {
      const t = i / 50
      const z = -length / 2 + t * length
      const x = Math.sin(t * Math.PI * 2) * 2
      arr.push(new THREE.Vector3(x, -1.4, z))
    }
    return arr
  }, [length])

  return (
    <>
      {[1, -1].map((side) => (
        <line key={side}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(points.flatMap((p) => [p.x, p.y + side * 0.6, p.z])), 3]}
              count={points.length}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#8b2e2e" transparent opacity={0.3} />
        </line>
      ))}
    </>
  )
}
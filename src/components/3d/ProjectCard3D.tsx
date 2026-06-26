'use client'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Image, Text } from '@react-three/drei'
import { Group, MathUtils } from 'three'
import type { Project } from '@/payload-types'

type Props = {
  project: Project
  position: [number, number, number]
  featured?: boolean
  onClick?: () => void
}

export function ProjectCard3D({ project, position, featured, onClick }: Props) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)

  const coverUrl = typeof project.coverImage === 'object' ? (project.coverImage as any).url : null

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const targetZ = position[2] + (hovered ? 0.5 : 0)
    groupRef.current.position.z = MathUtils.lerp(groupRef.current.position.z, targetZ, delta * 5)
  })

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      {coverUrl && (
        <Image
          url={coverUrl}
          scale={[2, 1.125]}
          transparent
          opacity={featured ? 1 : 0.6}
        />
      )}
      {featured && (
        <Text
          position={[0, -0.8, 0.1]}
          fontSize={0.12}
          color="#f5f1ea"
          anchorX="center"
          maxWidth={2}
        >
          {project.title}
        </Text>
      )}
    </group>
  )
}
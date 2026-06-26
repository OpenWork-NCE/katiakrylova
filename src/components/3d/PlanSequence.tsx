'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import { Fog, MathUtils, Group } from 'three'
import type { Project } from '@/payload-types'
import { ProjectCard3D } from './ProjectCard3D'
import { DollyRails } from './DollyRails'
import { DustParticles } from './DustParticles'
import { useRouter } from 'next/navigation'

const ROW_Z = [-6, -2, 2, 6]
const COL_X = [-8, -4, 0, 4, 8]

function CameraRig({ scrollProgress }: { scrollProgress: { current: number } }) {
  const { camera, mouse } = useThree()

  useFrame(() => {
    camera.position.z = MathUtils.lerp(camera.position.z, 8 - scrollProgress.current * 20, 0.05)
    camera.position.y = MathUtils.lerp(camera.position.y, mouse.y * 0.3, 0.05)
    camera.rotation.x = MathUtils.lerp(camera.rotation.x, -mouse.y * 0.05, 0.05)
    camera.rotation.y = MathUtils.lerp(camera.rotation.y, mouse.x * 0.05, 0.05)
  })

  return null
}

export function PlanSequence({ projects, locale }: { projects: Project[]; locale: string }) {
  const router = useRouter()
  const [supportsWebGL, setSupportsWebGL] = useState(true)
  const scrollProgress = useRef({ current: 0 })

  useEffect(() => {
    try {
      const c = document.createElement('canvas')
      setSupportsWebGL(!!(c.getContext('webgl') || c.getContext('experimental-webgl')))
    } catch { setSupportsWebGL(false) }
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scrollProgress.current.current = window.scrollY / max
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!supportsWebGL) return <FallbackGrid projects={projects} locale={locale} />

  return (
    <div className="fixed inset-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true }}
        onCreated={({ scene }) => { scene.fog = new Fog('#0a0a0a', 5, 25) }}
      >
        <CameraRig scrollProgress={scrollProgress.current} />
        <DollyRails />
        <DustParticles />
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 2, 4]} intensity={0.6} color="#8b2e2e" />

        {projects.map((project, i) => {
          const rowIdx = Math.floor(i / COL_X.length)
          const colIdx = i % COL_X.length
          const x = COL_X[colIdx] ?? 0
          const z = ROW_Z[rowIdx] ?? 0
          return (
            <ProjectCard3D
              key={project.id}
              project={project}
              position={[x, 0, z]}
              featured={i === 0}
              onClick={() => router.push(`/${locale}/projects/${project.slug}`)}
            />
          )
        })}
      </Canvas>

      <div className="fixed bottom-md right-md text-xs text-text-muted opacity-70 font-body z-10">
        {String(1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
      </div>
    </div>
  )
}

function FallbackGrid({ projects, locale }: { projects: Project[]; locale: string }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md p-md">
      {projects.map((p) => {
        const cover = typeof p.coverImage === 'object' ? (p.coverImage as any).url : null
        return (
          <a key={p.id} href={`/${locale}/projects/${p.slug}`} className="block">
            {cover && <img src={cover} alt={p.title} className="w-full aspect-video object-cover" />}
            <h3 className="font-hand mt-sm">{p.title}</h3>
          </a>
        )
      })}
    </div>
  )
}
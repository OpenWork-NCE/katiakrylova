'use client'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import { useState, useEffect, useRef } from 'react'
import { Fog } from 'three'
import Link from 'next/link'
import type { Project } from '@/payload-types'
import { getMediaUrl } from '@/lib/utils'
import { GalleryCorridor } from './GalleryCorridor'
import { CorridorHUD } from './CorridorHUD'
import { CorridorScrollProgress } from './CorridorScrollProgress'
import { CAMERA_EYE_Y, FOG_COLOR, SCROLL_DAMPING, SCROLL_PAGES_PER_PROJECT } from './corridor-constants'
import '@/styles/corridor-scroll.css'

export function PlanSequence({ projects, locale }: { projects: Project[]; locale: string }) {
  const [supportsWebGL, setSupportsWebGL] = useState(true)
  const [reduced, setReduced] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [showHint, setShowHint] = useState(true)
  const scrollProgressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    try {
      const c = document.createElement('canvas')
      setSupportsWebGL(!!(c.getContext('webgl') || c.getContext('experimental-webgl')))
    } catch {
      setSupportsWebGL(false)
    }
  }, [])

  if (reduced || !supportsWebGL) return <FallbackGrid projects={projects} locale={locale} />

  const activeProject = projects[activeIndex]
  const scrollPages = Math.max(1.5, projects.length * SCROLL_PAGES_PER_PROJECT)

  return (
    <>
      <div className="plan-sequence-viewport fixed inset-x-0 top-16 bottom-0 z-0">
        <Canvas
          camera={{ position: [0, CAMERA_EYE_Y, 9], fov: 50 }}
          gl={{ antialias: true }}
          frameloop="always"
          style={{ touchAction: 'pan-y' }}
          onCreated={({ scene }) => {
            scene.fog = new Fog(FOG_COLOR, 9, 44)
          }}
        >
          <ScrollControls
            pages={scrollPages}
            damping={SCROLL_DAMPING}
            distance={1}
            maxSpeed={1.75}
            eps={0.001}
            style={{ scrollbarGutter: 'stable' }}
          >
            <GalleryCorridor
              projects={projects}
              activeIndex={activeIndex}
              onActiveIndexChange={setActiveIndex}
              onDismissHint={() => setShowHint(false)}
              scrollProgressRef={scrollProgressRef}
            />
          </ScrollControls>
        </Canvas>

        <CorridorScrollProgress progressRef={scrollProgressRef} />

        {activeProject && (
          <CorridorHUD
            project={activeProject}
            locale={locale}
            index={activeIndex}
            total={projects.length}
            showHint={showHint}
          />
        )}
      </div>

      <ul className="sr-only">
        {projects.map((p) => (
          <li key={p.id}>
            <Link href={`/${locale}/projects/${p.slug}`}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

function FallbackGrid({ projects, locale }: { projects: Project[]; locale: string }) {
  return (
    <div className="grid grid-cols-2 gap-md p-md md:grid-cols-3">
      {projects.map((p) => {
        const cover = getMediaUrl(p.coverImage)
        return (
          <Link key={p.id} href={`/${locale}/projects/${p.slug}`} className="group block">
            {cover && <img src={cover} alt={p.title} className="aspect-video w-full object-cover" />}
            <h3 className="mt-sm font-hand">{p.title}</h3>
          </Link>
        )
      })}
    </div>
  )
}
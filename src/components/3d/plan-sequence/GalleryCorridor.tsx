'use client'
import { useMemo, useRef, type MutableRefObject, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import type { Project } from '@/payload-types'
import { CorridorCamera } from './CorridorCamera'
import { CorridorEnvironment } from './CorridorEnvironment'
import { GalleryFrame } from './GalleryFrame'
import { CorridorScrollBridge } from './CorridorScrollBridge'
import type { CorridorScrollHandle } from './corridor-scroll'
import { HINT_DISMISS_OFFSET } from './corridor-constants'
import { buildFrameSlots, getCorridorDimensions, pickActiveIndexFromScroll } from './corridor-math'

function ScrollWatcher({ onDismissHint }: { onDismissHint: () => void }) {
  const scroll = useScroll()
  const dismissed = useRef(false)

  useFrame(() => {
    if (!dismissed.current && scroll.offset > HINT_DISMISS_OFFSET) {
      dismissed.current = true
      onDismissHint()
    }
  })

  return null
}

type Props = {
  projects: Project[]
  activeIndex: number
  onActiveIndexChange: (index: number) => void
  onDismissHint: () => void
  scrollProgressRef: RefObject<HTMLDivElement | null>
  scrollHandleRef: MutableRefObject<CorridorScrollHandle | null>
  onScrollOffsetChange?: (offset: number) => void
}

export function GalleryCorridor({
  projects,
  activeIndex,
  onActiveIndexChange,
  onDismissHint,
  scrollProgressRef,
  scrollHandleRef,
  onScrollOffsetChange,
}: Props) {
  const { viewport, size } = useThree()
  const scroll = useScroll()
  const focusZRef = useRef(0)
  const activeIndexRef = useRef(activeIndex)
  const isMobile = size.width < 768

  const dims = useMemo(
    () => getCorridorDimensions(viewport.width, isMobile, size.width),
    [viewport.width, isMobile, size.width],
  )
  const slots = useMemo(() => buildFrameSlots(projects.length, dims), [projects.length, dims])

  useFrame(() => {
    const next = pickActiveIndexFromScroll(scroll.offset, projects.length, activeIndexRef.current)
    if (next !== activeIndexRef.current) {
      activeIndexRef.current = next
      onActiveIndexChange(next)
    }
  })

  return (
    <>
      <ScrollWatcher onDismissHint={onDismissHint} />
      <CorridorScrollBridge
        progressRef={scrollProgressRef}
        scrollHandleRef={scrollHandleRef}
        onOffsetChange={onScrollOffsetChange}
      />
      <CorridorCamera slots={slots} dims={dims} focusZRef={focusZRef} activeIndexRef={activeIndexRef} />
      <CorridorEnvironment
        projectCount={projects.length}
        halfWidth={dims.halfWidth}
        startZ={dims.startZ}
        frameSpacingZ={dims.frameSpacingZ}
      />
      <ambientLight intensity={0.16} color="#1a1414" />
      <hemisphereLight args={['#2a1a18', '#060606', 0.28]} />
      <pointLight position={[0, 2.6, 3]} intensity={0.28} color="#8b3a3a" distance={18} decay={2} />
      <pointLight position={[0, 1.8, -6]} intensity={0.12} color="#4a2820" distance={22} decay={2} />

      {projects.map((project, i) => (
        <GalleryFrame
          key={project.id}
          project={project}
          slot={slots[i]}
          activeIndexRef={activeIndexRef}
          frameWidth={dims.frameWidth}
          frameHeight={dims.frameHeight}
          presentXPull={dims.presentXPull}
          presentRotPull={dims.presentRotPull}
        />
      ))}
    </>
  )
}
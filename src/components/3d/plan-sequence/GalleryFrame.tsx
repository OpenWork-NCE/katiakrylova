'use client'
import { useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { Group, MathUtils, Mesh, MeshBasicMaterial, PointLight } from 'three'
import type { Project } from '@/payload-types'
import { getAbsoluteMediaUrl, getMediaUrl } from '@/lib/utils'
import {
  ACCENT_LIGHT,
  FRAME_COLOR,
  FRAME_DAMP_ACTIVE,
  FRAME_DAMP_IDLE,
  FRAME_EDGE,
  FRAME_LIP,
  MATTE_COLOR,
  PRESENT_CENTER_Z,
  PRESENT_DAMP_IN,
  PRESENT_DAMP_OUT,
  WALL_EMBED_DEPTH,
  WALL_RECESS_Z,
} from './corridor-constants'
import { easeInOutCubic, lerpAngle } from './corridor-math'
import type { FrameSlot } from './types'

type InnerProps = {
  coverUrl: string
  slot: FrameSlot
  activeIndexRef: MutableRefObject<number>
  frameWidth: number
  frameHeight: number
  presentXPull: number
  presentRotPull: number
}

function GalleryFrameInner({
  coverUrl,
  slot,
  activeIndexRef,
  frameWidth,
  frameHeight,
  presentXPull,
  presentRotPull,
}: InnerProps) {
  const frameRef = useRef<Group>(null)
  const imageMeshRef = useRef<Mesh>(null)
  const imageMatRef = useRef<MeshBasicMaterial>(null)
  const shellMatRef = useRef<MeshBasicMaterial>(null)
  const edgeMatRef = useRef<MeshBasicMaterial>(null)
  const lipMatRef = useRef<MeshBasicMaterial>(null)
  const matteMatRef = useRef<MeshBasicMaterial>(null)
  const sconceMatRef = useRef<MeshBasicMaterial>(null)
  const lightRef = useRef<PointLight>(null)
  const presentAmount = useRef(0)
  const opacityRef = useRef(0.5)
  const lightIntensity = useRef(0)
  const texture = useTexture(coverUrl)

  const border = 0.055
  const outerW = frameWidth + border * 2
  const outerH = frameHeight + border * 2
  const wallY = slot.position[1]
  const wallZ = slot.position[2]

  useFrame((_, delta) => {
    if (!frameRef.current) return

    const isActive = activeIndexRef.current === slot.index
    const targetPresent = isActive ? 1 : 0

    presentAmount.current = MathUtils.damp(
      presentAmount.current,
      targetPresent,
      isActive ? PRESENT_DAMP_IN : PRESENT_DAMP_OUT,
      delta,
    )

    if (!isActive && presentAmount.current < 0.006) {
      presentAmount.current = 0
    }

    const rawP = presentAmount.current
    const p = isActive ? rawP : 1 - easeInOutCubic(1 - rawP)
    const shellAlpha = MathUtils.clamp((p - 0.06) / 0.4, 0, 1)
    const imageZ = MathUtils.lerp(WALL_RECESS_Z, 0.028, p)

    if (p <= 0) {
      frameRef.current.position.set(slot.wallX, wallY, wallZ)
      frameRef.current.rotation.set(0, slot.rotation[1], 0)
    } else {
      const presentX = MathUtils.lerp(slot.wallX, 0, p * presentXPull)
      const targetZ = MathUtils.lerp(wallZ, wallZ + PRESENT_CENTER_Z, p)
      const targetRotY = lerpAngle(slot.rotation[1], 0, p * presentRotPull)
      frameRef.current.position.set(presentX, wallY, targetZ)
      frameRef.current.rotation.set(0, targetRotY, 0)
    }

    const targetOpacity = MathUtils.lerp(0.58, 0.94, p)
    const targetLight = p * 0.4
    const frameSmooth = isActive ? FRAME_DAMP_ACTIVE : FRAME_DAMP_IDLE

    opacityRef.current = MathUtils.damp(opacityRef.current, targetOpacity, frameSmooth, delta)
    lightIntensity.current = MathUtils.damp(lightIntensity.current, targetLight, frameSmooth, delta)

    if (imageMeshRef.current) imageMeshRef.current.position.z = imageZ
    if (imageMatRef.current) {
      imageMatRef.current.opacity = opacityRef.current
      imageMatRef.current.depthWrite = p > 0.12
    }
    if (shellMatRef.current) shellMatRef.current.opacity = shellAlpha * 0.92
    if (edgeMatRef.current) edgeMatRef.current.opacity = shellAlpha * 0.85
    if (lipMatRef.current) lipMatRef.current.opacity = shellAlpha * 0.7
    if (matteMatRef.current) matteMatRef.current.opacity = shellAlpha * 0.75
    if (sconceMatRef.current) sconceMatRef.current.opacity = shellAlpha * 0.5
    if (lightRef.current) lightRef.current.intensity = lightIntensity.current
  })

  return (
    <group ref={frameRef} position={[slot.wallX - WALL_EMBED_DEPTH, wallY, wallZ]} rotation={[0, slot.rotation[1], 0]}>
      <mesh position={[0, outerH * 0.56, 0.035]}>
        <boxGeometry args={[outerW * 0.7, 0.008, 0.04]} />
        <meshBasicMaterial ref={sconceMatRef} color={FRAME_LIP} transparent opacity={0} toneMapped={false} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0, -0.048]}>
        <boxGeometry args={[outerW, outerH, 0.055]} />
        <meshBasicMaterial ref={shellMatRef} color={FRAME_COLOR} transparent opacity={0} toneMapped={false} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0, -0.022]}>
        <boxGeometry args={[outerW - 0.02, outerH - 0.02, 0.014]} />
        <meshBasicMaterial ref={edgeMatRef} color={FRAME_EDGE} transparent opacity={0} toneMapped={false} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[outerW - 0.04, outerH - 0.04, 0.006]} />
        <meshBasicMaterial ref={lipMatRef} color={FRAME_LIP} transparent opacity={0} toneMapped={false} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0, 0.002]}>
        <planeGeometry args={[frameWidth + 0.06, frameHeight + 0.06]} />
        <meshBasicMaterial ref={matteMatRef} color={MATTE_COLOR} transparent opacity={0} toneMapped={false} depthWrite={false} />
      </mesh>

      <mesh ref={imageMeshRef} position={[0, 0, WALL_RECESS_Z]}>
        <planeGeometry args={[frameWidth, frameHeight]} />
        <meshBasicMaterial
          ref={imageMatRef}
          map={texture}
          transparent
          opacity={0.58}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      <pointLight
        ref={lightRef}
        position={[0, frameHeight * 0.38, 0.18]}
        color={ACCENT_LIGHT}
        intensity={0}
        distance={4}
        decay={2}
      />
    </group>
  )
}

type Props = Omit<InnerProps, 'coverUrl'> & {
  project: Project
}

export function GalleryFrame({ project, ...props }: Props) {
  const relativeCover = getMediaUrl(project.coverImage)
  const coverUrl = relativeCover ? getAbsoluteMediaUrl(relativeCover) : null
  if (!coverUrl) return null
  return <GalleryFrameInner {...props} coverUrl={coverUrl} />
}
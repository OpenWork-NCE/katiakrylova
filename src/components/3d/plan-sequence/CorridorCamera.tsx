'use client'
import { useEffect, useRef, type MutableRefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { MathUtils, PerspectiveCamera } from 'three'
import { CAMERA_PITCH } from './corridor-constants'
import { sampleDollyPose } from './corridor-math'
import type { CorridorDimensions, FrameSlot } from './types'

type Props = {
  slots: FrameSlot[]
  dims: CorridorDimensions
  focusZRef: MutableRefObject<number>
  activeIndexRef: MutableRefObject<number>
}

/**
 * Stable dolly rig — walks straight down the corridor center.
 * Fixed pitch/yaw/roll: no lookAt, no gimbal flip, no roll drift.
 */
export function CorridorCamera({ slots, dims, focusZRef, activeIndexRef }: Props) {
  const scroll = useScroll()
  const { camera, size } = useThree()
  const panXRef = useRef(0)

  useEffect(() => {
    const cam = camera as PerspectiveCamera
    cam.fov = size.width < 400 ? 54 : size.width < 640 ? 50 : size.width < 1024 ? 58 : 50
    cam.up.set(0, 1, 0)
    cam.rotation.order = 'YXZ'
    cam.updateProjectionMatrix()
  }, [camera, size.width])

  useEffect(() => {
    const pose = sampleDollyPose(0, slots, dims)
    const activeSlot = slots[activeIndexRef.current]
    panXRef.current = activeSlot ? activeSlot.wallX * dims.cameraPanRatio : 0
    camera.position.set(panXRef.current, pose.position[1], pose.position[2])
    camera.rotation.set(CAMERA_PITCH, 0, 0)
    focusZRef.current = pose.focusZ
  }, [camera, slots, dims, focusZRef, activeIndexRef])

  useFrame((_, delta) => {
    const pose = sampleDollyPose(scroll.offset, slots, dims)
    const activeSlot = slots[activeIndexRef.current]
    const targetPanX = activeSlot ? activeSlot.wallX * dims.cameraPanRatio : 0

    panXRef.current = MathUtils.damp(panXRef.current, targetPanX, 5, delta)

    camera.position.set(panXRef.current, pose.position[1], pose.position[2])
    camera.rotation.set(CAMERA_PITCH, 0, 0)
    focusZRef.current = pose.focusZ
  })

  return null
}
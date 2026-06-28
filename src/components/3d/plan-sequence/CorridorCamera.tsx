'use client'
import { useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { PerspectiveCamera } from 'three'
import { CAMERA_PITCH } from './corridor-constants'
import { sampleDollyPose } from './corridor-math'
import type { CorridorDimensions, FrameSlot } from './types'

type Props = {
  slots: FrameSlot[]
  dims: CorridorDimensions
  focusZRef: React.MutableRefObject<number>
}

/**
 * Stable dolly rig — walks straight down the corridor center.
 * Fixed pitch/yaw/roll: no lookAt, no gimbal flip, no roll drift.
 */
export function CorridorCamera({ slots, dims, focusZRef }: Props) {
  const scroll = useScroll()
  const { camera, size } = useThree()

  useEffect(() => {
    const cam = camera as PerspectiveCamera
    cam.fov = size.width < 640 ? 66 : size.width < 1024 ? 58 : 50
    cam.up.set(0, 1, 0)
    cam.rotation.order = 'YXZ'
    cam.updateProjectionMatrix()
  }, [camera, size.width])

  useEffect(() => {
    const pose = sampleDollyPose(0, slots, dims)
    camera.position.set(...pose.position)
    camera.rotation.set(CAMERA_PITCH, 0, 0)
    focusZRef.current = pose.focusZ
  }, [camera, slots, dims, focusZRef])

  useFrame(() => {
    const pose = sampleDollyPose(scroll.offset, slots, dims)

    camera.position.set(pose.position[0], pose.position[1], pose.position[2])
    camera.rotation.set(CAMERA_PITCH, 0, 0)
    focusZRef.current = pose.focusZ
  })

  return null
}
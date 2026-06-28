import {
  ACTIVE_SCROLL_BACK,
  ACTIVE_SCROLL_FORWARD,
  CAMERA_EYE_Y,
  FOCUS_PLANE_OFFSET,
  FRAME_CENTER_Y,
  PRESENT_ROT_PULL,
  PRESENT_ROT_PULL_MOBILE,
  PRESENT_X_PULL,
  PRESENT_X_PULL_MOBILE,
} from './corridor-constants'
import type { CorridorDimensions, FrameSlot, WallSide } from './types'

export function frameSideForIndex(index: number): WallSide {
  return index % 2 === 0 ? 'left' : 'right'
}

export type DollyPose = {
  position: [number, number, number]
  focusZ: number
}

/** Shortest-path angle interpolation — no spin through 360° */
export function lerpAngle(from: number, to: number, t: number) {
  let delta = to - from
  while (delta > Math.PI) delta -= Math.PI * 2
  while (delta < -Math.PI) delta += Math.PI * 2
  return from + delta * t
}

/** Quintic ease — premium reveal curve */
export function easeQuint(t: number) {
  const c = Math.max(0, Math.min(1, t))
  return c * c * c * (c * (c * 6 - 15) + 10)
}

export function easeInOutCubic(t: number) {
  const c = Math.max(0, Math.min(1, t))
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2
}

export function getCorridorDimensions(
  viewportWidth: number,
  isMobile: boolean,
  pixelWidth = 1024,
): CorridorDimensions {
  const narrow = pixelWidth < 400
  const halfWidth = isMobile
    ? Math.min(1.85, Math.max(1.4, viewportWidth * 0.24))
    : Math.min(2.95, Math.max(2.2, viewportWidth * 0.26))

  const frameHeight = isMobile
    ? narrow
      ? Math.min(1, Math.max(0.74, pixelWidth / 380))
      : Math.min(1.12, Math.max(0.82, viewportWidth / 11))
    : Math.min(1.36, Math.max(1, viewportWidth / 13.5))

  const frameSpacingZ = isMobile ? (narrow ? 4.4 : 4.6) : 5.4
  const wallInsetFactor = isMobile ? (narrow ? 0.5 : 0.58) : 0.975

  return {
    halfWidth,
    frameSpacingZ,
    frameHeight,
    frameWidth: frameHeight * (16 / 9),
    viewingDistance: isMobile ? (narrow ? 2.75 : 2.95) : 4,
    startZ: 5,
    eyeY: CAMERA_EYE_Y,
    frameCenterY: FRAME_CENTER_Y,
    peekOffset: 0,
    wallInset: halfWidth * wallInsetFactor,
    presentXPull: isMobile ? PRESENT_X_PULL_MOBILE : PRESENT_X_PULL,
    presentRotPull: isMobile ? PRESENT_ROT_PULL_MOBILE : PRESENT_ROT_PULL,
    cameraPanRatio: isMobile ? (narrow ? 0.5 : 0.46) : 0,
  }
}

/** Paintings hung flush on alternating walls, facing the corridor. */
export function buildFrameSlots(count: number, dims: CorridorDimensions): FrameSlot[] {
  return Array.from({ length: count }, (_, i) => {
    const side = frameSideForIndex(i)
    const sign = side === 'left' ? -1 : 1
    const wallX = sign * dims.wallInset
    const z = dims.startZ - i * dims.frameSpacingZ
    const y = dims.frameCenterY
    const rotY = side === 'left' ? Math.PI / 2 : -Math.PI / 2

    return {
      index: i,
      side,
      position: [wallX, y, z],
      rotation: [0, rotY, 0],
      wallX,
    }
  })
}

export function corridorTravel(count: number, dims: CorridorDimensions) {
  return Math.max(dims.frameSpacingZ, (count - 1) * dims.frameSpacingZ)
}

/** Continuous dolly — scroll drives position 1:1, no keyframe jumps. */
export function sampleDollyPose(scrollOffset: number, slots: FrameSlot[], dims: CorridorDimensions): DollyPose {
  const count = slots.length
  const travel = corridorTravel(count, dims)
  const startCamZ = dims.startZ + dims.viewingDistance
  const endCamZ = startCamZ - travel
  const progress = Math.max(0, Math.min(1, scrollOffset))

  const cameraZ = startCamZ - progress * (startCamZ - endCamZ)
  const focusZ = cameraZ - FOCUS_PLANE_OFFSET

  return {
    position: [0, dims.eyeY, cameraZ],
    focusZ,
  }
}

/**
 * Scroll-segment Schmitt trigger — stable index, no flip-flop from damped focusZ jitter.
 * Each painting owns a scroll segment; wide dead band at boundaries kills oscillation.
 */
export function pickActiveIndexFromScroll(scrollOffset: number, count: number, currentIndex: number): number {
  if (count <= 1) return 0

  const clamped = Math.max(0, Math.min(1, scrollOffset))
  const t = clamped * (count - 1)
  const lower = Math.floor(t)
  const upper = Math.min(count - 1, lower + 1)
  const frac = t - lower

  if (upper > currentIndex && frac >= ACTIVE_SCROLL_FORWARD) return upper
  if (lower < currentIndex && frac <= ACTIVE_SCROLL_BACK) return lower
  return currentIndex
}

export function sampleCenterline(
  count: number,
  _halfWidth: number,
  startZ: number,
  spacing: number,
  steps = 48,
): { x: number; z: number }[] {
  const maxT = Math.max(1, count - 1)
  const endZ = startZ - maxT * spacing
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps
    return {
      x: 0,
      z: startZ + (endZ - startZ) * t,
    }
  })
}
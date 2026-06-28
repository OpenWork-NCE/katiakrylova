export type WallSide = 'left' | 'right'

export type FrameSlot = {
  index: number
  side: WallSide
  position: [number, number, number]
  rotation: [number, number, number]
  wallX: number
}

export type CameraKeyframe = {
  position: [number, number, number]
  lookAt: [number, number, number]
}

export type CorridorDimensions = {
  halfWidth: number
  frameSpacingZ: number
  frameHeight: number
  frameWidth: number
  viewingDistance: number
  startZ: number
  eyeY: number
  frameCenterY: number
  peekOffset: number
  wallInset: number
  presentXPull: number
  presentRotPull: number
  cameraPanRatio: number
}
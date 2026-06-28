'use client'
import { useMemo } from 'react'
import * as THREE from 'three'
import { DustParticles } from '../DustParticles'
import {
  CEILING_Y,
  FLOOR_COLOR,
  FLOOR_Y,
  FOG_COLOR,
  GUIDE_LINE,
  GUIDE_LINE_DIM,
  RUNNER_COLOR,
} from './corridor-constants'

type Props = {
  projectCount: number
  halfWidth: number
  startZ: number
  frameSpacingZ: number
}

const CORRIDOR_WIDTH_RATIO = 0.95

function buildStraightCorridorPoints(
  projectCount: number,
  halfWidth: number,
  startZ: number,
  frameSpacingZ: number,
  steps: number,
) {
  const w = halfWidth * CORRIDOR_WIDTH_RATIO
  const maxT = Math.max(1, projectCount - 1)
  const endZ = startZ - maxT * frameSpacingZ
  const floor: number[] = []
  const walls: number[] = []
  const ceiling: number[] = []
  const center: number[] = []

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const z = startZ + (endZ - startZ) * t

    floor.push(-w, FLOOR_Y, z, w, FLOOR_Y, z)
    walls.push(-w, FLOOR_Y, z, -w, CEILING_Y, z)
    walls.push(w, FLOOR_Y, z, w, CEILING_Y, z)
    ceiling.push(-w, CEILING_Y, z, w, CEILING_Y, z)
    center.push(0, FLOOR_Y + 0.02, z)
  }

  const shellDepth = Math.abs(endZ - startZ) + 14
  const shellZ = (startZ + endZ) / 2

  return {
    floorLines: new Float32Array(floor),
    wallLines: new Float32Array(walls),
    ceilingLines: new Float32Array(ceiling),
    centerLine: new Float32Array(center),
    shellWidth: halfWidth * 3.4,
    shellDepth,
    shellZ,
    corridorWidth: w * 2,
  }
}

export function CorridorEnvironment({ projectCount, halfWidth, startZ, frameSpacingZ }: Props) {
  const { floorLines, wallLines, ceilingLines, centerLine, shellWidth, shellDepth, shellZ, corridorWidth } = useMemo(
    () => buildStraightCorridorPoints(projectCount, halfWidth, startZ, frameSpacingZ, 48),
    [projectCount, halfWidth, startZ, frameSpacingZ],
  )

  const midY = (FLOOR_Y + CEILING_Y) / 2

  return (
    <group>
      <mesh position={[0, FLOOR_Y - 0.01, shellZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[shellWidth, shellDepth]} />
        <meshBasicMaterial color={FLOOR_COLOR} toneMapped={false} />
      </mesh>

      <mesh position={[0, FLOOR_Y + 0.005, shellZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[corridorWidth * 0.58, shellDepth]} />
        <meshBasicMaterial color={RUNNER_COLOR} transparent opacity={0.85} toneMapped={false} depthWrite={false} />
      </mesh>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[floorLines, 3]} count={floorLines.length / 3} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={GUIDE_LINE} transparent opacity={0.16} />
      </lineSegments>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[wallLines, 3]} count={wallLines.length / 3} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={GUIDE_LINE} transparent opacity={0.1} />
      </lineSegments>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ceilingLines, 3]} count={ceilingLines.length / 3} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={GUIDE_LINE_DIM} transparent opacity={0.08} />
      </lineSegments>

      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[centerLine, 3]} count={centerLine.length / 3} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={GUIDE_LINE_DIM} transparent opacity={0.12} />
      </line>

      <mesh position={[0, midY, shellZ]}>
        <planeGeometry args={[shellWidth, shellDepth]} />
        <meshBasicMaterial color={FOG_COLOR} side={THREE.BackSide} toneMapped={false} />
      </mesh>

      <DustParticles count={90} />
    </group>
  )
}
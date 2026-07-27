'use client'

import { useMemo, type CSSProperties } from 'react'
import { CLOSE_MS, IRIS_BLADE_COUNT, OPEN_MS, type TransitionIntent } from './constants'
import { irisBladeClosedRotation, irisBladePaths } from './iris-geometry'
import '@/styles/iris-wipe.css'

export type IrisPhase = 'idle' | 'closing' | 'closed' | 'opening' | 'boot'

type Props = {
  phase: IrisPhase
  intent?: TransitionIntent
}

/**
 * Full-viewport diaphragm overlay — radial shutter + decorative blades.
 */
export function IrisWipe({ phase, intent = 'default' }: Props) {
  const blades = useMemo(() => irisBladePaths(), [])
  const closeMs = CLOSE_MS[intent]
  const openMs = OPEN_MS[intent]
  const slice = 360 / IRIS_BLADE_COUNT

  const style = {
    '--iris-close-ms': `${closeMs}ms`,
    '--iris-open-ms': `${openMs}ms`,
  } as CSSProperties

  return (
    <div className="iris-wipe" data-phase={phase} data-intent={intent} aria-hidden style={style}>
      {/* Reliable full blackout */}
      <div className="iris-wipe__shutter" />

      {/* Mechanical blades for cinema texture */}
      {(phase === 'closing' ||
        phase === 'closed' ||
        phase === 'opening' ||
        phase === 'boot') && (
        <svg
          className="iris-wipe__svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          {blades.map((d, i) => (
            <path
              key={i}
              className="iris-wipe__blade"
              d={d}
              style={
                {
                  '--blade-base': `${i * slice}deg`,
                  '--blade-shut': `${irisBladeClosedRotation(i)}deg`,
                  transitionDelay:
                    phase === 'opening' ? `${(blades.length - 1 - i) * 10}ms` : undefined,
                } as CSSProperties
              }
            />
          ))}
        </svg>
      )}
    </div>
  )
}

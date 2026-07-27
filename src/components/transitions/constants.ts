/** Iris blink timings (ms) — premium cinema, no overshoot */

export type TransitionIntent = 'default' | 'signature' | 'locale'

export const CLOSE_MS: Record<TransitionIntent, number> = {
  default: 380,
  signature: 450,
  locale: 280,
}

export const OPEN_MS: Record<TransitionIntent, number> = {
  default: 420,
  signature: 520,
  locale: 320,
}

/** Reduced-motion crossfade */
export const REDUCED_FADE_MS = 120

/** Blade count for the diaphragm */
export const IRIS_BLADE_COUNT = 8

/** Session flag: home boot iris already played */
export const HOME_BOOT_KEY = 'kk-iris-boot'

/** Legacy alias — prefer CLOSE_MS / OPEN_MS */
export const FADE_MS = CLOSE_MS.default

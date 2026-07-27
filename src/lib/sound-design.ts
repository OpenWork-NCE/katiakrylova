/**
 * Cinematic sound design for Iris Blink — Web Audio only (no asset files).
 * Aesthetic: soft shutter / aperture, dark cinema room, never cartoon.
 *
 * Unlock: first user gesture (click/tap). Mute: localStorage `kk-sound`.
 */

export type SoundCue =
  | 'iris-close'
  | 'iris-open'
  | 'iris-close-signature'
  | 'iris-open-signature'
  | 'iris-close-locale'
  | 'iris-open-locale'
  | 'boot-open'
  | 'ui-toggle'

const STORAGE_KEY = 'kk-sound'

type Master = {
  ctx: AudioContext
  master: GainNode
  unlocked: boolean
}

let master: Master | null = null
let muted = true // until we read storage + unlock

function readMutedPreference(): boolean {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    // Default: sound on (user can mute). First play still needs gesture.
    if (v === 'off') return true
    if (v === 'on') return false
    return false
  } catch {
    return false
  }
}

export function isSoundMuted(): boolean {
  return muted
}

export function setSoundMuted(next: boolean) {
  muted = next
  try {
    localStorage.setItem(STORAGE_KEY, next ? 'off' : 'on')
  } catch {
    /* ignore */
  }
  if (master) {
    const t = master.ctx.currentTime
    master.master.gain.cancelScheduledValues(t)
    master.master.gain.setValueAtTime(master.master.gain.value, t)
    master.master.gain.linearRampToValueAtTime(next ? 0 : 0.85, t + 0.08)
  }
}

function ensureMaster(): Master | null {
  if (typeof window === 'undefined') return null
  if (master) return master

  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AC) return null

  const ctx = new AC()
  const gain = ctx.createGain()
  gain.gain.value = 0
  gain.connect(ctx.destination)

  master = { ctx, master: gain, unlocked: false }
  muted = readMutedPreference()
  return master
}

/** Call from any user gesture — resumes AudioContext and raises master if unmuted. */
export async function unlockSound(): Promise<void> {
  const m = ensureMaster()
  if (!m) return
  if (m.ctx.state === 'suspended') {
    try {
      await m.ctx.resume()
    } catch {
      return
    }
  }
  m.unlocked = true
  muted = readMutedPreference()
  const t = m.ctx.currentTime
  m.master.gain.cancelScheduledValues(t)
  m.master.gain.setValueAtTime(m.master.gain.value, t)
  m.master.gain.linearRampToValueAtTime(muted ? 0 : 0.85, t + 0.05)
}

function noiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * seconds)
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) {
    // Soft noise (not pure white) — average a few samples
    data[i] = (Math.random() * 2 - 1) * 0.55 + (Math.random() * 2 - 1) * 0.25
  }
  return buf
}

function playWhoosh(
  m: Master,
  opts: {
    duration: number
    filterStart: number
    filterEnd: number
    gainPeak: number
    type?: BiquadFilterType
    reverse?: boolean
  },
) {
  const { ctx, master: out } = m
  const t0 = ctx.currentTime
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer(ctx, Math.min(opts.duration + 0.05, 1.2))

  const filter = ctx.createBiquadFilter()
  filter.type = opts.type ?? 'lowpass'
  filter.Q.value = 0.7
  filter.frequency.setValueAtTime(opts.filterStart, t0)
  filter.frequency.exponentialRampToValueAtTime(Math.max(80, opts.filterEnd), t0 + opts.duration)

  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  if (opts.reverse) {
    // open: swell then fade
    g.gain.exponentialRampToValueAtTime(opts.gainPeak, t0 + opts.duration * 0.35)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.duration)
  } else {
    // close: attack then decay into silence
    g.gain.exponentialRampToValueAtTime(opts.gainPeak, t0 + 0.04)
    g.gain.exponentialRampToValueAtTime(opts.gainPeak * 0.45, t0 + opts.duration * 0.55)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.duration)
  }

  src.connect(filter)
  filter.connect(g)
  g.connect(out)
  src.start(t0)
  src.stop(t0 + opts.duration + 0.02)
}

function playTick(
  m: Master,
  opts: { freq: number; duration: number; gain: number; delay?: number },
) {
  const { ctx, master: out } = m
  const t0 = ctx.currentTime + (opts.delay ?? 0)

  const osc = ctx.createOscillator()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(opts.freq, t0)
  osc.frequency.exponentialRampToValueAtTime(opts.freq * 0.45, t0 + opts.duration)

  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(opts.gain, t0 + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.duration)

  // gentle bandpass to soften
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = opts.freq
  bp.Q.value = 1.2

  osc.connect(bp)
  bp.connect(g)
  g.connect(out)
  osc.start(t0)
  osc.stop(t0 + opts.duration + 0.02)
}

function playTone(
  m: Master,
  opts: { freq: number; duration: number; gain: number; type?: OscillatorType },
) {
  const { ctx, master: out } = m
  const t0 = ctx.currentTime
  const osc = ctx.createOscillator()
  osc.type = opts.type ?? 'sine'
  osc.frequency.setValueAtTime(opts.freq, t0)
  osc.frequency.exponentialRampToValueAtTime(opts.freq * 0.92, t0 + opts.duration)

  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(opts.gain, t0 + 0.03)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.duration)

  osc.connect(g)
  g.connect(out)
  osc.start(t0)
  osc.stop(t0 + opts.duration + 0.02)
}

/** Play a named cue if unlocked and not muted. Safe no-op otherwise. */
export function playSound(cue: SoundCue): void {
  const m = ensureMaster()
  if (!m || !m.unlocked || muted) return
  if (m.ctx.state === 'suspended') {
    void m.ctx.resume()
  }

  switch (cue) {
    case 'iris-close':
      playWhoosh(m, {
        duration: 0.38,
        filterStart: 2400,
        filterEnd: 180,
        gainPeak: 0.22,
      })
      playTick(m, { freq: 920, duration: 0.07, gain: 0.09, delay: 0.02 })
      playTick(m, { freq: 210, duration: 0.12, gain: 0.06, delay: 0.05 })
      break

    case 'iris-open':
      playWhoosh(m, {
        duration: 0.42,
        filterStart: 200,
        filterEnd: 2800,
        gainPeak: 0.16,
        reverse: true,
      })
      playTick(m, { freq: 640, duration: 0.06, gain: 0.05, delay: 0.08 })
      break

    case 'iris-close-signature':
      playWhoosh(m, {
        duration: 0.48,
        filterStart: 1800,
        filterEnd: 120,
        gainPeak: 0.28,
      })
      playTick(m, { freq: 780, duration: 0.09, gain: 0.11, delay: 0.03 })
      playTick(m, { freq: 160, duration: 0.18, gain: 0.1, delay: 0.06 })
      playTone(m, { freq: 98, duration: 0.35, gain: 0.05, type: 'sine' })
      break

    case 'iris-open-signature':
      playWhoosh(m, {
        duration: 0.52,
        filterStart: 140,
        filterEnd: 3200,
        gainPeak: 0.2,
        reverse: true,
      })
      playTick(m, { freq: 880, duration: 0.07, gain: 0.07, delay: 0.12 })
      playTone(m, { freq: 196, duration: 0.28, gain: 0.035, type: 'sine' })
      break

    case 'iris-close-locale':
      playWhoosh(m, {
        duration: 0.26,
        filterStart: 2000,
        filterEnd: 280,
        gainPeak: 0.14,
      })
      playTick(m, { freq: 1000, duration: 0.05, gain: 0.06, delay: 0.01 })
      break

    case 'iris-open-locale':
      playWhoosh(m, {
        duration: 0.3,
        filterStart: 280,
        filterEnd: 2200,
        gainPeak: 0.12,
        reverse: true,
      })
      break

    case 'boot-open':
      playWhoosh(m, {
        duration: 0.85,
        filterStart: 100,
        filterEnd: 2600,
        gainPeak: 0.14,
        reverse: true,
      })
      playTone(m, { freq: 110, duration: 0.6, gain: 0.04, type: 'sine' })
      break

    case 'ui-toggle':
      playTick(m, { freq: 720, duration: 0.05, gain: 0.07 })
      break

    default:
      break
  }
}

export function closeCueForIntent(intent: 'default' | 'signature' | 'locale'): SoundCue {
  if (intent === 'signature') return 'iris-close-signature'
  if (intent === 'locale') return 'iris-close-locale'
  return 'iris-close'
}

export function openCueForIntent(intent: 'default' | 'signature' | 'locale'): SoundCue {
  if (intent === 'signature') return 'iris-open-signature'
  if (intent === 'locale') return 'iris-open-locale'
  return 'iris-open'
}

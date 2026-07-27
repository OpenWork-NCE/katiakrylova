'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  isSoundMuted,
  playSound,
  setSoundMuted,
  unlockSound,
  type SoundCue,
} from '@/lib/sound-design'

type SoundContextValue = {
  muted: boolean
  unlocked: boolean
  toggleMute: () => void
  play: (cue: SoundCue) => void
  unlock: () => void
}

const SoundContext = createContext<SoundContextValue | null>(null)

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(true)
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    // Hydrate mute preference (default: sound enabled after unlock)
    setMuted(isSoundMuted())
  }, [])

  const unlock = useCallback(() => {
    void unlockSound().then(() => {
      setUnlocked(true)
      setMuted(isSoundMuted())
    })
  }, [])

  // Unlock on first pointer/key — required by browsers
  useEffect(() => {
    const onFirst = () => {
      unlock()
    }
    window.addEventListener('pointerdown', onFirst, { once: true, capture: true })
    window.addEventListener('keydown', onFirst, { once: true, capture: true })
    return () => {
      window.removeEventListener('pointerdown', onFirst, true)
      window.removeEventListener('keydown', onFirst, true)
    }
  }, [unlock])

  const toggleMute = useCallback(() => {
    void unlockSound().then(() => {
      const next = !isSoundMuted()
      setSoundMuted(next)
      setMuted(next)
      setUnlocked(true)
      if (!next) playSound('ui-toggle')
    })
  }, [])

  const play = useCallback((cue: SoundCue) => {
    playSound(cue)
  }, [])

  const value = useMemo(
    () => ({ muted, unlocked, toggleMute, play, unlock }),
    [muted, unlocked, toggleMute, play, unlock],
  )

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export function useSound() {
  const ctx = useContext(SoundContext)
  if (!ctx) {
    // Safe fallback if used outside provider
    return {
      muted: true,
      unlocked: false,
      toggleMute: () => {},
      play: (_cue: SoundCue) => {},
      unlock: () => {},
    }
  }
  return ctx
}

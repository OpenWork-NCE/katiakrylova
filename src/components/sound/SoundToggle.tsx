'use client'

import { useTranslations } from 'next-intl'
import { useSound } from './SoundProvider'
import '@/styles/sound-toggle.css'

export function SoundToggle({ className = '' }: { className?: string }) {
  const t = useTranslations('sound')
  const { muted, toggleMute } = useSound()

  return (
    <button
      type="button"
      className={`sound-toggle ${muted ? 'sound-toggle--muted' : ''} ${className}`.trim()}
      onClick={toggleMute}
      aria-label={muted ? t('enable') : t('disable')}
      aria-pressed={!muted}
      title={muted ? t('enable') : t('disable')}
    >
      <span className="sound-toggle__icon" aria-hidden>
        {muted ? (
          // Speaker off
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M11 5 6 9H3v6h3l5 4V5Z" strokeLinejoin="round" />
            <path d="m16 10 5 5M21 10l-5 5" strokeLinecap="round" />
          </svg>
        ) : (
          // Speaker on with waves
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M11 5 6 9H3v6h3l5 4V5Z" strokeLinejoin="round" />
            <path d="M15.5 9.5a3.5 3.5 0 0 1 0 5" strokeLinecap="round" />
            <path d="M18 7a7 7 0 0 1 0 10" strokeLinecap="round" />
          </svg>
        )}
      </span>
    </button>
  )
}

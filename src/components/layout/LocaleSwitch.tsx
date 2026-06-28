'use client'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { usePageTransition } from '@/components/transitions/usePageTransition'

export function LocaleSwitch() {
  const locale = useLocale()
  const pathname = usePathname()
  const { navigate } = usePageTransition()

  const switchTo = (target: 'fr' | 'en') => {
    if (target === locale) return
    const segments = pathname.split('/')
    segments[1] = target
    navigate(segments.join('/'))
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        type="button"
        onClick={() => switchTo('fr')}
        className={locale === 'fr' ? 'text-accent' : 'text-text-muted'}
        aria-label="Français"
        aria-current={locale === 'fr' ? 'true' : undefined}
      >
        FR
      </button>
      <span className="text-text-muted" aria-hidden>
        |
      </span>
      <button
        type="button"
        onClick={() => switchTo('en')}
        className={locale === 'en' ? 'text-accent' : 'text-text-muted'}
        aria-label="English"
        aria-current={locale === 'en' ? 'true' : undefined}
      >
        EN
      </button>
    </div>
  )
}

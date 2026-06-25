'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

export function LocaleSwitch() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchTo = (target: 'fr' | 'en') => {
    if (target === locale) return
    const segments = pathname.split('/')
    segments[1] = target
    router.push(segments.join('/'))
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <button onClick={() => switchTo('fr')} className={locale === 'fr' ? 'text-accent' : 'text-text-muted'}>FR</button>
      <span className="text-text-muted">|</span>
      <button onClick={() => switchTo('en')} className={locale === 'en' ? 'text-accent' : 'text-text-muted'}>EN</button>
    </div>
  )
}

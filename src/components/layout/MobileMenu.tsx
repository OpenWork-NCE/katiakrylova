'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export function MobileMenu({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false)
  const t = useTranslations('common')

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative z-[70] flex h-10 w-10 items-center justify-center text-lg text-text-primary lg:hidden"
        aria-label={open ? t('close') : t('menu')}
        aria-expanded={open}
      >
        {open ? '✕' : '☰'}
      </button>
      {open && (
        <nav
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-lg overflow-y-auto overscroll-contain bg-bg-primary px-md pb-[max(2rem,env(safe-area-inset-bottom,0px))] pt-[max(5rem,env(safe-area-inset-top,0px))] lg:hidden"
          aria-label={t('menu')}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="max-w-full px-sm text-center text-[clamp(1.35rem,6vw,1.85rem)] font-hand uppercase tracking-[0.18em]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

export function MobileMenu({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const t = useTranslations('common')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const panel =
    open && mounted
      ? createPortal(
          <div
            className="fixed inset-0 z-[200] flex flex-col bg-bg-primary lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label={t('menu')}
          >
            <div className="flex items-center justify-end px-md pt-[max(0.75rem,env(safe-area-inset-top,0px))]">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center text-xl text-text-primary"
                aria-label={t('close')}
              >
                ✕
              </button>
            </div>
            <nav
              className="flex flex-1 flex-col items-center justify-center gap-lg overflow-y-auto overscroll-contain px-md pb-[max(2rem,env(safe-area-inset-bottom,0px))]"
              aria-label={t('menu')}
            >
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="max-w-full px-sm text-center text-[clamp(1.35rem,6vw,1.85rem)] font-hand uppercase tracking-[0.18em] text-text-primary transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>,
          document.body,
        )
      : null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative z-[70] flex h-10 w-10 items-center justify-center text-lg text-text-primary lg:hidden"
        aria-label={open ? t('close') : t('menu')}
        aria-expanded={open}
      >
        {open ? '✕' : '☰'}
      </button>
      {panel}
    </>
  )
}

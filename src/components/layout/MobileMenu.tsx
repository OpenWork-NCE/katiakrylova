'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import '@/styles/mobile-menu.css'

/** Aligné sur PortfolioViewer (FADE_MS ~280–500, ease premium) */
const FADE_MS = 450

export function MobileMenu({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false)
  const [rendered, setRendered] = useState(false)
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const closeTimer = useRef<number | null>(null)
  const pathname = usePathname()
  const t = useTranslations('common')

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  const requestOpen = useCallback(() => {
    clearCloseTimer()
    setOpen(true)
    setRendered(true)
    // double rAF pour laisser le DOM peindre opacity:0 avant d’ouvrir
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true))
    })
  }, [clearCloseTimer])

  const requestClose = useCallback(() => {
    setOpen(false)
    setVisible(false)
    clearCloseTimer()
    closeTimer.current = window.setTimeout(() => {
      setRendered(false)
      closeTimer.current = null
    }, FADE_MS)
  }, [clearCloseTimer])

  const toggle = useCallback(() => {
    if (open || visible) requestClose()
    else requestOpen()
  }, [open, visible, requestClose, requestOpen])

  useEffect(() => {
    setMounted(true)
    return () => clearCloseTimer()
  }, [clearCloseTimer])

  // Close smoothly on route change
  useEffect(() => {
    if (!rendered) return
    requestClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on pathname
  }, [pathname])

  useEffect(() => {
    if (!rendered) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [rendered, requestClose])

  const panel =
    rendered && mounted
      ? createPortal(
          <div
            className={`mobile-menu${visible ? ' mobile-menu--open' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label={t('menu')}
          >
            <div className="mobile-menu__bar">
              <button
                type="button"
                onClick={requestClose}
                className="mobile-menu__close"
                aria-label={t('close')}
              >
                ✕
              </button>
            </div>
            <nav className="mobile-menu__nav" aria-label={t('menu')}>
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={requestClose}
                  className="mobile-menu__link"
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
        onClick={toggle}
        className="mobile-menu__toggle"
        aria-label={open || visible ? t('close') : t('menu')}
        aria-expanded={open || visible}
      >
        {open || visible ? '✕' : '☰'}
      </button>
      {panel}
    </>
  )
}

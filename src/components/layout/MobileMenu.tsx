'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export function MobileMenu({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false)
  const t = useTranslations('common')

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden text-text-primary"
        aria-label={open ? t('close') : t('menu')}
      >
        {open ? '✕' : '☰'}
      </button>
      {open && (
        <nav className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-lg bg-bg-primary px-md pb-[env(safe-area-inset-bottom,0px)] pt-[env(safe-area-inset-top,0px)] md:hidden">
          {items.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="text-2xl font-hand">
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </>
  )
}
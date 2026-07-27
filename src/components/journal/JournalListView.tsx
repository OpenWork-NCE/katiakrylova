'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import '@/styles/journal-page.css'

export type JournalListItem = {
  id: string | number
  slug: string
  title: string
  excerpt?: string | null
  coverUrl?: string | null
  coverAlt?: string
}

type Props = {
  locale: string
  backgroundUrl: string
  title: string
  emptyLabel: string
  entries: JournalListItem[]
}

function padIndex(n: number, total: number) {
  const width = Math.max(2, String(total).length)
  return String(n).padStart(width, '0')
}

/** News — grille éditoriale type filmographie (sans dates). */
export function JournalListView({ locale, backgroundUrl, title, emptyLabel, entries }: Props) {
  const t = useTranslations('journal')
  const listRef = useRef<HTMLUListElement>(null)
  const [ready, setReady] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const total = entries.length

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReducedMotion(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), reducedMotion ? 0 : 80)
    return () => window.clearTimeout(timer)
  }, [reducedMotion])

  useEffect(() => {
    const root = listRef.current
    if (!root) return

    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-journal-item]'))
    if (items.length === 0) return

    if (reducedMotion) {
      items.forEach((el) => el.classList.add('journal-page__item--visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entriesObs) => {
        for (const entry of entriesObs) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('journal-page__item--visible')
          observer.unobserve(entry.target)
        }
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )

    items.forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${Math.min(i, 8) * 50}ms`)
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [entries, reducedMotion, ready])

  return (
    <div className={`journal-page${ready ? ' journal-page--ready' : ''}`}>
      <div
        className="journal-page__bg"
        style={{ backgroundImage: `url('${backgroundUrl}')` }}
        aria-hidden
      />
      <div className="journal-page__scrim" aria-hidden />
      <div className="journal-page__vignette" aria-hidden />

      <div className="journal-page__content">
        <header className="journal-page__header">
          <h1 className="journal-page__title">{title}</h1>
          {total > 0 ? (
            <p className="journal-page__count">
              {padIndex(total, total)} · {t('listMeta')}
            </p>
          ) : null}
        </header>

        {entries.length === 0 ? <p className="journal-page__empty">{emptyLabel}</p> : null}

        <ul ref={listRef} className="journal-page__list">
          {entries.map((e, i) => {
            const n = padIndex(i + 1, total)
            return (
              <li key={e.id} data-journal-item className="journal-page__item">
                <Link href={`/${locale}/journal/${e.slug}`} className="journal-page__row">
                  <div
                    className={`journal-page__still${e.coverUrl ? '' : ' journal-page__still--empty'}`}
                    aria-hidden={!e.coverUrl}
                  >
                    {e.coverUrl ? (
                      <Image
                        src={e.coverUrl}
                        alt={e.coverAlt || e.title}
                        fill
                        sizes="(max-width: 768px) 90vw, 380px"
                        className="object-cover"
                        priority={i < 3}
                        quality={90}
                      />
                    ) : (
                      <span className="journal-page__still-placeholder">{n}</span>
                    )}
                  </div>

                  <div className="journal-page__copy">
                    <span className="journal-page__index">{n}</span>
                    <h2 className="journal-page__entry-title">{e.title}</h2>
                    {e.excerpt ? <p className="journal-page__excerpt">{e.excerpt}</p> : null}
                    <span className="journal-page__cta">{t('read')}</span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import '@/styles/contact-page.css'

type Props = {
  backgroundUrl: string
  title: string
  intro: string
  emailLabel: string
  phoneLabel: string
  email?: string | null
  phone?: string | null
  vimeoUrl?: string | null
  instagramUrl?: string | null
  linkedinUrl?: string | null
}

/** Contact — entrée cinématique (style Projets / À propos). */
export function ContactView({
  backgroundUrl,
  title,
  intro,
  emailLabel,
  phoneLabel,
  email,
  phone,
  vimeoUrl,
  instagramUrl,
  linkedinUrl,
}: Props) {
  const [ready, setReady] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

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

  return (
    <div className={`contact-page${ready ? ' contact-page--ready' : ''}`}>
      <div
        className="contact-page__bg"
        style={{ backgroundImage: `url('${backgroundUrl}')` }}
        aria-hidden
      />
      <div className="contact-page__scrim" aria-hidden />
      <div className="contact-page__vignette" aria-hidden />

      <div className="contact-page__inner">
        <h1 className="contact-page__title">{title}</h1>
        <p className="contact-page__intro">{intro}</p>

        <div className="contact-page__meta">
          {email ? (
            <div className="contact-page__row">
              <span className="contact-page__label">{emailLabel} · </span>
              <a href={`mailto:${email}`} className="contact-page__link">
                {email}
              </a>
            </div>
          ) : null}
          {phone ? (
            <div className="contact-page__row">
              <span className="contact-page__label">{phoneLabel} · </span>
              <a href={`tel:${phone}`} className="contact-page__link">
                {phone}
              </a>
            </div>
          ) : null}
          <div className="contact-page__socials">
            {vimeoUrl ? (
              <a href={vimeoUrl} target="_blank" rel="noopener noreferrer" className="contact-page__link">
                Vimeo
              </a>
            ) : null}
            {instagramUrl ? (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-page__link"
              >
                Instagram
              </a>
            ) : null}
            {linkedinUrl ? (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-page__link"
              >
                LinkedIn
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useTranslations } from 'next-intl'
import '@/styles/projects-intro.css'

const BACKDROP = '/images/img8.jpg'

/** Atterrissage filmographie — section en flux (scroll up pour y revenir). */
export function ProjectsLanding() {
  const t = useTranslations('projects')
  const paragraphs = t.raw('introBody') as string[]

  return (
    <section className="projects-intro" aria-labelledby="projects-intro-title">
      <div
        className="projects-intro__bg"
        style={{ backgroundImage: `url('${BACKDROP}')` }}
        aria-hidden
      />
      <div className="projects-intro__scrim" aria-hidden />
      <div className="projects-intro__vignette" aria-hidden />

      <div className="projects-intro__inner">
        <h1 id="projects-intro-title" className="projects-intro__title">
          {t('introTitle')}
        </h1>
        <div className="projects-intro__body">
          {Array.isArray(paragraphs)
            ? paragraphs.map((p, i) => <p key={i}>{p}</p>)
            : null}
        </div>
        <p className="projects-intro__hint">{t('introHint')}</p>
      </div>
    </section>
  )
}

'use client'
import Link from 'next/link'

type Props = {
  href: string
  label: string
}

/**
 * CTA d’entrée — portail diaphragme (iris) + libellé typewriter.
 * Métaphore cinéma : l’œil s’ouvre sur l’univers.
 */
export function IrisEnterButton({ href, label }: Props) {
  return (
    <Link href={href} className="home-enter">
      <span className="home-enter__aperture" aria-hidden>
        <span className="home-enter__ring home-enter__ring--a" />
        <span className="home-enter__ring home-enter__ring--b" />
        <span className="home-enter__ring home-enter__ring--c" />
        <span className="home-enter__pupil">
          <span className="home-enter__glint" />
        </span>
      </span>

      <span className="home-enter__copy">
        <span className="home-enter__label">{label}</span>
        <span className="home-enter__rule" />
      </span>

      <span className="home-enter__chevron" aria-hidden>
        <span className="home-enter__chevron-line" />
      </span>
    </Link>
  )
}

'use client'
import Link from 'next/link'

type Props = {
  href: string
  label: string
}

/** CTA d’entrée cinématographique — iris + libellé (styles dans home-hero.css). */
export function IrisEnterButton({ href, label }: Props) {
  return (
    <Link href={href} className="home-enter group">
      <span className="home-enter__iris" aria-hidden>
        <span className="home-enter__ring home-enter__ring--outer" />
        <span className="home-enter__ring home-enter__ring--inner" />
        <span className="home-enter__dot" />
      </span>
      <span className="home-enter__label">{label}</span>
      <span className="home-enter__arrow" aria-hidden>
        →
      </span>
    </Link>
  )
}

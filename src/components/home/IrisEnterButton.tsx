'use client'
import Link from 'next/link'

type Props = {
  href: string
  label: string
}

export function IrisEnterButton({ href, label }: Props) {
  return (
    <Link href={href} className="group relative inline-flex items-center gap-md">
      <span className="relative flex h-14 w-14 items-center justify-center">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full border border-accent/55 transition-all duration-700 ease-out group-hover:scale-110 group-hover:border-accent"
        />
        <span
          aria-hidden
          className="absolute inset-[6px] rounded-full border border-text-primary/25 transition-all duration-700 ease-out group-hover:scale-105 group-hover:border-text-primary/45"
        />
        <span
          aria-hidden
          className="h-2 w-2 rounded-full bg-accent transition-transform duration-500 group-hover:scale-125"
        />
      </span>
      <span className="text-sm uppercase tracking-[0.28em] text-text-primary transition-colors duration-500 group-hover:text-accent">
        {label}
      </span>
    </Link>
  )
}
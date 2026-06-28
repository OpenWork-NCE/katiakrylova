'use client'
import Link from 'next/link'

type Props = {
  href: string
  label: string
}

export function IrisEnterButton({ href, label }: Props) {
  return (
    <Link href={href} className="group relative inline-flex max-w-full flex-col items-center gap-sm sm:flex-row sm:gap-md">
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center sm:h-14 sm:w-14">
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
      <span className="max-w-[14rem] text-center text-[0.7rem] uppercase leading-snug tracking-[0.18em] text-text-primary transition-colors duration-500 group-hover:text-accent sm:max-w-none sm:text-sm sm:tracking-[0.28em]">
        {label}
      </span>
    </Link>
  )
}
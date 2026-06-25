import Link from 'next/link'

type Props = {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'ghost'
}

export function Button({ href, children, variant = 'primary' }: Props) {
  const classes = variant === 'primary'
    ? 'inline-block bg-accent text-text-primary px-lg py-sm text-sm uppercase tracking-widest hover:bg-accent/80 transition'
    : 'inline-block border border-text-primary text-text-primary px-lg py-sm text-sm uppercase tracking-widest hover:bg-text-primary hover:text-bg-primary transition'
  return <Link href={href} className={classes}>{children}</Link>
}
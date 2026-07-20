'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LocaleSwitch } from './LocaleSwitch'
import { MobileMenu } from './MobileMenu'
import { Container } from '../ui/Container'

type NavItem = { href: string; label: string }

type Props = {
  locale: string
  items: NavItem[]
}

export function HeaderBar({ locale, items }: Props) {
  const pathname = usePathname()
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isHome ? 'bg-transparent' : 'bg-bg-primary/80 backdrop-blur'
      }`}
    >
      <Container className="flex items-center justify-between gap-sm py-sm sm:gap-md sm:py-md">
        <Link href={`/${locale}`} className="min-w-0 shrink">
          <Image
            src="/images/katia_krylova.png"
            alt="Katia Krylova"
            width={120}
            height={32}
            className="h-auto w-[clamp(4.75rem,28vw,7.5rem)]"
            priority
          />
        </Link>
        <nav
          className={`hidden items-center gap-md text-xs uppercase tracking-widest transition-opacity duration-500 lg:flex lg:gap-lg lg:text-sm ${
            isHome ? 'text-text-primary/75 hover:text-text-primary' : ''
          }`}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap transition-colors duration-300 hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-sm sm:gap-md">
          <MobileMenu items={items} />
          <LocaleSwitch />
        </div>
      </Container>
    </header>
  )
}
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
      <Container className="flex items-center justify-between py-sm sm:py-md">
        <Link href={`/${locale}`} className="shrink-0">
          <Image
            src="/images/katia_krylova.png"
            alt="Katia Krylova"
            width={120}
            height={32}
            className="h-auto w-[clamp(5.25rem,30vw,7.5rem)]"
          />
        </Link>
        <nav
          className={`hidden md:flex items-center gap-lg text-sm transition-opacity duration-500 ${
            isHome ? 'text-text-primary/75 hover:text-text-primary' : ''
          }`}
        >
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors duration-300 hover:text-accent">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-md">
          <MobileMenu items={items} />
          <LocaleSwitch />
        </div>
      </Container>
    </header>
  )
}
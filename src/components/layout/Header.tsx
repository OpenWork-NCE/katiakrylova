import Link from 'next/link'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { LocaleSwitch } from './LocaleSwitch'
import { MobileMenu } from './MobileMenu'
import { Container } from '../ui/Container'

export async function Header({ locale }: { locale: string }) {
  const t = await getTranslations('nav')
  const items = [
    { href: `/${locale}/projects`, label: t('projects') },
    { href: `/${locale}/portfolio`, label: t('portfolio') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/journal`, label: t('journal') },
    { href: `/${locale}/contact`, label: t('contact') },
  ]
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur">
      <Container className="flex items-center justify-between py-md">
        <Link href={`/${locale}`}>
          <Image src="/images/katia_krylova.png" alt="Katia Krylova" width={120} height={32} />
        </Link>
        <nav className="hidden md:flex items-center gap-lg text-sm">
          {items.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
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

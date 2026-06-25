import Link from 'next/link'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { LocaleSwitch } from './LocaleSwitch'
import { Container } from '../ui/Container'

export async function Header({ locale }: { locale: string }) {
  const t = await getTranslations('nav')
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur">
      <Container className="flex items-center justify-between py-md">
        <Link href={`/${locale}`}>
          <Image src="/images/katia_krylova.png" alt="Katia Krylova" width={120} height={32} />
        </Link>
        <nav className="hidden md:flex items-center gap-lg text-sm">
          <Link href={`/${locale}/projects`}>{t('projects')}</Link>
          <Link href={`/${locale}/portfolio`}>{t('portfolio')}</Link>
          <Link href={`/${locale}/about`}>{t('about')}</Link>
          <Link href={`/${locale}/journal`}>{t('journal')}</Link>
          <Link href={`/${locale}/contact`}>{t('contact')}</Link>
        </nav>
        <LocaleSwitch />
      </Container>
    </header>
  )
}

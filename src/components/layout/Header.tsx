import { getTranslations } from 'next-intl/server'
import { HeaderBar } from './HeaderBar'

export async function Header({ locale }: { locale: string }) {
  const t = await getTranslations('nav')
  const items = [
    { href: `/${locale}/projects`, label: t('projects') },
    { href: `/${locale}/portfolio`, label: t('portfolio') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/journal`, label: t('journal') },
    { href: `/${locale}/contact`, label: t('contact') },
  ]
  return <HeaderBar locale={locale} items={items} />
}

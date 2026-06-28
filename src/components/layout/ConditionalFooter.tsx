'use client'
import { usePathname } from 'next/navigation'

type Props = {
  locale: string
  children: React.ReactNode
}

export function ConditionalFooter({ locale, children }: Props) {
  const pathname = usePathname()
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`
  if (isHome) return null
  return <>{children}</>
}
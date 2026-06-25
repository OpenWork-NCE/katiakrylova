import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

const locales = ['fr', 'en'] as const

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = (locales.includes(requested as any) ? requested : 'fr') as string

  let messages
  try {
    messages = (await import(`./${locale}.json`)).default
  } catch {
    notFound()
  }

  return { locale, messages }
})

import { getLocale, getTranslations } from 'next-intl/server'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'

export default async function NotFound() {
  const locale = await getLocale()
  const t = await getTranslations('notFound')
  return (
    <Section className="text-center">
      <h1 className="font-hand text-6xl mb-md">{t('title')}</h1>
      <Button href={`/${locale}`} variant="primary">{t('back')}</Button>
    </Section>
  )
}
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'

export default async function NotFound({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('notFound')
  return (
    <Section className="text-center">
      <h1 className="font-hand text-6xl mb-md">{t('title')}</h1>
      <Button href={`/${locale}`} variant="primary">{t('back')}</Button>
    </Section>
  )
}
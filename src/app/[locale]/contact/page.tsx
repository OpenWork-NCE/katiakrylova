import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getContact } from '@/lib/payload'
import { getMediaUrl } from '@/lib/utils'
import { ContactView } from '@/components/contact/ContactView'

const FALLBACK_BG = '/images/Fonds Contact.jpg'

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, contact] = await Promise.all([
    getTranslations('contact'),
    getContact(locale as 'fr' | 'en'),
  ])

  const backgroundUrl = getMediaUrl(contact?.backgroundImage) ?? FALLBACK_BG

  return (
    <ContactView
      backgroundUrl={backgroundUrl}
      title={t('title')}
      intro={t('intro')}
      emailLabel={t('email')}
      phoneLabel={t('phone')}
      email={contact?.email}
      phone={contact?.phone}
      vimeoUrl={contact?.vimeoUrl}
      instagramUrl={contact?.instagramUrl}
      linkedinUrl={contact?.linkedinUrl}
    />
  )
}

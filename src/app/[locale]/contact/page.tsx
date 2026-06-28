import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getContact } from '@/lib/payload'
import { Section } from '@/components/ui/Section'

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, contact] = await Promise.all([
    getTranslations('contact'),
    getContact(locale as 'fr' | 'en'),
  ])

  return (
    <Section>
      <h1 className="font-hand text-5xl mb-xl">{t('title')}</h1>
      <p className="text-text-muted mb-xl">{t('intro')}</p>

      <div className="grid md:grid-cols-2 gap-xl">
        <div className="space-y-md text-lg">
          {contact?.email && (
            <div>
              <span className="text-text-muted text-sm uppercase tracking-widest">{t('email')} · </span>
              <a href={`mailto:${contact.email}`} className="hover:text-accent">{contact.email}</a>
            </div>
          )}
          {contact?.phone && (
            <div>
              <span className="text-text-muted text-sm uppercase tracking-widest">{t('phone')} · </span>
              <a href={`tel:${contact.phone}`} className="hover:text-accent">{contact.phone}</a>
            </div>
          )}
          <div className="flex gap-md pt-md">
            {contact?.vimeoUrl && <a href={contact.vimeoUrl} target="_blank" className="hover:text-accent">Vimeo</a>}
            {contact?.instagramUrl && <a href={contact.instagramUrl} target="_blank" className="hover:text-accent">Instagram</a>}
            {contact?.linkedinUrl && <a href={contact.linkedinUrl} target="_blank" className="hover:text-accent">LinkedIn</a>}
          </div>
        </div>

        {contact?.calComUrl && (
          <div>
            <h2 className="text-sm uppercase tracking-widest text-text-muted mb-md">{t('book')}</h2>
            <iframe
              src={contact.calComUrl}
              className="w-full h-[600px] border border-border bg-bg-secondary"
              title="Cal.com booking"
            />
          </div>
        )}
      </div>
    </Section>
  )
}

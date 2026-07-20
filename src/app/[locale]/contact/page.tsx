import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getContact } from '@/lib/payload'
import { getMediaUrl } from '@/lib/utils'
import '@/styles/contact-page.css'

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
    <div className="contact-page">
      <div
        className="contact-page__bg"
        style={{ backgroundImage: `url('${backgroundUrl}')` }}
        aria-hidden
      />
      <div className="contact-page__scrim" aria-hidden />
      <div className="contact-page__vignette" aria-hidden />

      <div className="contact-page__inner">
        <h1 className="contact-page__title">{t('title')}</h1>
        <p className="contact-page__intro">{t('intro')}</p>

        <div className="contact-page__grid">
          <div className="contact-page__meta">
            {contact?.email && (
              <div>
                <span className="contact-page__label">{t('email')} · </span>
                <a href={`mailto:${contact.email}`} className="contact-page__link">
                  {contact.email}
                </a>
              </div>
            )}
            {contact?.phone && (
              <div>
                <span className="contact-page__label">{t('phone')} · </span>
                <a href={`tel:${contact.phone}`} className="contact-page__link">
                  {contact.phone}
                </a>
              </div>
            )}
            <div className="contact-page__socials">
              {contact?.vimeoUrl && (
                <a href={contact.vimeoUrl} target="_blank" rel="noopener noreferrer" className="contact-page__link">
                  Vimeo
                </a>
              )}
              {contact?.instagramUrl && (
                <a
                  href={contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-page__link"
                >
                  Instagram
                </a>
              )}
              {contact?.linkedinUrl && (
                <a
                  href={contact.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-page__link"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>

          {contact?.calComUrl && (
            <div>
              <h2 className="contact-page__book-title">{t('book')}</h2>
              <iframe
                src={contact.calComUrl}
                className="contact-page__iframe"
                title="Cal.com booking"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

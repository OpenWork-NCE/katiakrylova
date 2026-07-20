import { getTranslations } from 'next-intl/server'
import { Container } from '../ui/Container'
import { getContact } from '@/lib/payload'

export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations('footer')
  const contact = await getContact(locale as 'fr' | 'en')
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-20 mt-2xl border-t border-border bg-bg-primary py-xl">
      <Container className="flex flex-col md:flex-row justify-between gap-md text-sm text-text-muted">
        <div className="flex gap-md">
          {contact?.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
          {contact?.phone && <a href={`tel:${contact.phone}`}>{contact.phone}</a>}
        </div>
        <div className="flex gap-md">
          {contact?.vimeoUrl && <a href={contact.vimeoUrl} target="_blank">Vimeo</a>}
          {contact?.instagramUrl && <a href={contact.instagramUrl} target="_blank">Instagram</a>}
          {contact?.linkedinUrl && <a href={contact.linkedinUrl} target="_blank">LinkedIn</a>}
        </div>
        <div>© {year} · {t('built')}</div>
      </Container>
    </footer>
  )
}

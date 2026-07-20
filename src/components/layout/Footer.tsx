import { getTranslations } from 'next-intl/server'
import { Container } from '../ui/Container'
import { getContact } from '@/lib/payload'

export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations('footer')
  const contact = await getContact(locale as 'fr' | 'en')
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-20 mt-xl border-t border-border bg-bg-primary py-lg md:mt-2xl md:py-xl">
      <Container className="flex flex-col gap-md text-sm text-text-muted sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap gap-x-md gap-y-sm break-words">
          {contact?.email && (
            <a href={`mailto:${contact.email}`} className="break-all hover:text-accent">
              {contact.email}
            </a>
          )}
          {contact?.phone && (
            <a href={`tel:${contact.phone}`} className="hover:text-accent">
              {contact.phone}
            </a>
          )}
        </div>
        <div className="flex flex-wrap gap-md">
          {contact?.vimeoUrl && (
            <a href={contact.vimeoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
              Vimeo
            </a>
          )}
          {contact?.instagramUrl && (
            <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
              Instagram
            </a>
          )}
          {contact?.linkedinUrl && (
            <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
              LinkedIn
            </a>
          )}
        </div>
        <div className="text-xs sm:text-sm">
          © {year} · {t('built')}
        </div>
      </Container>
    </footer>
  )
}

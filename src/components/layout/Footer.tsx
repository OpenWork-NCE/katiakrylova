import { getTranslations } from 'next-intl/server'
import { getContact } from '@/lib/payload'
import '@/styles/footer.css'

export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations('footer')
  const contact = await getContact(locale as 'fr' | 'en')
  const year = new Date().getFullYear()

  const links: Array<{ href: string; label: string; external?: boolean }> = []
  if (contact?.email) links.push({ href: `mailto:${contact.email}`, label: contact.email })
  if (contact?.phone) links.push({ href: `tel:${contact.phone}`, label: contact.phone })
  if (contact?.vimeoUrl) links.push({ href: contact.vimeoUrl, label: 'Vimeo', external: true })
  if (contact?.instagramUrl) links.push({ href: contact.instagramUrl, label: 'Instagram', external: true })
  if (contact?.linkedinUrl) links.push({ href: contact.linkedinUrl, label: 'LinkedIn', external: true })

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__meta">
          {links.map((link, i) => (
            <span key={link.href} className="contents">
              {i > 0 ? (
                <span className="site-footer__sep" aria-hidden>
                  ·
                </span>
              ) : null}
              <a
                href={link.href}
                {...(link.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {link.label}
              </a>
            </span>
          ))}
        </div>
        <p className="site-footer__copy">
          © {year} · {t('built')}
        </p>
      </div>
    </footer>
  )
}

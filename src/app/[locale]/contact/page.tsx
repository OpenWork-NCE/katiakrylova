import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getContact } from '@/lib/payload'
import { getMediaUrl } from '@/lib/utils'
import { ContactView } from '@/components/contact/ContactView'

const FALLBACK_BG = '/images/Fonds Contact.jpg'

/** Sites connexes — fallbacks if CMS empty / cache stale (same pattern as FALLBACK_BG). */
const FALLBACK_RELATED = {
  egoDuMoi: 'https://katiafontaine.wixsite.com/ego-du-moi',
  tarotDecrypte: 'https://tarot-decrypte.be',
} as const

export const revalidate = 600

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, contact] = await Promise.all([
    getTranslations('contact'),
    getContact(locale as 'fr' | 'en'),
  ])

  const backgroundUrl = getMediaUrl(contact?.backgroundImage, 'hd') ?? FALLBACK_BG

  const egoUrl = contact?.egoDuMoiUrl?.trim() || FALLBACK_RELATED.egoDuMoi
  const tarotUrl = contact?.tarotDecrypteUrl?.trim() || FALLBACK_RELATED.tarotDecrypte

  const relatedSites = [
    {
      label: t('egoDuMoi'),
      href: egoUrl,
      host: hostFromUrl(egoUrl),
      visitLabel: t('visitSite'),
      ariaLabel: t('visitSiteAria', { label: t('egoDuMoi') }),
    },
    {
      label: t('tarotDecrypte'),
      href: tarotUrl,
      host: hostFromUrl(tarotUrl),
      visitLabel: t('visitSite'),
      ariaLabel: t('visitSiteAria', { label: t('tarotDecrypte') }),
    },
  ]

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
      relatedSitesHeading={t('relatedSitesHeading')}
      relatedSites={relatedSites}
    />
  )
}

function hostFromUrl(url: string): string | undefined {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return undefined
  }
}

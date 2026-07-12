import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getLinks } from '@/lib/payload'
import { getMediaUrl } from '@/lib/utils'
import '@/styles/links-page.css'

export default async function LinksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, links] = await Promise.all([
    getTranslations('links'),
    getLinks(locale as 'fr' | 'en'),
  ])
  const backgroundUrl = getMediaUrl(links?.photo)
  const items = (links?.items ?? []).filter(
    (item): item is { id?: string | null; name: string; role: string; url: string } =>
      Boolean(item?.name && item?.role && item?.url),
  )

  return (
    <div className="links-page">
      {backgroundUrl && (
        <>
          <div
            className="links-page__bg"
            style={{ backgroundImage: `url('${backgroundUrl}')` }}
            aria-hidden
          />
          <div className="links-page__scrim" aria-hidden />
          <div className="links-page__vignette" aria-hidden />
        </>
      )}

      <div className="links-page__inner">
        <h1 className="links-page__title">{t('title')}</h1>
        {items.length === 0 ? (
          <p className="text-center text-text-muted">{t('empty')}</p>
        ) : (
          <ul className="links-page__list">
            {items.map((item, i) => (
              <li key={item.id ?? `${item.name}-${i}`} className="links-page__item">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <p className="links-page__name">{item.name}</p>
                  <p className="links-page__role">{item.role}</p>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

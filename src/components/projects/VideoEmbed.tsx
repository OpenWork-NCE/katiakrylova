import { parseVideoUrl } from '@/lib/video'

type Props = {
  url: string
  platform?: string
  title?: string
  priority?: boolean
  /** full = edge-to-edge, contained = centered cinema embed (default) */
  layout?: 'full' | 'contained'
  className?: string
}

export function VideoEmbed({
  url,
  platform,
  title,
  priority = false,
  layout = 'contained',
  className = '',
}: Props) {
  const parsed = parseVideoUrl(url, platform)
  if (!parsed) return null

  const shell =
    layout === 'full'
      ? 'w-full'
      : 'mx-auto w-full max-w-[min(100%,42rem)] md:max-w-[min(100%,48rem)]'

  return (
    <div className={`${shell} ${className}`}>
      <div className="relative aspect-video w-full overflow-hidden border border-white/10 bg-bg-secondary shadow-[0_16px_48px_rgba(0,0,0,0.45)]">
        <iframe
          src={parsed.embedUrl}
          title={title ?? 'Vidéo du projet'}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          loading={priority ? 'eager' : 'lazy'}
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  )
}
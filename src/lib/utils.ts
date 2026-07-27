/** Strip host from Payload media URLs so images work on any environment (local, preview, prod). */
export function normalizeMediaPath(url: string): string {
  if (!url) return url
  if (url.startsWith('/api/media/')) return url

  try {
    const parsed = new URL(url)
    if (parsed.pathname.startsWith('/api/media/')) {
      return `${parsed.pathname}${parsed.search}`
    }
  } catch {
    /* relative or invalid — return as-is */
  }

  return url
}

/** Payload-generated variants. Use original only for portfolio/project liseuses. */
export type MediaSize = 'thumbnail' | 'card' | 'hd' | 'original'

type MediaLike = {
  url?: string | null
  mimeType?: string | null
  width?: number | null
  height?: number | null
  sizes?: {
    thumbnail?: { url?: string | null; width?: number | null; height?: number | null } | null
    card?: { url?: string | null; width?: number | null; height?: number | null } | null
    hd?: { url?: string | null; width?: number | null; height?: number | null } | null
  } | null
}

/**
 * Prefer a Payload-generated size when available; fall back to the original.
 * Callers that need art fidelity (portfolio viewer, project lightbox) must pass `'original'`.
 */
export function getMediaUrl(media: unknown, size: MediaSize = 'original'): string | null {
  if (!media || typeof media === 'number') return null
  if (typeof media === 'string') {
    return media.startsWith('http') || media.startsWith('/') ? normalizeMediaPath(media) : null
  }
  if (typeof media !== 'object' || media === null) return null

  const m = media as MediaLike

  if (size !== 'original') {
    const sized = m.sizes?.[size]?.url
    if (sized) return normalizeMediaPath(sized)
  }

  if (!m.url) return null
  return normalizeMediaPath(m.url)
}

/** Dimensions for a chosen size (falls back to original media dims). */
export function getMediaDimensions(
  media: unknown,
  size: MediaSize = 'original',
): { width?: number; height?: number } {
  if (!media || typeof media !== 'object' || media === null) return {}
  const m = media as MediaLike
  if (size !== 'original') {
    const sized = m.sizes?.[size]
    if (sized?.width || sized?.height) {
      return {
        width: sized.width ?? undefined,
        height: sized.height ?? undefined,
      }
    }
  }
  return {
    width: m.width ?? undefined,
    height: m.height ?? undefined,
  }
}

/** True for GIF / animated sources that must bypass image optimizers. */
export function isAnimatedMedia(media: unknown, src?: string | null): boolean {
  if (typeof media === 'object' && media !== null) {
    const mime = (media as MediaLike).mimeType?.toLowerCase() ?? ''
    if (mime === 'image/gif' || mime.startsWith('video/')) return true
  }
  if (src && /\.gif($|\?)/i.test(src)) return true
  return false
}

/** Render project formats from either legacy single values or Payload hasMany values. */
export function formatProjectFormats(formats: string | readonly string[] | null | undefined): string {
  if (typeof formats === 'string') return formats
  return formats?.join(' · ') ?? ''
}

/** Absolute URL for client-only loaders that need a full origin. */
export function getAbsoluteMediaUrl(pathOrUrl: string): string {
  const path = normalizeMediaPath(pathOrUrl)
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${path}`
  }
  const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
  return `${base.replace(/\/$/, '')}${path}`
}

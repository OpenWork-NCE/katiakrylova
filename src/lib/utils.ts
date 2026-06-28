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

export function getMediaUrl(media: unknown): string | null {
  if (!media || typeof media === 'number') return null
  if (typeof media === 'string') {
    return media.startsWith('http') || media.startsWith('/') ? normalizeMediaPath(media) : null
  }
  if (typeof media === 'object' && media !== null && 'url' in media) {
    const url = (media as { url?: string | null }).url
    if (!url) return null
    return normalizeMediaPath(url)
  }
  return null
}

/** Absolute URL for WebGL textures (drei Image) and other client-only loaders. */
export function getAbsoluteMediaUrl(pathOrUrl: string): string {
  const path = normalizeMediaPath(pathOrUrl)
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${path}`
  }
  const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
  return `${base.replace(/\/$/, '')}${path}`
}
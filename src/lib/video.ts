export type VideoPlatform = 'YouTube' | 'Vimeo'

export type ParsedVideo = {
  platform: VideoPlatform
  embedUrl: string
  originalUrl: string
  /** YouTube 11-char id or Vimeo numeric id when extracted */
  videoId?: string
  /** Canonical watch page (open on platform site) */
  watchUrl: string
  /** Poster / cover candidate (YouTube thumbnail when available) */
  thumbnailUrl?: string
}

/** Public Invidious instances used as age-restriction fallbacks (embed path). */
export const INVIDIOUS_ORIGINS = [
  'https://yewtu.be',
  'https://inv.nadeko.net',
  'https://invidious.nerdvpn.de',
] as const

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`
}

export function youtubeEmbedUrl(videoId: string, enableJsApi = true): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
  })
  if (enableJsApi) {
    params.set('enablejsapi', '1')
    if (typeof window !== 'undefined') {
      params.set('origin', window.location.origin)
    }
  }
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`
}

export function youtubeThumbnailUrl(videoId: string): string {
  // hqdefault is reliably available; maxresdefault 404s for some videos
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

export function invidiousEmbedUrl(videoId: string, origin: string = INVIDIOUS_ORIGINS[0]): string {
  const base = origin.replace(/\/$/, '')
  return `${base}/embed/${videoId}?autoplay=0`
}

export function parseVideoUrl(url: string, platform?: string): ParsedVideo | null {
  const trimmed = url.trim()
  if (!trimmed) return null

  const youtube =
    trimmed.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    )?.[1] ?? null
  if (youtube) {
    return {
      platform: 'YouTube',
      videoId: youtube,
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtube}`,
      originalUrl: trimmed,
      watchUrl: youtubeWatchUrl(youtube),
      thumbnailUrl: youtubeThumbnailUrl(youtube),
    }
  }

  const vimeo = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1] ?? null
  if (vimeo) {
    return {
      platform: 'Vimeo',
      videoId: vimeo,
      embedUrl: `https://player.vimeo.com/video/${vimeo}`,
      originalUrl: trimmed,
      watchUrl: `https://vimeo.com/${vimeo}`,
    }
  }

  if (platform === 'YouTube' || platform === 'Vimeo') {
    return {
      platform: platform as VideoPlatform,
      embedUrl: trimmed,
      originalUrl: trimmed,
      watchUrl: trimmed,
    }
  }

  return null
}

/** YouTube IFrame API error codes that usually mean “can’t play in embed” (age gate, embedding disabled, private). */
export function isYouTubeEmbedBlockedError(code: number): boolean {
  // 2 = invalid id, 5 = HTML5 error, 100 = not found/private, 101/150 = embedding not allowed
  return code === 101 || code === 150 || code === 100 || code === 5
}

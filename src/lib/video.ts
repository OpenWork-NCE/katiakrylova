export type VideoPlatform = 'YouTube' | 'Vimeo'

export type ParsedVideo = {
  platform: VideoPlatform
  embedUrl: string
  originalUrl: string
}

export function parseVideoUrl(url: string, platform?: string): ParsedVideo | null {
  const trimmed = url.trim()
  if (!trimmed) return null

  const youtube =
    trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)?.[1] ??
    null
  if (youtube) {
    return {
      platform: 'YouTube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtube}`,
      originalUrl: trimmed,
    }
  }

  const vimeo = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1] ?? null
  if (vimeo) {
    return {
      platform: 'Vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeo}`,
      originalUrl: trimmed,
    }
  }

  if (platform === 'YouTube' || platform === 'Vimeo') {
    return { platform: platform as VideoPlatform, embedUrl: trimmed, originalUrl: trimmed }
  }

  return null
}
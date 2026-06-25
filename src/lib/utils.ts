export function getMediaUrl(media: any): string | null {
  if (!media) return null
  if (typeof media === 'string') return media
  return media.url ?? null
}

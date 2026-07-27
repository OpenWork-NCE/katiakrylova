import { unstable_cache } from 'next/cache'
import { DEFAULT_REVALIDATE } from './cache-tags'

export { CACHE_TAGS, DEFAULT_REVALIDATE } from './cache-tags'

/**
 * Cache a pure JSON-serializable Payload read across requests.
 * Prefer DTOs / plain objects — never cache non-serializable instances.
 */
export function cachedPayload<T>(
  keyParts: string[],
  tags: string[],
  revalidate: number = DEFAULT_REVALIDATE,
  fn: () => Promise<T>,
): Promise<T> {
  return unstable_cache(fn, keyParts, { tags, revalidate })()
}

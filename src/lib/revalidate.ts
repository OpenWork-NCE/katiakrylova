import { CACHE_TAGS } from './cache-tags'

/**
 * Safe revalidate helpers for Payload hooks.
 * `next/cache` is only available inside the Next.js runtime — scripts/migrations no-op.
 */
function safeTag(tag: string) {
  try {
    // Dynamic require keeps collection imports usable outside Next (tests, migrate).
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { revalidateTag } = require('next/cache') as typeof import('next/cache')
    revalidateTag(tag)
  } catch {
    /* outside Next request (migrations, seed scripts) */
  }
}

export function revalidateProjects(slug?: string) {
  safeTag(CACHE_TAGS.projects)
  if (slug) safeTag(CACHE_TAGS.project(slug))
}

export function revalidatePortfolio(categorySlug?: string) {
  safeTag(CACHE_TAGS.portfolio)
  if (categorySlug) safeTag(CACHE_TAGS.portfolioCat(categorySlug))
}

export function revalidateJournal(slug?: string) {
  safeTag(CACHE_TAGS.journal)
  if (slug) safeTag(CACHE_TAGS.journalEntry(slug))
}

export function revalidateMakingOf(slug?: string) {
  safeTag(CACHE_TAGS.makingOf)
  if (slug) safeTag(CACHE_TAGS.makingOfEntry(slug))
}

export function revalidateGlobal(slug: string) {
  safeTag(CACHE_TAGS.global(slug))
}

export function revalidateMedia() {
  safeTag(CACHE_TAGS.media)
  safeTag(CACHE_TAGS.projects)
  safeTag(CACHE_TAGS.portfolio)
  safeTag(CACHE_TAGS.journal)
  safeTag(CACHE_TAGS.makingOf)
  safeTag(CACHE_TAGS.global('home'))
  safeTag(CACHE_TAGS.global('about'))
  safeTag(CACHE_TAGS.global('contact'))
  safeTag(CACHE_TAGS.global('journal'))
}

/** Shared cache tag names for on-demand revalidation from Payload hooks. */
export const CACHE_TAGS = {
  projects: 'projects',
  project: (slug: string) => `project:${slug}`,
  portfolio: 'portfolio',
  portfolioCat: (slug: string) => `portfolio:cat:${slug}`,
  journal: 'journal',
  journalEntry: (slug: string) => `journal:${slug}`,
  makingOf: 'making-of',
  makingOfEntry: (slug: string) => `making-of:${slug}`,
  global: (slug: string) => `global:${slug}`,
  media: 'media',
} as const

/** Default ISR window (seconds) when no on-demand revalidation fires. */
export const DEFAULT_REVALIDATE = 600

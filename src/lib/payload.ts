import { getPayload } from 'payload'
import config from '@payload-config'
import type { Project, Portfolio, JournalEntry, MakingOf, PortfolioCategory } from '@/payload-types'
import { CACHE_TAGS, DEFAULT_REVALIDATE, cachedPayload } from '@/lib/cache'
import { toProjectListItem, type ProjectListItem } from '@/lib/project-list'

let cached: Awaited<ReturnType<typeof getPayload>> | null = null

export async function getPayloadClient() {
  if (cached) return cached
  cached = await getPayload({ config })
  return cached
}

type Locale = 'fr' | 'en' | 'all'

function loc(locale: Locale) {
  return locale === 'all' ? 'all' : locale
}

/** Full project docs (detail pages). Prefer getProjectsList for filmography. */
export async function getProjects(locale: Locale = 'fr') {
  return cachedPayload(
    ['projects', String(locale)],
    [CACHE_TAGS.projects],
    DEFAULT_REVALIDATE,
    async () => {
      const payload = await getPayloadClient()
      const { docs } = await payload.find({
        collection: 'projects',
        depth: 1,
        locale: loc(locale),
        sort: 'order',
        limit: 1000,
      })
      return docs as Project[]
    },
  )
}

/** Slim cards for the projects index — no gallery/credits/caseStudy on the client. */
export async function getProjectsList(locale: Locale = 'fr'): Promise<ProjectListItem[]> {
  return cachedPayload(
    ['projects-list', String(locale)],
    [CACHE_TAGS.projects],
    DEFAULT_REVALIDATE,
    async () => {
      const payload = await getPayloadClient()
      const { docs } = await payload.find({
        collection: 'projects',
        depth: 1,
        locale: loc(locale),
        sort: 'order',
        limit: 1000,
      })
      return (docs as Project[]).map(toProjectListItem)
    },
  )
}

export async function getProjectSlugs(): Promise<string[]> {
  return cachedPayload(['project-slugs'], [CACHE_TAGS.projects], DEFAULT_REVALIDATE, async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'projects',
      depth: 0,
      limit: 1000,
      select: { slug: true },
    })
    return docs.map((d) => d.slug).filter(Boolean) as string[]
  })
}

export async function getProjectBySlug(slug: string, locale: Locale = 'fr') {
  return cachedPayload(
    ['project', slug, String(locale)],
    [CACHE_TAGS.projects, CACHE_TAGS.project(slug)],
    DEFAULT_REVALIDATE,
    async () => {
      const payload = await getPayloadClient()
      const { docs } = await payload.find({
        collection: 'projects',
        where: { slug: { equals: slug } },
        depth: 1,
        locale: loc(locale),
        limit: 1,
      })
      return (docs[0] as Project | undefined) ?? null
    },
  )
}

export type AdjacentProject = {
  slug: string
  title: string
  coverImage?: { url?: string | null }
}

export async function getAdjacentProjects(order: number, locale: Locale = 'fr') {
  return cachedPayload(
    ['project-adjacent', String(order), String(locale)],
    [CACHE_TAGS.projects],
    DEFAULT_REVALIDATE,
    async () => {
      const payload = await getPayloadClient()
      const [prev, next] = await Promise.all([
        payload.find({
          collection: 'projects',
          where: { order: { less_than: order } },
          depth: 1,
          sort: '-order',
          locale: loc(locale),
          limit: 1,
        }),
        payload.find({
          collection: 'projects',
          where: { order: { greater_than: order } },
          depth: 1,
          sort: 'order',
          locale: loc(locale),
          limit: 1,
        }),
      ])
      const mapAdj = (doc: Project | undefined): AdjacentProject | undefined => {
        if (!doc) return undefined
        const cover =
          typeof doc.coverImage === 'object' && doc.coverImage
            ? { url: (doc.coverImage as { url?: string | null }).url ?? undefined }
            : undefined
        return { slug: doc.slug, title: doc.title, coverImage: cover }
      }
      return {
        prev: mapAdj(prev.docs[0] as Project | undefined),
        next: mapAdj(next.docs[0] as Project | undefined),
      }
    },
  )
}

export async function getPortfolio(locale: Locale = 'fr') {
  return cachedPayload(
    ['portfolio', String(locale)],
    [CACHE_TAGS.portfolio],
    DEFAULT_REVALIDATE,
    async () => {
      const payload = await getPayloadClient()
      const { docs } = await payload.find({
        collection: 'portfolio',
        depth: 1,
        locale: loc(locale),
        sort: 'order',
        limit: 1000,
      })
      return docs as Portfolio[]
    },
  )
}

/** Portfolio works for one category (covers + gallery for the liseuse). */
export async function getPortfolioByCategory(categoryId: number | string, locale: Locale = 'fr') {
  return cachedPayload(
    ['portfolio-cat', String(categoryId), String(locale)],
    [CACHE_TAGS.portfolio, CACHE_TAGS.portfolioCat(String(categoryId))],
    DEFAULT_REVALIDATE,
    async () => {
      const payload = await getPayloadClient()
      const { docs } = await payload.find({
        collection: 'portfolio',
        where: { category: { equals: categoryId } },
        depth: 1,
        locale: loc(locale),
        sort: 'order',
        limit: 1000,
      })
      return docs as Portfolio[]
    },
  )
}

export async function getPortfolioBySlug(slug: string, locale: Locale = 'fr') {
  return cachedPayload(
    ['portfolio-item', slug, String(locale)],
    [CACHE_TAGS.portfolio],
    DEFAULT_REVALIDATE,
    async () => {
      const payload = await getPayloadClient()
      const { docs } = await payload.find({
        collection: 'portfolio',
        where: { slug: { equals: slug } },
        depth: 1,
        locale: loc(locale),
        limit: 1,
      })
      return (docs[0] as Portfolio | undefined) ?? null
    },
  )
}

export async function getPortfolioCategories(locale: Locale = 'fr') {
  return cachedPayload(
    ['portfolio-categories', String(locale)],
    [CACHE_TAGS.portfolio],
    DEFAULT_REVALIDATE,
    async () => {
      const payload = await getPayloadClient()
      const { docs } = await payload.find({
        collection: 'portfolio-categories',
        locale: loc(locale),
        sort: 'order',
        limit: 100,
      })
      return docs as PortfolioCategory[]
    },
  )
}

export async function getJournalEntries(locale: Locale = 'fr') {
  return cachedPayload(
    ['journal-entries', String(locale)],
    [CACHE_TAGS.journal],
    DEFAULT_REVALIDATE,
    async () => {
      const payload = await getPayloadClient()
      const { docs } = await payload.find({
        collection: 'journal-entries',
        depth: 1,
        locale: loc(locale),
        sort: '-createdAt',
        limit: 100,
      })
      return docs as JournalEntry[]
    },
  )
}

export async function getJournalEntrySlugs(): Promise<string[]> {
  return cachedPayload(['journal-slugs'], [CACHE_TAGS.journal], DEFAULT_REVALIDATE, async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'journal-entries',
      depth: 0,
      limit: 100,
      select: { slug: true },
    })
    return docs.map((d) => d.slug).filter(Boolean) as string[]
  })
}

export async function getJournalEntryBySlug(slug: string, locale: Locale = 'fr') {
  return cachedPayload(
    ['journal-entry', slug, String(locale)],
    [CACHE_TAGS.journal, CACHE_TAGS.journalEntry(slug)],
    DEFAULT_REVALIDATE,
    async () => {
      const payload = await getPayloadClient()
      const { docs } = await payload.find({
        collection: 'journal-entries',
        where: { slug: { equals: slug } },
        depth: 2,
        locale: loc(locale),
        limit: 1,
      })
      return (docs[0] as JournalEntry | undefined) ?? null
    },
  )
}

export async function getMakingOfEntries(locale: Locale = 'fr') {
  return cachedPayload(
    ['making-of', String(locale)],
    [CACHE_TAGS.makingOf],
    DEFAULT_REVALIDATE,
    async () => {
      const payload = await getPayloadClient()
      const { docs } = await payload.find({
        collection: 'making-of',
        depth: 1,
        locale: loc(locale),
        sort: '-year',
        limit: 100,
      })
      return docs as MakingOf[]
    },
  )
}

export async function getMakingOfSlugs(): Promise<string[]> {
  return cachedPayload(['making-of-slugs'], [CACHE_TAGS.makingOf], DEFAULT_REVALIDATE, async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'making-of',
      depth: 0,
      limit: 100,
      select: { slug: true },
    })
    return docs.map((d) => d.slug).filter(Boolean) as string[]
  })
}

export async function getMakingOfBySlug(slug: string, locale: Locale = 'fr') {
  return cachedPayload(
    ['making-of-entry', slug, String(locale)],
    [CACHE_TAGS.makingOf, CACHE_TAGS.makingOfEntry(slug)],
    DEFAULT_REVALIDATE,
    async () => {
      const payload = await getPayloadClient()
      const { docs } = await payload.find({
        collection: 'making-of',
        where: { slug: { equals: slug } },
        depth: 1,
        locale: loc(locale),
        limit: 1,
      })
      return (docs[0] as MakingOf | undefined) ?? null
    },
  )
}

export async function getContact(locale: Locale = 'fr') {
  return cachedPayload(
    ['global-contact', String(locale)],
    [CACHE_TAGS.global('contact')],
    DEFAULT_REVALIDATE,
    async () => {
      const payload = await getPayloadClient()
      return payload.findGlobal({
        slug: 'contact',
        depth: 1,
        locale: loc(locale),
      })
    },
  )
}

export async function getAbout(locale: Locale = 'fr') {
  return cachedPayload(
    ['global-about', String(locale)],
    [CACHE_TAGS.global('about')],
    DEFAULT_REVALIDATE,
    async () => {
      const payload = await getPayloadClient()
      return payload.findGlobal({
        slug: 'about',
        depth: 1,
        locale: loc(locale),
      })
    },
  )
}

export async function getJournal(locale: Locale = 'fr') {
  return cachedPayload(
    ['global-journal', String(locale)],
    [CACHE_TAGS.global('journal')],
    DEFAULT_REVALIDATE,
    async () => {
      const payload = await getPayloadClient()
      return payload.findGlobal({
        slug: 'journal',
        depth: 1,
        locale: loc(locale),
      })
    },
  )
}

export async function getHome(locale: Locale = 'fr') {
  return cachedPayload(
    ['global-home', String(locale)],
    [CACHE_TAGS.global('home')],
    DEFAULT_REVALIDATE,
    async () => {
      const payload = await getPayloadClient()
      return payload.findGlobal({
        slug: 'home',
        depth: 1,
        locale: loc(locale),
      })
    },
  )
}

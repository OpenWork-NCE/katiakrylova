import { getPayload } from 'payload'
import config from '@payload-config'
import type { Project, Portfolio, JournalEntry, MakingOf } from '@/payload-types'

let cached: Awaited<ReturnType<typeof getPayload>> | null = null

export async function getPayloadClient() {
  if (cached) return cached
  cached = await getPayload({ config })
  return cached
}

type Locale = 'fr' | 'en' | 'all'

export async function getProjects(locale: Locale = 'fr') {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    depth: 1,
    locale: locale === 'all' ? 'all' : locale,
    sort: 'order',
    limit: 1000,
  })
  return docs as Project[]
}

export async function getProjectBySlug(slug: string, locale: Locale = 'fr') {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    depth: 1,
    locale: locale === 'all' ? 'all' : locale,
    limit: 1,
  })
  return (docs[0] as Project | undefined) ?? null
}

export async function getAdjacentProjects(order: number, locale: Locale = 'fr') {
  const payload = await getPayloadClient()
  const [prev, next] = await Promise.all([
    payload.find({
      collection: 'projects',
      where: { order: { less_than: order } },
      depth: 1,
      sort: '-order',
      locale: locale === 'all' ? 'all' : locale,
      limit: 1,
    }),
    payload.find({
      collection: 'projects',
      where: { order: { greater_than: order } },
      depth: 1,
      sort: 'order',
      locale: locale === 'all' ? 'all' : locale,
      limit: 1,
    }),
  ])
  return { prev: prev.docs[0] as Project | undefined, next: next.docs[0] as Project | undefined }
}

export async function getPortfolio(locale: Locale = 'fr') {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'portfolio',
    depth: 1,
    locale: locale === 'all' ? 'all' : locale,
    sort: 'order',
    limit: 1000,
  })
  return docs as Portfolio[]
}

export async function getPortfolioBySlug(slug: string, locale: Locale = 'fr') {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'portfolio',
    where: { slug: { equals: slug } },
    depth: 1,
    locale: locale === 'all' ? 'all' : locale,
    limit: 1,
  })
  return (docs[0] as Portfolio | undefined) ?? null
}

export async function getPortfolioCategories(locale: Locale = 'fr') {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'portfolio-categories',
    locale: locale === 'all' ? 'all' : locale,
    sort: 'order',
    limit: 100,
  })
  return docs
}

export async function getJournalEntries(locale: Locale = 'fr') {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'journal-entries',
    locale: locale === 'all' ? 'all' : locale,
    sort: '-createdAt',
    limit: 100,
  })
  return docs as JournalEntry[]
}

export async function getJournalEntryBySlug(slug: string, locale: Locale = 'fr') {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'journal-entries',
    where: { slug: { equals: slug } },
    depth: 1,
    locale: locale === 'all' ? 'all' : locale,
    limit: 1,
  })
  return (docs[0] as JournalEntry | undefined) ?? null
}

export async function getMakingOfEntries(locale: Locale = 'fr') {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'making-of',
    locale: locale === 'all' ? 'all' : locale,
    sort: '-year',
    limit: 100,
  })
  return docs as MakingOf[]
}

export async function getContact(locale: Locale = 'fr') {
  const payload = await getPayloadClient()
  const contact = await payload.findGlobal({
    slug: 'contact',
    locale: locale === 'all' ? 'all' : locale,
  })
  return contact
}

export async function getAbout(locale: Locale = 'fr') {
  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug: 'about',
    depth: 1,
    locale: locale === 'all' ? 'all' : locale,
  })
}

export async function getJournal(locale: Locale = 'fr') {
  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug: 'journal',
    depth: 1,
    locale: locale === 'all' ? 'all' : locale,
  })
}

export async function getHome(locale: Locale = 'fr') {
  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug: 'home',
    depth: 1,
    locale: locale === 'all' ? 'all' : locale,
  })
}

export async function getLinks(locale: Locale = 'fr') {
  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug: 'links',
    depth: 1,
    locale: locale === 'all' ? 'all' : locale,
  })
}

import 'dotenv/config'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { uploadMedia, clearMediaCache } from './lib/upload-media'
import { textToLexical } from './lib/lexical'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const dataDir = path.join(root, 'scripts/data')
const imagesRoot = path.join(root, 'public/images')

type PortfolioManifest = {
  items: Array<{
    order: number
    category: string
    categorySlug: string
    title: string
    slug: string
    filename: string
    localPath: string
    year: number
  }>
}

type ProjectsManifest = {
  projects: Array<{
    slug: string
    title: string
    year: number
    format: string
    description: string
    order: number
    coverImage: string | null
    gallery: string[]
    credits: Array<{ role: string; name: string }>
    externalLinks: Array<{ platform: 'Vimeo' | 'YouTube'; url: string }>
  }>
}

type GlobalsManifest = {
  home: {
    heroImage: string
    tagline?: string
    role?: string
    intro?: string
    ctaLabel?: string
  }
  about: {
    bio: string
    /** @deprecated legacy full-bleed background */
    photo?: string
    profileImage?: string
    gallery?: string[]
  }
  contact: {
    email: string
    phone: string
    calComUrl: string
    backgroundImage?: string
    vimeoUrl?: string
    instagramUrl?: string
    linkedinUrl?: string
  }
  /** Page liste Journal — fond CMS */
  journalPage?: { photo: string }
  /** @deprecated prefer journalEntries */
  journal?: {
    title: string
    slug: string
    excerpt: string
    coverImage: string
    content: string
  }
  journalEntries?: Array<{
    title: string
    slug: string
    excerpt: string
    coverImage: string
    content: string
  }>
}

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const only = args.find((a) => a.startsWith('--only='))?.split('=')[1]

function shouldRun(section: string) {
  return !only || only === section
}

async function loadJson<T>(name: string): Promise<T> {
  const p = path.join(dataDir, name)
  return JSON.parse(await readFile(p, 'utf8')) as T
}

async function findBySlug(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: 'portfolio' | 'portfolio-categories' | 'projects' | 'journal-entries',
  slug: string,
) {
  const { docs } = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return docs[0] ?? null
}

async function migrateGlobals(payload: Awaited<ReturnType<typeof getPayload>>, globals: GlobalsManifest) {
  const heroId = await uploadMedia(
    payload,
    path.join(imagesRoot, globals.home.heroImage),
    'Hero Katia Krylova',
    dryRun,
  )
  const aboutProfilePath = globals.about.profileImage ?? 'Profile Picture.png'
  const aboutProfileId = await uploadMedia(
    payload,
    path.join(imagesRoot, aboutProfilePath),
    'Portrait Katia Krylova',
    dryRun,
  )
  const aboutGalleryPaths = globals.about.gallery ?? ['maman.jpg', 'Image de fond.jpg']
  const aboutGalleryIds: number[] = []
  for (const filename of aboutGalleryPaths) {
    const id = await uploadMedia(
      payload,
      path.join(imagesRoot, filename),
      `About — ${filename}`,
      dryRun,
    )
    if (id != null) aboutGalleryIds.push(id)
  }
  const aboutBgPath = globals.about.photo ?? 'maman.jpg'
  const aboutBgId = await uploadMedia(
    payload,
    path.join(imagesRoot, aboutBgPath),
    'Fond de page About',
    dryRun,
  )
  const journalPhotoPath = globals.journalPage?.photo ?? 'moodboard.jpg'
  const journalPhotoId = await uploadMedia(
    payload,
    path.join(imagesRoot, journalPhotoPath),
    'Fond de page Journal',
    dryRun,
  )
  const contactBgPath = globals.contact.backgroundImage ?? 'Fonds Contact.jpg'
  const contactBgId = await uploadMedia(
    payload,
    path.join(imagesRoot, contactBgPath),
    'Fond de page Contact',
    dryRun,
  )

  if (!dryRun) {
    await payload.updateGlobal({
      slug: 'home',
      data: {
        heroImage: heroId ?? undefined,
        tagline: globals.home.tagline,
        role: globals.home.role,
        intro: globals.home.intro,
        ctaLabel: globals.home.ctaLabel,
      },
      locale: 'fr',
    })

    await payload.updateGlobal({
      slug: 'about',
      data: {
        bio: textToLexical(globals.about.bio),
        profileImage: aboutProfileId ?? undefined,
        gallery: aboutGalleryIds.map((image) => ({ image })),
        photo: aboutBgId ?? undefined,
      },
      locale: 'fr',
    })

    await payload.updateGlobal({
      slug: 'contact',
      data: {
        email: globals.contact.email,
        phone: globals.contact.phone,
        calComUrl: globals.contact.calComUrl,
        vimeoUrl: globals.contact.vimeoUrl,
        instagramUrl: globals.contact.instagramUrl,
        linkedinUrl: globals.contact.linkedinUrl,
        backgroundImage: contactBgId ?? undefined,
      },
      locale: 'fr',
    })

    await payload.updateGlobal({
      slug: 'journal',
      data: {
        photo: journalPhotoId ?? undefined,
      },
      locale: 'fr',
    })
  }

  console.log('✓ Globals: home, about, contact, journal')
}

/** Hub order: Acryliques · Collage · Gravure · Linos · Identity. Letter kept for legacy items. */
async function migrateCategories(payload: Awaited<ReturnType<typeof getPayload>>) {
  const categories = [
    { name: 'Acryliques', slug: 'acryliques', order: 0 },
    { name: 'Collage', slug: 'collage', order: 1 },
    { name: 'Gravure', slug: 'gravure', order: 2 },
    { name: 'Linos', slug: 'linos', order: 3 },
    { name: 'Identity', slug: 'identity', order: 4 },
    { name: 'Letter', slug: 'letter', order: 99 },
  ]
  const ids: Record<string, number> = {}

  for (const { name, slug, order } of categories) {
    const existing = await findBySlug(payload, 'portfolio-categories', slug)
    if (existing) {
      if (!dryRun) {
        await payload.update({
          collection: 'portfolio-categories',
          id: existing.id,
          data: { name, order },
          locale: 'fr',
        })
      }
      ids[slug] = existing.id
      continue
    }
    if (dryRun) {
      ids[slug] = -1
      continue
    }
    const doc = await payload.create({
      collection: 'portfolio-categories',
      data: { name, slug, order },
      locale: 'fr',
    })
    ids[slug] = doc.id
  }

  console.log(`✓ Portfolio categories: ${categories.length}`)
  return ids
}

async function migratePortfolio(
  payload: Awaited<ReturnType<typeof getPayload>>,
  manifest: PortfolioManifest,
  categoryIds: Record<string, number>,
) {
  let created = 0
  let skipped = 0

  for (const item of manifest.items) {
    const existing = await findBySlug(payload, 'portfolio', item.slug)
    if (existing) {
      skipped += 1
      continue
    }

    const filePath = path.join(imagesRoot, item.localPath)
    const coverId = await uploadMedia(payload, filePath, item.title, dryRun)
    if (!coverId && !dryRun) {
      console.warn(`  ⚠ Skipping portfolio ${item.slug}: no cover image`)
      continue
    }

    if (!dryRun) {
      await payload.create({
        collection: 'portfolio',
        data: {
          title: item.title,
          slug: item.slug,
          year: item.year,
          category: categoryIds[item.categorySlug],
          coverImage: coverId!,
          order: item.order,
        },
        locale: 'fr',
      })
    }
    created += 1
  }

  console.log(`✓ Portfolio: ${created} created, ${skipped} skipped`)
}

async function migrateProjects(payload: Awaited<ReturnType<typeof getPayload>>, manifest: ProjectsManifest) {
  let created = 0
  let skipped = 0

  for (const p of manifest.projects) {
    const existing = await findBySlug(payload, 'projects', p.slug)
    if (existing) {
      skipped += 1
      continue
    }

    let coverId: number | null = null
    if (p.coverImage) {
      coverId = await uploadMedia(
        payload,
        path.join(imagesRoot, p.coverImage),
        p.title,
        dryRun,
      )
    }

    const galleryIds: Array<{ image: number }> = []
    for (const file of p.gallery) {
      const id = await uploadMedia(payload, path.join(imagesRoot, file), `${p.title} — ${file}`, dryRun)
      if (id) galleryIds.push({ image: id })
    }

    if (!coverId && !dryRun) {
      console.warn(`  ⚠ Skipping project ${p.slug}: no cover image`)
      continue
    }

    if (!dryRun) {
      await payload.create({
        collection: 'projects',
        data: {
          title: p.title,
          slug: p.slug,
          year: p.year,
          format: p.format as 'Court-métrage' | 'Clip' | 'Performance' | 'Documentaire' | 'Essai expérimental' | 'Making Of',
          description: p.description,
          order: p.order,
          coverImage: coverId!,
          gallery: galleryIds,
          credits: p.credits,
          externalLinks: p.externalLinks,
        },
        locale: 'fr',
        draft: false,
      })
    }
    created += 1
  }

  console.log(`✓ Projects: ${created} created, ${skipped} skipped`)
}

async function migrateJournal(payload: Awaited<ReturnType<typeof getPayload>>, globals: GlobalsManifest) {
  const entries =
    globals.journalEntries ??
    (globals.journal ? [globals.journal] : [])

  let created = 0
  let skipped = 0

  for (const j of entries) {
    const existing = await findBySlug(payload, 'journal-entries', j.slug)
    if (existing) {
      skipped += 1
      continue
    }

    const coverId = await uploadMedia(
      payload,
      path.join(imagesRoot, j.coverImage),
      j.title,
      dryRun,
    )

    if (!dryRun) {
      await payload.create({
        collection: 'journal-entries',
        data: {
          title: j.title,
          slug: j.slug,
          excerpt: j.excerpt,
          content: textToLexical(j.content),
          coverImage: coverId ?? undefined,
        },
        locale: 'fr',
      })
    }
    created += 1
  }

  console.log(`✓ Journal: ${created} created, ${skipped} skipped`)
}

async function run() {
  if (!existsSync(path.join(dataDir, 'portfolio-manifest.json'))) {
    console.error('Missing manifests. Run:')
    console.error('  node scripts/extract-portfolio-manifest.mjs')
    console.error('  node scripts/parse-site-map.mjs')
    process.exit(1)
  }

  clearMediaCache()
  const payload = await getPayload({ config })

  if (dryRun) console.log('DRY RUN — no writes to Payload')

  if (shouldRun('globals') || shouldRun('journal')) {
    const globals = await loadJson<GlobalsManifest>('globals-manifest.json')
    if (shouldRun('globals')) await migrateGlobals(payload, globals)
    // Journal entries ship with the globals manifest (incl. --only=globals)
    if (shouldRun('journal') || shouldRun('globals')) {
      await migrateJournal(payload, globals)
    }
  }

  let categoryIds: Record<string, number> = {}
  if (shouldRun('portfolio') || shouldRun('projects')) {
    categoryIds = await migrateCategories(payload)
  }

  if (shouldRun('portfolio')) {
    const portfolio = await loadJson<PortfolioManifest>('portfolio-manifest.json')
    await migratePortfolio(payload, portfolio, categoryIds)
  }

  if (shouldRun('projects')) {
    const projects = await loadJson<ProjectsManifest>('projects-manifest.json')
    await migrateProjects(payload, projects)
  }

  console.log('Done.')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
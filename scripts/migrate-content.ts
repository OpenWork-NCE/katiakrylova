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
  home: { heroImage: string; tagline: string }
  about: { photo: string; bio: string }
  contact: { email: string; phone: string; calComUrl: string }
  journal: {
    title: string
    slug: string
    excerpt: string
    coverImage: string
    content: string
  }
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
  const aboutPhotoId = await uploadMedia(
    payload,
    path.join(imagesRoot, globals.about.photo),
    'About Katia Krylova',
    dryRun,
  )

  if (!dryRun) {
    await payload.updateGlobal({
      slug: 'home',
      data: {
        heroImage: heroId ?? undefined,
        tagline: globals.home.tagline,
      },
      locale: 'fr',
    })

    await payload.updateGlobal({
      slug: 'about',
      data: {
        bio: textToLexical(globals.about.bio),
        photo: aboutPhotoId ?? undefined,
      },
      locale: 'fr',
    })

    await payload.updateGlobal({
      slug: 'contact',
      data: globals.contact,
      locale: 'fr',
    })
  }

  console.log('✓ Globals: home, about, contact')
}

async function migrateCategories(payload: Awaited<ReturnType<typeof getPayload>>) {
  const categories = ['Collage', 'Gravure', 'Identity', 'Letter']
  const ids: Record<string, number> = {}

  for (let i = 0; i < categories.length; i++) {
    const name = categories[i]
    const slug = name.toLowerCase()
    const existing = await findBySlug(payload, 'portfolio-categories', slug)
    if (existing) {
      ids[slug] = existing.id
      continue
    }
    if (dryRun) {
      ids[slug] = -1
      continue
    }
    const doc = await payload.create({
      collection: 'portfolio-categories',
      data: { name, slug, order: i },
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
  const j = globals.journal
  const existing = await findBySlug(payload, 'journal-entries', j.slug)
  if (existing) {
    console.log('✓ Journal: already exists, skipped')
    return
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

  console.log('✓ Journal: 1 entry')
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

  if (shouldRun('globals')) {
    const globals = await loadJson<GlobalsManifest>('globals-manifest.json')
    await migrateGlobals(payload, globals)
    if (shouldRun('journal')) await migrateJournal(payload, globals)
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
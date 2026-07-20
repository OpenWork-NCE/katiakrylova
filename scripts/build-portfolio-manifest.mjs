/**
 * Scan public/images/PORTFOLIO/{CATEGORY}/* and write scripts/data/portfolio-manifest.json
 */
import { readdir, writeFile, mkdir, stat } from 'fs/promises'
import { join, extname, basename } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const portfolioRoot = join(root, 'public/images/PORTFOLIO')
const outPath = join(root, 'scripts/data/portfolio-manifest.json')

/** Folder name → CMS category */
const CATEGORY_MAP = {
  ACRYLIQUES: { name: 'Acryliques', slug: 'acryliques', order: 0 },
  COLLAGES: { name: 'Collage', slug: 'collage', order: 1 },
  GRAVURES: { name: 'Gravure', slug: 'gravure', order: 2 },
  LINOS: { name: 'Linos', slug: 'linos', order: 3 },
  IDENTITY: { name: 'Identity', slug: 'identity', order: 4 },
}

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.JPG', '.JPEG', '.PNG', '.GIF', '.WEBP'])

function naturalKey(name) {
  return name
    .replace(/\.[^.]+$/, '')
    .split(/(\d+)/)
    .map((part) => (/^\d+$/.test(part) ? part.padStart(8, '0') : part.toLowerCase()))
    .join('')
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Human title from filename */
function titleFromFilename(filename, categoryName) {
  let base = basename(filename, extname(filename))
  // double ext like Maman.gif.jpg
  base = base.replace(/\.(gif|jpg|jpeg|png|webp)$/i, '')
  base = base.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
  // pure number → "Acrylique 12"
  if (/^\d+(\.\d+)?$/.test(base)) {
    const singular = categoryName.replace(/s$/i, '')
    return `${singular} ${base}`
  }
  // Title Case light
  return base
    .split(' ')
    .map((w) => {
      if (w.length <= 2 && w === w.toUpperCase()) return w
      return w.charAt(0).toUpperCase() + w.slice(1)
    })
    .join(' ')
}

async function main() {
  const year = new Date().getFullYear()
  const items = []
  const byCategory = {}
  let order = 0

  const folders = (await readdir(portfolioRoot)).sort()

  for (const folder of folders) {
    const meta = CATEGORY_MAP[folder]
    if (!meta) {
      console.warn(`⚠ Unknown folder (skipped): PORTFOLIO/${folder}`)
      continue
    }

    const dir = join(portfolioRoot, folder)
    const st = await stat(dir)
    if (!st.isDirectory()) continue

    const files = (await readdir(dir))
      .filter((f) => IMAGE_EXT.has(extname(f)))
      .sort((a, b) => naturalKey(a).localeCompare(naturalKey(b), 'fr'))

    byCategory[meta.name] = files.length

    for (const filename of files) {
      order += 1
      const title = titleFromFilename(filename, meta.name)
      const slugBase = slugify(`${meta.slug}-${title}`) || `${meta.slug}-${order}`
      const localPath = `PORTFOLIO/${folder}/${filename}`

      items.push({
        order,
        category: meta.name,
        categorySlug: meta.slug,
        title,
        slug: slugBase,
        filename,
        localPath,
        year,
      })
    }
  }

  // ensure unique slugs
  const seen = new Map()
  for (const item of items) {
    const key = item.slug
    const n = (seen.get(key) ?? 0) + 1
    seen.set(key, n)
    if (n > 1) item.slug = `${item.slug}-${n}`
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    source: 'public/images/PORTFOLIO',
    count: items.length,
    byCategory,
    items,
  }

  await mkdir(join(root, 'scripts/data'), { recursive: true })
  await writeFile(outPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8')
  console.log(`✓ Wrote ${items.length} items → scripts/data/portfolio-manifest.json`)
  console.log('  byCategory:', byCategory)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

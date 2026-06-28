import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { dirname, join, basename } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outDir = join(root, 'scripts/data')
const htmlPath = join(root, '.firecrawl/portfolio.html')

function humanizeFilename(name) {
  const base = basename(name).replace(/\.[^.]+$/, '')
  return base
    .replace(/_e_/g, 'é')
    .replace(/_E_/g, 'É')
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function slugify(text, category) {
  const base = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${category.toLowerCase()}-${base}`
}

function parsePortfolioHtml(html) {
  const items = []
  const re = /<li class="afp-single-item" data-id="([^"]+)" data-type="([^"]+)">\s*<a[^>]+href="([^"]+)"[^>]*>/g
  let m
  let order = 0
  while ((m = re.exec(html)) !== null) {
    const [, id, category, imageUrl] = m
    const decodedUrl = imageUrl.replace(/&amp;/g, '&').replace('https://www.katiakrylova.com', 'http://www.katiakrylova.com')
    const filename = decodeURIComponent(basename(decodedUrl.split('?')[0]))
    const yearMatch = decodedUrl.match(/\/uploads\/(\d{4})\//)
    const year = yearMatch ? Number(yearMatch[1]) : 2013
    const title = humanizeFilename(filename)
    order += 1
    items.push({
      id,
      order,
      category,
      categorySlug: category.toLowerCase(),
      title,
      slug: slugify(title, category),
      filename,
      imageUrl: decodedUrl,
      localPath: `portfolio/${category.toLowerCase()}/${filename}`,
      year,
    })
  }
  return items
}

async function ensureHtml() {
  if (existsSync(htmlPath)) return readFile(htmlPath, 'utf8')
  console.log('Scraping portfolio page via firecrawl...')
  execSync(
    'firecrawl scrape "https://www.katiakrylova.com/portfolio/" --wait-for 5000 --format html -o .firecrawl/portfolio.html',
    { cwd: root, stdio: 'inherit' },
  )
  return readFile(htmlPath, 'utf8')
}

async function main() {
  const html = await ensureHtml()
  const items = parsePortfolioHtml(html)
  if (items.length === 0) {
    console.error('No portfolio items parsed — check HTML structure')
    process.exit(1)
  }
  await mkdir(outDir, { recursive: true })
  const manifest = {
    generatedAt: new Date().toISOString(),
    source: 'https://www.katiakrylova.com/portfolio/',
    count: items.length,
    byCategory: items.reduce((acc, i) => {
      acc[i.category] = (acc[i.category] || 0) + 1
      return acc
    }, {}),
    items,
  }
  const outPath = join(outDir, 'portfolio-manifest.json')
  await writeFile(outPath, JSON.stringify(manifest, null, 2) + '\n')
  console.log(`✓ Wrote ${items.length} items to ${outPath}`)
  console.log('  By category:', manifest.byCategory)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
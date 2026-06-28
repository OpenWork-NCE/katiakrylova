import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const manifestPath = join(root, 'scripts/data/portfolio-manifest.json')
const destRoot = join(root, 'previousWebsite/images/portfolio')

async function downloadFile(url, destPath) {
  if (existsSync(destPath)) {
    return 'skipped'
  }
  const httpUrl = url.replace('https://www.katiakrylova.com', 'http://www.katiakrylova.com')
  const res = await fetch(httpUrl)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await mkdir(dirname(destPath), { recursive: true })
  await writeFile(destPath, buf)
  return 'downloaded'
}

async function main() {
  if (!existsSync(manifestPath)) {
    console.error('Run: node scripts/extract-portfolio-manifest.mjs first')
    process.exit(1)
  }
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  let downloaded = 0
  let skipped = 0
  const failed = []

  for (const item of manifest.items) {
    const destPath = join(destRoot, item.categorySlug, item.filename)
    try {
      const status = await downloadFile(item.imageUrl, destPath)
      if (status === 'downloaded') downloaded += 1
      else skipped += 1
    } catch (e) {
      failed.push({ slug: item.slug, error: e.message })
      console.error(`✗ ${item.slug}: ${e.message}`)
    }
  }

  console.log(`✓ Portfolio assets: ${downloaded} downloaded, ${skipped} skipped, ${failed.length} failed`)
  if (failed.length) process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
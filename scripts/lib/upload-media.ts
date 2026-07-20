import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import type { Payload } from 'payload'

const cache = new Map<string, number>()

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
}

/** Stable unique media name (Payload strips path seps — use hyphens). */
function blobFilename(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/')
  const marker = '/public/images/'
  const idx = normalized.toLowerCase().indexOf(marker)
  const rel = idx !== -1 ? normalized.slice(idx + marker.length) : path.basename(filePath)
  return rel.replace(/\//g, '-')
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

/** Idempotent lookup by filename only — alt can change when reusing the same media. */
async function findExistingMedia(payload: Payload, filename: string) {
  const { docs } = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  })
  return docs[0] ?? null
}

async function withRetry<T>(label: string, fn: () => Promise<T>, attempts = 5): Promise<T> {
  let last: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (e) {
      last = e
      const msg = e instanceof Error ? e.message : String(e)
      console.warn(`  ↻ retry ${i + 1}/${attempts} ${label}: ${msg.slice(0, 120)}`)
      await sleep(1500 * (i + 1))
    }
  }
  throw last
}

export async function uploadMedia(
  payload: Payload,
  filePath: string,
  alt: string,
  dryRun = false,
): Promise<number | null> {
  const resolved = path.resolve(filePath)
  if (cache.has(resolved)) return cache.get(resolved)!

  if (!existsSync(resolved)) {
    console.warn(`  ⚠ File not found: ${resolved}`)
    return null
  }

  if (dryRun) {
    return -1
  }

  const name = blobFilename(resolved)
  // also match Payload-flattened form PORTFOLIOIDENTITY13.jpg
  const flatName = name.replace(/-/g, '')

  const existing =
    (await withRetry(`find media ${name}`, () => findExistingMedia(payload, name))) ||
    (flatName !== name
      ? await withRetry(`find media ${flatName}`, () => findExistingMedia(payload, flatName))
      : null)
  if (existing) {
    cache.set(resolved, existing.id as number)
    return existing.id as number
  }

  const data = await readFile(resolved)
  const ext = path.extname(resolved).toLowerCase()
  const mimetype = MIME[ext] ?? 'application/octet-stream'

  const doc = await withRetry(`upload ${name}`, () =>
    payload.create({
      collection: 'media',
      data: { alt },
      file: {
        data,
        mimetype,
        name,
        size: data.length,
      },
    }),
  )

  cache.set(resolved, doc.id as number)
  return doc.id as number
}

export function clearMediaCache() {
  cache.clear()
}
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

function blobFilename(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/')
  const marker = '/public/images/'
  const idx = normalized.toLowerCase().indexOf(marker)
  if (idx !== -1) return normalized.slice(idx + marker.length)
  return path.basename(filePath)
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
  const existing = await findExistingMedia(payload, name)
  if (existing) {
    cache.set(resolved, existing.id)
    return existing.id
  }

  const data = await readFile(resolved)
  const ext = path.extname(resolved).toLowerCase()
  const mimetype = MIME[ext] ?? 'application/octet-stream'

  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data,
      mimetype,
      name,
      size: data.length,
    },
  })

  cache.set(resolved, doc.id)
  return doc.id
}

export function clearMediaCache() {
  cache.clear()
}
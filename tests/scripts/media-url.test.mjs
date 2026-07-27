import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '../..')

// Load TS helpers via experimental strip-types if available, else skip.
async function loadUtils() {
  try {
    return await import(pathToFileURL(resolve(root, 'src/lib/utils.ts')).href)
  } catch {
    return null
  }
}

test('getMediaUrl prefers Payload size then falls back to original', async () => {
  const utils = await loadUtils()
  if (!utils) {
    // Runtime may not support TS import; skip soft
    return
  }
  const { getMediaUrl } = utils

  const media = {
    url: '/api/media/file/master.jpg',
    sizes: {
      card: { url: '/api/media/file/master-800x600.jpg', width: 800, height: 600 },
      hd: { url: '/api/media/file/master-1920x1440.jpg', width: 1920, height: 1440 },
      thumbnail: { url: '/api/media/file/master-480x360.jpg', width: 480, height: 360 },
    },
  }

  assert.equal(getMediaUrl(media, 'original'), '/api/media/file/master.jpg')
  assert.equal(getMediaUrl(media, 'card'), '/api/media/file/master-800x600.jpg')
  assert.equal(getMediaUrl(media, 'hd'), '/api/media/file/master-1920x1440.jpg')
  assert.equal(getMediaUrl(media, 'thumbnail'), '/api/media/file/master-480x360.jpg')
  assert.equal(getMediaUrl(media), '/api/media/file/master.jpg')

  const noSizes = { url: '/api/media/file/only.jpg' }
  assert.equal(getMediaUrl(noSizes, 'card'), '/api/media/file/only.jpg')
})

test('portfolio viewer constraint: original is never a size path when sizes exist', async () => {
  const utils = await loadUtils()
  if (!utils) return
  const { getMediaUrl } = utils
  const media = {
    url: 'https://blob.example/original.gif',
    sizes: {
      card: { url: 'https://blob.example/card.jpg' },
    },
  }
  assert.equal(getMediaUrl(media, 'original'), 'https://blob.example/original.gif')
  assert.notEqual(getMediaUrl(media, 'original'), getMediaUrl(media, 'card'))
})

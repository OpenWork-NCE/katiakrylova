import test from 'node:test'
import assert from 'node:assert/strict'
import { pathToFileURL } from 'node:url'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

test('iris blade paths: 8 closed polygons covering center', async () => {
  const mod = await import(pathToFileURL(resolve(root, 'src/components/transitions/iris-geometry.ts')).href)
  const paths = mod.irisBladePaths(8)
  assert.equal(paths.length, 8)
  for (const d of paths) {
    assert.match(d, /^M 50 50 L /)
    assert.ok(d.endsWith(' Z') || d.endsWith('Z'))
  }
})

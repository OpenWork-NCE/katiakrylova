import { readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const migrationsDir = resolve(__dirname, '..', 'src', 'migrations')

const pattern = /^import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]@payloadcms\/db-postgres['"]\s*;?\s*$/

function patchSource(source) {
  const match = source.match(pattern)
  if (!match) return source

  const names = match[1]
    .split(',')
    .map((n) => n.trim())
    .filter(Boolean)

  const valueNames = names.filter((n) => n !== 'MigrateUpArgs' && n !== 'MigrateDownArgs')
  const typeNames = names.filter((n) => n === 'MigrateUpArgs' || n === 'MigrateDownArgs')

  if (typeNames.length === 0) return source

  const valueLine = valueNames.length
    ? `import { ${valueNames.join(', ')} } from '@payloadcms/db-postgres'`
    : ''
  const typeLine = `import type { ${typeNames.join(', ')} } from '@payloadcms/db-postgres'`

  const replacement = [valueLine, typeLine].filter(Boolean).join('\n')
  return source.replace(pattern, replacement)
}

const entries = await readdir(migrationsDir)
let touched = 0

for (const entry of entries) {
  if (!entry.endsWith('.ts')) continue
  const filePath = resolve(migrationsDir, entry)
  const original = await readFile(filePath, 'utf8')
  const patched = patchSource(original)
  if (patched !== original) {
    await writeFile(filePath, patched, 'utf8')
    touched += 1
    console.log(`patched: ${entry}`)
  }
}

console.log(`Done. ${touched} file(s) patched.`)

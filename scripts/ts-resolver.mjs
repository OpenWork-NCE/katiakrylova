import { fileURLToPath } from 'node:url'
import { resolve as pathResolve, dirname as pathDirname } from 'node:path'
import { existsSync } from 'node:fs'

const EXTENSIONS = ['.ts', '.tsx', '.mts', '/index.ts', '/index.tsx']

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    const parentURL = context.parentURL
    if (parentURL) {
      const parentPath = fileURLToPath(parentURL)
      const basePath = pathResolve(pathDirname(parentPath), specifier)
      for (const ext of EXTENSIONS) {
        const candidate = basePath + ext
        if (existsSync(candidate)) {
          return nextResolve(specifier + ext, context)
        }
      }
    }
  }
  return nextResolve(specifier, context)
}

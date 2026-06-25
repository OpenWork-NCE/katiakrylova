import { register } from 'node:module'
import { pathToFileURL } from 'node:url'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')

register(pathToFileURL(resolve(__dirname, 'ts-resolver.mjs')).href, pathToFileURL(__dirname + '/'))

const configPath = resolve(projectRoot, 'src/payload.config.ts')
const configMod = await import(pathToFileURL(configPath).href)
let config = configMod.default ?? configMod
if (config && typeof config.then === 'function') {
  config = await config
}

const { generateTypes } = await import(
  pathToFileURL(resolve(projectRoot, 'node_modules/.pnpm/payload@3.85.1_graphql@16.14.2_typescript@5.9.3/node_modules/payload/dist/bin/generateTypes.js')).href
)

await generateTypes(config)
console.log('Types generated at:', config.typescript.outputFile)

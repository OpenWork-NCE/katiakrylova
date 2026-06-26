import { register } from 'node:module'
import { pathToFileURL } from 'node:url'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { config as loadEnv } from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')

loadEnv({ path: resolve(projectRoot, '.env') })

register(pathToFileURL(resolve(__dirname, 'ts-resolver.mjs')).href, pathToFileURL(__dirname + '/'))

const configPath = resolve(projectRoot, 'src/payload.config.ts')
const configMod = await import(pathToFileURL(configPath).href)
let config = configMod.default ?? configMod
if (config && typeof config.then === 'function') {
  config = await config
}

const command = process.argv[2] ?? 'migrate'

if (command === 'migrate:create') {
  await import(pathToFileURL(resolve(__dirname, 'patch-migration-imports.mjs')).href)
}

const payloadPath = resolve(
  projectRoot,
  'node_modules/.pnpm/payload@3.85.1_graphql@16.14.2_typescript@5.9.3/node_modules/payload/dist/bin/migrate.js',
)

const { migrate } = await import(pathToFileURL(payloadPath).href)

await migrate({
  config,
  parsedArgs: { _: [command] },
})

console.log(`Done: ${command}`)

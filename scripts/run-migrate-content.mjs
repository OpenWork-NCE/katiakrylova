import { register } from 'node:module'
import { pathToFileURL } from 'node:url'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { config as loadEnv } from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')

loadEnv({ path: resolve(projectRoot, '.env') })
loadEnv({ path: resolve(projectRoot, '.env.local') })

register(pathToFileURL(resolve(__dirname, 'ts-resolver.mjs')).href, pathToFileURL(__dirname + '/'))

await import(pathToFileURL(resolve(__dirname, 'migrate-content.ts')).href)
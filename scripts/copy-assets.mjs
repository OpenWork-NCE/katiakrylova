import { cp, mkdir } from 'fs/promises'
import { existsSync } from 'fs'

const srcImages = './previousWebsite/images'
const srcLogo = './previousWebsite/katia_krylova.png'
const destImages = './public/images'
const destLogo = './public/images/katia_krylova.png'

await mkdir(destImages, { recursive: true })
await cp(srcImages, destImages, { recursive: true })
await cp(srcLogo, destLogo)
console.log('✓ Images and logo copied to public/')
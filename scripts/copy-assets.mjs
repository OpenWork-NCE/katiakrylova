import { cp, mkdir } from 'fs/promises'
import { existsSync } from 'fs'

const srcImages = './previousWebsite/images'
const srcLogo = './previousWebsite/katia_krylova.png'
const destImages = './public/images'
const destLogo = './public/images/katia_krylova.png'

const srcPortfolio = './previousWebsite/images/portfolio'
const destPortfolio = './public/images/portfolio'

await mkdir(destImages, { recursive: true })
await cp(srcImages, destImages, { recursive: true })
await cp(srcLogo, destLogo)
if (existsSync(srcPortfolio)) {
  await cp(srcPortfolio, destPortfolio, { recursive: true })
  console.log('✓ Portfolio images copied to public/images/portfolio/')
}
console.log('✓ Images and logo copied to public/')
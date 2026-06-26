import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { en } from '@payloadcms/translations/languages/en'
import { fr } from '@payloadcms/translations/languages/fr'
import { buildConfig, type SharpDependency } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { PortfolioCategories } from './collections/PortfolioCategories'
import { Portfolio } from './collections/Portfolio'
import { Journal } from './collections/Journal'
import { MakingOf } from './collections/MakingOf'
import { About } from './globals/About'
import { Contact } from './globals/Contact'
import { Home } from './globals/Home'
import { SiteSettings } from './globals/SiteSettings'
import { env } from './lib/env'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: env.NEXT_PUBLIC_SERVER_URL,
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Projects, PortfolioCategories, Portfolio, Journal, MakingOf],
  globals: [About, Contact, Home, SiteSettings],
  editor: lexicalEditor({}),
  secret: env.PAYLOAD_SECRET,
  sharp: sharp as unknown as SharpDependency,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: env.DATABASE_URI,
    },
  }),
  plugins: [
    vercelBlobStorage({
      collections: { media: true },
      token: env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
  i18n: {
    fallbackLanguage: 'fr',
    supportedLanguages: { en, fr },
  },
  localization: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    fallback: true,
  },
})
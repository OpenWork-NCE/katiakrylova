import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
  },
  collections: [Users, Media, Projects, PortfolioCategories, Portfolio, Journal, MakingOf],
  globals: [About, Contact, Home, SiteSettings],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  plugins: [
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
  i18n: {
    supportedLanguages: {
      en: { dateFNSKey: 'en-US', translations: {} as any },
      fr: { dateFNSKey: 'fr', translations: {} as any },
    },
  },
  localization: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    fallback: true,
  },
})
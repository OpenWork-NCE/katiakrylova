import type { GlobalConfig } from 'payload'

export const Home: GlobalConfig = {
  slug: 'home',
  fields: [
    { name: 'heroImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'tagline', type: 'text', localized: true },
  ],
}

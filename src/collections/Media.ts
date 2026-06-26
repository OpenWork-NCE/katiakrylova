import type { CollectionConfig } from 'payload'

const isVercel = process.env.VERCEL === '1'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  upload: {
    staticDir: 'public/images',
    disableLocalStorage: isVercel,
    mimeTypes: ['image/*', 'video/mp4'],
    imageSizes: [
      { name: 'thumbnail', width: 480 },
      { name: 'card', width: 800 },
      { name: 'hd', width: 1920 },
    ],
  },
  fields: [
    { name: 'alt', type: 'text', required: true },
    { name: 'caption', type: 'text' },
  ],
}

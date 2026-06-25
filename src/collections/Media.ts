import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  upload: {
    staticDir: 'public/images',
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

import type { CollectionConfig } from 'payload'
import { revalidateMakingOf } from '../lib/revalidate'

export const MakingOf: CollectionConfig = {
  slug: 'making-of',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidateMakingOf(typeof doc?.slug === 'string' ? doc.slug : undefined)
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidateMakingOf(typeof doc?.slug === 'string' ? doc.slug : undefined)
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'year', type: 'number', required: true },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'content', type: 'richText', localized: true },
    {
      name: 'gallery',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media' }],
    },
  ],
  timestamps: true,
}

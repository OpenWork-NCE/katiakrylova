import type { CollectionConfig } from 'payload'

export const Portfolio: CollectionConfig = {
  slug: 'portfolio',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'year', type: 'number', required: true },
    { name: 'category', type: 'relationship', relationTo: 'portfolio-categories', required: true },
    { name: 'coverImage', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'images',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'order', type: 'number', defaultValue: 0, required: true },
  ],
  timestamps: true,
}

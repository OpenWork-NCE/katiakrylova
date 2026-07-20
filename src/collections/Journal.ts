import type { CollectionConfig } from 'payload'

export const Journal: CollectionConfig = {
  slug: 'journal-entries',
  labels: {
    singular: 'News',
    plural: 'News',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Contenu',
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'excerpt', type: 'textarea', localized: true },
    { name: 'content', type: 'richText', localized: true },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
  ],
  timestamps: true,
}

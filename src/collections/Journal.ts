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
    {
      name: 'relatedProject',
      type: 'relationship',
      relationTo: 'projects',
      label: 'Projet lié',
      admin: {
        description: 'Bouton « Voir le projet » sur la fiche News (ex. Plus de lait, La petite faucheuse).',
      },
    },
  ],
  timestamps: true,
}

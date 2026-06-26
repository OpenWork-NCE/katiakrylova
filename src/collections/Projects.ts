import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  versions: {
    drafts: {
      autosave: false,
    },
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [
          ({ data, value, originalDoc }) => {
            if (value) return value
            const source = data?.title || originalDoc?.title
            return source?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
          },
        ],
      },
    },
    { name: 'year', type: 'number', required: true },
    {
      name: 'format',
      type: 'select',
      required: true,
      options: [
        'Court-métrage',
        'Clip',
        'Performance',
        'Documentaire',
        'Essai expérimental',
        'Making Of',
      ],
    },
    { name: 'description', type: 'textarea', localized: true },
    {
      name: 'credits',
      type: 'array',
      localized: true,
      fields: [
        { name: 'role', type: 'text', required: true },
        { name: 'name', type: 'text', required: true },
      ],
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'gallery',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      name: 'externalLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: ['Vimeo', 'YouTube'],
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
    { name: 'caseStudy', type: 'richText', localized: true },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'order', type: 'number', defaultValue: 0, required: true },
  ],
  timestamps: true,
}

import type { GlobalConfig } from 'payload'

export const Links: GlobalConfig = {
  slug: 'links',
  label: 'Liens',
  fields: [
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Fond de page',
      admin: {
        description: 'Image de fond de la page Liens (plein écran).',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Liens',
      labels: { singular: 'Lien', plural: 'Liens' },
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          localized: true,
          label: 'Nom',
        },
        {
          name: 'role',
          type: 'text',
          required: true,
          localized: true,
          label: 'Rôle / métier',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL',
        },
      ],
    },
  ],
}

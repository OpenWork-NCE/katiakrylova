import type { GlobalConfig } from 'payload'

export const About: GlobalConfig = {
  slug: 'about',
  label: 'À propos',
  fields: [
    {
      name: 'bio',
      type: 'richText',
      required: true,
      localized: true,
      label: 'Biographie',
      admin: {
        description: 'Texte principal (colonne gauche).',
      },
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Portrait',
      admin: {
        description: 'Portrait à droite (ratio portrait recommandé, ex. 600×746).',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Images bas de page',
      labels: { singular: 'Image', plural: 'Images' },
      maxRows: 4,
      admin: {
        description: 'Deux images sous le texte / portrait (bandeau bas).',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Fond de page',
      admin: {
        description: 'Image de fond plein écran (style page Projets : scrim + vignette).',
      },
    },
  ],
}

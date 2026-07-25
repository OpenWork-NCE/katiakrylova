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
        description: 'Portrait à gauche (ratio portrait recommandé, ex. 600×746).',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Fond de page',
      admin: {
        description: 'Image de fond de la première section.',
      },
    },
    {
      name: 'visionImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Fond de la section vision',
      admin: {
        description: 'Image de fond de la seconde section.',
      },
    },
    { name: 'visionText', type: 'textarea', localized: true, label: 'Texte de la section vision' },
  ],
}

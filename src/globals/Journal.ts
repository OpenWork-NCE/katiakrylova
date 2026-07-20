import type { GlobalConfig } from 'payload'

export const Journal: GlobalConfig = {
  slug: 'journal',
  label: 'News (page)',
  fields: [
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Fond de page',
      admin: {
        description: 'Image de fond de la page liste News (plein écran).',
      },
    },
  ],
}

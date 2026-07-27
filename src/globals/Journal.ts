import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '../lib/revalidate'

export const Journal: GlobalConfig = {
  slug: 'journal',
  label: 'News (page)',
  hooks: {
    afterChange: [() => revalidateGlobal('journal')],
  },
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

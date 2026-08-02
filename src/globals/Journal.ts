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
      label: 'Fond de page (secours)',
      admin: {
        description:
          'Secours uniquement. Le fond de la liste News utilise d’abord la cover de la news la plus récente ; cette image sert s’il n’y a aucune news ou aucune cover.',
      },
    },
  ],
}

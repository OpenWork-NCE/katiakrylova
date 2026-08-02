import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '../lib/revalidate'

export const Contact: GlobalConfig = {
  slug: 'contact',
  label: 'Contact',
  hooks: {
    afterChange: [() => revalidateGlobal('contact')],
  },
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Fond de page',
      admin: {
        description: 'Image de fond plein écran (style scrim + vignette).',
      },
    },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'vimeoUrl', type: 'text' },
    { name: 'instagramUrl', type: 'text' },
    { name: 'linkedinUrl', type: 'text' },
    { name: 'calComUrl', type: 'text', required: true },
    {
      name: 'egoDuMoiUrl',
      type: 'text',
      label: 'Ego Du Moi (URL)',
      admin: {
        description: 'Site connexe — création jeux de cartes (imagination).',
      },
    },
    {
      name: 'tarotDecrypteUrl',
      type: 'text',
      label: 'Le Tarot Décrypté (URL)',
      admin: {
        description: 'Site connexe — création jeux de cartes (tarot).',
      },
    },
  ],
}

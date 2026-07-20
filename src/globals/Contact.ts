import type { GlobalConfig } from 'payload'

export const Contact: GlobalConfig = {
  slug: 'contact',
  label: 'Contact',
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
  ],
}

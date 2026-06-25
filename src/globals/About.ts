import type { GlobalConfig } from 'payload'

export const About: GlobalConfig = {
  slug: 'about',
  fields: [
    {
      name: 'bio',
      type: 'richText',
      required: true,
      localized: true,
    },
    { name: 'photo', type: 'upload', relationTo: 'media' },
  ],
}

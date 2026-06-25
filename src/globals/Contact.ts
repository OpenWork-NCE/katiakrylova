import type { GlobalConfig } from 'payload'

export const Contact: GlobalConfig = {
  slug: 'contact',
  fields: [
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'vimeoUrl', type: 'text' },
    { name: 'instagramUrl', type: 'text' },
    { name: 'linkedinUrl', type: 'text' },
    { name: 'calComUrl', type: 'text', required: true },
  ],
}

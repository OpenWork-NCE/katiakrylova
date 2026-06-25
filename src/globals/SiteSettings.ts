import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  fields: [
    { name: 'siteName', type: 'text', defaultValue: 'Katia Krylova', required: true },
    { name: 'metaDescription', type: 'textarea' },
    { name: 'ogImage', type: 'upload', relationTo: 'media' },
  ],
}

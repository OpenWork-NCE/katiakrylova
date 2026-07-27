import type { CollectionConfig } from 'payload'
import { revalidatePortfolio } from '../lib/revalidate'

export const PortfolioCategories: CollectionConfig = {
  slug: 'portfolio-categories',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidatePortfolio(typeof doc?.slug === 'string' ? doc.slug : undefined)
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidatePortfolio(typeof doc?.slug === 'string' ? doc.slug : undefined)
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}

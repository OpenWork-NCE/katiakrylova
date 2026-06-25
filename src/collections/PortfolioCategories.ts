import type { CollectionConfig } from 'payload'

export const PortfolioCategories: CollectionConfig = {
  slug: 'portfolio-categories',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}

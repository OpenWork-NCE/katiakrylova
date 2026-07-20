import type { GlobalConfig } from 'payload'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Accueil',
  fields: [
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Image de fond',
      admin: {
        description: 'Fond plein écran de la page d’accueil.',
      },
    },
    {
      name: 'role',
      type: 'text',
      localized: true,
      label: 'Fonction / titre',
      admin: {
        description: 'Ex. Réalisatrice · Artiste visuelle',
      },
    },
    {
      name: 'intro',
      type: 'textarea',
      localized: true,
      label: 'Texte d’intro',
      admin: {
        description: 'Manifeste affiché entre le logo et le bouton d’entrée.',
      },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      localized: true,
      label: 'Libellé du bouton',
      admin: {
        description: 'Ex. Découvrir mon univers',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      label: 'Tagline (legacy)',
      admin: {
        hidden: true,
      },
    },
  ],
}

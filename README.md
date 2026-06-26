# Katia Krylova — Site officiel

Site portfolio professionnel de Katia Krylova, réalisatrice et artiste visuelle.

## Stack
- Next.js 15 (App Router) + TypeScript
- Payload CMS 3
- React Three Fiber (3D)
- Tailwind CSS
- next-intl (FR/EN)
- Vercel + Neon Postgres + Vercel Blob

## Developpement local
```bash
pnpm install
cp .env.example .env.local
# Renseigner DATABASE_URI, PAYLOAD_SECRET, BLOB_READ_WRITE_TOKEN
pnpm dev
```
Site: http://localhost:3000 · Admin: http://localhost:3000/admin

## Commandes
- `pnpm dev` — dev server
- `pnpm build` — build production
- `pnpm typecheck` — TypeScript check
- `pnpm test:e2e` — tests Playwright

## Utilisation du CMS
1. Aller sur `/admin`
2. Se connecter
3. Ajouter/modifier projets, portfolio, journal, making-of
4. Tout changement déclenche un redéploiement automatique

## Workflow de migration de contenu
Le script `scripts/migrate-content.ts` importe le contenu initial (catégories du portfolio, projets) depuis les sources existantes. Le contenu est créé en mode **brouillon** (`draft: true`) afin de ne pas apparaître publiquement tant qu'il n'a pas été relu.

Étapes :
1. Lancer la migration : `pnpm tsx scripts/migrate-content.ts`
   Les projets et catégories sont insérés comme brouillons.
2. Aller sur `/admin`, se connecter, puis ouvrir chaque entrée brouillon.
3. Téléverser la couverture (cover) et la galerie d'images pour chaque projet.
4. Une fois le média en place, **publier** chaque brouillon (bouton « Publish ») pour le rendre visible sur le site.

Tant qu'un brouillon n'est pas publié, il n'apparaît pas dans les lectures publiques du site.

## Scores Lighthouse (mesurés le 2026-06-25)
- Performance: à mesurer
- Accessibility: à mesurer
- Best Practices: à mesurer
- SEO: à mesurer

## Crédits
Site construit avec soin pour Katia Krylova.

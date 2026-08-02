# Katia Krylova — Site officiel

Site portfolio professionnel de Katia Krylova, réalisatrice et artiste visuelle.

## Stack
- Next.js 15 (App Router) + TypeScript
- Payload CMS 3
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
- `pnpm generate:types` — regénère `src/payload-types.ts`
- `pnpm migrate:create` — crée une migration Payload (patche automatiquement les `import type` requis par Node `--experimental-strip-types`)
- `pnpm migrate` — applique les migrations sur `DATABASE_URI`
- `pnpm migrate:status` — état des migrations
- `pnpm migrate:fresh` — drop + recrée la DB (⚠ destructif)

## Utilisation du CMS
1. Aller sur `/admin`
2. Se connecter
3. Ajouter/modifier projets, portfolio, news, making-of
4. Tout changement déclenche un redéploiement automatique

## Workflow de migration de contenu

Migration automatisée depuis l'ancien site (`previousWebsite/` + scrape live du portfolio).

### Préparation (une fois)

```bash
node scripts/extract-portfolio-manifest.mjs   # 100 items portfolio depuis l'ancien site
node scripts/download-portfolio-assets.mjs    # télécharge les images portfolio (HTTP)
node scripts/parse-site-map.mjs               # manifest projets + globals + news
node scripts/copy-assets.mjs                  # copie images vers public/
```

### Import Payload

```bash
pnpm migrate                                  # schéma DB à jour
pnpm migrate:content                          # import complet
```

Options :
- `--dry-run` — simule sans écrire dans Payload
- `--only=globals|portfolio|projects|journal` — section ciblée (journal = news)
- `--project=<slug>` — limite l’import à un projet existant et synchronise sa galerie

Le script importe : globals (home, about, contact), catégories portfolio, réalisations images, projets (covers + galeries + crédits), articles news.

Idempotent : relancer le script ignore les entrées déjà présentes (slug existant).

## Performance & cache (2026-07-27)

Stratégie en place :
- **ISR** `revalidate = 600` sur les pages publiques + `generateStaticParams` pour slugs
- **Data cache** Payload via `unstable_cache` + tags invalidés par hooks CMS (`src/lib/cache.ts`, `src/lib/revalidate.ts`)
- **Média dual** : listes/grilles → dérivés Payload (`card`/`hd`) ; **liseuse portfolio** et **lightbox projets** → **originaux** uniquement
- **CDN** : `Cache-Control` long sur `/fonts/*` et `/images/*` ; `images.minimumCacheTTL` 7j ; AVIF/WebP
- **Fonts** : `next/font` (Architects Daughter + Prestige Elite local), plus de `@import` Google

### Contrainte qualité
Les œuvres en liseuse portfolio (`PortfolioViewer`) et les images en liseuse projets (`ImageLightbox`) restent en **qualité originale** (pas de recompression Next sur le stage principal).

### Scores Lighthouse
- À re-mesurer après déploiement (mobile + desktop : home, projects, portfolio category, project detail)
- Baseline historique (2026-06-25) : non renseignée

## Crédits
Site construit avec soin pour Katia Krylova.

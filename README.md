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

## Scores Lighthouse (mesurés le 2026-06-25)
- Performance: à mesurer
- Accessibility: à mesurer
- Best Practices: à mesurer
- SEO: à mesurer

## Crédits
Site construit avec soin pour Katia Krylova.

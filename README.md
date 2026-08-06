# Katia Krylova — Site officiel

Site portfolio professionnel de **Katia Krylova**, réalisatrice et artiste visuelle (Belgique).  
Public cible : producteurs, festivals, collaborateurs, presse.

**Domaine** : [katiakrylova.com](https://katiakrylova.com) · **Admin CMS** : `/admin`

---

## Stack

| Couche | Techno |
|--------|--------|
| App | Next.js 15 (App Router) + React 19 + TypeScript |
| CMS | Payload 3 (même app Next), Lexical rich text |
| DB | Postgres (Neon en prod) via `@payloadcms/db-postgres` |
| Médias | Vercel Blob (prod) · `public/images` en local |
| i18n | next-intl — `fr` (défaut) / `en`, préfixe URL toujours présent |
| UI | Tailwind CSS + CSS dédiés (`src/styles/`) |
| Hosting | Vercel |
| Package manager | pnpm (`packageManager: pnpm@11`) |

**Non livré** (présent dans d’anciennes specs) : React Three Fiber / couloir 3D « Plan-Séquence ». La signature motion est l’**Iris Blink** (SVG/CSS).

---

## Développement local

```bash
pnpm install
cp .env.example .env.local
# Renseigner DATABASE_URI, PAYLOAD_SECRET
# BLOB_READ_WRITE_TOKEN requis sur Vercel ; optionnel en local
pnpm dev
```

| URL | Rôle |
|-----|------|
| http://localhost:3000 | Site public (`/fr` par défaut) |
| http://localhost:3000/admin | Admin Payload |

### Variables d’environnement

| Variable | Requis | Rôle |
|----------|--------|------|
| `DATABASE_URI` | oui | Postgres |
| `PAYLOAD_SECRET` | oui | Secret CMS (≥ 8 caractères) |
| `NEXT_PUBLIC_SERVER_URL` | oui | URL publique (ex. `http://localhost:3000`) |
| `BLOB_READ_WRITE_TOKEN` | prod Vercel | Stockage médias Vercel Blob |

Validation Zod : `src/lib/env.ts`.

---

## Commandes

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Serveur de dev |
| `pnpm build` / `pnpm start` | Build / run production |
| `pnpm typecheck` | TypeScript sans émission |
| `pnpm test:e2e` | Playwright (parcours signature) |
| `pnpm generate:types` | Régénère `src/payload-types.ts` |
| `pnpm migrate:create` | Nouvelle migration Payload (+ patch `import type`) |
| `pnpm migrate` | Applique les migrations |
| `pnpm migrate:status` | État des migrations |
| `pnpm migrate:fresh` | Drop + recrée le schéma (⚠ destructif) |
| `pnpm migrate:content` | Import / sync contenu depuis les manifests |
| `pnpm portfolio:manifest` | Rebuild du manifest portfolio |
| `pnpm portfolio:replace` | Rebuild manifest + reimport portfolio (`--replace`) |

---

## Architecture du site

### Routes publiques (`/[locale]/…`)

| Route | Contenu |
|-------|---------|
| `/` | Hero cinématique + CTA « Iris » → projets |
| `/projects` | Filmographie scrollable, filtres (texte / formats / années) |
| `/projects/[slug]` | Fiche projet : vidéo (YouTube/Vimeo), galerie, crédits, nav prev/next |
| `/portfolio` | Hub catégories (Acryliques, Collages, Gravures, Linos, Identity) |
| `/portfolio/categorie/[slug]` | Grille + **liseuse** pleine qualité |
| `/about` | Bio + portrait + section vision |
| `/journal` | News (liste type filmographie) |
| `/journal/[slug]` | Fiche article (+ lien projet lié si configuré) |
| `/contact` | Coordonnées, Cal.com, sites liés |
| `/making-of` | Archive optionnelle |

Middleware next-intl : locales `fr` \| `en`, préfixe **always**.  
Hors locale : `/admin`, API Payload, assets statiques.

### Signature UX — Iris Blink

Transitions de page : diaphragme (fermeture → navigation → ouverture).  
Implémentation : `src/components/transitions/` (`PageTransitionProvider`, `IrisWipe`, géométrie testable).  
Intents : `default` · `signature` (CTA accueil) · `locale` (FR/EN).  
`prefers-reduced-motion` : fade court, sans lamelles.

### CMS Payload

**Collections** : `users`, `media`, `projects` (brouillons), `portfolio-categories`, `portfolio`, `journal-entries` (News), `making-of`  
**Globals** : `home`, `about`, `contact`, `journal` (fond de page News), `site-settings`

Hooks `afterChange` / `afterDelete` → `revalidateTag` (`src/lib/revalidate.ts`) pour invalider le cache Next sans redeploy manuel.

### Données & cache

```
Page (revalidate = 600)
  → getX() dans src/lib/payload.ts
    → cachedPayload (unstable_cache + CACHE_TAGS)
```

- ISR 600 s + `generateStaticParams` pour slugs / catégories hub  
- Listes / grilles : dérivés Payload `card` / `hd`  
- **Liseuse portfolio** et **lightbox projets** : **originaux uniquement** (`getMediaUrl(..., 'original')`)  
- CDN : `Cache-Control` long sur `/fonts/*` et `/images/*` ; AVIF/WebP  
- Fonts via `next/font` : **Architects Daughter** (titres) + **Prestige Elite** local (corps)

### News — fond de page

Ordre de résolution du background liste (`src/app/[locale]/(frontend)/journal/page.tsx`) :

1. Cover **hd** de la news la plus récente  
2. Sinon photo du global CMS `journal`  
3. Sinon fallback statique `/images/Plus-de-lait-affiche.jpg`

Les fonds portrait sont ancrés en **bas** (`background-position: center bottom`) pour garder le bas d’affiche visible au crop full-bleed.

### Vidéos YouTube

Certaines vidéos age-restricted cassent l’embed tiers.  
API `GET /api/youtube-embed-status?id=…` + cascade Invidious / carte de repli dans `VideoEmbed`.

---

## Utilisation du CMS

1. Ouvrir `/admin` et se connecter  
2. Éditer projets, portfolio, news, making-of, globals (home / about / contact / journal)  
3. Les hooks Payload invalidant les tags de cache ; le site se met à jour (ISR + on-demand revalidation)

---

## Migration de contenu (ancien site → Payload)

Référence : `previousWebsite/` (site-map + images).  
Manifests : `scripts/data/{portfolio,projects,globals}-manifest.json`.

### Préparation (une fois / quand les sources changent)

```bash
node scripts/extract-portfolio-manifest.mjs   # items portfolio
node scripts/download-portfolio-assets.mjs    # télécharge images HTTP
node scripts/parse-site-map.mjs               # projets + globals + news
node scripts/copy-assets.mjs                  # copie vers public/images
# ou
pnpm portfolio:manifest
```

### Import / sync

```bash
pnpm migrate                                  # schéma DB
pnpm migrate:content                          # import complet
```

Options :

| Flag | Effet |
|------|--------|
| `--dry-run` | Simule sans écrire |
| `--only=globals\|portfolio\|projects\|journal` | Section ciblée (`journal` = news) |
| `--project=<slug>` | Un seul projet + sa galerie |
| `--replace` | Purge puis réimport portfolio (avec `portfolio:replace`) |

**Comportement** :

- Création si le slug n’existe pas  
- **Journal / globals** : mise à jour des entrées existantes depuis le manifest (titre, cover, contenu, liens)  
- Médias : upload idempotent par nom de fichier (`scripts/lib/upload-media.ts`) — un **nouveau** fichier = nouveau nom pour forcer l’upload

Exemple affiche News *Plus de lait* :

- Asset : `public/images/Plus-de-lait-affiche.jpg`  
- Manifest : `coverImage` + `journalPage.photo`  
- Sync : `pnpm migrate:content -- --only=journal` puis `--only=globals` si besoin du fond global

---

## Structure du dépôt (essentiel)

```
src/
  app/                 Routes (site locale + Payload admin/API + youtube status)
  collections/         Schémas Payload
  globals/
  components/          about, contact, home, journal, layout, portfolio, projects, transitions, ui
  lib/                 payload, cache, media utils, video, fonts, env
  i18n/                fr.json / en.json
  styles/              CSS pages (about, journal, iris-wipe, projects…)
  migrations/          Migrations DB Payload
scripts/               Migration contenu + manifests
public/images/         Assets statiques / seed
previousWebsite/       Archive de l’ancien WordPress
docs/superpowers/      Plans & specs de design (historique + livré)
tests/                 Playwright e2e + petits tests unitaires
```

---

## Documentation design

Voir [`docs/README.md`](docs/README.md) pour l’index des specs/plans et ce qui est **livré** vs **historique / non implémenté**.

---

## Performance

- Stratégie détaillée : § cache ci-dessus + plan `docs/superpowers/plans/2026-07-27-performance-cache-optimization.md`  
- Lighthouse : à re-mesurer après déploiement (home, projects, portfolio catégorie, project detail — mobile + desktop)

---

## Crédits

Site construit avec soin pour Katia Krylova · Digital House Company

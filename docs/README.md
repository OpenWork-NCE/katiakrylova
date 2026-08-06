# Documentation projet

Index des documents de conception et de planification.  
Le **README racine** décrit l’état **livré** du code. Les fichiers ci-dessous sont des specs / plans de travail : certains ont été implémentés tels quels, d’autres ont été simplifiés ou abandonnés.

## État vs codebase (résumé)

| Sujet | Statut dans le code |
|-------|---------------------|
| Next.js 15 + Payload 3 + next-intl FR/EN + Vercel/Neon/Blob | **Livré** |
| Design system sombre / oxblood, film grain | **Livré** |
| Iris Blink (transitions page + CTA home) | **Livré** (SVG/CSS, pas R3F) |
| Filmographie projets (scroll 2D + filtres) | **Livré** |
| Portfolio hub → catégories → liseuse originaux | **Livré** |
| About (bio, portrait sticky, vision) | **Livré** |
| News / journal + fond dynamique + poster *Plus de lait* | **Livré** |
| Contact + Cal.com + sites liés | **Livré** |
| Cache ISR + tags Payload + médias dual | **Livré** |
| Couloir 3D « Plan-Séquence » (R3F) | **Non livré** — remplacé par liste scroll |
| Diaphragme Three.js / GSAP / son | **Non livré** — iris 2D ; son retiré |
| Homemade Apple / Special Elite | **Remplacé** par Architects Daughter + Prestige Elite |

## Specs (`docs/superpowers/specs/`)

| Fichier | Contenu | Note |
|---------|---------|------|
| [2026-06-25-katiakrylova-redesign-design.md](./superpowers/specs/2026-06-25-katiakrylova-redesign-design.md) | Vision globale refonte, IA, design system initial | Historique — stack 3D / polices Google dépassées |
| [2026-06-28-plan-sequence-gallery-corridor-design.md](./superpowers/specs/2026-06-28-plan-sequence-gallery-corridor-design.md) | Couloir 3D musée | **Non implémenté** |
| [2026-07-25-innuit-project-formats-design.md](./superpowers/specs/2026-07-25-innuit-project-formats-design.md) | Formats multi-valeurs projets | **Livré** (`format` hasMany) |
| [2026-07-27-iris-blink-transitions-design.md](./superpowers/specs/2026-07-27-iris-blink-transitions-design.md) | Signature Iris Blink | **Livré** (sans son) |

## Plans (`docs/superpowers/plans/`)

| Fichier | Contenu | Note |
|---------|---------|------|
| [2026-06-25-katiakrylova-redesign.md](./superpowers/plans/2026-06-25-katiakrylova-redesign.md) | Plan d’implémentation initial (SDD) | Exécuté ; évolutions post-plan sur `main` |
| [2026-06-28-plan-sequence-gallery-corridor.md](./superpowers/plans/2026-06-28-plan-sequence-gallery-corridor.md) | Plan couloir 3D | **Abandonné** au profit du scroll 2D |
| [2026-07-25-about-page-restructure.md](./superpowers/plans/2026-07-25-about-page-restructure.md) | Restructuration About | **Livré** (typo affinée ensuite) |
| [2026-07-25-innuit-project-formats.md](./superpowers/plans/2026-07-25-innuit-project-formats.md) | Formats Innuit | **Livré** |
| [2026-07-27-performance-cache-optimization.md](./superpowers/plans/2026-07-27-performance-cache-optimization.md) | ISR, cache tags, dual media | **Livré** |

## Archive ancien site

`previousWebsite/` — cartographie et assets de l’ancien WordPress, source des scripts de migration (`scripts/`). Voir aussi `previousWebsite/README.md`.

## Convention

- **Modifier le README racine** pour tout changement de comportement livré (routes, cache, CMS, commandes).  
- **Ajouter une spec/plan** dans `docs/superpowers/` pour les designs non triviaux, puis marquer le statut dans ce fichier une fois mergé.

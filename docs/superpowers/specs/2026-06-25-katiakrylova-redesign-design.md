# Katia Krylova — Refonte du site

**Date** : 2026-06-25
**Statut** : Design validé, prêt pour le plan d'implémentation
**Auteur** : brainstorming collaboratif avec le propriétaire du site

---

## 1. Vision & identité

**Katia Krylova** est une cinéaste / artiste visuelle belge. Son site est une **vitrine professionnelle** destinée aux producteurs, festivals, agents et presse.

**Identité de marque** : « Katia Krylova » uniquement (le nom civil « Katia Fontaine » est abandonné publiquement).

**Domaine cible** : `katiakrylova.com`.

**Promesse du nouveau site** :

- Plus rapide (statique, CDN mondial)
- Plus beau (cinématique sombre, immersif)
- Plus mémorable (grille 3D « Plan-Séquence » et diaphragme 3D comme signature)
- Plus maintenable (CMS moderne, contenu structuré)
- Plus professionnel (HTTPS, multilingue, calendrier de RDV intégré)

**Publics visés** :

- Producteurs / festivals : voient la filmographie pro, peuvent booker un RDV
- Artistes / collaborateurs : voient le style, comprennent l'univers
- Presse : trouvent bio + portfolio rapidement

**Hors périmètre** (YAGNI) : newsletter, e-commerce, commentaires, app mobile, authentification publique.

---

## 2. Architecture technique

### Frontend (Next.js 15 App Router)

- Rendu statique (SSG) ou ISR
- TypeScript strict
- Tailwind CSS pour le styling de base
- CSS Modules pour les composants complexes (grille 3D)
- `next-intl` pour le i18n FR / EN
- **React Three Fiber** + `@react-three/drei` pour la 3D (choisi sur Three.js vanilla car déclaratif et intégré nativement à React/Next)
- `lottie-react` pour les micro-animations
- `sharp` pour l'optimisation des images
- `yet-another-react-lightbox` pour les galeries

### CMS (Payload 3)

- Auto-hébergé dans le même repo Next.js (Payload 3 est Next-natif)
- TypeScript-first : types auto-générés consommés par le frontend
- Postgres via Neon (serverless, gratuit jusqu'à 0.5 GB)
- Médias stockés sur Vercel Blob (ou Cloudflare R2)
- Interface admin à `/admin`
- Auth simple (email + password)

### Déploiement

- **Vercel** (hosting Next.js + Payload)
- **Neon** : Postgres serverless
- **Vercel Blob** : stockage des images/vidéos
- **Domaine** : `katiakrylova.com` configuré sur Vercel
- **Cal.com** : iframe de booking dans `/contact`

### CI/CD

- GitHub → Vercel : auto-deploy sur `main`
- Preview URL automatique par PR
- Lint + typecheck en pre-commit (Husky) et sur CI (GitHub Actions)

### Tests (strict minimum)

- **E2E Playwright** : un seul test couvre le parcours signature `accueil → diaphragme → portfolio 3D → hover → click → page projet`
- Tests manuels : i18n FR ↔ EN, responsive, Cal.com embed
- **Lighthouse** : lancé une fois en local pour vérifier les scores, noté dans le README (pas de CI)

---

## 3. Architecture de l'information

### Pages principales

| Route | Contenu |
|-------|---------|
| `/` | Hero (image signature + intro) |
| `/about` | Bio poétique |
| `/projects` | Grille 3D « Plan-Séquence » des **films** |
| `/projects/[slug]` | Page projet individuelle (cinéma pur, images fixes, pas d'embed vidéo) |
| `/portfolio` | Grille des **réalisations images** catégorisées |
| `/portfolio/[slug]` | Page portfolio individuelle |
| `/making-of` | Galerie making-of (optionnel, vide initialement) |
| `/journal` | Liste éditoriale d'articles |
| `/contact` | Coordonnées + Cal.com embed |

### Header / Navigation

- Logo `katia_krylova.png` à gauche (depuis `previousWebsite/katia_krylova.png`)
- Liens à droite : Projects / Portfolio / About / Journal / Contact
- Switch de langue `FR | EN` en haut à droite
- Sur mobile : menu burger avec animation slide-in

### Footer

- Email + téléphone (cliquables)
- Liens sociaux : Vimeo, Instagram, LinkedIn (si pertinent)
- Copyright + année
- Petit texte « Site construit avec soin »

### 404

- Image signature + « Cette page n'existe pas » + lien retour

### i18n

- Préfixe de locale : `/fr/...` et `/en/...`
- Détection auto via cookie Accept-Language (fallback : `fr`)
- Tout le contenu éditorial (projets, bio, journal) a versions FR et EN
- Éléments d'UI traduits via fichiers `messages/fr.json` et `messages/en.json`

---

## 4. Design system

### Palette de couleurs (cinématique sombre + carnet)

| Token | Valeur | Usage |
|-------|--------|-------|
| `--bg-primary` | `#0a0a0a` | Fond principal |
| `--bg-secondary` | `#141414` | Cartes, surfaces élevées |
| `--text-primary` | `#f5f1ea` | Texte principal (blanc cassé chaud) |
| `--text-muted` | `#8a8580` | Sous-titres, métadonnées |
| `--accent` | `#8b2e2e` | Rouge oxblood (signature, liens, hover) |
| `--border` | `#1f1f1f` | Séparateurs subtils |

### Typographie

- **Titres** : `Homemade Apple` (Google Fonts) — manuscrite authentique, lisible, ton carnet
- **Corps** : `Special Elite` (Google Fonts) — typewriter, évoque scénario, presse cinéma
- **Hiérarchie** :
  - Hero H1 : Homemade Apple, 10vw, manuscrit signature
  - H2 sections : Homemade Apple, 5vw
  - H3 cartes : Special Elite bold, uppercase
  - Body : Special Elite, 1rem, line-height 1.7
  - Crédits / métadonnées : Special Elite small caps

### Espacements

- Système 8px : `xs=4`, `sm=8`, `md=16`, `lg=32`, `xl=64`, `2xl=128`
- Sections : padding vertical `xl` à `2xl`

### Effets cinéma (overlay global)

- Grain de film subtil (composante React `<div>` absolute, opacité 0.05)
- Vignettage sur les images importantes
- Glow doux derrière les images featured
- Transitions « wipe » (pas fade) entre sections

### Animations

- Transitions de page : fade + slide léger (300-500ms)
- Hover sur cartes projet : zoom 1.05 + reveal couleur (300ms ease-out)
- Grille 3D : inertia + damping (R3F `useFrame`)
- Micro-interactions Lottie : bouton « Enter » du hero

---

## 5. Expériences 3D

### 5.1 Le diaphragme 3D — signature du site

**Concept** : Le site est cadré par un diaphragme 3D (les lamelles d'un objectif photographique/cinéma) qui s'ouvre et se ferme à chaque transition. L'utilisateur est « à l'intérieur de l'appareil ».

**Implémentation** (R3F + Drei)

- 8 lamelles triangulaires organisées en cercle (forme d'iris)
- Animation GSAP : lamelles se rétractent en spirale (1.2s) pour ouvrir
- Inverse : lamelles s'expandent pour fermer
- Pendant l'ouverture : effet `DepthOfField` (Drei) qui passe de flou à net
- Son : léger « clac » d'obturateur (optionnel, désactivable)

**Où ça s'applique** :

- Page d'accueil → portfolio : diaphragme s'ouvre sur le couloir « Plan-Séquence »
- Portfolio → projet : diaphragme se ferme (cut to black) puis s'ouvre sur la page projet
- Projet → portfolio : idem en sens inverse
- Navigation entre sections : micro-diaphragme (0.4s)

**Performance / accessibilité** :

- 8 plans + 1 shader simple = coût GPU négligeable
- Fallback : si WebGL indisponible, fade simple
- `prefers-reduced-motion` : fade simple à la place (pas d'animation 3D)

### 5.2 Le couloir 3D « Plan-Séquence » — page portfolio

**Concept** : Vous entrez dans un long couloir 3D obscur, légèrement courbe (arc de cercle, comme un travelling dans un musée). Les 20 projets sont suspendus dans l'espace, arrangés sur plusieurs rangées à différentes profondeurs.

**Implémentation** (R3F + Drei)

- Une scène 3D plein écran (`<Canvas>`)
- Cartes-projets : planes géométriques avec image texture
- Disposition :
  - 4 rangées en Z (depth) : `z = -6, -2, 2, 6`
  - 5 colonnes en X : `x = -8, -4, 0, 4, 8`
  - Courbe douce (spline) plutôt qu'axe droit
- Caméra positionnée à `z = 8`, regardant vers l'origine
- Effet de « tunnel » : fog (Drei `<Fog>`) sur les rangées du fond
- **Rails du dolly** visibles au sol, subtilement éclairés (signature « making of » révélée)

**État initial**

- Projet featured au focus : c'est le **premier projet de la rangée la plus proche** (z = +6), colonne centrale (x = 0). Image HD, titre, année visibles
- Projets adjacents (autres colonnes de la rangée avant) : en perspective, légèrement flous (depth of field)
- Projets sur les rangées arrière (z = +2, -2, -6) : de plus en plus effacés par le fog
- Au démarrage, la caméra est positionnée de sorte que le premier projet featured occupe la moitié inférieure de l'écran (composition cinéma, règle des tiers)

**Interactions**

- **Scroll vertical** : la caméra translate en Z (parcours le couloir, travelling avant/arrière)
- **Souris** : parallaxe ±5° sur la caméra (inclinaison légère)
- **Hover** sur une carte : carte s'avance de 1 unité, devient nette, autres s'estompent
- **Click** : transition diaphragme 3D → page projet
- **Indicateur timecode** : `01 / N` en bas à droite (où N est le nombre total de projets, calculé dynamiquement par Payload), Special Elite small caps, opacity 0.7
  - Mise à jour en temps réel selon le scroll : affiche l'index du projet featured courant

**Scalabilité**

- Le couloir n'est pas limité à 20 projets
- Virtualisation : on ne rend que les ~7 projets proches de la caméra
- Les bornes Z sont calculées dynamiquement selon le nombre de projets
- Payload permet l'ajout illimité sans changement de code

**Ambiance**

- Fond noir profond avec fog volumétrique
- Particules de poussière flottantes (sprite system custom, opacité faible)
- Grain de film (overlay global, voir design system)
- Léger bloom (Drei) sur les cartes featured

**Performance**

- `frameloop="demand"` pour économiser le GPU hors interaction
- Images via `next/image` avec loader spécial pour textures Three.js
- Lazy load des textures hors fenêtre
- Fallback 2D : grille masonry CSS si WebGL indisponible

**Accessibilité**

- `prefers-reduced-motion` : grille statique, pas de parallaxe ni d'inertie
- Navigation clavier : Tab entre cartes, Enter pour ouvrir
- Lecteur d'écran : `<ul>` sémantique des projets, 3D = enhancement progressif

### 5.3 Page projet individuelle

**Layout** (single-page, scroll vertical) :

1. **Hero plein écran** : image principale du projet, fit-cover. Titre en bas à gauche (Homemade Apple, 6vw). Format + année en small caps (ex: « Court-métrage · 2021 »). Bouton « Retour aux projets » en haut à droite (flèche).
2. **Synopsis** : bloc max 60ch, Special Elite corps. 2-4 phrases.
3. **Galerie principale** :
   - Toutes les images du projet
   - Layout **masonry** sur 2-3 colonnes desktop, 1 colonne mobile
   - Click = lightbox (`yet-another-react-lightbox`)
   - Hover = zoom 1.03
   - Caption optionnel en Special Elite small
4. **Crédits** : bloc label-valeur, Special Elite, deux colonnes
5. **Vidéos externes** (optionnel) : si Vimeo/YouTube, **lien externe** (pas d'embed) : « ▶ Voir sur Vimeo » → nouvel onglet
6. **Navigation prev/next** : grandes flèches (← →) avec thumbnails des projets adjacents (comme un clap de cinéma qui se ferme)

**Animations** : fade-in au scroll (Intersection Observer), wipe cinéma entre projets, parallaxe léger sur le hero.

**Bonus « case study »** (opt-in via CMS) : champ `caseStudy: richText` pour les projets avec making-of détaillé.

---

## 6. Modèle de données (Payload CMS)

### Collection : `projects` (films et courts-métrages)

| Champ | Type | Notes |
|-------|------|-------|
| `title` | text | i18n, required |
| `slug` | text | required, unique, auto-generated |
| `year` | number |
| `format` | select | `Court-métrage`, `Clip`, `Performance`, `Documentaire`, `Essai expérimental`, `Making Of` |
| `description` | textarea | synopsis court, i18n |
| `credits` | array `{role, name}` | i18n |
| `coverImage` | upload | 16:9, required |
| `gallery` | array uploads | ordre manuel |
| `externalLinks` | array `{platform, url}` | Vimeo/YouTube, lien externe pas embed |
| `caseStudy` | richText | i18n, opt-in |
| `featured` | bool | pour accueil |
| `order` | number | ordre dans le couloir |
| `publishedAt` | date | auto |

### Collection : `portfolio` (réalisations images catégorisées)

| Champ | Type | Notes |
|-------|------|-------|
| `title` | text | i18n, required |
| `slug` | text | required, unique |
| `category` | relation → `portfolio-categories` | |
| `year` | number | |
| `coverImage` | upload | |
| `images` | array uploads | ordre manuel |
| `description` | textarea | i18n |
| `order` | number | |
| `publishedAt` | date | |

### Collection : `portfolio-categories`

| Champ | Type | Notes |
|-------|------|-------|
| `name` | text | i18n (ex: Collage, Gravure, Identity, Letter) |
| `slug` | text | |
| `order` | number | |

### Collection : `journal-entries`

| Champ | Type | Notes |
|-------|------|-------|
| `title` | text | i18n |
| `slug` | text | |
| `excerpt` | textarea | i18n |
| `content` | richText | i18n |
| `coverImage` | upload | |
| `publishedAt` | date | |

### Collection : `making-of`

| Champ | Type | Notes |
|-------|------|-------|
| `title` | text | i18n |
| `slug` | text | |
| `year` | number | |
| `coverImage` | upload | |
| `content` | richText | i18n |
| `gallery` | array uploads | |
| `publishedAt` | date | |

### Collection : `media`

- Gérée par Payload
- Storage Vercel Blob
- Auto-génération de thumbnails
- Métadonnées : alt, dimensions, focal point

### Collection : `users`

- Email + password
- Rôle : `admin` (Katia) ou `editor` (collaborateur ponctuel)

### Globals (singletons)

- `about` : bio poétique (richText, i18n)
- `contact` : email, téléphone, liens sociaux (i18n)
- `home` : hero image, intro tagline (i18n)
- `site-settings` : nom du site, descriptions meta, SEO defaults

**Distinction projects vs portfolio** :

- `projects` = films / courts-métrages avec synopsis, crédits, gallery, vidéos externes
- `portfolio` = réalisations images (Collage, Gravure, Identity, Letter) catégorisées
- Les deux collections sont **indépendantes** : ajouter un `project` (film) ≠ ajouter un `portfolio` (réalisation image)

---

## 7. Pages secondaires

### Making Of (`/making-of`)

- Collection Payload dédiée
- Layout : hero image + texte éditorial + galerie masonry
- Lien dans le footer (pas la nav principale)
- Initialement vide, accessible sans contenu bloquant
- Katia remplira au fil du temps

### Journal (`/journal`)

- Collection `journal-entries`
- Layout : liste éditoriale style « magazine »
- Date + titre + excerpt visibles en liste
- Click → page article avec richText rendu
- Lien dans le footer (pas la nav principale)
- Optionnellement seedé avec 1-2 billets d'exemple (à la demande de Katia)

### Contact (`/contact`)

- **Minimaliste** : pas de formulaire custom
- Coordonnées directes : email, téléphone (cliquables)
- Liens sociaux : Vimeo, Instagram, LinkedIn (si pertinent)
- **Cal.com embed** (iframe) pour la prise de RDV

---

## 8. Contenu initial à migrer

Depuis `previousWebsite/` :

- **20 projets** depuis `site-map/*.md` + `images/` :
  - la-tache-noire, casting, yadel, cine-palace, presentation-teresa-1, teresa-viesti, light-vador, strangers, la-petite-faucheuse, seconde-papillon, paphius, alice-au-pays-des-ombres, hip-hop-de-rue, manacao, la-beaute-du-geste, que-faire-avec-innuit-siniswichi, le-mariage-campagnard, la-robe-ragot, hero-zero, + récents (Capture d'écran 2025)
- **Bio poétique** depuis `site-map/about.md` :
  > Voir est mon plus grand péché, depuis toute petite. Manger avec gourmandise les images, les couleurs, les ombres, les vides. Voir pour savoir, connaître, faire connaissance avec l'œil.
  > Une image, deux images, une séquence de lumière et d'ombre. Collant à la chose filmée ou s'en décollant. Toute en subjectivité, je les peins, les triture, les malaxe, les desserre de leur étreinte « collet monté ».
  > Vision triple, sonde cérébrale, flash affectif, projection d'amour. Je vous laisse découvrir mes hantises, mes fantasmes, mes angoisses et mes joies.
- **Coordonnées** depuis `site-map/contact.md` :
  - Katia Krylova (nom public)
  - +32(0)474 468 168
- **129 images** depuis `previousWebsite/images/`
- **Logo** : `previousWebsite/katia_krylova.png`
- **Vidéos externes** : URLs YouTube/Vimeo référencées dans les fiches projets (à entrer dans `externalLinks`, pas d'embed)

---

## 9. Décisions clés (récap)

| Décision | Choix | Raison |
|----------|-------|--------|
| Identité | « Katia Krylova » uniquement | Nom artistique international, mémorable |
| Langues | FR + EN | Couverture Belgique + festivals internationaux |
| Direction visuelle | Cinématique sombre | Cohérent avec métier de cinéaste |
| Stack | Next.js + Payload + R3F + Lottie | Moderne, performant, maintenable |
| Hébergement | Vercel | Standard industrie, auto-deploy, CDN |
| CMS | Payload 3 | TypeScript-first, intégré Next, auto-hébergé |
| 3D | React Three Fiber | Déclaratif, intégration React native |
| Signature 3D | Diaphragme 3D | Concept ciné unique, unifie toutes les transitions |
| Grille portfolio | Plan-Séquence 3D (couloir courbe) | Métaphore travelling cinéma |
| Polices | Homemade Apple (titres) + Special Elite (corps) | Manuscrit + carnet de tournage |
| Couleur accent | Rouge oxblood `#8b2e2e` | Signature, cote de scénario |
| Vidéos projet | Liens externes (pas d'embed) | Performance + respect préférence utilisateur |
| Sections | Hero, About, Projects, Portfolio, Making Of, Journal, Contact | YAGNI, basé sur assets réels |
| Tests | 1 test E2E signature + manuels | Strict nécessaire |
| Press, Awards | Exclus | Pas de données existantes |

---

## 10. Livrables

À la fin de l'implémentation, le propriétaire obtient :

1. Code source complet (Next.js + Payload) dans le repo
2. Site déployé sur Vercel + domaine `katiakrylova.com` configuré
3. CMS Payload accessible à `/admin` avec collections configurées
4. Contenu initial migré (20 projets + bio + contact)
5. Documentation : README + guide d'utilisation CMS
6. 1 test E2E Playwright passant
7. Scores Lighthouse notés dans le README

---

## 11. Prochaines étapes

1. **Écrire le plan d'implémentation** via le skill `writing-plans`
2. **Implémenter** étape par étape avec checkpoints
3. **Déployer** sur Vercel
4. **Migrer** le contenu initial
5. **Vérifier** le parcours signature avec Playwright
6. **Livrer**
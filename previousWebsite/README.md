# Katia Krylova — Archive de l’ancien site (référence migration)

**Statut** : archive figée pour la refonte.  
**Ancien site** : http://www.katiakrylova.com/ (WordPress, HTTPS non fiable).  
**Site livré** : Next.js + Payload — voir le [README racine](../README.md) et [`docs/README.md`](../docs/README.md).

## Fichiers

| Fichier | Usage |
|---------|-------|
| **INDEX.md** | Cartographie : navigation, chaque page avec images et vidéos |
| **site-map/{slug}.md** | Fiche détaillée par page (images, rôle, vidéos, texte, crédits) |
| **images/** | Images HD extraites (seed / comparaison) |

## Résumé de l’ancien site

- **Type** : Portfolio de réalisatrice / artiste visuelle  
- **CMS** : WordPress + thème « Producer »  
- **Pages** : 6 pages principales + ~20 projets  
- **Contenu** : Films courts, projets artistiques, mode, danse  
- **Média** : Images + vidéos YouTube / Vimeo

## Lien avec le code actuel

Les scripts `scripts/parse-site-map.mjs`, `extract-portfolio-manifest.mjs`, `copy-assets.mjs` et `migrate-content` s’appuient sur cette archive (et les manifests dans `scripts/data/`) pour peupler Payload.

Ne pas éditer ces fiches comme source de vérité du site en production — le contenu live est dans le CMS (`/admin`) et les manifests versionnés.

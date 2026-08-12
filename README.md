# CytoLight — thème Shopify

Thème de la boutique `cytolight.myshopify.com` (thème live : « CytoLight Theme v4 »).

## Déploiement

La branche `main` est synchronisée avec le thème live par l'**intégration GitHub native de Shopify**
(Online Store → Themes → Connect from GitHub). Aucun token, aucun workflow CI : **merger sur `main`, c'est déployer.**

Shopify refuse tout thème dépassant **50 Mo**.

## Où vont les images

C'est la règle qui a fait dépasser la limite une première fois. Elle tient en une ligne :
**`assets/` ne contient ni photo ni visuel marketing.**

| | Emplacement | Filtre Liquid |
|---|---|---|
| CSS, JS, icônes d'interface | `assets/` (dans le dépôt) | `{{ 'theme.css' \| asset_url }}` |
| Photos, visuels marketing, éditorial | **Content → Files** (CDN Shopify) | `{{ 'photo.jpg' \| file_url }}` |
| Visuels qu'un non-technique doit pouvoir changer | Content → Files, via un réglage `image_picker` | `{{ section.settings.mon_image \| image_url: width: 1200 }}` |

### Ajouter un visuel

1. L'uploader dans **Content → Files** depuis l'admin Shopify.
2. Vérifier le nom retourné par Shopify : si un fichier du même nom existe déjà, il est suffixé
   (`photo.jpg` → `photo_1.jpg`). C'est ce nom-là, exactement, qu'attend `file_url`.
3. Le référencer avec `{{ 'ce-nom.jpg' | file_url }}`.

`file_url` renvoie une URL protocol-relative, utilisable telle quelle dans un `src` comme dans un
`background-image: url(...)`.

> `shopify://shop_images/...` ne se résout **que** dans les fichiers de réglages JSON
> (`config/settings_data.json`, `templates/*.json`), alimentés par des réglages `image_picker`.
> Ce n'est pas une URI utilisable directement en Liquid.

### Ordre des opérations

Un fichier doit être **dans Files avant** que le code qui le référence n'arrive sur `main`.
Sinon le merge déploie une image cassée en production.

## Travail en local

Copier `.env.example` en `.env.local`, puis :

```bash
shopify auth login
```

Prévisualiser sur un thème de développement non publié (ne touche pas au live) :

```bash
shopify theme dev --store cytolight.myshopify.com
```

Valider le Liquid :

```bash
shopify theme check
```

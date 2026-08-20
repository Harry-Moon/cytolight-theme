# CytoLight — thème Shopify

Thème sur mesure de la boutique CytoLight (luminothérapie rouge). Liquid, CSS et JS écrits à la main,
sans framework ni build. Ce qui est dans le dépôt est ce qui est servi.

## Déploiement — à lire avant toute modification

`main` est synchronisée avec le **thème live** par l'intégration GitHub native de Shopify. Il n'y a ni
workflow CI ni token : **ce qui arrive sur `main` part en production.**

Conséquences pratiques :

- Tout passe par une PR. Pas de push direct sur `main`.
- Un fichier référencé par le code doit exister **avant** le merge, pas après.
- Shopify refuse tout thème dépassant **50 Mo**.

## Structure

| Dossier | Contenu |
|---|---|
| `sections/` | Sections de page. `main-product.liquid` (1500 lignes) et `cytolight-home.liquid` portent l'essentiel du contenu éditorial. |
| `snippets/` | Fragments réutilisables (`product-card`, `icon`, `cytolight-device-card`). |
| `templates/` | Points d'entrée. `index.liquid` appelle `cytolight-home` ; `product.json`, `collection.json` et `cart.json` référencent les sections `main-*`. |
| `layout/` | `theme.liquid` (enveloppe globale) et `password.liquid`. |
| `assets/` | **CSS et JS uniquement** — voir la convention ci-dessous. |
| `config/` | `settings_schema.json` (définitions) et `settings_data.json` (valeurs, auto-généré). |

`theme.css` porte les styles globaux et la palette ; `cytolight-cinematic.css` / `.js` gèrent les
animations au scroll de la page d'accueil.

## Convention images

**`assets/` ne contient aucune image.** Ce dossier est réservé au CSS, au JS et aux éléments d'interface.

| Type de fichier | Emplacement | Référence Liquid |
|---|---|---|
| CSS, JS | `assets/` | `{{ 'theme.css' \| asset_url }}` |
| Photo, visuel marketing, éditorial | Content → Files | `{{ 'photo.jpg' \| file_url }}` |
| Visuel modifiable par un non-technique | Content → Files, via `image_picker` | `{{ section.settings.image \| image_url: width: 1200 }}` |

Deux raisons : le plafond de 50 Mo, et le fait que Git ne sache pas fusionner deux versions d'un binaire.
Le thème avait atteint 59,4 Mo avant la migration ; il fait aujourd'hui environ 500 Ko.

Pour ajouter un visuel :

1. L'uploader dans Content → Files depuis l'admin Shopify — cette étape ne peut pas être automatisée
   depuis le dépôt, elle demande une action manuelle.
2. Relever le nom retourné par Shopify. En cas de doublon il est suffixé (`photo.jpg` → `photo_1.jpg`),
   et `file_url` sur le nom d'origine pointerait dans le vide.
3. Le référencer avec `{{ 'ce-nom.jpg' | file_url }}`.

`file_url` renvoie une URL protocol-relative, utilisable telle quelle dans un `src` comme dans un
`background-image: url(...)`.

> `shopify://shop_images/...` ne se résout que dans les fichiers de réglages JSON, alimentés par des
> réglages `image_picker`. Ce n'est pas une URI utilisable directement en Liquid.

## Langues

Le thème n'utilise pas les fichiers de traduction pour son contenu éditorial. Chaque section dérive un
booléen depuis la locale, puis inline les langues :

```liquid
{%- assign is_fr = false -%}
{%- if request.locale.iso_code contains 'fr' -%}
  {%- assign is_fr = true -%}
{%- endif -%}

{% if is_fr %}Récupération{% else %}Recovery{% endif %}
```

Le thème est **bilingue FR / EN partout, sauf `header.liquid`** qui gère en plus le portugais via un
booléen `is_pt`. Tout texte ajouté doit couvrir les langues du fichier modifié — vérifier lesquelles
avant d'écrire plutôt que de le supposer.

Les accents sont écrits en entités HTML (`&eacute;`) dans les sections existantes. S'aligner sur le
fichier modifié.

## Contenu conditionné au produit

`main-product.liquid` sert toutes les fiches produit et bascule son contenu éditorial selon le handle,
via des booléens dérivés en début de section : `is_cap` (`cytolight-cap`), `is_pano_ultra`
(`cytolight-pano-ultra`) et `is_foot` (`cytolight-foot`). Les autres handles — `cytolight-desk`,
`cytolight-pano-plus` — retombent sur la branche par défaut.

Une modification dans ce fichier doit être vérifiée sur **chaque** variante, pas seulement celle en cours.

## Espace Learn

Sept pages éditoriales plus le blog, regroupées sous l'entrée **Apprendre / Learn** du mega-menu.
L'espace fusionne deux lots de contenu : les pages rédigées dans l'admin (`wavelengths`, `how-to-use`,
`faq`, `academy`) et les sections Liquid écrites dans le thème.

| Page (handle) | Gabarit | Section | Contenu porté par |
|---|---|---|---|
| `academy` | `page.academy.liquid` | `learn-hub` | le thème |
| `comment-ca-marche` | `page.comment-ca-marche.liquid` | `learn-how-it-works` | le thème |
| `wavelengths` | `page.wavelengths.liquid` | `learn-wavelengths` | le thème |
| `science` | `page.science.liquid` | `learn-science` | le thème |
| `how-to-use` | `page.how-to-use.liquid` | — (contenu admin) | l'admin |
| `faq` | `page.faq.liquid` | — (contenu admin) | l'admin |
| `nos-valeurs` | `page.nos-valeurs.liquid` | `learn-values` | le thème |
| blog | `blog.liquid`, `article.liquid` | — | l'admin |

**Les gabarits doivent être assignés à la main dans Content → Pages, après le merge.** Le sélecteur
« Theme template » de l'admin ne liste que les gabarits du thème **publié** : tant que la PR n'est pas
mergée, `page.science` & co. n'y apparaissent pas. Le thème ne peut pas créer les pages.

Les handles sont ceux réellement créés en boutique, d'où le mélange FR / EN (`comment-ca-marche`,
`nos-valeurs` d'un côté, `wavelengths`, `science`, `faq` de l'autre). Shopify ne dérive le handle du
titre **qu'à la création** : renommer le titre d'une page existante ne change jamais son URL, elle se
corrige dans *Search engine listing → Edit → URL handle*.

`snippets/learn-nav.liquid` est la **source unique** des URL et des libellés de la sous-navigation
(trilingue FR / EN / PT). Il ne rend plus que la barre collante des pages Learn : les variantes
`header` et `mobile` ont été retirées, le mega-menu de `header.liquid` porte l'entrée Apprendre et
deux menus concurrents s'affichaient. Un handle qui change ne se corrige qu'à cet endroit — sauf dans
`header.liquid`, où les liens du mega-menu sont écrits en dur comme le reste de la navigation.

`assets/learn.css` et `learn.js` ne sont chargés que par ces gabarits. Le CSS ne masque **jamais**
rien de lui-même : c'est `learn.js` qui pose `is-armed` sur ce qu'il va animer. Sans le script — bloqué,
404 sur le CDN, mouvement réduit — rien n'est armé et la page s'affiche entièrement. Ne pas
réintroduire de règle du type `.ln-reveal { opacity: 0 }`, elle rendrait la page blanche au moindre
incident. Même logique pour les états d'animation : la transition n'est déclarée que dans l'état
révélé, sinon l'élément s'efface visiblement avant de revenir.

`.site-header` porte `position: sticky` mais Shopify l'enveloppe dans `#shopify-section-header`, haut
de 88 px : un élément collant ne peut pas sortir des limites de son parent, **le header ne colle donc
pas**. La sous-navigation Learn est en `top: 0` pour cette raison, avec un `z-index` sous les 50 du
header pour se glisser dessous si sa stickiness est un jour réparée.

### Répartition des contenus

`learn-how-it-works` traite le mécanisme, la dose et la sécurité ; le spectre détaillé vit sur
`learn-wavelengths` pour ne pas maintenir deux fois la même liste de longueurs d'onde. La FAQ
commerciale (essai, garantie, certifications) reste sur la page `faq` de l'admin ; le bloc sécurité de
`learn-how-it-works` y renvoie. `learn-wavelengths` reprend la correspondance longueur d'onde /
appareil qui était saisie dans l'admin — elle doit rester alignée sur les fiches produit.

### Références scientifiques

`learn-science.liquid` cite quinze jalons et huit publications, chacun lié à son DOI. Aucune de ces
études n'a été menée sur un appareil CytoLight, et la section le dit explicitement dans son bloc
« Ce que ces études ne disent pas ». Ce bloc n'est pas décoratif : sans lui la page devient une
allégation de santé non étayée sur les produits vendus, sanctionnée par l'article L.121-2 du Code de
la consommation et rejetée à la validation des comptes publicitaires.

Ne jamais ajouter une référence sans identifiant vérifiable, ni retirer le cadrage sur les limites.

## Fichiers auto-générés

`config/settings_data.json`, `templates/cart.json`, `templates/collection.json` et
`templates/product.json` sont réécrits par l'éditeur de thème Shopify. L'intégration GitHub étant
bidirectionnelle, une modification dans l'éditeur produit des commits sur `main` sans que personne
n'ait poussé.

Ne pas les éditer à la main sans intention explicite.

## Workflow

Le dépôt est partagé entre deux développeurs. Une branche appartient à une seule personne.

```bash
# Démarrer — toujours depuis un main fraîchement tiré
git checkout main && git pull --ff-only origin main && git checkout -b feat/sujet

# Recaler quand main a bougé
git fetch origin && git rebase origin/main && git push --force-with-lease

# Après merge
git checkout main && git pull --ff-only origin main && git branch -D feat/sujet
```

Préfixes de branche : `feat/`, `fix/`, `perf/`, `refactor/`, `chore/`. Une branche ne sert qu'une fois —
ne jamais rouvrir une branche déjà mergée.

`--force-with-lease` uniquement, jamais `--force` seul. Ne jamais rebaser une branche appartenant à
l'autre développeur.

## Vérifier avant de proposer un merge

```bash
shopify theme check
```

Le dépôt part avec 28 infractions préexistantes (dont 14 `ImgWidthAndHeight`). Comparer au résultat sur
`origin/main` et n'en introduire aucune nouvelle.

```bash
shopify theme dev --store cytolight.myshopify.com
```

Crée un thème de développement non publié et sert le thème local sur `127.0.0.1:9292`, sans toucher au
live. Parcourir les pages affectées et contrôler dans l'onglet Réseau qu'aucune image ne renvoie 404 —
un 404 sur `/cdn/shop/files/` signale un fichier absent de Content → Files ou un nom divergent.

Ne pas annoncer qu'une modification fonctionne sans l'avoir vérifiée ainsi.

## Repères

| | |
|---|---|
| Boutique | `cytolight.myshopify.com` |
| Thème live, connecté à `main` | `cytolight-theme/main` |
| Thème conservé pour rollback | `CytoLight Theme v4` (non publié) |
| Taille du thème | ~500 Ko, plafond 50 Mo |

Le travail local avec le Shopify CLI demande un `shopify auth login` préalable. Voir `.env.example`.

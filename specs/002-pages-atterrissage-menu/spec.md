# Feature Specification: Pages d'atterrissage du mega-menu

**Feature Branch**: `claude/header-menu-navigation-658f0d`

**Created**: 2026-08-31

**Status**: Implémentée — pages admin à créer avant merge

**Input**: User description : « Améliore le header : quand je clique sur l'un des menus, le bouton
reste bloqué sur l'affichage du hover (titre souligné) alors qu'il faut que j'arrive sur la page
principale de chaque onglet. »

## Contexte

Les six onglets du mega-menu étaient des `<button type="button">`. Le panneau s'ouvrait au
survol, et `theme.js` ajoutait une bascule au clic pour le tactile. Deux défauts en découlaient :

1. **Aucune destination.** Cliquer un onglet n'amenait nulle part. Le visiteur qui veut « voir la
   boutique » devait choisir un lien dans le panneau, alors que l'intitulé de l'onglet promet une
   page.
2. **Le soulignement restait.** Le clic laissait le focus sur le bouton ; la règle
   `.site-header__nav-item:focus-within .site-header__nav-link::after { transform: scaleX(1) }`
   maintenait donc le trait rouge comme si l'onglet était encore survolé, jusqu'au prochain clic
   ailleurs. C'est le symptôme rapporté.

Le même piège est documenté dans `CLAUDE.md` pour le masquage de la rangée au scroll : le focus
laissé par une souris n'est pas du focus clavier et ne doit pas épingler un état.

## Décisions

1. **L'onglet devient un lien.** `<a href>` au lieu de `<button>`. Sur pointeur fin, le clic
   navigue — il n'y a plus d'état à « débloquer », la page change. Le panneau reste piloté par le
   survol et le focus clavier, comme avant.
2. **Le tactile garde deux temps.** Sur pointeur grossier (`(hover: none)`), où le survol
   n'existe pas, la première touche est retenue et ouvre le panneau ; la seconde suit le lien. Le
   test se fait au moment du clic, pas au chargement : une tablette avec clavier-souris bascule
   d'un mode à l'autre sans recharger.
3. **Repli sans JavaScript amélioré.** Un `<button>` sans script ne menait nulle part ; un lien
   mène toujours à la page de sa rubrique.
4. **Repérage de la page courante.** `aria-current="page"` sur l'onglet dont l'URL correspond à
   `request.path`, rendu par le même trait à 40 % d'opacité. Le survol le ramène à plein, ce qui
   garde les deux états distincts.
5. **Une seule source d'URL.** Les six destinations sont dérivées en tête de
   `sections/header.liquid` et réutilisées par la rangée d'onglets, le visuel de chaque panneau et
   le tiroir mobile. Elles passent par `pages[handle].url`, qui porte le préfixe de langue, avec
   repli sur le chemin écrit en dur.
6. **Le tiroir mobile suit.** Un `<summary>` ne peut pas être un lien : chaque groupe reçoit en
   tête de corps l'entrée d'atterrissage de sa rubrique, mise en évidence.

## Destinations

| Onglet | Destination | Existant / à créer |
|---|---|---|
| Boutique | `routes.all_products_collection_url` | existe |
| Par objectif | `/pages/goals` | **à créer dans l'admin** |
| Protocoles | `/pages/protocols` | existe (page admin, ~72 mots) — gabarit à assigner |
| Apprendre | `/pages/academy` | existe |
| Antared Pro | `/pages/antared-pro` | **à créer dans l'admin** |
| Pourquoi Antared | `/pages/why-antared` | **à créer dans l'admin** |

Handles en anglais, alignés sur les pages récentes (`protocols`, `wavelengths`, `science`,
`benefits`, `technology`). Shopify ne dérive le handle du titre qu'à la création : les pages
doivent donc être créées avec ces handles exacts.

## Contenu des quatre pages

Quatre sections nouvelles, quatre gabarits, aucune feuille de style ajoutée : elles réutilisent
`assets/learn.css` et `learn.js` et leurs classes `ln-*`.

| Section | Gabarit | Rôle |
|---|---|---|
| `goals-hub` | `page.goals` | Explique le découpage par objectif, redistribue vers les cinq collections |
| `protocols-hub` | `page.protocols` | Index des six routines, renvoie vers Mode d'emploi et la FAQ |
| `pro-hub` | `page.antared-pro` | Point d'arrivée B2B, six contextes, convergence vers le contact |
| `why-hub` | `page.why-antared` | Arguments de vente, tous vérifiables ailleurs sur le site |

Les cartes passent par `snippets/nav-hub-card.liquid`, qui **rend un `<div>` plutôt qu'un `<a>`
quand l'URL est vide**. Une rubrique dont la page n'existe pas encore s'affiche donc sans lien, au
lieu de publier un lien vers une 404. Créer la page dans l'admin suffit à activer le lien.

### Garde-fous appliqués

- **Principe II — aucune allégation thérapeutique.** Les objectifs décrivent des zones du corps
  et des moments d'usage, jamais des indications. `goals-hub`, `protocols-hub` et `pro-hub`
  portent chacun un bloc `ln-note` rappelant le statut de produit de bien-être. Le bloc de
  `pro-hub` est le plus explicite : il s'adresse à des professionnels de santé.
- **Principe III — rien d'inventé.** Aucun tarif, aucune référence client, aucune certification,
  aucun effectif. `why-hub` s'appuie exclusivement sur : le spectre publié sur
  `learn-wavelengths`, les règles d'écriture publiées sur `learn-values`, les publications citées
  sur `learn-science`, et le droit applicable (rétractation, garantie légale de conformité).
- **Principe VI — FR / EN à parité.** Les deux langues sont écrites dans le même commit,
  `aria-label` compris. Accents en entités HTML.

### Écarté faute de fait vérifiable

Le brief produit liste comme axes de différenciation : stock intra-UE, SAV 100 % français,
positionnement prix « smart-value », canal B2B via l'écosystème Pareto Physio. **Aucun n'est
documenté comme acquis** — ce sont des intentions, pas des faits. Ils ne figurent donc pas sur
`why-hub`, qui serait la page où ils porteraient le plus. À réintégrer dès qu'ils sont établis.

## Relation avec la spec 001

`specs/001-pages-admin-bilingues` (Draft, non implémentée) prévoyait pour la page `protocols` un
gabarit `page.protocols` porté par une section `protocol-index`. La présente spec livre ce
gabarit sous le nom de section `protocols-hub`, par cohérence avec les trois autres pages
d'atterrissage. **L'item 7 du modèle de données de la spec 001 est donc servi ici** ; les six
pages de protocole détaillées (items 1 à 6) restent à sa charge, et `protocols-hub` les référence
sans les créer.

La spec 001 avait par ailleurs reporté l'arbitrage « CytoLight Pro » : écrire les six pages, ou
retirer l'entrée du menu. La création de `/pages/antared-pro` prend une **troisième voie** :
l'entrée du menu mène désormais à une page réelle, sans que les six pages de segment soient
écrites. L'arbitrage sur ces six-là reste ouvert.

## Actions admin obligatoires avant le merge

Constitution, principe I — un fichier référencé par le code doit exister **avant** le merge.

1. Créer trois pages dans Content → Pages, avec ces handles exacts :
   `goals`, `antared-pro`, `why-antared`.
2. Après le merge, assigner les gabarits : `page.goals`, `page.antared-pro`, `page.why-antared`,
   et `page.protocols` sur la page `protocols` existante. Le sélecteur « Theme template » ne
   liste que les gabarits du thème publié.
3. Vider le corps des quatre pages dans l'admin : la prose vit dans la section. Un texte saisi
   dans l'éditeur est rendu en bas de page plutôt que perdu, mais fait doublon.
4. Renseigner les titres et les descriptions SEO en FR et en EN.

## Ajouts du 2026-08-31 — barre du header

Quatre corrections demandées après une relecture en vue mobile, traitées dans la même branche :

1. **Logo centré à toutes les largeurs.** `grid-template-columns: 1fr auto 1fr` conservé sous
   1300 px, au lieu de `auto 1fr auto` qui centrait le logo dans la place restante.
2. **Burger et panier décollés des bords.** La règle mobile posait `padding: 11px 0`, ce qui
   annulait les 20 px de `.container` ; elle pose `11px 16px`.
3. **Bandeau de réassurance masqué sous 800 px.** Il devenait une bande noire à défilement
   horizontal dont le second argument restait hors champ.
4. **Sélecteur de langue en liste déroulante**, desktop comme mobile — un `<details>` qui nomme les
   langues et ne grandit pas avec leur nombre. Fonctionne sans JavaScript ; `theme.js` n'ajoute que
   la fermeture au clic extérieur et à Échap.

### Défaut corrigé en chemin — `ln-button--light` invisible

`.ln-page a { color: inherit }` (0,1,1) est plus spécifique que `.ln-button--light` (0,1,0) : tout
bouton clair posé dans un hero sombre héritait du blanc ambiant et son libellé disparaissait sur son
propre fond blanc. Le défaut existait depuis l'origine sur `/pages/academy` et se serait propagé aux
quatre nouvelles pages. Corrigé dans `learn.css` par des rappels `.ln-page a.ln-button--*`, avec le
contrat des variantes écrit au-dessus du bloc.

Deux `ln-button--line` (variante fond sombre) posés par erreur sur une section claire dans
`goals-hub` et `protocols-hub` sont passés en rouge plein + `--ink`.

## Décision annexe — durée de garantie

Le dépôt annonçait deux durées contradictoires : « Garantie 1 an » dans le discours de marque et
sur les fiches produit, « 2 ans » sur `learn-values`. Arbitrage du 2026-08-31 : **essai 14 jours,
garantie 2 ans**, partout.

- `learn-values` : l'essai passe de 30 à 14 jours ; la garantie y était déjà à 2 ans.
- 15 occurrences de « 1 an » passent à « 2 ans » dans `header`, `cytolight-home` (dont le compteur
  animé `data-count-to`), `main-cart`, `cytolight-why-cards` et `main-product` (pastilles, tableaux
  de spécifications, FAQ produit).
- **Non modifié** : `sections/vg-homepage.liquid` ligne 383. Son « 1 an » est une colonne d'un
  tableau comparatif à trois colonnes (1 an / 2 ans / 3 ans) ; le changer casserait la comparaison.
  La section n'est de toute façon rendue nulle part — `templates/index.liquid` n'appelle que
  `cytolight-home`.

Ces durées sont des engagements commerciaux, pas des caractéristiques d'appareil : elles doivent
correspondre à ce qui est écrit dans les conditions de vente et dans la politique de retour de
l'admin. À vérifier avant le merge.

## Vérification

Menée sous `shopify theme dev` (127.0.0.1), thème servi depuis ce worktree, en FR et en EN.

- `shopify theme check` : 24 infractions, toutes préexistantes, aucune dans les fichiers touchés.
- **Onglets** : les six sont des `<a>` avec la bonne destination. Sur `/fr`, les `href` sont bien
  préfixés (`/fr/pages/goals`…) — ce que les chemins écrits en dur ne faisaient pas.
- **Clic** : sur `/collections/all`, `aria-current="page"` est posé sur Boutique et sur lui seul,
  trait à 0,4 d'opacité, les cinq autres à `scaleX(0)`.
- **Tactile** (pointeur grossier simulé) : première touche → panneau ouvert, aucune navigation ;
  seconde → navigation ; un seul panneau ouvert à la fois ; Échap referme.
- **Les quatre sections rendent** via `?view=` : 5, 6, 6 et 4 cartes, aucune erreur Liquid, et les
  21 sous-pages référencées existent — aucune carte ne retombe sur le rendu sans lien.
- **Contraste des boutons** : sondé sur les quatre nouvelles pages et sur `academy`, `science`,
  `nos-valeurs` — aucun bouton à faible contraste.
- **Header mobile** (375 px) : burger à 16 px du bord, panier à 16 px, écart du logo au centre
  = 0 px, bandeau `display: none`, sélecteur de langue en `<details>` sans débordement.

**Non vérifié** : le changement de langue par le formulaire. Le POST vers `/localization` renvoie une
page vide sous `shopify theme dev` — limite de l'outil, le formulaire et son action sont inchangés.
À contrôler sur le thème de prévisualisation.

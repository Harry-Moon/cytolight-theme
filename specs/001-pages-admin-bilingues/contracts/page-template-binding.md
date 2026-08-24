# Contrat — Liaison page ↔ gabarit ↔ véhicule

**Feature**: Étoffer et traduire les pages portées par l'admin

Ce contrat lie chaque handle à son gabarit, son véhicule de contenu et les actions d'admin
qu'il exige. Il est la référence de la séquence de déploiement : une ligne non exécutée est une
page qui sert encore ses 90 mots.

## Règle de frontière — coquille et contenu

Le véhicule d'une page se juge à l'endroit où vit sa **prose**, jamais à l'existence d'un
gabarit dédié.

| | Définition | Exemples |
|---|---|---|
| **Coquille** | Ce que l'éditeur de page de l'admin ne peut pas produire | Fil d'Ariane, formulaire, carte produit tirée du catalogue, rappel de gamme, hero |
| **Contenu** | La prose qui répond à la promesse de la page | Paragraphes, listes, étapes, réponses de FAQ |

Une page est **`theme`** quand sa prose est dans le dépôt, **`admin`** quand elle est dans
l'admin. Une coquille de thème sur une page `admin` ne la fait pas basculer : `page.faq.liquid`
et `page.how-to-use.liquid` en sont le précédent, en service aujourd'hui.

## Les quinze liaisons

### Véhicule `theme` — 11 pages, prose dans le dépôt

Chacune reçoit un gabarit sur le modèle exact de `templates/page.science.liquid` : `learn.css`,
`learn.js` en `defer`, `<div class="ln-page" data-learn>`, appel de section, puis `page.content`
**sous garde `!= blank`**.

| handle | gabarit à créer | section à créer | lot |
|---|---|---|---|
| `pre-workout` | `templates/page.pre-workout.liquid` | `sections/protocol-pre-workout.liquid` | 1 |
| `post-workout` | `templates/page.post-workout.liquid` | `sections/protocol-post-workout.liquid` | 1 |
| `daily-recovery` | `templates/page.daily-recovery.liquid` | `sections/protocol-daily-recovery.liquid` | 1 |
| `skin-routine` | `templates/page.skin-routine.liquid` | `sections/protocol-skin-routine.liquid` | 1 |
| `full-body-routine` | `templates/page.full-body-routine.liquid` | `sections/protocol-full-body-routine.liquid` | 1 |
| `workday-routine` | `templates/page.workday-routine.liquid` | `sections/protocol-workday-routine.liquid` | 1 |
| `protocols` | `templates/page.protocols.liquid` | `sections/protocol-index.liquid` | 1 |
| `our-approach` | `templates/page.our-approach.liquid` | `sections/brand-our-approach.liquid` | 1 |
| `our-story` | `templates/page.our-story.liquid` | `sections/brand-our-story.liquid` | **2** |
| `quality` | `templates/page.quality.liquid` | `sections/brand-quality.liquid` | **2** |
| `technology` | `templates/page.technology.liquid` | `sections/brand-technology.liquid` | **2** |

### Véhicule `admin` — 4 pages, prose dans l'admin

| handle | gabarit | coquille apportée | lot |
|---|---|---|---|
| `contact` | `templates/page.contact.liquid` — **à créer** | `{% form 'contact' %}` natif, libellés FR/EN, message de confirmation | 1 |
| `faq` | `templates/page.faq.liquid` — **existe** | Coquille Learn + rappel produit | 1 |
| `how-to-use` | `templates/page.how-to-use.liquid` — **existe** | Coquille Learn + rappel produit | 1 |
| `bundles` | `templates/page.bundles.liquid` — **à créer** | Cartes produit depuis `all_products` | **2** |

## Actions d'admin exigées

Aucune ne peut être exécutée depuis le dépôt.

| # | Action | Pages | Position dans la séquence |
|---|---|---|---|
| A1 | Saisir la traduction EN du corps | `contact`, `faq`, `how-to-use`, `bundles` | **avant** le merge |
| A2 | Corriger le titre affiché, FR et EN | `nos-valeurs`, `comment-ca-marche`, `benefits` | indépendant du merge |
| A3 | Assigner le gabarit `page.<handle>` | les 11 migrées + `contact` + `bundles` | **après** le merge |
| A4 | Vider le corps admin devenu redondant | les 11 migrées | **après** A3, page par page |

**A3 ne peut pas précéder le merge** : le sélecteur « Theme template » de l'admin ne liste que les
gabarits du thème publié.

**A4 ne doit jamais précéder A3.** Vider d'abord produirait une page quasi blanche pendant
l'intervalle ; l'ordre prescrit ne produit jamais rien de pire qu'un paragraphe affiché en double,
visible et corrigible — c'est ce que garantit la garde `page.content != blank`.

## Invariants

- **INV-1** — Aucun handle ne change. Aucun `href` de `sections/header.liquid` n'est modifié.
- **INV-2** — Aucune page ne relève des deux véhicules. La table ci-dessus est exhaustive.
- **INV-3** — L'entrée CytoLight Pro et ses six liens restent en place, inchangés.
- **INV-4** — Aucun fichier n'est ajouté à `assets/`. Les gabarits chargent `learn.css` et
  `learn.js` existants.
- **INV-5** — Aucun `.json` du thème n'est modifié, donc aucune validation JSON n'est requise.

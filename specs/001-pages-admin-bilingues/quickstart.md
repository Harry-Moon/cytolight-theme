# Quickstart — Vérifier le chantier

**Feature**: Étoffer et traduire les pages portées par l'admin
**Date**: 2026-08-25

Guide de validation, pas d'implémentation. Il dit comment prouver que le travail tient — la
constitution interdit d'annoncer qu'une modification fonctionne sans l'avoir vérifiée ainsi.

## Prérequis

```bash
shopify auth login                 # voir .env.example
git checkout main && git pull --ff-only origin main
git checkout -b feat/pages-admin-bilingues
```

Python 3 en stdlib suffit pour l'audit — aucune dépendance à installer (principe IV).

## Relever la ligne de base, avant de toucher à quoi que ce soit

```bash
shopify theme check 2>&1 | tail -5          # attendu : 28 infractions
python3 scripts/audit-nav.py --min-mots 250 # attendu : 0 lien cassé, 21 non traduites
```

Ces deux chiffres sont la référence de comparaison. Les noter.

## Boucle de développement

```bash
shopify theme dev --store cytolight.myshopify.com
```

Sert le thème local sur `127.0.0.1:9292` via un thème de développement non publié — le live n'est
pas touché.

**Attention au piège du gabarit** : en local comme en production, une page n'utilise
`page.<handle>.liquid` que si le gabarit lui est **assigné dans l'admin**, et l'admin ne liste que
les gabarits du thème publié. Tant que la PR n'est pas mergée, `/pages/post-workout` servira
`templates/page.liquid` même si la section est écrite.

Pour voir une page migrée avant le merge, ouvrir l'éditeur de thème du thème de développement
créé par `shopify theme dev` et y assigner le gabarit — l'assignation vaut pour ce thème de
développement seul et ne touche ni le live ni l'admin de production.

## Les cinq vérifications, dans l'ordre

### 1. Parité et volume — l'audit

```bash
python3 scripts/audit-nav.py --min-mots 250
```

Conforme quand les **seules** pages signalées sont les six du groupe CytoLight Pro, nommément :
`become-a-dealer`, `clinics`, `corporate-wellness`, `gyms`, `hotels-spas`, `physios`.

Une septième page signalée est une régression, même si le total reste bas. Barème complet et
paliers intermédiaires : [`contracts/audit-expectations.md`](./contracts/audit-expectations.md).

> L'audit interroge la boutique **en ligne**. Il ne voit donc le résultat qu'après le merge et
> l'assignation des gabarits. Avant cela, il sert à mesurer la ligne de base et à vérifier que
> rien n'a cassé.

### 2. Allégations — le `grep`

```bash
grep -rniE "traite|soigne|gu(é|e)ri|soulage|anti-inflammatoire|pathologie|th(é|e)rapeutique|cliniquement prouv|dispositif m(é|e)dical" sections/protocol-*.liquid sections/brand-*.liquid templates/page.contact.liquid templates/page.bundles.liquid

grep -rniE "treats?|cures?|heals?|relie(f|ves)|anti-inflammatory|disease|therapeutic|clinically proven|medical device" sections/protocol-*.liquid sections/brand-*.liquid templates/page.contact.liquid templates/page.bundles.liquid
```

Attendu : **zéro occurrence** sur les deux. Liste complète et nuances (« récupération » reste
autorisé) : [`contracts/content-contract.md`](./contracts/content-contract.md), section C-6.

Le `grep` ne remplace pas la relecture — il attrape le lexique, pas le sous-entendu. Une page qui
passe le `grep` peut encore promettre par l'image ou par la tournure.

### 3. Structure — la relecture par contrat

Pour chacune des 15 pages, vérifier les blocs obligatoires de son groupe dans
[`contracts/content-contract.md`](./contracts/content-contract.md).

Les deux points qui se perdent le plus facilement :

- **P-1** — les quatre paramètres de séance (moment, durée, distance, fréquence) sur chacune des
  7 pages Protocoles. Trois sur quatre ne suffit pas.
- **P-2** — le bloc « ce que cette séance ne fait pas » sur les 7. C'est la garde du principe II ;
  son absence est une régression.

### 4. Infractions de thème

```bash
shopify theme check 2>&1 | tail -5
```

Attendu : le même nombre qu'au relevé de base. Le plafond de 28 ne remonte pas.

### 5. Parcours réel, dans les deux langues

```bash
shopify theme dev --store cytolight.myshopify.com
```

Onglet Réseau ouvert, parcourir les 15 pages en FR puis en EN. Attendu : **zéro 404**. Un 404 sur
`/cdn/shop/files/` signalerait un fichier absent de Content → Files — ce chantier n'en ajoute
aucun, donc toute occurrence est anormale.

Trois points à contrôler à l'œil, qu'aucune commande n'attrape :

- La bascule de langue depuis une page du chantier **reste sur la même page**. Le
  `{% form 'localization' %}` du header s'en charge nativement ; c'est une vérification, pas un
  développement.
- Le formulaire de contact s'envoie et affiche sa confirmation, **JavaScript désactivé**.
- Chaque page a un `h1` unique et une hiérarchie de titres continue.

## Vérifier la séquence de déploiement

Après le merge, page par page — l'ordre compte :

1. Assigner le gabarit dans Content → Pages, puis ouvrir la page en FR et en EN.
2. Une fois la page correcte, **et seulement là**, vider le corps admin devenu redondant.

Vider avant d'assigner produit une page quasi blanche pendant l'intervalle. L'ordre prescrit ne
produit jamais rien de pire qu'un paragraphe affiché en double — c'est ce que garantit la garde
`{%- if page.content != blank -%}` du gabarit.

Détail des 4 actions d'admin et de leur position :
[`contracts/page-template-binding.md`](./contracts/page-template-binding.md).

## Ce qui bloque une publication

- Une page du lot 2 dont un emplacement de fait est resté marqué. Aucun `TODO`, aucune valeur
  approchée ne part en production (FR-014).
- Une page prête dans une seule langue. Livrer le français puis l'anglais « plus tard » reproduit
  exactement le défaut que ce chantier corrige.
- Une infraction nouvelle à `shopify theme check`.

## Ce que ce chantier ne touche pas

`sections/header.liquid`, `sections/main-product.liquid`, les fichiers `.json` du thème, `assets/`.
Un diff qui les mentionne sort du plan et demande une justification.

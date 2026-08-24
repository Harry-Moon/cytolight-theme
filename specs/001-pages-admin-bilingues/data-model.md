# Phase 1 — Modèle de données

**Feature**: Étoffer et traduire les pages portées par l'admin
**Date**: 2026-08-25

Ce chantier ne crée aucun schéma persistant : il n'y a ni base, ni métachamp, ni réglage de
section. Les « entités » ci-dessous sont les objets que le plan manipule et sur lesquels les
tâches et les vérifications s'appuient. Elles se lisent comme un contrat de cohérence, pas comme
un modèle physique.

---

## Entité — Page du périmètre

L'unité de travail. Quinze instances.

| Attribut | Valeurs | Règle |
|---|---|---|
| `handle` | chaîne | Immuable (FR-025). Détermine l'URL et le nom du gabarit |
| `groupe` | `protocoles` \| `pourquoi` \| `divers` | Détermine le véhicule et le contrat de contenu |
| `véhicule` | `theme` \| `admin` | Où vit la **prose**. Un seul, jamais les deux (FR-005) |
| `lot` | `1` \| `2` | `2` si un fait requis est absent du dépôt et de l'entreprise |
| `gabarit` | `page.<handle>` \| `page` | `page` (défaut) tant que l'assignation admin n'a pas eu lieu |
| `section` | nom de fichier \| — | Présente pour le véhicule `theme` uniquement |
| `état` | `brouillon` → `rédigée` → `traduite` → `publiée` | Transitions ci-dessous |

### Les quinze instances

| # | handle | groupe | véhicule | lot | section | gabarit à créer |
|---|---|---|---|---|---|---|
| 1 | `pre-workout` | protocoles | theme | 1 | `protocol-pre-workout` | `page.pre-workout` |
| 2 | `post-workout` | protocoles | theme | 1 | `protocol-post-workout` | `page.post-workout` |
| 3 | `daily-recovery` | protocoles | theme | 1 | `protocol-daily-recovery` | `page.daily-recovery` |
| 4 | `skin-routine` | protocoles | theme | 1 | `protocol-skin-routine` | `page.skin-routine` |
| 5 | `full-body-routine` | protocoles | theme | 1 | `protocol-full-body-routine` | `page.full-body-routine` |
| 6 | `workday-routine` | protocoles | theme | 1 | `protocol-workday-routine` | `page.workday-routine` |
| 7 | `protocols` | protocoles | theme | 1 | `protocol-index` | `page.protocols` |
| 8 | `our-approach` | pourquoi | theme | 1 | `brand-our-approach` | `page.our-approach` |
| 9 | `our-story` | pourquoi | theme | **2** | `brand-our-story` | `page.our-story` |
| 10 | `quality` | pourquoi | theme | **2** | `brand-quality` | `page.quality` |
| 11 | `technology` | pourquoi | theme | **2** | `brand-technology` | `page.technology` |
| 12 | `contact` | divers | admin | 1 | — | `page.contact` (coquille + formulaire) |
| 13 | `faq` | divers | admin | 1 | — | existe déjà |
| 14 | `how-to-use` | divers | admin | 1 | — | existe déjà |
| 15 | `bundles` | divers | admin | **2** | — | `page.bundles` (coquille + cartes produit) |

`protocols` est la page d'index du groupe : elle oriente vers les six autres plutôt que de décrire
une séance. Sa section porte donc un nom distinct du motif `protocol-<moment>`.

### Transitions d'état

```text
brouillon ──rédaction FR+EN──► rédigée ──relecture allégations──► traduite ──assignation admin──► publiée
                                  │
                                  └── lot 2 : bloquée tant que le dossier de faits est incomplet
```

Une page ne passe à `publiée` que si les deux langues sont prêtes (FR-001) et, pour le lot 2, si
aucun emplacement de fait n'est resté marqué (FR-014). Le passage est irréversible en pratique :
`main` est la production.

---

## Entité — Groupe

Détermine le véhicule, le contrat de contenu et la priorité. Quatre instances, dont une reportée.

| Groupe | Pages | Véhicule | Contrat de contenu | Priorité spec |
|---|---|---|---|---|
| Protocoles | 7 | theme | séquence d'usage + garde d'allégation | P2 |
| Pourquoi CytoLight | 4 | theme | raisons vérifiables, chiffres sourcés | P3 |
| Divers | 4 | admin | hétérogène, coquille au besoin | P1, P4, P5 |
| CytoLight Pro | 6 | — | **reporté**, aucune modification (FR-022) | — |

---

## Entité — Lot de livraison

| Lot | Pages | Condition de publication |
|---|---|---|
| 1 | 11 — les 7 protocoles, `our-approach`, `contact`, `faq`, `how-to-use` | Aucune dépendance externe |
| 2 | 4 — `our-story`, `quality`, `technology`, `bundles` | Dossier de faits complet pour la page |

Le lot 1 se publie sans attendre le lot 2 (FR-015). L'inverse n'est pas vrai : les pages du lot 2
renvoient vers celles du lot 1.

---

## Entité — Fait vérifiable

La donnée qu'une page publie et qui engage la marque. Sans source nommée, elle ne se publie pas
(FR-020, FR-021 ; constitution, principe III).

| Attribut | Règle |
|---|---|
| `valeur` | Le chiffre ou l'affirmation tel qu'il paraîtra |
| `source` | Fiche fournisseur, décision documentée, ou fichier du dépôt. Jamais « estimation » |
| `détenteur` | Qui peut la fournir, quand elle manque |
| `page` | Où elle paraît |

**Faits déjà disponibles**, réutilisables sans apport extérieur : les sept longueurs d'onde et
leur correspondance appareil (`sections/learn-wavelengths.liquid`), les caractéristiques par
appareil (`snippets/learn-product-cta.liquid` : 288 LED / 4 canaux pour le masque, 150 LED 3-en-1
pour la casquette, 60 LED en 660 et 850 nm et batterie 6000 mAh pour la genouillère), les
remises duo −10 % et famille −15 % (fiche produit), les engagements essai 30 jours / garantie
2 ans / livraison (barre du header).

**Faits manquants** : voir `research.md`, D6. Ce sont eux qui définissent le lot 2.

---

## Entité — Dossier de faits manquants

Livrable du chantier (FR-013), pas une note de travail. Une entrée par fait manquant : la page qui
l'attend, la donnée requise, son détenteur présumé, et ce que la page affichera à sa place tant
qu'il manque — c'est-à-dire rien de publié.

---

## Entité — Lien de navigation

Une URL écrite en dur dans `sections/header.liquid`, seule source des URL de la navigation.
Vingt-huit `/pages/...` y figurent : les 15 du périmètre, les 6 du groupe Pro reporté, et 7 pages
portées par le thème hors périmètre.

**Invariant** : ce chantier ne modifie aucun lien. Aucun handle ne change (FR-025), l'entrée Pro
reste en place (FR-022). `sections/header.liquid` n'est pas dans la liste des fichiers modifiés.

---

## Entité — Résultat d'audit

Produit par `python3 scripts/audit-nav.py`, pour un couple (URL, langue).

| Attribut | Origine |
|---|---|
| `code` | Statut HTTP. Un 429 est une demande d'attendre, pas un défaut |
| `mots` | Texte visible de `<main id="MainContent">`, hors `script`, `style`, `svg` |
| `défaut` | `lien cassé` \| `ébauche` (< seuil) \| `non traduite` (FR et EN à égalité stricte) |

C'est le seul point où les deux véhicules se mesurent au même endroit — ce qui en fait la
compensation de la déviation au principe VI. Sortie attendue :
`contracts/audit-expectations.md`.

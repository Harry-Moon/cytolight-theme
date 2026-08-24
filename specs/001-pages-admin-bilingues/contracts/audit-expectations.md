# Contrat — Sortie d'audit attendue

**Feature**: Étoffer et traduire les pages portées par l'admin

`python3 scripts/audit-nav.py` est la porte de vérification du chantier, et le seul endroit où
les deux véhicules de contenu se mesurent au même endroit. Ce document dit ce que le rapport doit
afficher — y compris ce qu'il doit continuer d'afficher.

## Commande de référence

```bash
python3 scripts/audit-nav.py --min-mots 250
```

Le seuil par défaut du script est de 200 mots ; le chantier vise 250 (FR-007). Le script teste
chaque URL en FR et en EN, avec un délai de politesse — un 429 est une demande d'attendre, pas un
lien cassé.

## Le point de départ — 2026-08-21

| Défaut | Nombre |
|---|---|
| Liens cassés | 0 |
| Pages non traduites | **21** — la totalité des pages de l'admin |
| Ébauches | les mêmes 21, de 1 à 175 mots |

## L'arrivée attendue — après le lot 1

| Défaut | Attendu | Détail |
|---|---|---|
| Liens cassés | **0** | Inchangé. Toute apparition est une régression |
| Pages non traduites | **6 + 4** | Les 6 du groupe Pro (reporté, FR-022) + les 4 du lot 2, non encore publiées |
| Ébauches | **6 + 4** | Les mêmes |

## L'arrivée attendue — après le lot 2

| Défaut | Attendu | Détail |
|---|---|---|
| Liens cassés | **0** | |
| Pages non traduites | **exactement 6** | `become-a-dealer`, `clinics`, `corporate-wellness`, `gyms`, `hotels-spas`, `physios` |
| Ébauches | **exactement 6** | Les mêmes six |

## Comment lire ce résidu

Les six pages CytoLight Pro **continueront d'être testées et signalées**, et c'est voulu :
l'entrée Pro reste dans `sections/header.liquid`, le script collecte ses URL en lisant les `href`
en dur du thème, et masquer une dette assumée la fait oublier.

**La règle de lecture est donc nominative, pas numérique** : le rapport est conforme quand les
seules pages signalées sont ces six-là, nommément. Une septième page signalée est une régression,
même si le total reste bas. Un total de six qui ne serait pas composé de ces six handles est une
régression déguisée.

## Ce que l'audit ne dit pas

Le script détecte l'absence de traduction par **égalité stricte du nombre de mots** entre FR et
EN, mesuré sur le texte visible de `<main id="MainContent">`.

- Il ne juge pas la **qualité** d'une traduction. Une page mal traduite passe. La relecture reste
  humaine.
- Il ne détecte pas une allégation interdite. C'est le rôle du `grep` de `content-contract.md`,
  section C-6.
- Il ne vérifie pas qu'un chiffre a une source. C'est le rôle de la revue du dossier de faits.
- Il ne teste que les URL **écrites en dur dans le thème**. Une page non liée depuis le thème lui
  est invisible.

## Portes complémentaires

| Porte | Commande | Critère |
|---|---|---|
| Infractions de thème | `shopify theme check` | Aucune nouvelle par rapport à `origin/main` (plafond 28) |
| Ressources manquantes | `shopify theme dev`, onglet Réseau | Zéro 404, en FR et en EN, sur les 15 pages |
| Allégations | `grep -ri` sur la liste C-6 dans les fichiers créés | Zéro occurrence |
| Validation JSON | — | Sans objet : aucun `.json` du thème n'est modifié |

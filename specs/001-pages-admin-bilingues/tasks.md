---
description: "Task list for feature implementation"
---

# Tasks: Étoffer et traduire les pages portées par l'admin

**Input**: Design documents from `/specs/001-pages-admin-bilingues/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: aucune tâche de test unitaire. Le dépôt n'a ni framework de test ni CI (constitution,
principe IV — pas d'outillage). Les portes de vérification sont `scripts/audit-nav.py`,
`shopify theme check`, `shopify theme dev` et la relecture d'allégations. Elles figurent comme
tâches explicites dans chaque phase.

**Organization**: tâches groupées par user story, chacune livrable et vérifiable seule.

## Format: `[ID] [P?] [Story] Description`

- **[P]** : parallélisable — fichiers différents, aucune dépendance sur une tâche incomplète
- **[Story]** : US1 … US6, selon `spec.md`
- **[ADMIN]** : action **hors dépôt**, dans l'admin Shopify. Ne peut être faite ni par un agent
  ni par un commit. L'emplacement remplace le chemin de fichier
- Chemins exacts dans chaque description

## Path Conventions

Thème Shopify à la racine du dépôt : `sections/`, `snippets/`, `templates/`, `assets/`,
`layout/`, `config/`. Aucun `src/`, aucun `tests/`. Voir `plan.md`, « Arborescence du thème ».

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: relever la ligne de base avant toute modification, pour avoir un point de comparaison.

- [ ] T001 Créer la branche `feat/pages-admin-bilingues` depuis un `main` fraîchement tiré (`git checkout main && git pull --ff-only origin main && git checkout -b feat/pages-admin-bilingues`)
- [ ] T002 [P] Relever la ligne de base des infractions : `shopify theme check 2>&1 | tail -5`, noter le total (attendu 28) dans `specs/001-pages-admin-bilingues/baseline.md`
- [ ] T003 [P] Relever la ligne de base de l'audit : `python3 scripts/audit-nav.py --min-mots 250`, consigner la sortie complète dans `specs/001-pages-admin-bilingues/baseline.md` (attendu : 0 lien cassé, 21 non traduites)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: le fragment partagé par les 13 coquilles, et le lancement du dossier de faits, qui a
un délai externe.

**⚠️ CRITICAL**: T004 bloque toutes les user stories qui créent un gabarit (US1 à US4).

- [ ] T004 Créer `snippets/editorial-hero.liquid` — fil d'Ariane, kicker et titre en FR et EN, paramétrés (`crumb_fr`, `crumb_en`, `kicker_fr`, `kicker_en`, `title_fr`, `title_en`), sur le modèle du hero de `sections/learn-science.liquid` (classes `.ln-hero`, `.ln-crumbs`, `.ln-kicker`, `.ln-title`). Accents en entités HTML. Aucun CSS ajouté
- [ ] T005 [P] Rédiger `specs/001-pages-admin-bilingues/fact-dossier.md` — pour chacune des 4 pages du lot 2, la liste nommée des faits requis et leur détenteur présumé, d'après `research.md` D6. Livrable de FR-013. Ne bloque pas le lot 1, mais a un délai externe : à lancer en premier

**Checkpoint**: `editorial-hero` en place, dossier de faits parti. Les user stories peuvent commencer.

---

## Phase 3: User Story 1 — La page de contact tient sa promesse (Priority: P1) 🎯 MVP

**Goal**: `/pages/contact` passe d'un mot à une page utilisable dans les deux langues, avec un
formulaire fonctionnel — la seule page du chantier atteignable en un clic depuis tout le site.

**Independent Test**: ouvrir `/pages/contact` en FR puis en EN, envoyer un message **JavaScript
désactivé**, obtenir la confirmation ; `audit-nav.py` ne la signale plus.

- [ ] T006 [US1] Créer `templates/page.contact.liquid` — coquille : `learn.css` + `learn.js` en `defer`, `<div class="ln-page" data-learn>`, `{% render 'editorial-hero' %}`, `{{ page.content }}` dans un `.ln-prose`, puis `{% form 'contact' %}`. Modèle : `templates/page.science.liquid`
- [ ] T007 [US1] Écrire les libellés du formulaire dans `templates/page.contact.liquid` — nom, e-mail, message, bouton, message de confirmation (`form.posted_successfully?`), en FR et EN. Chaque champ avec son `<label for>`, focus visible, nom accessible contenant le texte visible (contrat D-2 à D-4)
- [ ] T008 [P] [US1] [ADMIN] Rédiger la prose FR de la page `contact` dans Content → Pages — délai de réponse annoncé, identité de l'entreprise, rappel des engagements (essai 30 jours, garantie 2 ans, livraison). ≥ 250 mots (contrat D-5)
- [ ] T009 [US1] [ADMIN] Saisir la traduction EN de la page `contact` via la traduction native Shopify — mêmes faits, formulation anglaise, pas une copie du FR (dépend de T008)
- [ ] T010 [US1] Vérifier US1 sous `shopify theme dev` : formulaire envoyé JavaScript désactivé, confirmation affichée dans la langue servie, parcours clavier complet avec focus visible, `h1` unique — en FR et en EN

**Checkpoint**: US1 livrable seule. C'est le MVP : la pire page du site devient la meilleure du lot.

---

## Phase 4: User Story 2 — Les protocoles d'usage tiennent leur promesse (Priority: P2)

**Goal**: les 7 pages Protocoles portent une séquence d'usage applicable, dans les deux langues,
sans jamais glisser vers l'allégation thérapeutique.

**Independent Test**: chaque page donne moment, durée, distance et fréquence sans qu'on ait à en
ouvrir une autre ; les deux `grep` d'allégations reviennent vides ; les 7 diffèrent en nombre de
mots entre FR et EN.

**Note**: une tâche = une page = sa section **et** son gabarit. Les 7 sont strictement
indépendantes — fichiers disjoints, aucun ordre imposé.

- [ ] T011 [P] [US2] Créer `sections/protocol-pre-workout.liquid` et `templates/page.pre-workout.liquid` — hero via `editorial-hero`, séance en `.ln-steps` (moment, durée, distance, fréquence), bloc « ce que cette séance ne fait pas » en `.ln-pledge` + `.ln-pledge__mark--no`, renvoi vers `learn-how-it-works`, `{% render 'learn-product-cta' %}` avec des handles adaptés. FR et EN inlinés via `is_fr`. ≥ 250 mots par langue
- [ ] T012 [P] [US2] Créer `sections/protocol-post-workout.liquid` et `templates/page.post-workout.liquid` — même contrat que T011, sujet : après l'effort
- [ ] T013 [P] [US2] Créer `sections/protocol-daily-recovery.liquid` et `templates/page.daily-recovery.liquid` — même contrat, sujet : récupération quotidienne
- [ ] T014 [P] [US2] Créer `sections/protocol-skin-routine.liquid` et `templates/page.skin-routine.liquid` — même contrat, sujet : routine peau. Handles produit orientés `cytolight-mask`
- [ ] T015 [P] [US2] Créer `sections/protocol-full-body-routine.liquid` et `templates/page.full-body-routine.liquid` — même contrat, sujet : séance corps entier. Handles orientés `cytolight-pano-ultra`, `cytolight-sauna-dome`
- [ ] T016 [P] [US2] Créer `sections/protocol-workday-routine.liquid` et `templates/page.workday-routine.liquid` — même contrat, sujet : journée de travail. Handles orientés `cytolight-desk`
- [ ] T017 [P] [US2] Créer `sections/protocol-index.liquid` et `templates/page.protocols.liquid` — **page d'index** : oriente vers les six autres protocoles et ne décrit aucune séance (contrat P-5). Cartes en `.ln-hub` / `.ln-hub__card`
- [ ] T018 [US2] Vérifier P-1 sur les 7 sections : les **quatre** paramètres de séance sont présents et chiffrés dans chaque langue. Trois sur quatre est un échec (dépend de T011–T017)
- [ ] T019 [US2] Vérifier P-2 sur les 7 sections : le bloc « ce que cette séance ne fait pas » figure en FR et en EN (dépend de T011–T017)
- [ ] T020 [US2] Vérifier P-3 : toute longueur d'onde citée concorde avec `sections/learn-wavelengths.liquid` et les fiches produit. En cas d'écart, `learn-wavelengths` fait foi (dépend de T011–T017)
- [ ] T021 [US2] Relecture d'allégations sur les 7 sections — les deux `grep` de `quickstart.md` étape 2, puis relecture humaine du sous-entendu (le `grep` attrape le lexique, pas la tournure). Attendu : zéro occurrence

**Checkpoint**: US2 livrable indépendamment. Le groupe le plus exposé au principe II est passé.

---

## Phase 5: User Story 3 — « Pourquoi CytoLight » donne des raisons vérifiables (Priority: P3)

**Goal**: les 4 pages de marque donnent des raisons vérifiables ou pas de chiffre du tout.
`our-approach` part au lot 1 ; les trois autres reçoivent leur structure et attendent le dossier
de faits.

**Independent Test**: chaque chiffre affiché est traçable à une source nommée ; aucune page ne
porte d'avis, de note, de témoignage ni de certification ; les quatre diffèrent en nombre de mots
entre FR et EN.

- [ ] T022 [P] [US3] Créer `sections/brand-our-approach.liquid` et `templates/page.our-approach.liquid` — **lot 1**. Bloc « ce que la marque revendique / ce qu'elle ne revendique pas » en `.ln-pledge` avec ses deux modificateurs, positionnement, renvoi vers `learn-science`. C'est la page qui transforme la contrainte du principe II en argument de rigueur (contrat W-1). FR et EN
- [ ] T023 [P] [US3] Créer `sections/brand-our-story.liquid` et `templates/page.our-story.liquid` — **lot 2**. Structure, titres et chemins de sortie complets ; emplacements des faits manquants marqués en commentaire Liquid `{%- comment -%}`, jamais en texte visible (FR-014, contrat W-2)
- [ ] T024 [P] [US3] Créer `sections/brand-quality.liquid` et `templates/page.quality.liquid` — **lot 2**. Même traitement : contrôles, garantie, SAV, retours ; emplacements marqués en commentaire
- [ ] T025 [P] [US3] Créer `sections/brand-technology.liquid` et `templates/page.technology.liquid` — **lot 2**. Les sept longueurs d'onde en `.ln-waves`, reprises de `learn-wavelengths` sans réécriture ; pilotage intensité et pulsation ; **aucune valeur d'irradiance** tant que mesure, distance et opérateur ne sont pas fournis (contrat W-3, W-4)
- [ ] T026 [US3] Vérifier W-2 sur les 4 sections : aucun avis, note, témoignage, logo de presse, effectif client ni certification (dépend de T022–T025)
- [ ] T027 [US3] Confronter chaque chiffre des 4 sections à `fact-dossier.md` : tout chiffre sans source nommée est retiré, et sa page reste au lot 2 (dépend de T005, T022–T025)
- [ ] T028 [US3] Relecture d'allégations sur les 4 sections — mêmes `grep` qu'en T021, puis relecture humaine

**Checkpoint**: `our-approach` publiable. Les trois autres attendent le dossier de faits, structure prête.

---

## Phase 6: User Story 4 — La page Packs explique les remises déjà implémentées (Priority: P4)

**Goal**: `/pages/bundles` décrit la composition de chaque pack et sa remise, en cohérence avec la
fiche produit. **Lot 2** : bloquée tant que la composition exacte n'est pas fournie.

**Independent Test**: chaque remise annoncée concorde avec celle appliquée sur la fiche produit ;
les prix suivent la devise du marché courant, aucun prix écrit en dur.

- [ ] T029 [US4] Créer `templates/page.bundles.liquid` — coquille : `editorial-hero`, `{{ page.content }}` en `.ln-prose`, cartes produit tirées de `all_products` sur le modèle de `snippets/learn-product-cta.liquid` (produit absent du catalogue = sauté, jamais rendu vide). Aucun prix en dur (contrat D-8)
- [ ] T030 [US4] Vérifier dans `sections/main-product.liquid` les remises réellement implémentées (duo −10 %, famille −15 %) et consigner la correspondance pack ↔ remise dans `specs/001-pages-admin-bilingues/fact-dossier.md`
- [ ] T031 [US4] [ADMIN] Rédiger la prose FR de `bundles` dans Content → Pages — composition de chaque pack, remise appliquée, chemin d'achat. **Bloquée** tant que la composition exacte manque (dépend de T030 et du dossier de faits)
- [ ] T032 [US4] [ADMIN] Saisir la traduction EN de `bundles` via la traduction native Shopify (dépend de T031)

**Checkpoint**: US4 livrable dès que la composition des packs est fournie. La coquille, elle, peut partir avec le lot 1.

---

## Phase 7: User Story 5 — La FAQ et le mode d'emploi rejoignent le niveau de l'espace Learn (Priority: P5)

**Goal**: le contenu enveloppé par les coquilles Learn existantes est étoffé et traduit. Aucun
fichier de thème n'est touché.

**Independent Test**: le bloc sécurité de `learn-how-it-works` mène à des réponses réelles sur
l'essai, la garantie et les certifications, dans la langue servie.

- [ ] T033 [P] [US5] [ADMIN] Étoffer la prose FR de `faq` dans Content → Pages — essai, garantie, certifications, les questions que le bloc sécurité de `learn-how-it-works` lui délègue. ≥ 250 mots (contrat D-11)
- [ ] T034 [P] [US5] [ADMIN] Étoffer la prose FR de `how-to-use` dans Content → Pages — les gestes d'usage, en renvoyant aux protocoles pour le détail par moment. ≥ 250 mots
- [ ] T035 [US5] [ADMIN] Saisir la traduction EN de `faq` et `how-to-use` via la traduction native Shopify (dépend de T033, T034)
- [ ] T036 [US5] Relire la FAQ contre le contrat D-12 : aucune réponse ne revendique de certification de dispositif médical ni d'effet thérapeutique. C'est la page la plus exposée — une question de client se répond volontiers de travers (dépend de T033, T035)

**Checkpoint**: US5 livrable seule, sans aucune modification du dépôt.

---

## Phase 8: User Story 6 — Les titres affichés cessent d'être des handles (Priority: P6)

**Goal**: trois titres rédigés remplacent trois handles bruts dans l'onglet du navigateur et les
résultats Google. Indépendant du merge, sans risque de déploiement.

**Independent Test**: ouvrir les trois pages en FR et en EN et lire le titre de l'onglet.

- [ ] T037 [P] [US6] [ADMIN] Corriger le titre de `nos-valeurs` dans Content → Pages, en FR et en EN — « our-values » n'est pas un titre. Ne pas toucher au *URL handle* dans Search engine listing (FR-025)
- [ ] T038 [P] [US6] [ADMIN] Corriger le titre de `comment-ca-marche` en FR et en EN — « how-it-works » n'est pas un titre. Handle inchangé
- [ ] T039 [P] [US6] [ADMIN] Corriger le titre de `benefits` en FR et en EN — « benefits » est le handle affiché. Handle inchangé
- [ ] T040 [US6] Vérifier que les trois URL répondent toujours et qu'aucun `href` de `sections/header.liquid` n'est cassé : `python3 scripts/audit-nav.py` — 0 lien cassé (dépend de T037–T039)

**Checkpoint**: US6 livrable immédiatement, avant même la première PR.

---

## Phase 9: Polish, portes de qualité et déploiement

**Purpose**: les portes obligatoires avant PR, puis la séquence post-merge que le dépôt ne peut
pas exécuter.

### Portes avant la PR

- [ ] T041 Vérifier qu'aucun fichier n'a été ajouté à `assets/` et qu'aucun `.json` du thème n'est modifié : `git diff --name-only origin/main` (invariants INV-4, INV-5 de `contracts/page-template-binding.md`)
- [ ] T042 Vérifier que `sections/header.liquid` et `sections/main-product.liquid` sont absents du diff (invariants INV-1, INV-3)
- [ ] T043 `shopify theme check 2>&1 | tail -5` — comparer au relevé de T002. Aucune infraction nouvelle, plafond 28 inchangé
- [ ] T044 `shopify theme dev --store cytolight.myshopify.com` — parcourir les 15 pages en FR puis en EN, onglet Réseau ouvert. Zéro 404. Vérifier au passage que la bascule de langue reste sur la même page (le `{% form 'localization' %}` du header s'en charge — vérification, pas développement)
- [ ] T045 Vérifier sur chaque page créée : `h1` unique, hiérarchie de titres continue, contraste et focus conformes au principe VII
- [ ] T046 [P] [ADMIN] Confirmer que la traduction EN des 4 pages du groupe Divers est saisie **avant** le merge (FR-027, action A1 de `contracts/page-template-binding.md`)
- [ ] T047 Ouvrir la PR vers `main`. **Un agent n'a jamais l'autorisation de merger** (constitution, principe I) : la PR s'arrête là

### Séquence post-merge — page par page, l'ordre compte

- [ ] T048 [ADMIN] Assigner le gabarit `page.<handle>` dans Content → Pages pour les 13 pages concernées (11 migrées + `contact` + `bundles`), puis ouvrir chacune en FR et en EN. Action A3 : impossible avant le merge, le sélecteur ne listant que les gabarits du thème publié
- [ ] T049 [ADMIN] Vider le corps admin devenu redondant sur les 11 pages migrées — **après** T048 et jamais avant. Vider d'abord produirait une page quasi blanche ; l'ordre prescrit ne produit jamais rien de pire qu'un paragraphe en double, visible et corrigible (action A4)
- [ ] T050 Consigner dans `specs/001-pages-admin-bilingues/baseline.md` la fenêtre T048 → T049 réellement tenue (heure de merge, heure de dernière assignation). Elle se mesure en minutes, pas en jours, et se planifie avec la personne qui a accès à l'admin

### Vérification finale

- [ ] T051 `python3 scripts/audit-nav.py --min-mots 250` — conforme quand les **seules** pages signalées sont les six du groupe Pro, nommément `become-a-dealer`, `clinics`, `corporate-wellness`, `gyms`, `hotels-spas`, `physios`. Une septième est une régression, même si le total reste bas (`contracts/audit-expectations.md`)
- [ ] T052 Mettre à jour `.specify/memory/product-brief.md` — chantier n°1 : périmètre à 15 pages, report de l'arbitrage CytoLight Pro avec son déclencheur, état des deux lots
- [ ] T053 [P] Consigner dans `fact-dossier.md` l'état de chaque fait manquant du lot 2 : fourni, ou toujours attendu et par qui

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** : aucune dépendance. T002 et T003 sont le point de comparaison de T043 et T051 — les sauter rend ces portes ininterprétables
- **Foundational (Phase 2)** : T004 bloque US1, US2, US3, US4. T005 ne bloque rien mais a un délai externe : à lancer en premier
- **US1 à US6 (Phases 3–8)** : toutes dépendent de T004, sauf US5 et US6 qui ne touchent pas le dépôt et peuvent partir immédiatement
- **Phase 9** : T041–T047 dépendent des stories retenues ; T048–T050 dépendent du merge ; T051 dépend de T048 et T049

### User Story Dependencies

| Story | Dépend de | Indépendante des autres |
|---|---|---|
| US1 — contact (P1) | T004 | oui |
| US2 — 7 protocoles (P2) | T004 | oui |
| US3 — 4 pourquoi (P3) | T004 ; lot 2 attend T005 | oui |
| US4 — bundles (P4) | T004, T030, dossier de faits | oui |
| US5 — faq / how-to-use (P5) | rien | oui — aucun fichier du dépôt |
| US6 — 3 titres (P6) | rien | oui — aucun fichier du dépôt |

Aucune story n'en attend une autre. Le seul couplage réel est le dossier de faits, qui retient
trois pages d'US3 et la prose d'US4.

### Parallel Opportunities

- **T002, T003** en parallèle (relevés indépendants)
- **T011 à T017** — les 7 protocoles, fichiers strictement disjoints. Le plus gros gisement du chantier
- **T022 à T025** — les 4 pages de marque, fichiers disjoints
- **T033, T034** — deux pages d'admin distinctes
- **T037, T038, T039** — trois pages d'admin distinctes
- **US5 et US6 en parallèle de tout le reste** : elles ne touchent aucun fichier du dépôt, donc aucun conflit possible avec le travail Liquid

---

## Parallel Example: User Story 2

```text
# Les 7 protocoles, en parallèle — aucun fichier partagé :
Tâche T011 : sections/protocol-pre-workout.liquid       + templates/page.pre-workout.liquid
Tâche T012 : sections/protocol-post-workout.liquid      + templates/page.post-workout.liquid
Tâche T013 : sections/protocol-daily-recovery.liquid    + templates/page.daily-recovery.liquid
Tâche T014 : sections/protocol-skin-routine.liquid      + templates/page.skin-routine.liquid
Tâche T015 : sections/protocol-full-body-routine.liquid + templates/page.full-body-routine.liquid
Tâche T016 : sections/protocol-workday-routine.liquid   + templates/page.workday-routine.liquid
Tâche T017 : sections/protocol-index.liquid             + templates/page.protocols.liquid

# Puis, séquentiellement, les quatre vérifications transversales :
T018 (4 paramètres) → T019 (bloc « ne fait pas ») → T020 (longueurs d'onde) → T021 (allégations)
```

---

## Implementation Strategy

### MVP — User Story 1 seule

1. Phase 1 (T001–T003) : relever la ligne de base
2. Phase 2 (T004) : `editorial-hero`
3. Phase 3 (T006–T010) : la page de contact
4. **ARRÊT et VALIDATION** : formulaire envoyé JavaScript désactivé, en FR et en EN
5. Portes T041–T045, PR, merge, puis T048 pour `contact` seule

La pire page du site — un mot, atteignable en un clic depuis partout — devient utilisable. C'est
le plus court chemin entre l'état actuel et une amélioration mesurable.

### Livraison incrémentale

1. **Immédiatement, sans PR** : US6 (3 titres) et US5 (faq, how-to-use). Aucun fichier du dépôt,
   aucun risque de déploiement, gain SEO et contenu tout de suite
2. **PR 1 — lot 1** : US1 + US2 + `our-approach` d'US3. Onze pages publiables, aucune dépendance
   externe
3. **PR 2 — lot 2** : `our-story`, `quality`, `technology`, `bundles`, dès que `fact-dossier.md`
   est comblé
4. **Jamais** : une page dans une seule langue, ou une page du lot 2 dont un emplacement de fait
   est resté marqué

### Stratégie à deux développeurs

Le dépôt est partagé entre deux personnes, une branche appartient à une seule.

- Développeur A : US2 (les 7 protocoles) — le plus gros volume, entièrement parallélisable
- Développeur B : US1 puis US3 — le formulaire, puis les pages de marque
- Les tâches `[ADMIN]` (US5, US6, traductions, assignations) reviennent à qui a l'accès admin, et
  se mènent en parallèle du travail Liquid sans jamais entrer en conflit

---

## Notes

- **[ADMIN]** = action hors dépôt. Aucun agent ne peut l'exécuter ; elle se planifie avec la
  personne qui a l'accès Shopify. Treize tâches sur cinquante-trois sont dans ce cas
- Accents en entités HTML (`&eacute;`) dans tout fichier Liquid, comme les sections existantes
- Aucun fichier ajouté à `assets/` : `learn.css` et `learn.js` portent déjà tous les composants
  nécessaires (`research.md`, D3)
- La garde `{%- if page.content != blank -%}` de `templates/page.science.liquid` se recopie
  telle quelle dans chaque gabarit — c'est elle qui rend T048 → T049 sûr
- Commiter par page complète, pas par fichier : une section sans son gabarit n'est pas testable
- Un agent implémente, vérifie, ouvre la PR, et s'arrête là (constitution, principe I)

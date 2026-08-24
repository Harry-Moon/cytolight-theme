# Implementation Plan: Étoffer et traduire les pages portées par l'admin

**Branch**: `feat/pages-admin-bilingues` | **Date**: 2026-08-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-pages-admin-bilingues/spec.md`

> Le dossier de spec est `001-pages-admin-bilingues` ; spec-kit ne crée aucune branche et son
> `BRANCH_NAME` n'est qu'un identifiant de dossier. La branche git à créer à la main reste
> `feat/pages-admin-bilingues`, selon la convention du dépôt.

## Summary

Quinze des vingt et une pages portées par l'admin sont étoffées et traduites, par deux véhicules
distincts et figés. Les **11 pages structurées** — 7 Protocoles, 4 Pourquoi CytoLight — migrent
vers des gabarits de thème bilingues, sur le modèle exact de l'espace Learn : un
`templates/page.<handle>.liquid` mince appelant une `sections/<groupe>-<handle>.liquid` qui porte
les deux langues en dur. Les **4 pages du groupe Divers** — `contact`, `bundles`, `faq`,
`how-to-use` — gardent leur contenu dans l'admin, traduit par le mécanisme natif de Shopify, et
reçoivent au besoin une coquille de thème pour ce que l'éditeur admin ne sait pas produire (un
formulaire de contact, des cartes produit).

Le point décisif de la reconnaissance : **`assets/learn.css` porte déjà tous les composants
nécessaires** — `.ln-steps` / `.ln-step` (séquence numérotée automatiquement), `.ln-pledge` avec
son modificateur `--no` (ce que la séance ne fait pas), `.ln-faq`, `.ln-values`, `.ln-picks`.
Le chantier n'ajoute **aucun CSS et aucun JavaScript**. Il n'ajoute non plus aucune image. Le
coût pour le budget de performance est celui du texte, et rien d'autre.

Deux lots. Le **lot 1** (11 pages) se rédige à partir de faits déjà présents dans le thème ou
connus de l'entreprise, et se publie. Le **lot 2** (4 pages : `our-story`, `quality`,
`technology`, `bundles`) reçoit sa structure et ses emplacements marqués, et attend le dossier
de faits — livrable à part entière de ce chantier.

## Technical Context

**Pile** : Shopify Online Store 2.0 — Liquid, CSS et JavaScript écrits à la main. Aucun build,
aucun framework, aucune dépendance npm (constitution, principe IV).

**Fichiers créés** :

```text
snippets/editorial-hero.liquid                 # hero + fil d'Ariane bilingue, 11 réutilisations
sections/protocol-<handle>.liquid          × 7 # pre-workout, post-workout, daily-recovery,
                                               # skin-routine, full-body-routine,
                                               # workday-routine, protocols
sections/brand-<handle>.liquid             × 4 # our-approach, our-story, quality, technology
templates/page.<handle>.liquid            × 11 # coquilles minces, modèle page.science.liquid
templates/page.contact.liquid                  # coquille + {% form 'contact' %} natif
templates/page.bundles.liquid                  # coquille + cartes produit depuis all_products
```

**Fichiers modifiés** : aucun. `sections/header.liquid` n'est pas touché — les 15 handles ne
changent pas, et l'entrée CytoLight Pro reste en place (FR-022).

**Fichiers non créés, volontairement** : aucun `assets/*.css`, aucun `assets/*.js`. Les 13
gabarits chargent `learn.css` et `learn.js` par les deux mêmes lignes que `page.science.liquid`.

**Fiches produit concernées** : aucune. `sections/main-product.liquid` n'est pas touché.

**Contenu hors dépôt** (constitution, principe I) :

| Action | Où | Quand | Volume |
|---|---|---|---|
| Assigner le gabarit `page.<handle>` | Content → Pages | **après** le merge — voir Séquence | 13 pages |
| Vider le corps admin devenu redondant | Content → Pages | après assignation | 11 pages |
| Saisir la traduction EN des pages restées admin | Traduction native Shopify | avant le merge | 4 pages |
| Corriger 3 titres affichés en FR et EN | Content → Pages + traduction | indépendant du merge | 3 pages |
| Fournir le dossier de faits du lot 2 | hors outil | avant publication du lot 2 | 4 pages |

Aucune page à créer : les 15 existent. Aucun visuel à uploader dans Content → Files.

**Langues** : FR et EN, à parité. Les 11 pages migrées portent les deux langues inlinées dans le
Liquid via le booléen `is_fr` dérivé de `request.locale.iso_code`, exactement comme les sections
`learn-*`. Aucune chaîne ne part dans `locales/*.json` — le thème n'y met pas son contenu
éditorial. Les 4 pages restées dans l'admin passent par la traduction native Shopify. Accents en
entités HTML dans les fichiers Liquid, conformément aux sections existantes.

**Budget performance** : LCP ≤ 2,5 s, CLS ≤ 0,1 (p75 mobile), page initiale ≤ 1 Mo hors vidéo.
Cette fonctionnalité n'ajoute **aucun média**, aucune feuille de style et aucun script. Elle
ajoute du texte et réutilise deux fichiers déjà mis en cache par les pages Learn. L'impact
attendu sur le budget est nul.

**Vérification** : `shopify theme check` (plafond : 28 infractions, ne remonte pas) +
`shopify theme dev` sur les 15 pages, en FR et en EN, onglet Réseau ouvert, zéro 404 +
`python3 scripts/audit-nav.py --min-mots 250` comparé au résidu attendu.

## Constitution Check

*PORTE : doit passer avant la phase 0 (recherche). À revalider après la phase 1 (conception).*

Référence : `.specify/memory/constitution.md` v1.0.0.

- [x] **I — `main` est la production.** Aucune page à créer, aucun visuel à uploader, aucun
      `.json` de thème modifié. Le contenu hors dépôt est listé ci-dessus. Une réserve documentée :
      l'assignation du gabarit ne peut avoir lieu qu'**après** le merge, le sélecteur de l'admin
      ne listant que les gabarits du thème publié. Ce n'est pas une violation — la page existe,
      son URL répond, et pendant la fenêtre elle sert `templates/page.liquid` avec son contenu
      actuel. Aucun état intermédiaire n'affiche de page vide. Voir « Séquence de déploiement ».
      Aucun merge par un agent.
- [x] **II — Aucune allégation thérapeutique.** Les 7 pages Protocoles sont le terrain à risque
      et reçoivent une porte dédiée : chacune porte un bloc « ce que cette séance ne fait pas »
      (`.ln-pledge--no`), et la relecture d'allégations est une tâche distincte de la rédaction.
      Aucune page du chantier ne cite de littérature scientifique : la charge de l'encadré de
      limites ne se déclenche pas, et les pages renvoient vers `learn-science` plutôt que de
      dupliquer ses références.
- [x] **III — Rien d'inventé.** Le découpage en lots est la mise en œuvre directe de ce principe :
      les 4 pages dont les faits sont absents du dépôt ne se publient pas. Le dossier de faits
      manquants est un livrable. Aucun avis, aucune note, aucun témoignage, aucune certification
      n'est produit. Les longueurs d'onde citées sont reprises de `learn-wavelengths` et des
      fiches produit, pas rédigées à nouveau.
- [x] **IV — Lisible sans outillage.** Aucun build, framework, préprocesseur ni dépendance npm.
      **Aucun CSS et aucun JavaScript ajoutés** : les composants existent dans `learn.css`, et
      `learn.js` n'arme que ce qui porte `.ln-reveal` ou `.ln-tl`. Une page qui n'en porte pas
      s'affiche identiquement sans le script. Aucune règle du type `.ln-reveal { opacity: 0 }`
      n'est introduite. `prefers-reduced-motion` est déjà respecté par `learn.js`.
- [x] **V — `assets/` sans images.** Aucun média ajouté, nulle part. Aucune URL de CDN en dur,
      aucun domaine tiers. Les seules images affichées sont celles des cartes produit, servies
      par `all_products` via le snippet `learn-product-cta` existant.
- [x] **VI — FR et EN à parité.** Les 11 pages migrées portent les deux langues dans le même
      commit, `aria-label` compris. Les 4 pages restées dans l'admin ne le peuvent pas :
      **déviation assumée, documentée en Complexity Tracking**, compensée par une vérification
      d'audit obligatoire. Aucun portugais réintroduit ; l'entrée Pro et son portugais résiduel
      ne sont pas touchés.
- [x] **VII — Accessible et rapide.** Les composants `ln-*` réutilisés portent déjà les contrastes
      et les états de focus validés sur les pages Learn. Chaque page reçoit un `h1` unique et une
      hiérarchie de titres continue. Aucune image ajoutée, donc aucune question de `alt`,
      `width`/`height` ni de CLS. Le budget de poids est inchangé.

**Verdict initial** : PASS — une déviation assumée (principe VI, 4 pages), documentée.
**Verdict après conception** : PASS — voir « Revalidation post-conception ».

## Project Structure

### Documentation (this feature)

```text
specs/001-pages-admin-bilingues/
├── plan.md                              # Ce fichier
├── spec.md
├── research.md                          # Phase 0
├── data-model.md                        # Phase 1
├── quickstart.md                        # Phase 1
├── contracts/
│   ├── page-template-binding.md         # handle → gabarit → véhicule → lot → action admin
│   ├── content-contract.md              # ce que chaque page DOIT contenir, par groupe
│   └── audit-expectations.md            # sortie d'audit attendue, résidu Pro compris
├── checklists/
│   └── requirements.md
└── tasks.md                             # Phase 2 — /speckit-tasks, pas créé ici
```

### Arborescence du thème (racine du dépôt)

```text
sections/     # + 7 protocol-*.liquid, + 4 brand-*.liquid
snippets/     # + editorial-hero.liquid ; learn-product-cta.liquid réutilisé tel quel
templates/    # + 11 page.<handle>.liquid, + page.contact.liquid, + page.bundles.liquid
layout/       # inchangé
assets/       # INCHANGÉ — learn.css et learn.js réutilisés, aucun fichier ajouté
config/       # inchangé
locales/      # inchangé — le contenu éditorial n'y va pas
```

**Structure Decision**

**Une section par page, pas une section par groupe.** Un `case page.handle` à sept branches dans
un fichier unique aurait factorisé le squelette, mais aurait reproduit exactement le piège que la
constitution signale sur `sections/main-product.liquid` — « une modification DOIT être vérifiée
sur chaque variante ». Sept sections indépendantes se relisent, se diffent et se testent une par
une, et `/speckit-tasks` peut les paralléliser sans risque de collision. Le squelette répété est
ramené à un appel de snippet.

**Un snippet partagé, pas onze copies du hero.** `snippets/editorial-hero.liquid` porte le fil
d'Ariane, le kicker et le titre, en FR et en EN, paramétrés. C'est le seul fragment strictement
identique aux onze pages ; tout le reste diverge et reste dans sa section.

**Gabarit mince + section, pas de contenu dans le gabarit.** `templates/page.<handle>.liquid`
reprend `page.science.liquid` au mot près : chargement de `learn.css` / `learn.js`, appel de
section, puis `page.content` ajouté **si non vide**. Cette dernière clause n'est pas décorative —
c'est elle qui rend la séquence de déploiement sûre, en tolérant le corps admin résiduel pendant
la fenêtre d'assignation au lieu de le perdre ou de le dupliquer.

**Coquille de thème pour `contact` et `bundles`, contenu toujours admin.** L'éditeur de page de
l'admin ne sait produire ni formulaire ni carte produit. `templates/page.contact.liquid` porte le
`{% form 'contact' %}` natif de Shopify, `templates/page.bundles.liquid` les cartes tirées de
`all_products` — et l'un comme l'autre affichent le corps admin comme contenu principal. Ces deux
gabarits sont de la **coquille, pas du contenu** : ils ne font pas basculer ces pages dans le
véhicule « thème », exactement comme `page.faq.liquid` et `page.how-to-use.liquid` aujourd'hui.
Voir `contracts/page-template-binding.md`.

## Séquence de déploiement

L'ordre importe : le sélecteur « Theme template » de l'admin ne liste que les gabarits du thème
**publié**. Assigner avant de merger est impossible.

**Avant le merge** — la traduction EN des 4 pages restées dans l'admin est saisie ; les 3 titres
défectueux sont corrigés ; `shopify theme check` et `shopify theme dev` sont passés en FR et en EN.

**Le merge** — la PR arrive sur `main`, Shopify publie. Les 13 nouveaux gabarits existent mais
ne sont assignés à aucune page : les 13 pages servent encore `templates/page.liquid` et leur
contenu actuel. Rien ne casse, rien ne s'affiche vide.

**Après le merge, page par page** — assigner le gabarit dans Content → Pages, vérifier la page
en FR et en EN, puis vider le corps admin devenu redondant. Vider avant d'assigner produirait une
page quasi blanche pendant l'intervalle ; l'ordre inverse ne produit jamais rien de pire qu'un
paragraphe en double, visible et corrigible.

**La fenêtre à tenir courte** est celle entre le merge et la dernière assignation. Elle se mesure
en minutes, pas en jours, et se planifie avec la personne qui a accès à l'admin.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| **Principe VI** — la parité FR/EN de 4 pages (`contact`, `bundles`, `faq`, `how-to-use`) n'est pas attestée par le commit, leur contenu vivant dans l'admin | Décision du 2026-08-25 : ces pages doivent rester modifiables sans développeur — délais de réponse, conditions, questions fréquentes bougent sans passer par une PR | Tout migrer en gabarits de thème rendait la parité vérifiable en revue, mais gelait dans le code un contenu appelé à changer souvent, et faisait dépendre d'un déploiement la correction d'un délai de livraison. Compensation retenue : `python3 scripts/audit-nav.py` devient une porte obligatoire, seul endroit où les deux véhicules se rejoignent, et son résidu attendu est chiffré (`contracts/audit-expectations.md`) pour qu'une régression ne s'y noie pas |

## Revalidation post-conception

Reprise des sept portes après la phase 1, sur les artefacts réellement produits.

- **I** — `contracts/page-template-binding.md` liste les 13 assignations et les 11 vidages, page
  par page, avec leur position dans la séquence. Aucun `.json` de thème modifié. PASS.
- **II** — `contracts/content-contract.md` impose à chaque page Protocole un bloc « ce que cette
  séance ne fait pas » et une liste de termes proscrits vérifiable par `grep`, en FR et en EN.
  Aucune page ne cite de littérature. PASS.
- **III** — `data-model.md` porte l'entité « fait vérifiable » avec sa source obligatoire, et le
  dossier de faits manquants du lot 2 est nommé page par page. PASS.
- **IV** — la conception n'ajoute ni CSS ni JS. Aucune page migrée n'a besoin de `.ln-reveal` pour
  être lisible ; le script reste facultatif. PASS.
- **V** — aucun média. PASS.
- **VI** — 11 pages en parité de commit, 4 en parité vérifiée par audit, déviation tracée
  ci-dessus. PASS avec déviation.
- **VII** — `contracts/content-contract.md` impose un `h1` unique et une hiérarchie continue par
  page ; les composants réutilisés sont ceux déjà validés sur les pages Learn. PASS.

**Verdict** : PASS. Aucune porte bloquante, une déviation assumée et compensée.

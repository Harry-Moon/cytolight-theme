# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  Contexte technique CytoLight. La pile ne varie pas d'une fonctionnalité à l'autre :
  ne remplir que ce qui est spécifique à CETTE fonctionnalité, et supprimer les lignes
  sans objet plutôt que d'y écrire « N/A ».
-->

**Pile** : Shopify Online Store 2.0 — Liquid, CSS et JavaScript écrits à la main.
Aucun build, aucun framework, aucune dépendance npm (constitution, principe IV).

**Fichiers touchés** : [`sections/`, `snippets/`, `templates/`, `assets/`, `layout/`,
`config/` — lister les chemins réels]

**Fiches produit concernées** : [si `sections/main-product.liquid` est touché, lister les
handles à vérifier parmi cap, mask, knee, foot, desk, pano, pano-plus, pano-ultra,
sauna-dome — sinon supprimer cette ligne]

**Contenu hors dépôt** : [pages à créer dans l'admin Shopify, gabarits à assigner, visuels à
uploader dans Content → Files, collections à créer. Ces éléments DOIVENT exister avant le
merge — constitution, principe I]

**Langues** : FR et EN, à parité. [Préciser si des chaînes vont dans `locales/*.json` ou
restent inlinées dans le Liquid]

**Budget performance** : LCP ≤ 2,5 s, CLS ≤ 0,1 (p75 mobile), page initiale ≤ 1 Mo hors
vidéo. [Préciser si cette fonctionnalité ajoute des médias lourds]

**Vérification** : `shopify theme check` (plafond : 28 infractions, ne remonte pas) +
`shopify theme dev` sur les pages affectées, onglet Réseau ouvert, zéro 404.

## Constitution Check

*PORTE : doit passer avant la phase 0 (recherche). À revalider après la phase 1 (conception).*

Référence : `.specify/memory/constitution.md` v1.0.0. Cocher chaque ligne, ou justifier la
violation dans « Complexity Tracking ». Une case laissée vide bloque le passage aux tâches.

- [ ] **I — `main` est la production.** Tout élément externe référencé (page admin, gabarit,
      visuel dans Content → Files, collection) est listé dans « Contenu hors dépôt » et sera
      créé AVANT le merge. Tout `.json` de thème modifié sera validé. Aucun merge par un agent.
- [ ] **II — Aucune allégation thérapeutique.** Le contenu ajouté ne promet ni traitement, ni
      guérison, ni soulagement d'une pathologie. Toute référence scientifique porte un DOI ou
      un PMID, et toute page qui en cite conserve son encadré de limites.
- [ ] **III — Rien d'inventé.** Aucun chiffre, avis, note, témoignage, certification ou logo
      de presse qui n'existe pas et ne soit vérifiable. Aucune spécification technique publiée
      sans correspondance avec la fiche fournisseur.
- [ ] **IV — Lisible sans outillage.** Aucun build, framework, préprocesseur ni dépendance npm
      introduit. Le JavaScript est progressif : la page reste lisible s'il ne charge pas, le CSS
      ne masque rien de lui-même, `prefers-reduced-motion` est respecté.
- [ ] **V — `assets/` sans images.** Aucun média dans `assets/`. Aucune URL de CDN en dur,
      aucun domaine tiers : `file_url` ou `image_url` uniquement.
- [ ] **VI — FR et EN à parité.** Chaque chaîne ajoutée existe dans les deux langues, y compris
      les `aria-label` et les messages d'interface. Aucun portugais réintroduit.
- [ ] **VII — Accessible et rapide.** Contraste ≥ 4,5:1, navigation clavier avec focus visible,
      nom accessible contenant le texte visible, `alt` sur toute image porteuse de sens,
      `width`/`height` réels. Budget LCP / CLS / poids tenu.

**Verdict initial** : [PASS / VIOLATIONS À JUSTIFIER]
**Verdict après conception** : [à remplir en fin de phase 1]

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Arborescence du thème (racine du dépôt)

<!--
  Structure réelle et figée du thème. Ne pas la réinventer : lister les fichiers que
  CETTE fonctionnalité crée ou modifie, et supprimer les dossiers non concernés.
-->

```text
sections/     # Sections de page. main-product.liquid sert les 8 fiches via des booléens
              # de handle ; cytolight-home.liquid porte la page d'accueil ; learn-*.liquid
              # les pages éditoriales
snippets/     # Fragments réutilisables (product-card, icon, learn-nav, structured-data...)
templates/    # Points d'entrée. index.liquid appelle cytolight-home ; page.*.liquid les
              # gabarits Learn ; product/collection/cart.json sont AUTO-GÉNÉRÉS
layout/       # theme.liquid (enveloppe globale, :root, @font-face) et password.liquid
assets/       # CSS, JS et polices UNIQUEMENT — jamais d'images
config/       # settings_schema.json (définitions) ; settings_data.json est AUTO-GÉNÉRÉ
locales/      # Chaînes d'interface traduisibles
```

Fichiers auto-générés par l'éditeur de thème Shopify — ne pas modifier à la main sans
intention explicite : `config/settings_data.json`, `templates/product.json`,
`templates/collection.json`, `templates/cart.json`.

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

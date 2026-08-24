# Specification Quality Checklist: Étoffer et traduire les pages portées par l'admin

**Purpose**: Validate specification completeness and quality before proceeding to planning
**Created**: 2026-08-25
**Feature**: [spec.md](../spec.md)

## Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

## Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic (no implementation details)
- [x] All acceptance scenarios are defined
- [x] Edge cases are identified
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

## Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows
- [x] Feature meets measurable outcomes defined in Success Criteria
- [x] No implementation details leak into specification

## Notes

**Itération 1 — 2026-08-25.** Trois marqueurs `[NEEDS CLARIFICATION]` sur FR-004 (véhicule de
la parité), FR-016 (source des faits) et FR-017 (arbitrage CytoLight Pro). Posés au porteur du
projet plutôt que comblés par hypothèse : le brief produit marque les faits concernés
`[À COMPLÉTER]`, et la constitution (principe III) interdit de les déduire.

**Itération 2 — 2026-08-25.** Réponses reçues et réinjectées. Tous les items au vert.

| Question | Réponse | Effet sur la spec |
|---|---|---|
| Véhicule de la parité | **Hybride** | FR-004 / FR-005 / FR-006 : gabarits de thème pour Protocoles (7) et Pourquoi CytoLight (4), contenu admin traduit nativement pour Divers (4). Le « MUST être unique » d'origine est remplacé par une affectation nommée et figée, page par page |
| CytoLight Pro | **Ne rien faire maintenant** | Périmètre ramené de 21 à 15 pages. Section « Arbitrage reporté » + FR-022 / FR-023 + SC-003 : le résidu d'audit attendu est chiffré pour qu'une vraie régression ne s'y noie pas |
| Nature du livrable | **Structure + emplacements marqués** | Section « Lots de livraison » + FR-013 à FR-016 : lot 1 (11 pages publiables) / lot 2 (4 pages en attente). Le dossier de faits manquants devient un livrable |

**Décision reportée, assumée.** L'entrée CytoLight Pro du mega-menu continuera de mener à six
ébauches monolingues d'une centaine de mots. Le brief produit qualifiait ce cas de coût net
(« un menu qui mène nulle part coûte plus qu'il ne rapporte »). La spec l'inscrit comme dette
datée avec son déclencheur de reprise — l'existence par écrit des conditions commerciales
professionnelles — plutôt que comme silence.

**Tolérances assumées :**

- *No implementation details* — la spec nomme `sections/header.liquid`, `templates/page.liquid`,
  `sections/learn-wavelengths.liquid` et `scripts/audit-nav.py`. Ce ne sont pas des choix de
  mise en œuvre mais l'état de fait constaté par l'audit et la source unique des URL de
  navigation : les taire rendrait les contraintes de périmètre invérifiables.
- *Success criteria technology-agnostic* — SC-012 et SC-013 citent `shopify theme check` et
  `shopify theme dev`. Ce sont les portes de qualité imposées par la constitution
  (« Workflow et portes de qualité »), obligatoires avant toute PR, pas des choix techniques de
  cette feature.

**Conflits signalés dans la spec** (section « Conflits à signaler ») : principes VI (parité dans
le même commit, inapplicable aux 4 pages restées dans l'admin), III (faits absents du dépôt,
d'où le lot 2) et II (les 7 pages Protocoles sont le terrain naturel du glissement d'allégation).

Aucun item incomplet. Spec prête pour `/speckit-plan`.

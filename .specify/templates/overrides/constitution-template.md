<!--
  Scaffold de la constitution CytoLight.

  Ce fichier remplace le template generique de spec-kit (priorite 1 dans la pile de
  resolution). Il existe pour qu'un futur `/speckit-constitution` amende la constitution
  en place, au lieu de la reconstruire sur un squelette a cinq principes qui ne
  correspond ni au nombre ni a la nature des principes adoptes.

  Regles pour l'agent qui amende :
  - `.specify/memory/constitution.md` fait foi. Preserver chaque principe encore
    applicable, avec son intitule et sa numerotation romaine.
  - Les principes marques NON NEGOCIABLE ne s'assouplissent que sur une base factuelle
    nouvelle et documentee. Le signaler explicitement dans le Sync Impact Report.
  - Le nombre de principes n'est pas fixe : sept aujourd'hui. En ajouter est un MINOR,
    en retirer ou en redefinir de facon incompatible est un MAJOR.
  - Rediger en francais, accents reels, MUST / DOIT plutot que « il faudrait ».
  - Chaque principe : un intitule court, des regles verifiables, et une ligne *Raison*
    qui dit ce que la regle empeche concretement. Une regle sans raison se contourne.
-->

# Constitution [PROJECT_NAME]

[CONTEXTE_PROJET]
<!-- Une a deux phrases : ce que vend le projet, a qui, par quel canal. Puis le renvoi
     vers `.specify/memory/product-brief.md` pour la direction, qui evolue plus vite. -->

## Principes fondamentaux

### I. [PRINCIPLE_1_NAME]

[PRINCIPLE_1_DESCRIPTION]

*Raison* : [PRINCIPLE_1_RATIONALE]

### II. [PRINCIPLE_2_NAME]

[PRINCIPLE_2_DESCRIPTION]

*Raison* : [PRINCIPLE_2_RATIONALE]

### III. [PRINCIPLE_3_NAME]

[PRINCIPLE_3_DESCRIPTION]

*Raison* : [PRINCIPLE_3_RATIONALE]

### IV. [PRINCIPLE_4_NAME]

[PRINCIPLE_4_DESCRIPTION]

*Raison* : [PRINCIPLE_4_RATIONALE]

### V. [PRINCIPLE_5_NAME]

[PRINCIPLE_5_DESCRIPTION]

*Raison* : [PRINCIPLE_5_RATIONALE]

### VI. [PRINCIPLE_6_NAME]

[PRINCIPLE_6_DESCRIPTION]

*Raison* : [PRINCIPLE_6_RATIONALE]

### VII. [PRINCIPLE_7_NAME]

[PRINCIPLE_7_DESCRIPTION]

*Raison* : [PRINCIPLE_7_RATIONALE]

## Contraintes techniques

[CONTRAINTES_TECHNIQUES]
<!-- Pile, conventions structurantes, pieges connus du framework, dette plafonnee. Ce qui
     est vrai du code et qu'un nouvel arrivant paierait cher a redecouvrir seul. -->

## Workflow et portes de qualite

[WORKFLOW]
<!-- Quand une spec formelle est obligatoire ; convention de branches ; la liste exacte
     des verifications qui rendent une PR proposable ; l'automatisation cible. -->

## Gouvernance

[GOVERNANCE_RULES]
<!-- Portee (humains et agents), procedure d'amendement, politique de versionnement
     semantique, revue de conformite, et renvoi vers CLAUDE.md et le brief produit. -->

**Version** : [CONSTITUTION_VERSION] | **Ratifiee** : [RATIFICATION_DATE] | **Dernier amendement** : [LAST_AMENDED_DATE]

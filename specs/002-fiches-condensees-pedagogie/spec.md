# Feature Specification: Condenser les fiches produit et rendre l'accueil pédagogique

**Feature Branch**: `feat/fiches-condensees-pedagogie`

**Created**: 2026-08-31

**Status**: Draft — une clarification en attente (voir « Question ouverte »)

**Input**: Retour de l'associé n°3 : « le site est déjà beau et professionnel, il ne faut pas
casser la partie esthétique ; il faut le rendre plus clair, plus pédagogique, plus compact et
plus efficace commercialement. »

## Contexte

Le reproche n'est pas esthétique, il est cognitif : la page ne dit pas assez vite ce qu'elle
vend. Deux mesures le confirment, prises sur le thème tel qu'il est servi aujourd'hui.

**La fiche produit.** `sections/main-product.liquid` fait 1 997 lignes et rend, selon le
handle, entre 8 et 12 blocs de premier niveau, 44 questions de FAQ réparties par variante et
74 lignes de tableau technique. La densité varie fortement d'un produit à l'autre :

| Bloc rendu | desk / pano-plus | pano-ultra | cap | mask | foot | knee | sauna |
|---|---|---|---|---|---|---|---|
| Blocs de premier niveau | 9 | 9 | 9 | 11 | 10 | 11 | 10 |
| Cartes « pourquoi » | 8 | 5 | 8 | 8 | 8 | 8 | 8 |
| Lignes de tableau technique | 13 | 13 | 10 | 14 | 10 | 8 | 14 |
| Questions de FAQ | 12 | 12 | 7 | 8 | 7 | 6 | 4 |

L'information existe donc, en quantité. Elle est **étalée** : le visiteur doit franchir le
hero plein écran, une section d'introduction, une galerie de fonctionnalités et un bandeau de
statistiques avant d'atteindre l'essentiel de ce qu'il cherchait, et la même donnée — les
longueurs d'onde, par exemple — réapparaît dans quatre blocs distincts sans jamais être
rassemblée.

**La page d'accueil.** Elle enchaîne les grands visuels avant d'expliquer quoi que ce soit.
Un visiteur qui ne connaît pas la photobiomodulation ne trouve pas, dans le premier écran de
défilement, de réponse à « à quoi sert la lumière rouge ». Les blocs qui fonctionnent — « La
bonne lumière au bon moment », le slider catalogue, « Par objectif » — ne sont pas en cause.

**Trois références de structure, jamais de texte.** Mito Light pour la densité d'une fiche
produit — bénéfices, usages, longueurs d'onde, technologie, schémas et photos dans une même
zone. BlockBlueLight pour la logique du descriptif en haut de fiche, à dépasser en contenu.
Platinum Red Light Therapy pour la pédagogie d'accueil. Aucun texte, aucune illustration et
aucune formulation de ces sites n'entre dans le thème.

### Conflits à signaler (constitution)

**Principe II — le mot « bénéfices » est la zone la plus exposée du site.** Le brief demande
d'exposer « les principaux bénéfices » de la lumière rouge dès la page d'accueil. Les appareils
sont des produits de bien-être sans marquage CE de dispositif médical : toute formulation
laissant entendre un traitement, un soulagement ou une amélioration d'une pathologie est une
pratique commerciale trompeuse au sens de l'article L.121-2, quelle que soit la littérature
citée. La contrainte n'interdit pas d'expliquer — elle interdit de promettre. Ce chantier
DOIT donc arbitrer, sur chaque énoncé de bénéfice, entre le mécanisme (autorisé), l'usage
(autorisé), le ressenti au conditionnel (autorisé) et l'effet sur une pathologie (interdit).
C'est l'objet de la question ouverte plus bas.

**Principe II, second volet.** Toute page citant de la littérature scientifique porte un
encadré explicitant ce que ces travaux ne disent pas, et chaque affirmation scientifique porte
un identifiant vérifiable. Le bloc « Ce que ces études ne disent pas » de
`sections/learn-science.liquid` est le modèle. Si le bloc pédagogique d'accueil cite de la
recherche, il porte cet encadré ; s'il ne peut pas le porter, il ne cite pas de recherche.

**Principe VII — condenser ne doit pas dégrader.** Regrouper des blocs augmente mécaniquement
la densité visuelle. Les seuils restent : contraste ≥ 4,5:1, focus visible, hiérarchie de
titres continue, LCP ≤ 2,5 s et CLS ≤ 0,1 au 75e centile mobile, page initiale hors vidéo
≤ 1 Mo. Une fiche plus courte qui charge autant d'images n'a rien gagné.

**Principe VI — la parité s'applique au nouveau contenu.** Chaque énoncé ajouté existe en FR
et en EN dans le même commit, `aria-label` compris.

### Hors périmètre

- Les protocoles, « Pourquoi CytoLight », la FAQ, le mode d'emploi, la page contact et les
  21 pages portées par l'admin appartiennent à `specs/001-pages-admin-bilingues`, déjà
  spécifié et découpé en 53 tâches. Ce chantier ne les relance pas et ne les duplique pas.
- Les CGV, mentions légales, conditions de livraison et de garantie font l'objet d'une revue
  dédiée. Ce chantier ne les modifie pas, mais **en dépend** : une fiche condensée qui annonce
  une garantie ou un délai de rétractation doit citer la valeur que portent ces pages.
- La vérification du parcours d'achat est livrée par `scripts/audit-parcours.py`, hors de cette
  spec. Elle en est la porte de vérification, pas un livrable.
- Le développement de « Par objectif » et l'argumentaire de vente comparatif viennent après,
  dans l'ordre de priorité de l'associé.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Le visiteur comprend le produit avant de défiler (Priority: P1) 🎯 MVP

Un visiteur qui arrive sur une fiche depuis une publicité ou une recherche obtient, sans
défiler au-delà de la zone d'achat, les sept réponses qu'il est venu chercher : ce qu'est
l'appareil, à quoi il sert, à qui il s'adresse, ce qui le distingue, ses longueurs d'onde,
ses usages principaux et comment on l'utilise.

**Why this priority**: c'est la promesse centrale du retour. Un visiteur qui ne comprend pas
en trente secondes ne défile pas jusqu'aux blocs qui l'auraient convaincu.

**Independent Test**: ouvrir chacune des huit fiches en FR puis en EN, s'arrêter au bas de la
zone d'achat, et vérifier que les sept réponses y sont, sans avoir ouvert un onglet ni suivi
un lien.

**Acceptance Scenarios**:

1. **Given** une fiche produit ouverte sur mobile, **When** le visiteur a lu jusqu'au bouton
   d'ajout au panier sans le dépasser, **Then** les sept réponses lui ont été présentées.
2. **Given** une fiche produit, **When** le visiteur cherche les longueurs d'onde,
   **Then** il les trouve à un seul endroit, chiffrées, et cohérentes avec le tableau
   technique de la même page.
3. **Given** la même fiche servie en anglais, **When** on compte les énoncés du bloc
   descriptif, **Then** les sept réponses y figurent aussi.

---

### User Story 2 - La fiche se lit sans défiler plusieurs minutes (Priority: P2)

Le contenu actuel est conservé mais regroupé : les blocs qui traitent du même sujet fusionnent,
les données répétées d'un bloc à l'autre ne sont plus dites qu'une fois, et les photos qui
s'enchaînent laissent place à une composition unique.

**Why this priority**: c'est le reproche explicite — « trop de gros blocs et trop de photos qui
s'enchaînent ». Il se traite après US1, parce que condenser sans avoir d'abord posé le bloc
descriptif reviendrait à retirer de l'information sans rien donner en échange.

**Independent Test**: mesurer la hauteur de défilement de chaque fiche avant et après, en FR
et en EN, sur un viewport mobile de référence ; compter les blocs de premier niveau et les
images rendues par handle.

**Acceptance Scenarios**:

1. **Given** une fiche condensée, **When** on compare son contenu à la version précédente,
   **Then** aucune donnée chiffrée, aucun usage et aucune spécification n'a disparu du site —
   ce qui sort de la fiche est atteignable depuis la fiche.
2. **Given** les huit fiches, **When** on compte les blocs de premier niveau,
   **Then** l'écart entre la fiche la plus légère et la plus lourde a diminué.
3. **Given** une fiche condensée sur mobile, **When** on mesure le poids de la page initiale
   hors vidéo, **Then** il ne dépasse pas 1 Mo et le CLS reste ≤ 0,1.

---

### User Story 3 - L'accueil explique la technologie avant de la montrer (Priority: P3)

Un visiteur qui découvre la photobiomodulation trouve tôt dans la page une explication simple :
ce que fait la lumière rouge, ce que fait le proche infrarouge, pourquoi la longueur d'onde
change quelque chose, et à quoi cela sert au quotidien.

**Why this priority**: elle sert l'acquisition mais ne bloque pas la conversion d'un visiteur
déjà informé, contrairement à US1 et US2.

**Independent Test**: ouvrir la page d'accueil en FR puis en EN sur mobile et vérifier que
l'explication est atteinte avant les blocs déjà validés, sans avoir quitté la page.

**Acceptance Scenarios**:

1. **Given** un visiteur arrivant sur l'accueil, **When** il défile jusqu'au bloc pédagogique,
   **Then** il lit à quoi sert la lumière rouge et le proche infrarouge sans qu'aucune phrase
   ne promette un effet sur une pathologie.
2. **Given** le bloc pédagogique, **When** il cite un travail scientifique, **Then** cette
   citation porte un identifiant vérifiable et la page porte l'encadré sur les limites.
3. **Given** la page d'accueil après modification, **When** on cherche « La bonne lumière au
   bon moment », le slider catalogue et « Par objectif », **Then** les trois sont toujours là
   et fonctionnent.

---

### User Story 4 - Les descriptions correspondent à ce qu'on vend (Priority: P4)

Chaque description de produit est relue contre la fiche du fournisseur et contre le
positionnement du brief produit : ce qui n'est pas vérifiable sort, ce qui manque entre.

**Why this priority**: c'est une revue, pas une construction ; elle peut suivre les trois
autres sans les bloquer.

**Independent Test**: pour chaque produit, confronter chaque chiffre publié à sa source et
consigner l'écart.

**Acceptance Scenarios**:

1. **Given** une description produit, **When** on relève chaque chiffre publié, **Then**
   chacun est traçable à une fiche fournisseur nommée.
2. **Given** un chiffre sans source, **When** la relecture le rencontre, **Then** il est retiré
   plutôt que reformulé.

---

### Edge Cases

- **Un produit sans deuxième photo** : la composition condensée ne doit pas laisser un cadre
  vide. Le repli est l'image principale, comme le fait déjà la section d'introduction.
- **Un produit hors catalogue par défaut** (`cytolight-desk`, `cytolight-pano-plus` retombent
  sur la branche par défaut) : il reçoit le bloc descriptif comme les autres, sans branche
  dédiée qui ferait diverger à nouveau les variantes.
- **Le Sauna Dome** vient d'un autre fournisseur et sa fiche doit être refaite : il entre dans
  ce chantier avec ses propres données, ou il en sort explicitement, jamais par oubli.
- **JavaScript indisponible** : un bloc descriptif replié par script doit rester lu en entier
  si le script ne charge pas. Le CSS ne masque jamais de lui-même.
- **Mouvement réduit** : toute composition animée respecte `prefers-reduced-motion`.
- **Traduction manquante** : une variante qui n'aurait pas son texte anglais ne se publie pas.

## Requirements *(mandatory)*

### Bloc descriptif de tête

- **FR-001** : chaque fiche produit DOIT répondre, avant la fin de la zone d'achat, aux sept
  questions : nature du produit, usage, destinataire, différenciation, longueurs d'onde,
  usages principaux, mode d'emploi.
- **FR-002** : chaque réponse DOIT exister en FR et en EN dans le même commit.
- **FR-003** : les longueurs d'onde annoncées DOIVENT concorder avec le tableau technique de la
  même fiche et avec `sections/learn-wavelengths.liquid`. En cas d'écart, `learn-wavelengths`
  fait foi.
- **FR-004** : la différenciation DOIT s'appuyer sur une caractéristique vérifiable de
  l'appareil, jamais sur une comparaison avec un concurrent nommé ni sur un superlatif.
- **FR-005** : le mode d'emploi DOIT donner au moins la durée et la fréquence, chiffrées.

### Condensation

- **FR-006** : aucune donnée chiffrée, aucune spécification et aucun usage présent avant le
  chantier NE DOIT disparaître du site. Ce qui sort de la fiche DOIT rester atteignable depuis
  la fiche.
- **FR-007** : une même donnée NE DOIT plus être répétée dans plus de deux blocs d'une fiche.
- **FR-008** : les huit fiches DOIVENT converger vers la même ossature : mêmes blocs, dans le
  même ordre, quel que soit le handle. Les différences relèvent du contenu, pas de la structure.
- **FR-009** : la fiche DOIT conserver un seul `h1`, celui du titre produit.
- **FR-010** : le nombre d'images rendues par fiche NE DOIT pas augmenter.

### Pédagogie de l'accueil

- **FR-011** : la page d'accueil DOIT porter une explication de la photobiomodulation
  atteignable avant les blocs existants « La bonne lumière au bon moment », slider et
  « Par objectif ».
- **FR-012** : cette explication DOIT couvrir le rôle de la lumière rouge, celui du proche
  infrarouge et la raison pour laquelle la longueur d'onde change quelque chose.
- **FR-013** : les trois blocs cités DOIVENT rester en place et fonctionnels.
- **FR-014** : l'explication DOIT être compréhensible sans vocabulaire technique préalable.

### Conformité — allégations et véracité

- **FR-015** : aucun énoncé de bénéfice NE DOIT affirmer un traitement, une guérison, un
  soulagement, une réduction de douleur ni un effet anti-inflammatoire, ni le suggérer par
  l'image, le vocabulaire de prescription ou une mise en scène médicale.
- **FR-016** : un effet s'énonce au conditionnel ; une caractéristique physique de l'appareil
  s'énonce à l'indicatif.
- **FR-017** : toute citation de littérature scientifique DOIT porter un identifiant vérifiable
  (DOI ou PMID) et la page DOIT porter l'encadré « ce que ces études ne disent pas », sur le
  modèle de `sections/learn-science.liquid`.
- **FR-018** : aucun avis, note, témoignage, logo de presse ni effectif client NE DOIT être
  ajouté sans exister réellement.
- **FR-019** : aucun texte, aucune illustration et aucune formulation des trois sites de
  référence NE DOIT être repris. Ils servent de référence de structure.
- **FR-020** : toute promesse commerciale citée sur une fiche (durée d'essai, durée de
  garantie, seuil de livraison offerte) DOIT porter la même valeur que les pages légales et
  que le reste du site. `scripts/audit-parcours.py` en est la porte de vérification.

### Accessibilité et performance

- **FR-021** : hiérarchie de titres continue, focus visible, contraste ≥ 4,5:1, nom accessible
  contenant le texte visible.
- **FR-022** : toute image porteuse de sens porte un `alt`, `width` et `height` réels.
- **FR-023** : la page reste lisible et navigable si le JavaScript ne charge pas.
- **FR-024** : `prefers-reduced-motion` respecté partout où il y a du mouvement.

### Key Entities

- **Fiche produit** — une des huit pages servies par `sections/main-product.liquid`, identifiée
  par son handle, portant un bloc descriptif, une zone d'achat, un tableau technique et une FAQ.
- **Bloc descriptif** — l'ensemble des sept réponses, en tête de fiche, en FR et en EN.
- **Bloc pédagogique** — l'explication de la photobiomodulation sur la page d'accueil.
- **Énoncé de bénéfice** — toute phrase décrivant ce que l'usage apporte au visiteur ; l'objet
  du contrôle de conformité.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001** : un visiteur obtient les sept réponses sans dépasser la zone d'achat, sur les
  huit fiches, en FR et en EN.
- **SC-002** : la hauteur de défilement d'une fiche, du haut jusqu'au début de la FAQ, diminue
  d'au moins 30 % sur un viewport mobile de référence, à contenu conservé.
- **SC-003** : l'écart de nombre de blocs de premier niveau entre la fiche la plus légère et la
  plus lourde tombe à un au plus, contre trois aujourd'hui.
- **SC-004** : aucune donnée présente avant le chantier n'est devenue introuvable depuis la
  fiche.
- **SC-005** : la page d'accueil expose l'explication de la photobiomodulation avant les blocs
  conservés, dans les deux langues.
- **SC-006** : `scripts/audit-parcours.py` ne relève aucune promesse commerciale contradictoire
  sur l'ensemble du catalogue.
- **SC-007** : `shopify theme check` n'introduit aucune infraction nouvelle par rapport à
  `origin/main`.
- **SC-008** : la relecture d'allégations ne relève aucune occurrence du lexique interdit, ni
  aucune tournure suggérant un effet thérapeutique.
- **SC-009** : LCP ≤ 2,5 s et CLS ≤ 0,1 au 75e centile mobile, page initiale hors vidéo ≤ 1 Mo,
  sur les huit fiches et sur l'accueil.
- **SC-010** : chaque chiffre publié sur une fiche est traçable à une source nommée.

## Assumptions

- **Le contenu retiré d'une fiche n'est pas supprimé du site.** Il migre vers l'onglet
  technique, la FAQ de la même fiche ou l'espace Learn, et reste atteignable depuis la fiche.
  Condenser signifie regrouper, pas appauvrir.
- **Les photos existantes sont conservées.** Ce sont des actifs commerciaux ; le reproche porte
  sur leur enchaînement, pas sur leur nombre absolu. Elles sont recomposées, pas supprimées.
- **L'esthétique actuelle est le point de départ.** Palette, typographie et langage visuel ne
  changent pas ; ce chantier n'est pas une refonte de direction artistique.
- **Le viewport mobile de référence** est celui utilisé pour les mesures de performance
  existantes, à fixer en phase de plan.
- **Le Sauna Dome** entre dans le chantier avec les données de son fournisseur, qui diffèrent
  des sept autres produits. Sa fiche est traitée en dernier.
- **Les huit fiches restent servies par une seule section** conditionnée au handle. La
  convergence d'ossature réduit le branchement, elle ne le remplace pas par huit fichiers.

## Question ouverte

Une seule décision manque, et elle est bloquante pour US3 et pour tout énoncé de bénéfice.

### Q1 : jusqu'où va-t-on dans l'exposé des bénéfices ?

**Contexte** : le brief demande « quels sont les principaux bénéfices ». Le principe II
interdit toute allégation thérapeutique. Entre les deux, il existe une marge réelle, et le
choix de sa largeur détermine la rédaction de tout le chantier.

**Ce qu'il faut savoir** : quel registre les énoncés de bénéfice adoptent-ils sur l'accueil et
sur les fiches ?

| Option | Registre | Implications |
|--------|----------|--------------|
| A | **Mécanisme et usage seulement.** On explique ce que fait la lumière sur les tissus et dans quelles routines on l'utilise. Aucun bénéfice n'est nommé comme résultat. | Le plus sûr juridiquement, et le moins vendeur. Aucun encadré scientifique nécessaire, aucune source à réunir. Risque : la page reste descriptive et ne répond pas à « pourquoi j'achèterais ». |
| B | **Mécanisme, usage et ressenti au conditionnel**, adossés à la littérature déjà citée dans `learn-science.liquid`, avec son encadré sur les limites reporté sur l'accueil. | L'équilibre que la constitution décrit explicitement comme autorisé. Demande de réutiliser les références existantes et de porter l'encadré. C'est le registre que tient déjà l'espace Learn. |
| C | **Bénéfices nommés par domaine** — récupération, peau, sommeil, énergie — présentés comme les usages pour lesquels la lumière rouge est étudiée, sans promesse individuelle. | Le plus proche du brief et des concurrents cités. Demande une source par domaine et un cadrage serré, énoncé par énoncé. Le risque de glissement est réel et se paie en suspension de compte publicitaire. |
| Custom | Autre registre | À préciser. |

**Recommandation** : **B**. C'est le seul registre que la constitution nomme comme autorisé
sans condition supplémentaire, l'espace Learn le tient déjà, et il permet de répondre à
« pourquoi j'achèterais » sans rien promettre. C accroît la portée commerciale mais déplace la
charge de la preuve sur chaque domaine cité, et la sanction ne porte pas sur une phrase isolée
mais sur le compte publicitaire entier.

**Votre choix** : _en attente_

## Dépendances

- `specs/001-pages-admin-bilingues` — les protocoles et « Pourquoi CytoLight » y sont traités.
  Une fiche condensée qui renvoie vers un protocole dépend de leur existence.
- Revue des pages légales — les valeurs de garantie, de rétractation et de livraison citées sur
  les fiches en proviennent.
- `scripts/audit-parcours.py` — porte de vérification de SC-006.

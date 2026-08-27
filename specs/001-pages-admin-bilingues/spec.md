# Feature Specification: Étoffer et traduire les pages portées par l'admin

**Feature Branch**: `feat/pages-admin-bilingues`

**Created**: 2026-08-25

**Status**: Draft

**Input**: User description: "Étoffer et traduire les 21 pages portées par l'admin"

## Contexte

L'audit de navigation du 2026-08-21 (`python3 scripts/audit-nav.py`, 42 URL, FR et EN) n'a
relevé **aucun lien cassé** : toutes les pages existent. Le défaut suit la ligne de faille entre
les deux origines de contenu du site.

| Origine | Volume | FR / EN | Verdict |
|---|---|---|---|
| Le thème (sections Liquid avec `is_fr`) | 600 – 2 800 mots | écart de 20 à 25 % | sain |
| L'admin (Shopify Pages, servi par `templates/page.liquid`) | 1 – 175 mots | **identiques au mot près** | ébauches monolingues |

**21 pages sont strictement identiques en FR et en EN — la totalité des pages de l'admin, sans
exception.** Les 21 sont liées depuis `sections/header.liquid` : chacune est atteignable en un
ou deux clics depuis n'importe quelle page du site.

| Groupe | Handles | Volume actuel | Périmètre |
|---|---|---|---|
| Protocoles | `daily-recovery`, `full-body-routine`, `post-workout`, `pre-workout`, `protocols`, `skin-routine`, `workday-routine` | 72 – 118 mots | **dans le périmètre** |
| Pourquoi CytoLight | `our-approach`, `our-story`, `quality`, `technology` | 86 – 124 mots | **dans le périmètre** |
| Divers | `bundles` (43), `contact` (**1 mot**), `faq` (175), `how-to-use` (166) | 1 – 175 mots | **dans le périmètre** |
| CytoLight Pro | `become-a-dealer`, `clinics`, `corporate-wellness`, `gyms`, `hotels-spas`, `physios` | 75 – 116 mots | **reporté** — voir « Arbitrage reporté » |

S'y ajoutent trois **titres SEO défectueux** — des handles affichés comme titres, visibles dans
l'onglet du navigateur et dans les résultats Google : `/pages/nos-valeurs` s'intitule
« our-values », `/pages/comment-ca-marche` « how-it-works », `/pages/benefits` « benefits ».

**Périmètre retenu : 15 pages sur 21**, plus la correction de trois titres.

### Décisions arrêtées le 2026-08-25

1. **Véhicule hybride.** Les groupes structurés — Protocoles (7) et Pourquoi CytoLight (4) —
   migrent vers des gabarits de thème bilingues sur le modèle de l'espace Learn. Le groupe
   Divers (4) garde son contenu dans l'admin, traduit par le mécanisme de traduction natif de
   Shopify. Deux véhicules coexistent donc, chacun affecté à un périmètre nommé et figé.
2. **CytoLight Pro : ne rien faire maintenant.** Ni écrire les six pages, ni retirer l'entrée
   du menu. L'arbitrage est reporté, pas résolu.
3. **Livraison en deux lots.** Ce qui peut être écrit à partir de faits déjà connus est rédigé
   intégralement et publié. Ce qui dépend de faits absents du dépôt reçoit sa structure et un
   emplacement marqué, et attend que ces faits soient fournis.

### Arbitrage reporté — CytoLight Pro

Les six pages du groupe Pro restent en l'état : ~100 mots, identiques en FR et en EN, et
l'entrée **CytoLight Pro** du mega-menu continue d'y mener. C'est une **dette assumée et
datée**, pas un oubli.

Le brief produit posait l'arbitrage en ces termes : « soit on écrit ces pages, soit on retire
l'entrée du menu. Un menu qui mène nulle part coûte plus qu'il ne rapporte. » La décision du
2026-08-25 est de ne trancher ni dans un sens ni dans l'autre pour l'instant.

Conséquence mesurable : à l'issue de ce chantier, `scripts/audit-nav.py` continuera de
signaler **6 pages non traduites et 6 ébauches**. Ce résidu est attendu — c'est le périmètre
Pro, et rien d'autre. Toute autre page signalée est une régression.

Le déclencheur d'une reprise est l'existence par écrit des conditions commerciales
professionnelles (tarifs revendeur, minimums, délais). Elle passera par une spec dédiée.

### Conflits à signaler (constitution)

Trois tensions sont signalées ici plutôt que contournées, conformément à la clause de
gouvernance :

1. **Principe VI — « FR et EN dans le même commit ».** Pour les 11 pages migrées en gabarits de
   thème, la règle s'applique littéralement. Pour les 4 pages du groupe Divers, dont le contenu
   reste dans l'admin, elle ne le peut pas : la parité y est exigée mais vérifiée par audit, pas
   par revue de commit.
2. **Principe III — « rien d'inventé ».** `our-story`, `quality`, `technology` et `bundles`
   reposent sur des faits que le dépôt ne contient pas, et le brief produit marque explicitement
   « mesures d'irradiance disponibles » comme `[À COMPLÉTER]`. Ces pages relèvent du lot 2 et ne
   se publient pas sans dossier de faits.
3. **Principe II — « aucune allégation thérapeutique ».** Les 7 pages Protocoles décrivent des
   usages dirigés (post-workout, skin-routine, daily-recovery). C'est le terrain naturel du
   glissement vers « soulage », « réduit l'inflammation », « traite ». Chaque page de ce groupe
   demande une relecture d'allégations, pas seulement une relecture rédactionnelle.

## Lots de livraison

Le découpage suit la disponibilité des faits, pas les groupes de navigation.

**Lot 1 — publiable sans apport extérieur** (11 pages)
Les 7 Protocoles, `our-approach`, `contact`, `faq`, `how-to-use`. Les faits nécessaires sont
déjà dans le thème (longueurs d'onde, gamme, engagements essai / garantie / livraison) ou
relèvent de l'identité de l'entreprise, connue.

**Lot 2 — en attente du dossier de faits** (4 pages)
`our-story`, `quality`, `technology`, `bundles`. Structure, titres et chemins de sortie sont
posés ; les emplacements de faits sont marqués et la page n'est pas publiée tant qu'ils ne sont
pas comblés. Un `TODO` visible en production est un défaut, jamais une étape.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - La page de contact tient sa promesse (Priority: P1)

Un visiteur hésite avant un achat à trois chiffres et cherche à joindre quelqu'un. Il clique
« Nous contacter » dans la barre utilitaire du header — présente sur toutes les pages du site —
et arrive aujourd'hui sur une page d'**un seul mot**, identique en français et en anglais. Il
doit y trouver, dans sa langue : un moyen d'écrire, un délai de réponse annoncé, l'adresse de
l'entreprise, et la mention des engagements (essai 30 jours, garantie 2 ans, livraison).

**Why this priority**: c'est la seule page de la liste atteignable en un clic depuis
l'intégralité du site, et le brief la désigne comme le pire défaut de l'audit. Une page de
contact d'un mot transforme une hésitation en abandon. Elle est intégralement en lot 1.

**Independent Test**: parcourir `/pages/contact` en FR puis en EN, vérifier que le contenu
diffère entre les deux langues, qu'un moyen de contact fonctionnel est présent, et que
`audit-nav.py` ne la signale plus ni comme ébauche ni comme non traduite.

**Acceptance Scenarios**:

1. **Given** un visiteur en français, **When** il ouvre `/pages/contact`, **Then** la page
   affiche un moyen de contact utilisable, un délai de réponse annoncé et l'identité de
   l'entreprise, en français, sur au moins 250 mots.
2. **Given** le même visiteur bascule en anglais, **When** il ouvre `/pages/contact`, **Then**
   le contenu est le même sur le fond mais rédigé en anglais — pas une copie du texte français.
3. **Given** un visiteur qui envoie un message, **When** il valide, **Then** il obtient une
   confirmation dans sa langue.
4. **Given** l'audit de navigation, **When** il est relancé, **Then** `contact` ne figure ni
   dans les ébauches ni dans les pages non traduites.

---

### User Story 2 - Les protocoles d'usage tiennent leur promesse (Priority: P2)

Un client vient de recevoir son appareil, ou l'utilise depuis quelques semaines et cherche à
mieux s'en servir. Le mega-menu lui promet sept protocoles — récupération quotidienne, séance
corps entier, avant et après l'effort, routine peau, routine de journée de travail — et chacun
lui livre une centaine de mots identiques dans les deux langues.

Il doit y trouver, dans sa langue : à quel moment, à quelle distance, combien de temps, à quelle
fréquence, avec quelles longueurs d'onde et sur quel appareil de la gamme — et ce que la séance
ne fait pas.

**Why this priority**: c'est le contenu qui fait revenir un acheteur après l'achat, et le seul
groupe qui construit une raison de rester attaché à la marque plutôt que d'acheter une fois. Le
brief le désigne explicitement comme une promesse que 90 mots ne tiennent pas. Les sept pages
sont en lot 1 : leurs faits sont déjà dans le thème.

**Independent Test**: parcourir les 7 pages en FR et en EN ; vérifier que chacune porte une
séquence d'usage exploitable sans lire une autre page, renvoie vers au moins un appareil de la
gamme, et qu'aucune ne contient de formulation interdite par le principe II.

**Acceptance Scenarios**:

1. **Given** un client détenteur d'un `cytolight-cap`, **When** il ouvre `/pages/post-workout`,
   **Then** il obtient une séquence d'usage (moment, durée, distance, fréquence) applicable à
   son appareil, en français.
2. **Given** la même page en anglais, **When** elle est comparée à la version française,
   **Then** les deux couvrent les mêmes faits et diffèrent en nombre de mots.
3. **Given** une relecture d'allégations, **When** les 7 pages sont passées en revue, **Then**
   aucune n'emploie « traite », « soigne », « guérit », « réduit la douleur »,
   « anti-inflammatoire », « cliniquement prouvé » ni de variante par sous-entendu.
4. **Given** une affirmation d'effet sur l'une de ces pages, **When** elle est vérifiée,
   **Then** elle est formulée au conditionnel, ou rattachée à un identifiant vérifiable
   (DOI, PMID) accompagné du cadrage sur les limites.
5. **Given** une longueur d'onde citée, **When** elle est comparée à
   `sections/learn-wavelengths.liquid` et aux fiches produit, **Then** les trois concordent.

---

### User Story 3 - « Pourquoi CytoLight » donne des raisons vérifiables (Priority: P3)

Un acheteur au profil longévité — celui qui lit les études et compare les irradiances — cherche
à savoir à qui il achète. Les quatre pages qui devraient répondre (`our-approach`, `our-story`,
`quality`, `technology`) lui servent une centaine de mots, en anglais quelle que soit sa langue.

Il doit y trouver : ce que la marque revendique et ce qu'elle ne revendique pas, qui elle est,
comment les appareils sont contrôlés, et ce que les sept longueurs d'onde pilotables changent —
avec des chiffres réels, ou sans chiffre du tout.

**Why this priority**: c'est le socle de confiance sur un panier à trois chiffres, et l'axe de
différenciation retenu au brief (autorité de marque, rigueur, service francophone). `our-approach`
est en lot 1 ; `our-story`, `quality` et `technology` sont en lot 2 et attendent le dossier de
faits — c'est ce qui les place derrière les protocoles.

**Independent Test**: parcourir les 4 pages en FR et en EN ; vérifier que chaque chiffre publié
est traçable à une source fournie, et qu'aucune n'affiche de certification, note, effectif ou
témoignage non vérifiable.

**Acceptance Scenarios**:

1. **Given** un visiteur en français, **When** il ouvre `/pages/our-approach`, **Then** il
   obtient ce que la marque revendique et ce qu'elle ne revendique pas, sans chiffre non sourcé.
2. **Given** une valeur d'irradiance, **When** elle est publiée, **Then** sa source est
   documentée (fournisseur, distance de mesure) ; **When** aucune source n'est disponible,
   **Then** la page reste en lot 2 et n'est pas publiée.
3. **Given** `/pages/our-story`, **When** elle est relue, **Then** elle ne contient ni
   témoignage, ni logo de presse, ni effectif client, ni certification qui n'existe pas.
4. **Given** les 4 pages en anglais, **When** elles sont comparées au français, **Then** elles
   couvrent les mêmes faits et diffèrent en nombre de mots.

---

### User Story 4 - La page Packs explique les remises déjà implémentées (Priority: P4)

Un visiteur voit la remise duo (−10 %) ou famille (−15 %) annoncée sur une fiche produit, suit
« Packs » depuis le panneau Boutique du header, et arrive sur 43 mots identiques en FR et en EN.
La page censée expliquer les packs ne les décrit pas.

Il doit y trouver, dans sa langue : la composition de chaque pack, la remise appliquée, et un
chemin d'achat.

**Why this priority**: la page est sur le chemin de conversion et liée depuis le header, mais
elle est en lot 2 — la composition exacte des packs n'est pas dans le dépôt, seul le mécanisme
de remise l'est. Elle ne peut donc pas être livrée avec le lot 1 malgré sa valeur commerciale.

**Independent Test**: parcourir `/pages/bundles` en FR et en EN ; vérifier que chaque pack
décrit correspond à une remise réellement implémentée sur la fiche produit.

**Acceptance Scenarios**:

1. **Given** un visiteur en français, **When** il ouvre `/pages/bundles`, **Then** il trouve la
   composition de chaque pack, la remise appliquée et un lien vers l'achat.
2. **Given** une remise annoncée sur la page, **When** elle est comparée à celle appliquée sur
   la fiche produit, **Then** les deux concordent.
3. **Given** l'absence de composition de pack confirmée, **When** le lot 1 est publié,
   **Then** `/pages/bundles` n'est pas publiée et reste dans son état actuel.

---

### User Story 5 - La FAQ et le mode d'emploi rejoignent le niveau de l'espace Learn (Priority: P5)

`faq` (175 mots) et `how-to-use` (166 mots) portent déjà un gabarit de thème — `page.faq.liquid`
et `page.how-to-use.liquid` — qui les place dans la coquille Learn avec le fil d'Ariane et le
rappel produit. La coquille est bilingue ; le contenu qu'elle enveloppe ne l'est pas. À côté
d'elles, `learn-science` et `learn-wavelengths` pèsent entre 600 et 2 800 mots.

**Why this priority**: ces deux pages sont déjà les mieux loties du lot et bénéficient déjà d'un
cadre visuel correct ; l'écart perçu est plus faible. La FAQ commerciale reste par ailleurs le
point de chute du bloc sécurité de `learn-how-it-works`, qui y renvoie. Toutes deux sont en
lot 1.

**Independent Test**: parcourir `/pages/faq` et `/pages/how-to-use` en FR et en EN ; vérifier
que le contenu enveloppé par la coquille Learn est traduit et couvre les sujets que les autres
pages lui délèguent.

**Acceptance Scenarios**:

1. **Given** le bloc sécurité de `learn-how-it-works` qui renvoie à la FAQ, **When** un visiteur
   suit ce lien, **Then** il trouve les réponses sur l'essai, la garantie et les certifications,
   dans sa langue.
2. **Given** `/pages/how-to-use` en anglais, **When** elle est comparée au français, **Then**
   les deux couvrent les mêmes gestes et diffèrent en nombre de mots.
3. **Given** la FAQ, **When** elle est relue, **Then** aucune réponse ne revendique de
   certification de dispositif médical ni d'effet thérapeutique.

---

### User Story 6 - Les titres affichés cessent d'être des handles (Priority: P6)

Trois pages s'annoncent dans l'onglet du navigateur et dans les résultats Google sous leur
handle brut : `/pages/nos-valeurs` s'intitule « our-values », `/pages/comment-ca-marche`
« how-it-works », `/pages/benefits` « benefits ». Ces trois pages portent un contenu de thème
correct — seul leur titre est en cause.

**Why this priority**: correction la plus rapide de toute la liste, sans aucun risque de
déploiement puisqu'elle n'existe que dans l'admin, mais d'impact limité au référencement et à
la lisibilité de l'onglet.

**Independent Test**: ouvrir les trois pages en FR et en EN et lire le titre de l'onglet.

**Acceptance Scenarios**:

1. **Given** `/pages/nos-valeurs` en français, **When** la page est ouverte, **Then** le titre
   affiché est un titre rédigé, pas le handle.
2. **Given** les mêmes pages en anglais, **When** elles sont ouvertes, **Then** le titre est
   rédigé en anglais.
3. **Given** un renommage de titre, **When** il est appliqué, **Then** le handle et donc l'URL
   restent inchangés — aucun lien du thème ne casse.

---

### Edge Cases

- **Le gabarit ne peut être assigné qu'après le merge.** Le sélecteur « Theme template » de
  l'admin ne liste que les gabarits du thème **publié**. Une page migrée sert donc encore
  `templates/page.liquid` — et son contenu admin de 90 mots — entre le merge et l'assignation
  manuelle. Cette fenêtre doit être courte, prévue, et l'assignation faite page par page.
- **Le contenu admin devenu redondant.** Une fois une page migrée en gabarit de thème, le corps
  saisi dans l'admin n'est plus servi. S'il subsiste, il devient une seconde version du texte
  que personne ne relit et que le prochain gabarit pourrait réafficher. Son sort se décide
  explicitement pour les 11 pages migrées.
- **Deux véhicules, deux façons de régresser.** Une page migrée régresse par un commit ; une
  page restée dans l'admin régresse par une modification invisible du dépôt. La vérification
  doit couvrir les deux, et `audit-nav.py` est le seul point où elles se rejoignent.
- **Une page dépubliée ou renommée dans l'admin** : le thème écrit ses URL en dur dans
  `sections/header.liquid`. Changer un handle depuis l'admin casse le lien sans que le dépôt
  n'en sache rien. Toute correction de handle se répercute dans le thème avant le merge.
- **Une seule langue livrée** : livrer le français puis l'anglais « plus tard » reproduit
  exactement le défaut que ce chantier corrige. Une page ne bascule que lorsque ses deux
  versions sont prêtes.
- **La bascule de langue perd le contexte** : un visiteur sur `/pages/protocols` qui change de
  langue doit rester sur la page équivalente, pas revenir à l'accueil.
- **Une page de lot 2 publiée par inadvertance** : plus long ne veut pas dire meilleur. Une page
  de 400 mots portant un chiffre inventé est un défaut plus grave que la page de 90 mots qu'elle
  remplace, et une page portant un emplacement de fait non comblé ne se publie pas.
- **Contenu long et accessibilité** : une page qui triple de volume introduit des titres, des
  listes et des liens. La hiérarchie de titres et le contraste restent soumis au principe VII.
- **Le résidu Pro dans l'audit** : six pages continueront d'être signalées. Le rapport d'audit
  doit rester lisible malgré ce bruit connu, sinon une vraie régression s'y noiera.
- **Les collections** : `panels`, `recovery`, `performance`, `skin-amp-glow`, `longevity`,
  `work-amp-focus`, `all` sont minces (130 – 177 mots) **mais traduites**. Hors périmètre.

## Requirements *(mandatory)*

### Véhicule et parité linguistique

- **FR-001**: Chacune des 15 pages du périmètre MUST exister en français et en anglais, avec un
  contenu rédigé dans chaque langue — pas une copie du texte de l'autre langue.
- **FR-002**: Le nombre de mots visibles d'une page MUST différer entre FR et EN. Une égalité
  stricte est le signal d'absence de traduction retenu par `scripts/audit-nav.py`.
- **FR-003**: Les deux versions d'une page MUST couvrir les mêmes faits : aucune information,
  aucun lien et aucun engagement présent dans une langue ne manque dans l'autre.
- **FR-004**: Deux véhicules de contenu coexistent, chacun affecté à un périmètre nommé et figé :
  - **Gabarits de thème bilingues** pour les 11 pages des groupes Protocoles et Pourquoi
    CytoLight. Le contenu vit dans le dépôt, les deux langues dans le même commit, sur le modèle
    des sections de l'espace Learn.
  - **Contenu admin traduit nativement** pour les 4 pages du groupe Divers (`contact`,
    `bundles`, `faq`, `how-to-use`), dont deux disposent déjà d'une coquille de thème bilingue.
- **FR-005**: Aucune page MUST relever des deux véhicules à la fois. L'affectation de chaque
  handle MUST être explicite et vérifiable.
- **FR-006**: Pour les pages restées dans l'admin, la parité MUST être vérifiable par une
  commande reproductible, la revue de commit ne pouvant pas l'attester.

### Volume et substance

- **FR-007**: Chacune des 15 pages MUST atteindre au moins 250 mots visibles dans chaque langue,
  mesurés comme le fait `scripts/audit-nav.py` sur `<main id="MainContent">`.
- **FR-008**: Chaque page MUST être autonome : compréhensible sans lire une autre page, et
  répondant à la promesse portée par son libellé dans le mega-menu.
- **FR-009**: Chaque page MUST porter au moins un chemin de sortie explicite — vers un produit,
  une collection, une page Learn ou le contact — cohérent avec son sujet.
- **FR-010**: Les 7 pages Protocoles MUST chacune préciser au minimum le moment d'usage, la
  durée d'une séance, la distance à l'appareil et la fréquence recommandée.
- **FR-011**: `/pages/contact` MUST offrir un moyen de contact utilisable, un délai de réponse
  annoncé et l'identité de l'entreprise.
- **FR-012**: `/pages/bundles` MUST décrire la composition de chaque pack et la remise appliquée,
  en cohérence avec les remises réellement implémentées sur la fiche produit (duo −10 %,
  famille −15 %).

### Lots et dossier de faits

- **FR-013**: Le chantier MUST produire un **dossier de faits manquants** : pour chaque page du
  lot 2, la liste nommée des données requises et de qui peut les fournir. Ce dossier est un
  livrable au même titre que les pages.
- **FR-014**: Une page du lot 2 MUST NOT être publiée tant que ses emplacements de faits ne sont
  pas comblés. Aucun `TODO`, aucun texte de remplacement et aucune valeur approchée ne paraît en
  production.
- **FR-015**: Le lot 1 (11 pages) MUST pouvoir être livré et publié sans dépendre d'aucune donnée
  du lot 2.
- **FR-016**: La structure d'une page du lot 2 — titres, chemins de sortie, emplacements marqués —
  MUST être posée dans le même chantier, de sorte que combler les faits soit une opération de
  rédaction et non de conception.

### Conformité — allégations et véracité

- **FR-017**: Aucune page du périmètre MUST contenir de terme ou de sous-entendu interdit par le
  principe II : « traite », « soigne », « guérit », « réduit la douleur »,
  « anti-inflammatoire », « certifié médicalement », « cliniquement prouvé », imagerie médicale
  ou vocabulaire de prescription.
- **FR-018**: Toute affirmation d'effet MUST être formulée au conditionnel ; seules les
  caractéristiques physiques de l'appareil s'énoncent à l'indicatif.
- **FR-019**: Toute page citant de la littérature scientifique MUST porter un encadré
  explicitant ce que ces travaux ne disent pas, sur le modèle de `sections/learn-science.liquid`,
  et chaque référence MUST porter un identifiant vérifiable (DOI, PMID).
- **FR-020**: Aucun chiffre, avis, note, témoignage, certification, logo de presse ou effectif
  client MUST figurer sur ces pages sans exister réellement et être vérifiable.
- **FR-021**: Toute spécification technique publiée (longueurs d'onde, irradiance, nombre de
  LED, autonomie) MUST correspondre à la fiche fournisseur et rester cohérente avec les fiches
  produit et `sections/learn-wavelengths.liquid`. En l'absence de source, la valeur n'est pas
  publiée.

### Périmètre reporté

- **FR-022**: Les six pages du groupe CytoLight Pro MUST rester inchangées, et l'entrée
  CytoLight Pro du mega-menu MUST rester en place. Aucune modification de leur contenu, de leur
  titre ni de leur lien n'entre dans ce chantier.
- **FR-023**: Le résidu d'audit attendu — 6 pages non traduites, 6 ébauches, toutes du groupe
  Pro — MUST être documenté comme dette datée, de façon qu'une régression sur une autre page
  reste immédiatement visible dans le rapport.

### Titres et référencement

- **FR-024**: Les titres affichés de `/pages/nos-valeurs`, `/pages/comment-ca-marche` et
  `/pages/benefits` MUST être des titres rédigés dans la langue servie, non des handles.
- **FR-025**: Aucun handle MUST changer au cours de ce chantier. Si un changement est jugé
  nécessaire, il MUST être répercuté dans `sections/header.liquid` avant le merge, ce fichier
  étant la source unique des URL de la navigation.

### Intégrité du thème et séquence de déploiement

- **FR-026**: Toute modification du thème MUST n'introduire aucune infraction nouvelle à
  `shopify theme check` par rapport à `origin/main` (plafond : 28 infractions préexistantes).
- **FR-027**: Le contenu de chaque page MUST exister dans les deux langues **avant** le merge de
  toute modification du thème qui en dépend.
- **FR-028**: Pour chaque page migrée, la séquence — merge du gabarit, puis assignation manuelle
  dans Content → Pages, puis sort du contenu admin devenu redondant — MUST être définie page par
  page avant le merge, l'assignation ne pouvant se faire qu'une fois le thème publié.
- **FR-029**: Les pages étoffées MUST respecter le principe VII : hiérarchie de titres cohérente,
  contraste ≥ 4,5:1, éléments interactifs atteignables au clavier avec focus visible, `alt` sur
  toute image porteuse de sens, `width` et `height` réels.
- **FR-030**: Aucune image ajoutée MUST résider dans `assets/`. Tout visuel passe par
  Content → Files et se référence via `file_url`, uploadé avant le merge, sous le nom exact
  retourné par Shopify.
- **FR-031**: Aucune modification MUST introduire de contenu portugais, ni de règle CSS masquant
  un contenu de sa propre initiative.
- **FR-032**: `scripts/audit-nav.py` MUST rester l'outil de vérification du chantier et continuer
  de tourner sans dépendance externe.

### Key Entities

- **Page du périmètre** : une page Shopify identifiée par son handle, portant un titre, un
  contenu, un groupe d'appartenance, un véhicule de contenu (thème ou admin), un lot de
  livraison (1 ou 2) et deux versions linguistiques. Quinze sont concernées.
- **Groupe de pages** : Protocoles (7), Pourquoi CytoLight (4), Divers (4) dans le périmètre ;
  CytoLight Pro (6) reporté. Le groupe détermine le véhicule, la priorité et le registre.
- **Lot de livraison** : lot 1 (11 pages, publiable sans apport extérieur) ou lot 2 (4 pages,
  en attente du dossier de faits).
- **Fait vérifiable** : une donnée publiable — longueur d'onde, irradiance, remise, garantie,
  délai, composition de pack — rattachée à une source nommée. Sans source, pas de publication.
- **Dossier de faits manquants** : la liste, page par page, des données requises par le lot 2 et
  de qui peut les fournir. Livrable du chantier.
- **Lien de navigation** : une URL écrite en dur dans `sections/header.liquid`, seule source des
  URL de la navigation. Vingt-huit `/pages/...` y figurent.
- **Résultat d'audit** : pour une URL et une langue, un code HTTP et un nombre de mots visibles,
  produits par `scripts/audit-nav.py`. Trois défauts distincts : lien cassé, ébauche, non
  traduite.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `python3 scripts/audit-nav.py --min-mots 250` ne signale **aucune** page non
  traduite hors groupe Pro, contre 21 sur 21 au 2026-08-21.
- **SC-002**: `python3 scripts/audit-nav.py --min-mots 250` ne signale **aucune** ébauche parmi
  les 11 pages du lot 1.
- **SC-003**: Le résidu d'audit à l'issue du chantier est exactement de 6 pages non traduites et
  6 ébauches, toutes du groupe CytoLight Pro — aucune autre.
- **SC-004**: Aucun lien cassé sur l'ensemble des URL de navigation, en FR et en EN — l'état
  sain constaté au 2026-08-21 est préservé.
- **SC-005**: Aucune page du périmètre ne contient de terme interdit par le principe II, en FR
  comme en EN, vérifié par relecture d'allégations page par page.
- **SC-006**: Chaque chiffre publié sur ces pages est rattaché à une source nommée ; le nombre
  de chiffres sans source est zéro.
- **SC-007**: Le nombre de pages publiées portant un emplacement de fait non comblé est zéro.
- **SC-008**: Un visiteur trouve un moyen de contact utilisable en un clic depuis n'importe
  quelle page du site, dans sa langue.
- **SC-009**: Un client équipé trouve, sur une page de protocole, une séquence d'usage
  applicable — moment, durée, distance, fréquence — sans avoir à ouvrir une autre page.
- **SC-010**: Aucun titre de page affiché n'est un handle, dans aucune des deux langues.
- **SC-011**: Chacune des 11 pages migrées sert son gabarit de thème, et non
  `templates/page.liquid`, dans les deux langues.
- **SC-012**: `shopify theme check` ne relève aucune infraction nouvelle par rapport à
  `origin/main`.
- **SC-013**: Parcours des pages affectées sous `shopify theme dev`, onglet Réseau ouvert :
  zéro 404, en FR et en EN.

## Assumptions

- **Périmètre.** 15 des 21 pages relevées par l'audit du 2026-08-21, plus la correction de trois
  titres affichés. Les 6 pages CytoLight Pro sont explicitement reportées par décision du
  2026-08-25. Les collections (`panels`, `recovery`, `performance`, `skin-amp-glow`,
  `longevity`, `work-amp-focus`, `all`) sont minces mais traduites : autre chantier. Les pages
  portées par le thème (`academy`, `comment-ca-marche`, `wavelengths`, `science`, `nos-valeurs`,
  `benefits`, `find-your-cytolight`) sont hors périmètre, sauf leur titre affiché.
- **Répartition du véhicule hybride.** Les groupes Protocoles et Pourquoi CytoLight passent en
  gabarits de thème parce que leur contenu est structuré et répétitif d'une page à l'autre — une
  séquence d'usage, une raison de confiance — donc factorisable. Le groupe Divers reste dans
  l'admin parce que son contenu est hétérogène et appelé à bouger sans développeur (délais,
  conditions, questions fréquentes).
- **Seuil de volume.** 250 mots par page et par langue. Le seuil par défaut de
  `scripts/audit-nav.py` est de 200 mots ; les pages saines portées par le thème pèsent entre
  600 et 2 800. 250 est un plancher de recevabilité, pas une cible éditoriale.
- **Écart FR / EN.** Un écart de 20 à 25 % entre les deux langues est l'ordre de grandeur
  constaté sur les pages saines et sert de repère de normalité, non de critère bloquant. Le
  critère bloquant est l'absence d'égalité stricte.
- **Le contenu admin ne se crée pas depuis le dépôt.** Les pages existent déjà. Toute
  assignation de gabarit, tout upload de visuel dans Content → Files et toute saisie de
  traduction demandent une action manuelle dans l'admin Shopify.
- **`/pages/contact`.** Le moyen de contact retenu est un formulaire ou une adresse e-mail
  affichée ; le choix relève de la mise en œuvre. Aucune donnée personnelle nouvelle n'est
  collectée au-delà de ce que Shopify traite déjà.
- **Ton et registre.** Vouvoiement en français, registre expert, sobre et premium, conformément
  au brief produit.
- **Portugais.** Aucun contenu portugais n'est produit. Le retrait du portugais résiduel de
  `sections/header.liquid` relève d'un autre chantier.
- **Livraison par lots.** Le lot 1 est livré et publié en premier, par groupes complets dans les
  deux langues. Le lot 2 suit la remise du dossier de faits, sans nouvelle spec.

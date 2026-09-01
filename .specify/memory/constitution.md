<!--
Sync Impact Report — 2026-09-01
Version: 1.0.1 → 1.0.2 (PATCH)

Amendement de correction. Aucun principe n'est ajouté, retiré ni redéfini. Une règle est
reformulée pour cesser de dépendre d'un relevé, et une contradiction interne est levée.

  - Contraintes techniques : la « dette connue et plafonnée » devient « aucune régression de
    `theme check` ». Le plafond était écrit en chiffres — 28, puis 19 dont 6 erreurs — et le
    dépôt est passé à zéro le 2026-09-01, les six erreurs vivant dans des sections qu'aucun
    gabarit ne rendait. Le corriger en « zéro » aurait reconduit le défaut de forme : un compte
    périme au premier merge, et il se lit ensuite comme une autorisation à remonter jusqu'à lui.
    La règle porte donc la comparaison avec `origin/main`, et le relevé du jour est renvoyé à
    `CLAUDE.md`, qui se corrige sans amendement.
  - Contraintes techniques : le paragraphe « Header collant » décrivait le `top: 0` et le
    `z-index` de la sous-navigation Learn, retirée du thème. Il contredisait le principe VI du
    même document, qui acte ce retrait. La phrase est supprimée.

Fichiers dépendants alignés dans le même commit :
  - `CLAUDE.md` → relevé `theme check` formulé en comparaison, pas en plafond chiffré ✅
  - `.specify/templates/overrides/plan-template.md` → la porte de vérification annonçait
    encore « plafond : 28 infractions », jamais corrigé par l'amendement 1.0.1. Elle demande
    désormais la comparaison des deux relevés ✅

Sync Impact Report — 2026-08-31
Version: 1.0.0 → 1.0.1 (PATCH)

Amendement de correction. Aucun principe n'est ajouté, retiré ni redéfini ; seuls
des faits périmés et le nom de la marque sont mis à jour.

  - Marque : CytoLight → Antared dans tout le texte. Les identifiants techniques
    (domaine `cytolight.myshopify.com`, handles produit, noms de fichiers) gardent
    l'ancien nom : les renommer casserait des URL et ferait renvoyer 404 des images.
  - Principe VI : la règle citait `snippets/learn-nav.liquid` comme source unique des
    URL de la sous-navigation Learn. Ce fichier n'existe plus et cette sous-navigation
    a été retirée. `sections/header.liquid` est désormais le seul endroit concerné.
  - Contraintes techniques : le plafond de dette passe de 28 à 19 infractions, dont 6
    erreurs. Ce n'est pas un assouplissement mais l'application de la règle existante
    — « ce nombre est un plafond, il ne remonte pas » — au relevé réel sur `origin/main`.
  - Contraintes techniques : les booléens produit passent de trois cités à six réels.

Fichiers dépendants alignés dans le même commit :
  - `CLAUDE.md` → marque, plafond de dette, booléens produit, learn-nav, repères ✅

Sync Impact Report — 2026-08-21
Version: template non renseigné → 1.0.0 (ratification initiale)

Principes ajoutés (7) :
  I.   `main` est la production
  II.  Aucune allégation thérapeutique
  III. Rien d'inventé
  IV.  Le thème reste lisible sans outillage
  V.   `assets/` ne contient aucune image
  VI.  FR et EN, à parité, partout
  VII. Accessible et rapide

Sections ajoutées :
  - Contraintes techniques
  - Workflow et portes de qualité
  - Gouvernance

Fichiers dépendants à aligner :
  - `.specify/templates/plan-template.md` → section « Constitution Check » : gates renseignés ✅
  - `CLAUDE.md` → pointeur vers la constitution et le brief produit ✅
  - `.specify/memory/product-brief.md` → direction produit, créé ✅

TODO différés (à combler par le porteur du projet) :
  - TODO(OBJECTIFS_FINANCIERS) : brief produit, section « Objectifs »
  - TODO(CONCURRENCE) : brief produit, section « Concurrence »
  - TODO(ICP) : brief produit, section « À qui on parle »
  - TODO(STATUT_REGLEMENTAIRE_DOCUMENTE) : aucun certificat n'a été produit ; le
    principe II applique par défaut le régime le plus strict (produit bien-être).
-->

# Constitution Antared

Antared — la marque s'appelait CytoLight jusqu'au 2026-08-31 — vend des appareils de
luminothérapie rouge et proche infrarouge en Europe, en direct au consommateur, via une
boutique Shopify dont ce dépôt est le thème. Le renommage ne touche que le texte visible :
le domaine `cytolight.myshopify.com`, les handles produit et les noms de fichiers gardent
l'ancien nom, parce que les renommer casserait des URL et des références d'images. Ce document
énonce ce qui ne se négocie pas. Il prime sur toute habitude, toute préférence esthétique
et toute urgence commerciale.

La **direction** du projet — vision, marché, cible, gamme, identité visuelle, objectifs —
vit dans `.specify/memory/product-brief.md`. Elle évolue vite. Ce qui suit évolue lentement.

## Principes fondamentaux

### I. `main` est la production

L'intégration GitHub native de Shopify synchronise `main` avec le thème live. Il n'y a ni
étape de validation, ni environnement de recette, ni rollback automatique : **merger sur
`main`, c'est déployer devant les clients, immédiatement.**

- Aucun push direct sur `main`. Tout passe par une branche et une pull request.
- Un fichier référencé par le code — image dans Content → Files, page dans l'admin,
  collection, gabarit — DOIT exister **avant** le merge. Pas après.
- Un agent n'a jamais l'autorisation de merger. Il implémente, vérifie, ouvre la PR,
  et s'arrête là.
- Toute modification touchant `templates/*.json`, `sections/*-group.json` ou
  `config/settings_data.json` DOIT être validée comme JSON avant la PR : un seul de ces
  fichiers malformé rend la boutique inaccessible, ce qui s'est déjà produit.

*Raison* : l'étape irréversible n'a pas de filet technique. Elle a donc un filet humain.

### II. Aucune allégation thérapeutique (NON NÉGOCIABLE)

Les appareils Antared sont des **produits de bien-être, sans marquage CE de dispositif
médical**. En droit européen, cela interdit toute allégation de traitement, de guérison ou
de soulagement d'une pathologie — quelle que soit la solidité de la littérature citée.

- INTERDIT : « traite », « soigne », « guérit », « réduit la douleur », « anti-inflammatoire »,
  « certifié médicalement », « cliniquement prouvé », et toute variante par sous-entendu
  (avant/après médical, blouse blanche, vocabulaire de prescription).
- AUTORISÉ : décrire le mécanisme, les longueurs d'onde, l'irradiance, l'usage, le confort,
  le ressenti, le bien-être, la récupération perçue — au conditionnel quand il s'agit d'un
  effet, à l'indicatif quand il s'agit d'une caractéristique physique de l'appareil.
- Toute page citant de la littérature scientifique DOIT porter un encadré explicitant ce que
  ces travaux ne disent pas, et rappeler qu'aucune étude n'a porté sur un appareil Antared.
  Le bloc « Ce que ces études ne disent pas » de `sections/learn-science.liquid` est le modèle
  de référence. Le retirer est une régression, jamais une simplification.
- Chaque affirmation scientifique DOIT être rattachée à un identifiant vérifiable (DOI, PMID).
  Une référence sans identifiant ne se publie pas.

*Raison* : l'article L.121-2 du Code de la consommation sanctionne la pratique commerciale
trompeuse ; les régies publicitaires (Meta, Google, TikTok) rejettent ou suspendent les
comptes sur ces formulations. Ce n'est pas de la prudence rédactionnelle, c'est la condition
de survie du canal d'acquisition.

### III. Rien d'inventé (NON NÉGOCIABLE)

Aucun chiffre, avis, note, témoignage, certification, logo de presse ou effectif client ne
figure sur le site sans exister réellement et être vérifiable.

- Zéro avis affiché tant qu'il n'y a pas d'avis réels — y compris sur une fiche neuve, où
  l'absence d'étoiles est la bonne réponse. `snippets/structured-data.liquid` n'émet un
  `aggregateRating` que si des avis existent : ce garde-fou ne se contourne pas.
- Un témoignage porte le nom d'une personne réelle qui a consenti. Un prénom plausible suivi
  de « Verified Buyer » est un faux.
- Une spécification technique publiée (irradiance, nombre de LED, longueurs d'onde, autonomie)
  DOIT correspondre à la fiche du fournisseur. En cas de doute, on ne publie pas le chiffre.
- Un partenariat rémunéré est signalé comme tel, sans exception.

*Raison* : une note fabriquée expose à une pénalité manuelle Google, à une action DGCCRF, et
détruit la seule chose qu'une marque santé-adjacente ne peut pas racheter — sa crédibilité.
Le dépôt porte déjà la trace d'un correctif retirant des notes fabriquées : la règle existe
parce que l'erreur a été commise.

### IV. Le thème reste lisible sans outillage

Ce qui est dans le dépôt est exactement ce qui est servi. Pas de build, pas de bundler, pas
de framework, pas de dépendance npm, pas d'étape de transpilation.

- Liquid, CSS et JavaScript écrits à la main. Un développeur qui ouvre un fichier voit le
  code qui tourne en production.
- Pas de préprocesseur CSS, pas de TypeScript, pas de `node_modules` livré.
- Le JavaScript est progressif : la page DOIT rester lisible et navigable s'il ne charge pas.
  Le CSS ne masque jamais un contenu de lui-même — c'est le script qui arme ce qu'il va animer,
  comme le fait `assets/learn.js` avec `is-armed`. Une règle du type `.ln-reveal { opacity: 0 }`
  transforme un CDN lent en page blanche : elle ne se réintroduit pas.
- `prefers-reduced-motion` est respecté partout où il y a du mouvement.

*Raison* : l'équipe est petite, le déploiement n'a aucune étape de compilation, et une chaîne
d'outils non maintenue devient une panne silencieuse. La contrainte est le garde-fou.

### V. `assets/` ne contient aucune image

`assets/` est réservé au CSS, au JavaScript et aux polices. Aucune photo, aucun visuel
marketing, aucune vidéo.

| Type | Emplacement | Référence Liquid |
|---|---|---|
| CSS, JS, polices | `assets/` | `{{ 'theme.css' \| asset_url }}` |
| Photo, visuel éditorial | Content → Files | `{{ 'photo.jpg' \| file_url }}` |
| Visuel modifiable par un non-technique | Content → Files, via `image_picker` | `{{ section.settings.image \| image_url: width: 1200 }}` |

- Les URL de CDN écrites en dur (`https://cdn.shopify.com/s/files/...?v=...`) sont interdites :
  elles cassent au moindre ré-upload et contournent la convention. `file_url` uniquement.
- Aucun média hébergé sur un domaine tiers non contrôlé par la boutique.
- Un visuel s'uploade dans Content → Files **avant** que le code qui le référence n'arrive sur
  `main`, et sous le nom exact retourné par Shopify — les doublons sont suffixés (`photo.jpg`
  → `photo_1.jpg`) et `file_url` sur le nom d'origine pointe dans le vide.

*Raison* : Shopify refuse tout thème dépassant 50 Mo, et Git ne sait pas fusionner deux
versions d'un binaire. Le thème avait atteint 59,4 Mo avant la migration ; il fait aujourd'hui
environ 500 Ko.

### VI. FR et EN, à parité, partout

Le thème est bilingue français / anglais. Les deux langues sont des citoyens de première
classe : aucune page, aucune section, aucun libellé, aucun `aria-label` ne sort dans une
seule langue.

- Tout texte ajouté DOIT couvrir FR et EN dans le même commit. Un `TODO: traduire` est un
  défaut, pas une étape.
- Le portugais est **retiré** du thème. Il ne subsistait que dans `sections/header.liquid`,
  au-dessus d'un site qui n'existe pas en portugais : un menu trilingue menant à des pages
  bilingues. Son retour, s'il a lieu, passe par une spec dédiée couvrant l'intégralité du
  site, pas par un `elsif` de plus.
- Les accents s'écrivent en entités HTML (`&eacute;`) dans les fichiers Liquid, en accents
  réels dans les fichiers Markdown. S'aligner sur le fichier modifié.
- `sections/header.liquid` est la **source unique** des URL et libellés de l'espace Learn : il
  porte sa navigation en dur, et un handle qui change se corrige là, nulle part ailleurs. La
  sous-navigation qui coiffait ces pages a été retirée avec `snippets/learn-nav.liquid`, que
  citaient les versions antérieures de ce document.

*Raison* : la cible est européenne. Une langue traitée en second produit des pages orphelines,
un SEO dilué et une expérience qui trahit la taille réelle de l'équipe.

### VII. Accessible et rapide

Deux barres chiffrées, bloquantes en revue.

**Accessibilité — WCAG 2.1 niveau AA :**
- Contraste texte ≥ 4,5:1 (≥ 3:1 pour le grand texte et les éléments d'interface).
- Tout élément interactif atteignable et actionnable au clavier, avec un focus visible.
- Le nom accessible contient le texte visible (WCAG 2.5.3) : un bouton « Panier, 2 articles »
  ne s'annonce pas « Cart ».
- Toute image porteuse de sens a un `alt` ; toute image décorative est `aria-hidden`.
- `width` et `height` renseignés avec des valeurs réelles — `height="auto"` n'est pas valide
  et provoque un décalage de mise en page à l'arrivée de l'image.

**Performance :**
- LCP ≤ 2,5 s et CLS ≤ 0,1 au 75e centile mobile.
- Poids de la page initiale hors vidéo ≤ 1 Mo.
- Aucune ressource tierce bloquant le rendu. Les polices sont auto-hébergées : l'`@import`
  vers `fonts.googleapis.com` transmettait l'IP de chaque visiteur à Google sans consentement,
  il ne se réintroduit pas.
- Toute vidéo est `muted playsinline preload="metadata"`, avec une affiche, et ne bloque
  jamais l'affichage du texte qu'elle accompagne.

*Raison* : la directive européenne sur l'accessibilité (EAA) est entrée en application en juin
2025 et couvre le commerce en ligne. Et sur un panier à trois chiffres, une seconde de LCP se
paie en taux de conversion.

## Contraintes techniques

**Pile.** Shopify Online Store 2.0. Liquid, CSS, JavaScript. `assets/theme.css` porte les
styles globaux et la palette ; `cytolight-cinematic.css` / `.js` les animations de la page
d'accueil ; `learn.css` / `learn.js` ne sont chargés que par les gabarits de l'espace Learn.

**Contenu conditionné au produit.** `sections/main-product.liquid` sert les huit fiches et
bascule son contenu éditorial selon le handle, via six booléens dérivés en début de section :
`is_cap`, `is_mask`, `is_knee`, `is_foot`, `is_sauna_dome`, `is_pano_ultra`. Les deux handles
restants — `cytolight-desk` et `cytolight-pano-plus` — retombent sur la branche par défaut. **Une modification dans ce fichier DOIT être vérifiée sur
chaque variante**, pas seulement celle en cours.

**Fichiers auto-générés.** `config/settings_data.json`, `templates/cart.json`,
`templates/collection.json` et `templates/product.json` sont réécrits par l'éditeur de thème
Shopify. L'intégration GitHub étant bidirectionnelle, une modification dans l'éditeur produit
des commits sur `main` sans que personne n'ait poussé. Ne pas les éditer à la main sans
intention explicite, et ne jamais y placer de logique.

**Header collant.** `#shopify-section-header` porte `position: sticky`, pas `.site-header` :
un élément collant ne peut pas sortir des limites de son parent, et l'enveloppe de section
ajoutée par Shopify a exactement la hauteur du header.

**Aucune régression de `theme check`.** Une branche doit sortir au moins aussi propre que
`origin/main`. Le contrôle se fait par **comparaison des deux relevés** avant de proposer un
merge, jamais contre un nombre écrit ici.

Ce paragraphe a porté « 28 infractions préexistantes », puis « 19, dont 6 erreurs ». Un compte
est une mesure : il périme au premier merge, et un compte périmé ne se lit pas comme une
information dépassée mais comme une autorisation à remonter jusqu'à lui. Aucun chiffre de ce
genre n'a sa place dans ce document. Le relevé du jour vit dans `CLAUDE.md`, qui se corrige
sans amendement.

## Workflow et portes de qualité

**Quand une spec est obligatoire.** Passer par `/speckit-specify` → `/speckit-plan` →
`/speckit-tasks` pour : une nouvelle page ou section, un changement de direction artistique,
un chantier d'internationalisation, une refonte de navigation, et **tout ce qui touche aux
allégations ou aux références scientifiques**. Les correctifs et les ajustements visuels
localisés passent directement en branche + PR.

**Branches.** Une branche appartient à une seule personne, ne sert qu'une fois, et ne se
rouvre jamais après merge. Préfixes : `feat/`, `fix/`, `perf/`, `refactor/`, `chore/`.

```bash
git checkout main && git pull --ff-only origin main && git checkout -b feat/sujet
git fetch origin && git rebase origin/main && git push --force-with-lease
git checkout main && git pull --ff-only origin main && git branch -D feat/sujet
```

`--force-with-lease` uniquement, jamais `--force` seul. Ne jamais rebaser la branche d'un autre.

**Vérifications avant de proposer un merge.** Une PR n'est pas proposable sans :

1. `shopify theme check` — aucune infraction nouvelle par rapport à `origin/main`.
2. Validation JSON de tout fichier `.json` du thème modifié.
3. `shopify theme dev --store cytolight.myshopify.com` — parcours des pages affectées,
   onglet Réseau ouvert, **zéro 404**. Un 404 sur `/cdn/shop/files/` signale un fichier absent
   de Content → Files ou un nom divergent.
4. Les deux langues vérifiées, pas seulement celle dans laquelle on a écrit.
5. Si `main-product.liquid` est touché : les huit fiches produit parcourues.

**Ne jamais annoncer qu'une modification fonctionne sans l'avoir vérifiée ainsi.** Un agent qui
n'a pas pu exécuter ces commandes dit lesquelles, et ne présente pas son travail comme validé.

**Automatisation cible.** Ces portes ont vocation à devenir mécaniques : CI GitHub Actions
(theme check + validation JSON) bloquante en PR, vérificateur de liens morts sur la navigation,
budget Lighthouse, et passage de veille régulier sur la dette et les incohérences doc/code.
Tant qu'elles ne le sont pas, elles restent la responsabilité de l'auteur de la PR.

## Gouvernance

Cette constitution prime sur toute autre pratique. En cas de conflit entre elle et une
instruction ponctuelle, elle gagne — et le conflit se signale plutôt qu'il ne se contourne.

**Portée.** Elle engage tout contributeur, humain ou agent. Un agent DOIT la lire avant toute
spec, tout plan et toute implémentation, et signaler explicitement quand une demande entre en
conflit avec l'un de ses principes plutôt que de l'appliquer en silence.

**Amendements.** Un amendement se fait par pull request modifiant ce fichier, avec sa raison
et, si la règle change une pratique établie, le plan de migration du code existant. Les
principes marqués NON NÉGOCIABLE ne s'assouplissent que sur une base factuelle nouvelle et
documentée — par exemple un certificat de dispositif médical pour le principe II.

**Versionnement.** Sémantique.
- MAJOR : suppression ou redéfinition incompatible d'un principe.
- MINOR : ajout d'un principe ou d'une section, extension matérielle d'une règle.
- PATCH : clarification, reformulation, correction sans effet sur le fond.

**Revue de conformité.** Chaque PR vérifie sa conformité. Chaque plan produit par
`/speckit-plan` renseigne sa section « Constitution Check » avant de passer aux tâches. Une
violation assumée se documente dans la section « Complexity Tracking » du plan, avec la raison
et l'alternative écartée — jamais implicitement.

**Guidage courant.** `CLAUDE.md` porte les instructions opérationnelles du dépôt.
`.specify/memory/product-brief.md` porte la direction produit et de marque. Les deux se lisent
en complément de ce document ; aucun des deux ne peut le contredire.

**Version** : 1.0.2 | **Ratifiée** : 2026-08-21 | **Dernier amendement** : 2026-09-01

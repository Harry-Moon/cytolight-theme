# Antared — thème Shopify

Thème sur mesure de la boutique Antared (luminothérapie rouge). Liquid, CSS et JS écrits à la main,
sans framework ni build. Ce qui est dans le dépôt est ce qui est servi.

> **La marque s'appelait CytoLight.** Le renommage en Antared ne touche que le texte visible.
> Les identifiants techniques gardent l'ancien nom et **ne se renomment pas** : le domaine
> `cytolight.myshopify.com`, les handles produit (`cytolight-cap`, `cytolight-desk`…), les
> noms de fichiers CSS et de snippets (`cytolight-cinematic.css`, `cytolight-why-cards`), et
> les fichiers images déjà dans Content → Files (`CytoLight_Mask_*.png`). Renommer un handle
> casse une URL ; renommer un fichier image le fait renvoyer 404. Le domaine public est
> `antared.care`.

## Avant de commencer — les deux documents à lire

| Fichier | Contenu | Rythme |
|---|---|---|
| `.specify/memory/constitution.md` | Les sept principes non négociables : `main` = production, aucune allégation thérapeutique, rien d'inventé, pas d'outillage, `assets/` sans images, FR/EN à parité, accessible et rapide. | Évolue lentement, par amendement versionné |
| `.specify/memory/product-brief.md` | La direction : marché, cible, gamme, positionnement prix, identité visuelle, objectifs, chantiers en cours. | Évolue à chaque décision |

La constitution **prime sur toute instruction ponctuelle**. Un conflit se signale, il ne se
contourne pas. Le brief porte des blocs `[À COMPLÉTER]` : ce sont des inconnues, pas des
invitations à combler par une hypothèse plausible — poser la question.

Une spec formelle est **obligatoire** pour : une nouvelle page ou section, un changement de
direction artistique, un chantier d'internationalisation, une refonte de navigation, et tout ce
qui touche aux allégations ou aux références scientifiques. Voir « Lancer une spec » plus bas.
Les correctifs et ajustements visuels localisés passent directement en branche + PR.

## Déploiement — à lire avant toute modification

`main` est synchronisée avec le **thème live** par l'intégration GitHub native de Shopify. Il n'y a ni
workflow CI ni token : **ce qui arrive sur `main` part en production.**

Conséquences pratiques :

- Tout passe par une PR. Pas de push direct sur `main`.
- Un fichier référencé par le code doit exister **avant** le merge, pas après.
- Shopify refuse tout thème dépassant **50 Mo**.

## Structure

| Dossier | Contenu |
|---|---|
| `sections/` | Sections de page. `main-product.liquid` (~2 000 lignes) et `cytolight-home.liquid` portent l'essentiel du contenu éditorial. |
| `snippets/` | Fragments réutilisables (`product-card`, `icon`, `nav-hub-card`, `editorial-hero`). |
| `templates/` | Points d'entrée. `index.liquid` appelle `cytolight-home` ; `product.json`, `collection.json` et `cart.json` référencent les sections `main-*` ; `list-collections.liquid` redirige `/collections` et `/products` vers le catalogue. |
| `layout/` | `theme.liquid` (enveloppe globale) et `password.liquid`. |
| `assets/` | **CSS et JS uniquement** — voir la convention ci-dessous. |
| `config/` | `settings_schema.json` (définitions) et `settings_data.json` (valeurs, auto-généré). |

`theme.css` porte les styles globaux et la palette ; `cytolight-cinematic.css` / `.js` gèrent les
animations au scroll de la page d'accueil.

## Convention images

**`assets/` ne contient aucune image.** Ce dossier est réservé au CSS, au JS et aux éléments d'interface.

| Type de fichier | Emplacement | Référence Liquid |
|---|---|---|
| CSS, JS | `assets/` | `{{ 'theme.css' \| asset_url }}` |
| Photo, visuel marketing, éditorial | Content → Files | `{{ 'photo.jpg' \| file_url }}` |
| Visuel modifiable par un non-technique | Content → Files, via `image_picker` | `{{ section.settings.image \| image_url: width: 1200 }}` |

Deux raisons : le plafond de 50 Mo, et le fait que Git ne sache pas fusionner deux versions d'un binaire.
Le thème avait atteint 59,4 Mo avant la migration ; il fait aujourd'hui environ 500 Ko.

Pour ajouter un visuel :

1. L'uploader dans Content → Files depuis l'admin Shopify — cette étape ne peut pas être automatisée
   depuis le dépôt, elle demande une action manuelle.
2. Relever le nom retourné par Shopify. En cas de doublon il est suffixé (`photo.jpg` → `photo_1.jpg`),
   et `file_url` sur le nom d'origine pointerait dans le vide.
3. Le référencer avec `{{ 'ce-nom.jpg' | file_url }}`.

`file_url` renvoie une URL protocol-relative, utilisable telle quelle dans un `src` comme dans un
`background-image: url(...)`.

> `shopify://shop_images/...` ne se résout que dans les fichiers de réglages JSON, alimentés par des
> réglages `image_picker`. Ce n'est pas une URI utilisable directement en Liquid.

## Langues

Le thème n'utilise pas les fichiers de traduction pour son contenu éditorial. Chaque section dérive un
booléen depuis la locale, puis inline les langues :

```liquid
{%- assign is_fr = false -%}
{%- if request.locale.iso_code contains 'fr' -%}
  {%- assign is_fr = true -%}
{%- endif -%}

{% if is_fr %}Récupération{% else %}Recovery{% endif %}
```

Le thème est **bilingue FR / EN**, à parité stricte : tout texte ajouté couvre les deux langues
dans le même commit, `aria-label` compris. Un `TODO: traduire` est un défaut, pas une étape.

**Le portugais est retiré**, y compris de `sections/header.liquid` et de
`snippets/header-panel-media.liquid` que citaient les versions précédentes de ce document. Ne
pas en ajouter. Son retour éventuel passerait par une spec couvrant l'intégralité du site, pas
par un `elsif` de plus.

**Tout lien interne écrit en dur porte `locale_root`.** Shopify Markets attache la langue
principale au *domaine* : sur `antared.care` le français est à la racine et l'anglais sous
`/en`, sur `cytolight.myshopify.com` c'est l'inverse. Un `href="/pages/science"` renvoie donc
toujours à la langue racine du domaine, quelle que soit celle du visiteur. Le 2026-09-01, les
soixante-neuf liens du mega-menu et du tiroir mobile étaient dans ce cas : un visiteur
francophone perdait le français au premier clic dans le menu, sur chaque page du site.

La forme correcte est `href="{{ locale_root }}/pages/science"`, où `locale_root` vaut `''` sur la
langue racine et `/fr` (ou `/en`) ailleurs. Mieux encore : passer par `pages[handle].url`,
`collections[handle].url` ou `product.url`, qui portent déjà le préfixe — `locale_root` ne sert
alors qu'au repli, tant que la page n'existe pas dans l'admin. Le symptôme est silencieux : la
page répond 200, elle répond simplement dans l'autre langue.

> `snippets/learn-nav.liquid`, que citaient les versions précédentes de ce document et de la
> constitution, **n'existe plus** : la sous-navigation Learn a été retirée avec lui.

> La parité vaut aussi pour les pages rédigées **dans l'admin**, qui échappent à ce mécanisme :
> l'audit du 2026-08-21 en a trouvé 16 strictement identiques en FR et en EN. Voir le brief produit.

Les accents sont écrits en entités HTML (`&eacute;`) dans les sections existantes. S'aligner sur le
fichier modifié.

## Contenu conditionné au produit

`main-product.liquid` sert les huit fiches produit et bascule son contenu éditorial selon le handle,
via **six** booléens dérivés en début de section : `is_cap`, `is_mask`, `is_foot`, `is_knee`,
`is_sauna_dome` et `is_pano_ultra`, chacun sur le handle `cytolight-` correspondant. Les deux
autres — `cytolight-desk` et `cytolight-pano-plus` — retombent sur la branche par défaut.

Le seuil de livraison offerte se dérive au même endroit (`free_shipping_cents`, aligné sur
`sections/main-cart.liquid`) : la mention « Livraison offerte dès 125 € » disparaît des fiches qui
franchissent déjà le seuil.

Une modification dans ce fichier doit être vérifiée sur **chaque** variante, pas seulement celle en cours.

> Le fichier commençait par la chaîne littérale `&#65279;` — un BOM échappé. Ce n'est pas un blanc :
> il ouvrait une ligne anonyme haute d'une interligne entre le header et la page, soit une bande vide
> couleur du fond global en tête des huit fiches. Aucun outil ne le signalait. Un caractère invisible
> en tête de section se voit à l'écran, pas dans le diff.

## `/collections` et `/products`

Ces deux chemins tombent sur le gabarit `list-collections`. Le thème n'en portait aucun : Shopify
servait sa page par défaut — sans en-tête, sans pied de page, sans style — au milieu de la boutique.
`templates/list-collections.liquid` y répond désormais et renvoie vers
`routes.all_products_collection_url`, avec le préfixe de langue.

C'est une redirection **côté client** : `{% layout none %}` pour pouvoir écrire dans le `<head>`,
puis trois filets — script, `<meta http-equiv="refresh">`, lien visible — et un `noindex`. La
redirection propre reste un **301 dans Online Store → Navigation → URL Redirects**, qui ne peut pas
se créer depuis le dépôt. Tant qu'il n'existe pas, les moteurs ne suivent pas la redirection.

## Pied de page

Le pied de page tient en deux rangées. La **rangée de tête** (`.site-footer__masthead`) porte le
logo à gauche et l'inscription newsletter à sa droite, sur son niveau, et se termine par un filet.
La **rangée de liens** vient dessous : le bloc de marque (accroche, réseaux) à gauche, les colonnes
de menus à sa droite — elles commencent donc sous le logo.

Les colonnes s'alignent par le **haut**, à toutes les largeurs : leurs intitulés se posent sur une
même ligne. Un alignement par le bas — l'état précédent — calait la *dernière* ligne de chaque liste
sur une même base, et faisait donc démarrer les intitulés en escalier, d'autant plus creusé que les
listes sont inégales. `min-width: 1180px` reste le seuil au-delà duquel les sept colonnes possibles
tiennent sur une seule ligne (`flex-wrap: nowrap` plus `flex: 1 1 0` les y maintiennent quel que soit
leur nombre) ; en dessous, la grille s'enroule.

L'inscription newsletter passe par `{% form 'customer' %}` avec le tag `newsletter`, qui distingue
un contact marketing d'un compte ouvert au checkout. Elle fonctionne **sans JavaScript** : succès et
erreurs viennent du POST. Le halo rouge et le balayage néon sont en CSS pur, déclenchés par
`:has(input:valid:not(:placeholder-shown))` — `:valid` seul serait vrai dès le chargement sur un
champ vide. Le balayage est déclaré au repos, hors cadre, et l'animation ne fait que le faire
glisser ; il est enfermé dans `prefers-reduced-motion: no-preference`.

`theme.js` **intercepte l'envoi** et le rejoue en `fetch`, sans quitter la page : le POST natif
rechargeait tout le site, remontait le visiteur en haut et remplaçait le champ par une pastille de
succès — toute la rangée de tête changeait de hauteur. L'effet reste désormais dans le bouton
(balayage en boucle pendant l'envoi, puis libellé « Inscrit ✓ » et halo), et la ligne de message
sous le champ garde sa hauteur même vide pour ne rien pousser. Trois règles tiennent ce bloc :

1. **Le POST natif reste la référence.** Sans `fetch`, sans `FormData`, ou si le navigateur refuse
   l'adresse, le script ne touche à rien et le formulaire part comme avant. Et si la boutique
   répond sans traiter l'envoi — page de vérification anti-robot, maintenance, 5xx — le script
   **repasse la main au POST natif** plutôt que d'afficher une erreur : la page se recharge, ce qui
   est moins bien, mais l'inscription aboutit. C'est ce qui la rend testable sous
   `shopify theme dev`, où le proxy répond 403 à tous les coups.
2. **Le succès se lit sur deux signaux**, aucun n'étant garanti seul : `?customer_posted=true` dans
   l'URL finale de la réponse, ou la présence de `site-footer__news-ok` dans le HTML renvoyé — cette
   pastille n'existe que sous `form.posted_successfully?`.
3. **Le balayage d'attente est posé sur le bouton, pas sur le champ.** La règle
   `:has(input:valid…)` du champ est plus spécifique et l'emporterait sur une règle d'état.

> Le chemin `fetch` **ne s'exerce pas sous `shopify theme dev`** : le proxy local répond 403 et
> sert la page « Verifying your connection » de Shopify, quelle que soit l'adresse — même limite
> que le POST vers `/localization`. En local, l'inscription passe donc toujours par le repli
> natif, avec rechargement. Les quatre états (succès, adresse refusée, requête refusée, réseau
> coupé) se vérifient en remplaçant `window.fetch` par un stub ; l'absence de rechargement se
> contrôle en boutique.

## Boutons d'appel a l'action

Cinq familles cohabitent — `.btn` (theme.css), `.cy-button` (accueil), `.ln-button` (Learn et
hubs), `.fyc-*` (questionnaire), `.cl-atc` (fiche produit) — et elles partagent **une seule
mecanique**, decrite en tete du bloc CTA de `assets/theme.css` :

| | |
|---|---|
| au repos | une ombre portee, `--cta-shadow` |
| au survol | le bouton descend de `--cta-press` (3 px), perd son ombre, et passe au **blanc sur le rouge de la marque** — quelle que soit sa couleur de depart |
| au clic | `opacity: .5`, le temps que le doigt reste dessus |

Trois choses a ne pas rater en y touchant :

1. **`--color-accent` n'est pas le rouge des boutons.** Ce reglage vaut `#c7996e`, un sable herite
   d'une palette anterieure, encore utilise par des liens et des pastilles — et par le fond au repos
   des CTA du questionnaire. Le rouge des boutons est `--cta-red` (`#d20d2f`), la meme valeur que
   `--cy-red` et `--ln-red`. Un survol calcule sur `--color-accent` donnait un bouton beige.
2. **Le deplacement vit dans `prefers-reduced-motion: no-preference`**, jamais ailleurs. Sans lui, le
   survol change quand meme de couleur et perd son ombre : l'etat reste signale, il ne bouge pas.
3. **La couleur du survol se reaffirme sur les variantes claires.** `.cy-button--light` porte
   `color: #111 !important` et `.ln-page a { color: inherit }` est plus specifique que
   `.ln-button--light` : sans rappel a la bonne specificite, le libelle reste noir sur le rouge du
   survol. Voir les selecteurs `.ln-page a.ln-button--*:hover`.

Le bouton de la newsletter est le seul a garder son propre survol : il s'enfonce comme les autres,
mais son ombre portee cede la place au halo neon au lieu de disparaitre.

## Sections cinema de l'accueil

`cytolight-home.liquid` porte trois scenes a scene collante — DESK (« Sept spectres »), Cap et
PANO ULTRA — pilotees par `cytolight-cinematic.css` / `.js`. Le JS ne fait qu'une chose : publier la
progression du scroll dans quatre variables (`--cy-p`, `--cy-pe`, `--cy-zoom`, `--cy-light-step`) ;
tout le mouvement est en CSS. Trois regles tiennent ces sections :

1. **L'effet de scroll appartient a l'image, jamais au texte.** Aucune opacite liee au defilement
   ne se pose sur `.cy-cinema__panel` : la version precedente faisait fondre le panneau au-dela de
   68 % de la course, et le paragraphe palissait sous les yeux du lecteur alors qu'il etait encore
   en plein ecran.
2. **Les visuels sont contenus, pas recadres, et ils commencent sous le header.** Les sources sont
   en 16/9, la scene ne l'est pas : en `cover`, l'ecart de ratio se paye en rognage vertical — le
   panneau DESK perdait son sommet, l'athlete PANO sa tete. DESK et PANO sont donc en
   `object-fit: contain`, a 88 % de la scene. Le header et la scene sont tous deux
   `position: sticky; top: 0`, et le header passe devant : le haut du cadre lui revient toujours,
   et c'est ce qui coupait encore la tete du sujet une fois le rognage supprime. D'ou le
   `inset: var(--header-h, 0px) 0 0 0` du plan image — `--header-h` est publiee par `theme.js`.
   Seule la scene Cap garde le plein cadre, header compris : son plan de fond est une plaque
   d'ambiance, son sujet vit dans le calque avant-plan.
3. **Les sept longueurs d'onde ne s'ecrivent qu'une fois**, dans les variables `--cy-wave-*` de
   `cytolight-cinematic.css`. La liste `.cy-spectrum` et la lumiere posee sur l'image les lisent
   toutes deux — le JS lit meme la teinte courante sur la brique elle-meme, plutot que de recopier
   les valeurs. Cette lumiere (`.cy-cinema__beam`) **ne glisse pas** : elle change de teinte en
   fondu, sept fois sur toute la course, quand le scroll passe d'une brique a la suivante. Une
   version anterieure faisait defiler une bande de sept couleurs derriere un masque ; c'est plus
   agite et cela ne dit pas ce que fait l'appareil, qui commute de longueur d'onde. Ne pas revenir
   non plus a un degrade recolore image par image : repeindre un degrade a chaque frame invalide
   tout le calque, exactement comme le `filter()` scroll-linked deja retire de l'image. Sans
   support de `mask-image`, la lumiere ne s'affiche pas du tout : non masquee, elle serait un aplat
   de couleur sur toute la scene.

La course de la scene collante est de **170vh**, soit 70 % d'ecran de defilement pour derouler la
sequence entiere. A 220vh, la derniere longueur d'onde arrivait bien apres que le texte avait fini
de se poser.

Le parallaxe est neutralise sous 900 px (la scene n'est plus collante, `--cy-p` ne progresse plus
de maniere fiable) et sous `prefers-reduced-motion`. Dans les deux cas la lumiere est figee sur le
rouge profond et rien ne bouge.

## Espace Learn

Sept pages éditoriales plus le blog, regroupées sous l'entrée **Apprendre / Learn** du mega-menu.
L'espace fusionne deux lots de contenu : les pages rédigées dans l'admin (`wavelengths`, `how-to-use`,
`faq`, `academy`) et les sections Liquid écrites dans le thème.

| Page (handle) | Gabarit | Section | Contenu porté par |
|---|---|---|---|
| `academy` | `page.academy.liquid` | `learn-hub` | le thème |
| `comment-ca-marche` | `page.comment-ca-marche.liquid` | `learn-how-it-works` | le thème |
| `wavelengths` | `page.wavelengths.liquid` | `learn-wavelengths` | le thème |
| `science` | `page.science.liquid` | `learn-science` | le thème |
| `how-to-use` | `page.how-to-use.liquid` | — (contenu admin) | l'admin |
| `faq` | `page.faq.liquid` | — (contenu admin) | l'admin |
| `nos-valeurs` | `page.nos-valeurs.liquid` | `learn-values` | le thème |
| blog | `blog.liquid`, `article.liquid` | — | l'admin |

Trois gabarits vivent hors de ce tableau : `page.contact.liquid` (formulaire bilingue,
fonctionnel sans JavaScript), `page.benefits.liquid` et `page.find-your-cytolight.liquid`.
Le premier rend `snippets/editorial-hero.liquid`, le fragment de hero paramétré — fil d'Ariane,
kicker et titre en FR et EN — destiné à toutes les coquilles de pages rédigées dans l'admin.

**Les gabarits doivent être assignés à la main dans Content → Pages, après le merge.** Le sélecteur
« Theme template » de l'admin ne liste que les gabarits du thème **publié** : tant que la PR n'est pas
mergée, `page.science` & co. n'y apparaissent pas. Le thème ne peut pas créer les pages.

Les handles sont ceux réellement créés en boutique, d'où le mélange FR / EN (`comment-ca-marche`,
`nos-valeurs` d'un côté, `wavelengths`, `science`, `faq` de l'autre). Shopify ne dérive le handle du
titre **qu'à la création** : renommer le titre d'une page existante ne change jamais son URL, elle se
corrige dans *Search engine listing → Edit → URL handle*.

La sous-navigation qui coiffait les pages Learn a été retirée : le mega-menu du header porte
l'entrée Apprendre avec ses huit liens, et les deux barres se superposaient. `sections/header.liquid`
est désormais le **seul** endroit où vivent les URL de l'espace — un handle qui change se corrige là,
et nulle part ailleurs.

> **Tout chemin écrit en dur porte `{{ locale_root }}`.** Un `href="/pages/faq"` nu renvoie à la
> locale principale : le visiteur anglophone repart sur la version française, même quand la page
> anglaise existe — c'est ce qui ramenait « Find Your Antared » sur le questionnaire français.
> `locale_root` vaut `''` sur la locale principale et `/en` ailleurs ; il est dérivé en tête de
> chaque section qui écrit des chemins (`header`, `cytolight-home`, `main-collection-banner`).
> Quand un objet Shopify est disponible — `product.url`, `collection.url`, `pages[handle].url` —
> il est préféré : il porte déjà le préfixe.

`assets/learn.css` et `learn.js` ne sont chargés que par ces gabarits. Le CSS ne masque **jamais**
rien de lui-même : c'est `learn.js` qui pose `is-armed` sur ce qu'il va animer. Sans le script — bloqué,
404 sur le CDN, mouvement réduit — rien n'est armé et la page s'affiche entièrement. Ne pas
réintroduire de règle du type `.ln-reveal { opacity: 0 }`, elle rendrait la page blanche au moindre
incident. Même logique pour les états d'animation : la transition n'est déclarée que dans l'état
révélé, sinon l'élément s'efface visiblement avant de revenir.

Le collant est posé sur **`#shopify-section-header`**, l'enveloppe que Shopify ajoute autour de la
section — pas sur `.site-header`. Un élément collant ne peut pas sortir des limites de son parent :
sur `.site-header`, ce parent était l'enveloppe de section, haute exactement de la hauteur du header,
donc la course disponible était nulle et le header défilait avec la page malgré son `position: sticky`.
Le symptôme est silencieux : la règle est bien appliquée, elle ne produit simplement aucun effet.

`theme.js` mesure le header et publie sa hauteur dans `--header-h`, dont se servent la colonne galerie
de la fiche produit et le récapitulatif du panier. Le même script pose `.is-hidden` sur la rangée de
menu — `.site-header__nav`, et elle seule : le bandeau de réassurance et la barre logo restent en
place. Toujours garder une valeur de repli : sans le script, rien ne doit bouger.

L'état est **binaire**, jamais intermédiaire : la rangée est entière ou masquée, et il faut franchir un
seuil pour basculer (64 px cumulés vers le bas pour masquer, 24 px vers le haut pour revenir, chaque
changement de direction remettant le compteur opposé à zéro). Une version antérieure suivait le
défilement au pixel près, en posant une `max-height` inline proportionnelle à la distance parcourue :
défiler de quelques pixels laissait la rangée arrêtée à mi-course, à demi transparente, suspendue sous
le logo et immobile tant qu'on ne défilait pas davantage. Ne pas y revenir — l'animation appartient au
CSS, le JS ne fait que poser la classe. La rangée n'existe qu'au-dessus de 1300 px de large
(`display: none` en dessous) : tout test du masquage demande une fenêtre plus large.

Trois pièges se cachent derrière ce masquage, tous vérifiés en conditions réelles :

1. **Le header est dans le flux.** `position: sticky` n'extrait pas l'élément : rétracter la rangée
   raccourcit le document d'autant, le navigateur recule alors le scroll pour compenser (*scroll
   anchoring*), `theme.js` relit ce recul comme un défilement vers le haut et ramène la rangée —
   masquage, saut, retour, en boucle au moindre petit scroll. D'où la marge basse posée sur
   `#shopify-section-header` (`.is-nav-hidden`), qui rend au flux exactement la hauteur retirée, et la
   resynchronisation du repère `lastY` après chaque bascule. Les deux transitions — `max-height` de la
   rangée et `margin-bottom` de l'enveloppe — doivent garder **la même durée, la même courbe et la
   même amplitude**, faute de quoi la page tremble en cours d'animation.
2. **`max-height` borne la boîte bordure** (`box-sizing: border-box` global), et la boîte ne descend
   jamais sous la bordure de 1 px. D'où le `calc(--nav-row-h + 1px)` révélé et le `1px` masqué : viser
   `0` désynchronise les deux courses sur la fin.
3. **Une transition part même si elle vient d'être déclarée.** Publier la mesure et armer l'animation
   dans la même passe de style anime le passage de la valeur de repli à la mesure — la rangée se
   rétractait de dix pixels toute seule au chargement. Le script lit donc la mise en page entre les
   deux, puis pose `.nav-collapse-ready`.

**Ce qui retient la rangée** : le survol, et le focus **clavier** (`:focus-visible`) — jamais le focus
qu'un clic souris laisse derrière lui. La nuance n'est pas cosmétique : traité comme du focus clavier,
ce focus-là épinglait la rangée pour de bon, et plus rien ne se masquait après un clic dans le menu.
Un défilement referme donc le panneau ouvert au clic et relâche ce focus ; il ne touche jamais à un
focus clavier.

## Pages Protocoles

Sept pages d'usage, servies par **une seule section** — `sections/protocol-page.liquid` — qui
dérive le protocole depuis `page.handle`, exactement comme `main-product.liquid` le fait depuis
`product.handle`. Sept gabarits d'une ligne, une seule mise en page à maintenir.

| Handle | Gabarit | Sujet |
|---|---|---|
| `protocols` | `page.protocols.liquid` | index, ne décrit aucune séance |
| `pre-workout` | `page.pre-workout.liquid` | avant l'effort |
| `post-workout` | `page.post-workout.liquid` | après l'effort |
| `daily-recovery` | `page.daily-recovery.liquid` | récupération quotidienne |
| `skin-routine` | `page.skin-routine.liquid` | routine peau |
| `full-body-routine` | `page.full-body-routine.liquid` | séance corps entier |
| `workday-routine` | `page.workday-routine.liquid` | journée de travail |

Trois règles tiennent ces pages, et elles ne se contournent pas :

1. **Les quatre paramètres de séance** — moment, durée, distance, fréquence — sont présents et
   chiffrés dans les deux langues. Trois sur quatre est un défaut.
2. **Le bloc « ce que cette séance ne fait pas »** figure sur chaque page. C'est lui qui tient
   la page du bon côté du principe II : décrire un usage est autorisé, promettre un effet sur
   une pathologie ne l'est pas. Le retirer transforme la page en allégation.
3. **Aucun chiffre de dose n'est écrit ici en premier.** Durée, fréquence et distance viennent
   de `learn-how-it-works` ; les longueurs d'onde de `learn-wavelengths`. Ces deux pages font
   foi. Une valeur changée ici sans l'être là-bas crée une contradiction qu'aucun script ne
   voit — elle ne se verra qu'en clientèle.

Faute de tableaux d'objets en Liquid, les listes répétées (étapes, erreurs, limites) passent par
une chaîne à deux séparateurs : `|` sépare les éléments, `~` sépare le titre du texte. Aucun
texte ne doit contenir ces deux caractères.

Comme pour l'espace Learn, **les gabarits s'assignent à la main dans Content → Pages après le
merge** : le sélecteur ne liste que les gabarits du thème publié.

### Répartition des contenus

`learn-how-it-works` traite le mécanisme, la dose et la sécurité ; le spectre détaillé vit sur
`learn-wavelengths` pour ne pas maintenir deux fois la même liste de longueurs d'onde. La FAQ
commerciale (essai, garantie, certifications) reste sur la page `faq` de l'admin ; le bloc sécurité de
`learn-how-it-works` y renvoie. `learn-wavelengths` reprend la correspondance longueur d'onde /
appareil qui était saisie dans l'admin — elle doit rester alignée sur les fiches produit.

### Références scientifiques

`learn-science.liquid` cite quinze jalons et huit publications, chacun lié à son DOI. Aucune de ces
études n'a été menée sur un appareil Antared, et la section le dit explicitement dans son bloc
« Ce que ces études ne disent pas ». Ce bloc n'est pas décoratif : sans lui la page devient une
allégation de santé non étayée sur les produits vendus, sanctionnée par l'article L.121-2 du Code de
la consommation et rejetée à la validation des comptes publicitaires.

Ne jamais ajouter une référence sans identifiant vérifiable, ni retirer le cadrage sur les limites.

## Pages d'atterrissage du menu

Les six onglets du mega-menu sont des **liens**, pas des boutons : chacun mène à la page qui
coiffe sa rubrique. Un onglet qui n'ouvrait qu'un panneau laissait le visiteur sans destination
au clic — et, le focus restant sur le bouton, l'onglet gardait son soulignement de survol après
le clic, comme s'il était encore survolé.

| Onglet | Destination | Gabarit | Section |
|---|---|---|---|
| Boutique | `routes.all_products_collection_url` | — (collection) | — |
| Par objectif | `/pages/goals` | `page.goals.liquid` | `goals-hub` |
| Protocoles | `/pages/protocols` | `page.protocols.liquid` | `protocol-page` |
| Apprendre | `/pages/academy` | `page.academy.liquid` | `learn-hub` |
| Antared Pro | `/pages/antared-pro` | `page.antared-pro.liquid` | `pro-hub` |
| Pourquoi Antared | `/pages/why-antared` | `page.why-antared.liquid` | `why-hub` |

Les URL sont dérivées une fois en tête de `sections/header.liquid` (`url_shop`, `url_goals`,
`url_protocols`, `url_learn`, `url_pro`, `url_why`) et réutilisées par la rangée d'onglets, le
visuel de chaque panneau et le tiroir mobile. Un handle qui change se corrige à cet endroit, et
nulle part ailleurs. Chaque variable passe par `pages[handle].url` — qui porte le préfixe de
langue — avec repli sur le chemin écrit en dur tant que la page n'existe pas dans l'admin.

**Ces pages doivent être créées dans l'admin, gabarit assigné, avant le merge** (constitution,
principe I). Le sélecteur « Theme template » ne liste que les gabarits du thème *publié* : créer
la page d'abord, assigner le gabarit après le merge.

> `sections/protocols-hub.liquid`, que citaient les versions précédentes de ce document,
> **n'existe plus** : deux branches avaient créé chacune leur index Protocoles, et
> `page.protocols.liquid` rendait déjà `protocol-page`. Le doublon n'était rendu nulle part.

Les quatre sections d'atterrissage réutilisent `assets/learn.css` et `learn.js` — mêmes classes
`ln-*`, mêmes révélations au scroll, aucune feuille de style supplémentaire. Les cartes passent
par `snippets/nav-hub-card.liquid`, qui **rend un `<div>` au lieu d'un `<a>` quand l'URL est
vide** : une rubrique dont la page n'existe pas encore s'affiche sans lien plutôt qu'avec un lien
vers une 404. Créer la page suffit à activer le lien, il n'y a rien à modifier dans la section.

Sur pointeur fin, le clic navigue et le panneau reste piloté par le survol. Sur pointeur grossier,
où le survol n'existe pas, `theme.js` retient la première touche pour ouvrir le panneau ; la
seconde suit le lien. Le test se fait au moment du clic, pas au chargement — une tablette avec
clavier-souris bascule d'un mode à l'autre sans recharger.

### Barre du header

Trois réglages tiennent ensemble et se cassent facilement l'un l'autre :

- **La barre garde `grid-template-columns: 1fr auto 1fr` à toutes les largeurs.** En passant à
  `auto 1fr auto` sous 1300 px, le logo était centré dans la place restante entre le burger et les
  utilitaires de droite — donc décalé vers la gauche, d'autant que ce côté pèse plus lourd. Deux
  gouttières égales le centrent dans la fenêtre quoi qu'on ajoute de part et d'autre.
- **Le padding horizontal se réécrit, il ne se supprime pas.** `.container` en pose 20 ; la règle
  mobile posait `padding: 11px 0`, ce qui les annulait et collait le burger et le panier aux bords
  de l'écran. Elle pose désormais `11px 16px`.
- **Le bandeau de réassurance disparaît sous 800 px.** Il n'y tenait pas sur une ligne : il devenait
  une bande noire à défilement horizontal dont le second argument restait hors champ. Les mêmes
  engagements sont repris dans le tiroir, sur la fiche produit et dans le panier.

### Sélecteur de langue

C'est un `<details>` (`assets/lang-flags.css`) : le `<summary>` porte le drapeau courant et son code,
le panneau liste les langues **nommées**. La rangée de drapeaux côte à côte qui vivait là tenait à
deux langues, débordait la barre à trois, et n'avait plus de place pour marquer l'active. Un drapeau
n'est d'ailleurs pas une langue : il désigne un pays, ce qui devient faux dès qu'une langue est
parlée dans plusieurs.

Il fonctionne sans JavaScript — ouverture, fermeture et soumission du formulaire `localization` sont
natives. `theme.js` n'ajoute que ce qu'une liste déroulante native ne sait pas faire : se refermer
sur un clic extérieur et sur Échap. Sous 420 px, le code de langue est masqué et il ne reste que le
drapeau et le chevron.

> Le POST vers `/localization` ne fonctionne pas sous `shopify theme dev` : il renvoie une page
> vide. Ce n'est pas un défaut du composant. Pour tester une langue en local, ouvrir directement
> l'URL préfixée (`/fr/...`).

### Variantes de bouton des pages Learn

`ln-button--light` et `ln-button--line` sont dessinés pour un **fond sombre** (hero,
`.ln-section--dark`, `.ln-cta`), `ln-button--ink` pour un **fond clair** ; le rouge plein va partout.
Un `--line` posé sur une section claire écrit en blanc sur crème.

Le piège est aggravé par la cascade : `.ln-page a { color: inherit }` (0,1,1) est plus spécifique
que `.ln-button--light` (0,1,0). Sans les rappels `.ln-page a.ln-button--*` de `learn.css`, un bouton
clair hérite du blanc de son hero sombre et son libellé disparaît sur son propre fond blanc — ce qui
était le cas sur `/pages/academy` depuis l'origine.

## Fichiers auto-générés

`config/settings_data.json`, `templates/cart.json`, `templates/collection.json` et
`templates/product.json` sont réécrits par l'éditeur de thème Shopify. L'intégration GitHub étant
bidirectionnelle, une modification dans l'éditeur produit des commits sur `main` sans que personne
n'ait poussé.

Ne pas les éditer à la main sans intention explicite.

## Lancer une spec

Deux outils portent le même nom et ne font pas la même chose.

| | Quoi | Quand |
|---|---|---|
| **CLI `specify`** | Installe et met à jour l'outillage : `specify check`, `specify init`. | Rarement — à l'installation, ou pour une mise à jour de spec-kit |
| **Commandes `/speckit-*`** | Le workflow lui-même, dans Claude Code. | À chaque chantier structurant |

La CLI ne lance **pas** de spec. Le workflow se déroule dans Claude Code :

```
/speckit-specify   Décrire le besoin en langage naturel → specs/NNN-nom/spec.md
/speckit-clarify   Poser les questions qui manquent, réinjecter les réponses dans la spec
/speckit-plan      Concevoir → plan.md, avec la porte « Constitution Check » à valider
/speckit-tasks     Découper → tasks.md, ordonné par dépendances
/speckit-implement Exécuter les tâches
```

`/speckit-analyze` contrôle la cohérence entre les trois documents ; `/speckit-checklist`
génère une liste de vérification sur mesure ; `/speckit-converge` compare le code réel à la
spec et ajoute les tâches manquantes.

**spec-kit ne crée aucune branche git.** Il numérote un dossier `specs/001-nom/` et écrit un
pointeur local dans `.specify/feature.json`. Le `BRANCH_NAME` qu'affichent ses scripts n'est
qu'un identifiant de dossier. La convention de branches du dépôt (`feat/`, `fix/`, `perf/`,
`refactor/`, `chore/`) reste seule en vigueur — créer la branche à la main, comme d'habitude.

`specs/` **se commite** : c'est la trace des décisions. `.specify/feature.json` est ignoré,
c'est un état par machine.

### Personnalisations locales

`.specify/templates/overrides/` a la priorité sur les templates du cœur et **survit à une mise
à jour de spec-kit** — contrairement à `.specify/templates/`, réécrit à chaque `specify init`.
Deux fichiers y vivent :

- `plan-template.md` — les sept gates de la constitution en cases à cocher, plus le contexte
  technique Shopify (fiches produit à vérifier, contenu hors dépôt à créer avant merge, budget
  performance) à la place du contexte générique de spec-kit.
- `constitution-template.md` — le scaffold à sept principes, pour qu'un futur amendement
  préserve la structure adoptée au lieu de repartir du squelette générique.

Toute personnalisation future va dans `overrides/`, jamais dans `.specify/templates/`.

## Audits

Deux scripts, tous deux en stdlib Python uniquement — aucune dépendance, conformément au
principe IV. Ils testent une boutique **servie**, pas le dépôt : `--base` vise par défaut
`cytolight.myshopify.com`, et `--base http://127.0.0.1:9292` un `shopify theme dev`.

```bash
python3 scripts/audit-nav.py
```

La navigation. Extrait les URL écrites en dur dans le thème, les teste dans les deux langues,
et sépare trois défauts : lien cassé, ébauche (sous le seuil de mots), page non traduite (les
deux langues identiques au mot près). `--base`, `--min-mots` pour ajuster.

Il reconnaît les trois formes de lien du thème : `href="/pages/x"`, `href="{{ locale_root }}/pages/x"`
et `append: '/pages/x'`. Ajouter une quatrième forme sans l'apprendre à l'extracteur rend l'audit
vert sur des URL qu'il n'a pas testées.

```bash
python3 scripts/audit-parcours.py
```

Le parcours d'achat. Lit le catalogue réel — pas de liste de handles en dur — et contrôle
chaque fiche dans les deux langues : la page répond, un seul `h1`, un prix non nul, un
formulaire `/cart/add` complet (action, variante, quantité), aucune image cassée ni sans
`width`/`height`, et FR ≠ EN au mot près. `--produit HANDLE` cible une fiche, `--verbeux`
affiche aussi les fiches saines, `--panier` ajoute réellement au panier puis le vide — c'est
la seule requête de ces deux scripts qui modifie un état, elle reste locale à la session et
ne s'active que sur ce drapeau.

**Les préfixes de langue ne sont pas écrits en dur** : les deux scripts lisent la langue racine
dans `<html lang>` puis les autres dans le sélecteur du header, et vérifient chaque préfixe avant
de le retenir. Ils supposaient FR à la racine et EN sous `/en` — vrai sur `antared.care`, faux sur
`cytolight.myshopify.com`, qui est pourtant leur `--base` par défaut. Conséquence relevée le
2026-09-01 : `audit-parcours` déclarait les huit fiches en HTTP 404, et le contrôle de parité de
`audit-nav` comparait chaque page à une URL en 404, donc ne se déclenchait jamais. Un audit qui
échoue partout ne se lit plus, et un audit qui réussit sans rien tester est pire.

Son septième contrôle, **les promesses commerciales**, est celui qui a manqué le plus cher :
il relève la durée d'essai, la durée de garantie et le seuil de livraison offerte sur toutes
les fiches, et échoue si une même promesse porte deux valeurs différentes. Le 2026-08-31, deux
branches ont annoncé simultanément 30 et 14 jours d'essai, puis 1 et 2 ans de garantie. Ni
`theme check` ni l'audit de navigation ne voyaient quoi que ce soit.

> **Une vitrine protégée par mot de passe répond 200** en servant la page de mot de passe.
> Les deux scripts le détectent maintenant et s'arrêtent : sans ce garde-fou, ils décrivaient
> cette page et concluaient que tout le site faisait 31 mots et n'était pas traduit.

## Workflow

Le dépôt est partagé entre deux développeurs. Une branche appartient à une seule personne.

```bash
# Démarrer — toujours depuis un main fraîchement tiré
git checkout main && git pull --ff-only origin main && git checkout -b feat/sujet

# Recaler quand main a bougé
git fetch origin && git rebase origin/main && git push --force-with-lease

# Après merge
git checkout main && git pull --ff-only origin main && git branch -D feat/sujet
```

Préfixes de branche : `feat/`, `fix/`, `perf/`, `refactor/`, `chore/`. Une branche ne sert qu'une fois —
ne jamais rouvrir une branche déjà mergée.

`--force-with-lease` uniquement, jamais `--force` seul. Ne jamais rebaser une branche appartenant à
l'autre développeur.

## Vérifier avant de proposer un merge

```bash
shopify theme check
```

La règle est dans la constitution et ne dépend d'aucun chiffre : **une branche sort au moins
aussi propre que `origin/main`**. Comparer les deux relevés avant de proposer un merge.

Dernier relevé sur `origin/main`, le 2026-09-01 : **zéro infraction**. Le dépôt en portait 19,
dont 6 erreurs ; les six vivaient toutes dans des sections que plus aucun gabarit ne rendait —
`vg-homepage`, `hero-video`, `image-with-text`, `featured-collection`, `newsletter` — supprimées
avec les trois snippets devenus orphelins. Ce relevé est ici, et pas dans la constitution,
précisément parce qu'il périme : il se corrige sans amendement.

```bash
shopify theme dev --store cytolight.myshopify.com
```

Crée un thème de développement non publié et sert le thème local sur `127.0.0.1:9292`, sans toucher au
live. Parcourir les pages affectées et contrôler dans l'onglet Réseau qu'aucune image ne renvoie 404 —
un 404 sur `/cdn/shop/files/` signale un fichier absent de Content → Files ou un nom divergent.

Ne pas annoncer qu'une modification fonctionne sans l'avoir vérifiée ainsi.

## Repères

| | |
|---|---|
| Marque | Antared (anciennement CytoLight) |
| Domaine public | `antared.care` |
| Boutique | `cytolight.myshopify.com` — identifiant technique, il ne se renomme pas |
| Thème live, connecté à `main` | `cytolight-theme/main` |
| Thème conservé pour rollback | `CytoLight Theme v4` (non publié) |
| Taille du thème | ~500 Ko, plafond 50 Mo |
| Logo du header | `LOGO_ANTARED_REDLIGHT_THERAPY_WHITE.webp` dans Content → Files, écrit dans `sections/header.liquid` (le réglage de section l'emporte) |
| Logo du pied de page | `LOGO_ANTARED_transparent.png` dans Content → Files |
| `settings.logo` (global) | `LOGO_ANTARED.jpg` — ne sert plus qu'aux données structurées |

La vitrine est actuellement **protégée par mot de passe** : elle répond 200 en servant la page de
mot de passe, ce qui fausse silencieusement tout audit lancé dessus.

Le travail local avec le Shopify CLI demande un `shopify auth login` préalable. Voir `.env.example`.

# Phase 0 — Recherche

**Feature**: Étoffer et traduire les pages portées par l'admin
**Date**: 2026-08-25

Les trois inconnues de la spec ont été tranchées par le porteur du projet avant cette phase
(véhicule hybride, report de CytoLight Pro, livraison en deux lots). Cette recherche porte sur
ce que leur mise en œuvre suppose, et se fait par lecture du dépôt plutôt que par hypothèse.

---

## D1 — Comment une page de l'admin devient bilingue sans quitter l'admin

**Décision** : traduction native Shopify, sur une boutique où le multilingue est déjà actif.

**Rationale** : `sections/header.liquid:59-70` rend un `{% form 'localization' %}` en itérant sur
`localization.available_languages`, avec `localization.language.iso_code` pour l'état actif. Cette
API n'est peuplée que si la boutique publie plusieurs langues. Le multilingue Shopify est donc
déjà en service — ce n'est pas une capacité à activer, c'est un mécanisme déjà utilisé par le
sélecteur de drapeaux du header.

Conséquence directe pour les 4 pages du groupe Divers : leur titre, leur corps et leurs champs
SEO se traduisent par langue depuis l'admin, sans toucher au thème. C'est aussi ce qui rend la
correction des 3 titres défectueux indépendante du merge.

Second acquis : `{% form 'localization' %}` est le formulaire natif, qui conserve le chemin
courant lors de la bascule. Le cas limite « la bascule de langue perd le contexte » relevé dans la
spec est donc déjà couvert par le thème, et n'appelle aucun travail — seulement une vérification.

**Alternatives considérées** :
- *Tout migrer en gabarits de thème* — écarté par la décision du 2026-08-25, et à raison : un
  délai de livraison ou une question de FAQ qui change ne doit pas demander une PR.
- *Un fichier `locales/*.json`* — ne s'applique pas. Le dépôt n'y met que des chaînes d'interface,
  jamais de contenu éditorial ; le thème entier fonctionne au booléen `is_fr`.

---

## D2 — Le squelette d'une page migrée existe déjà, à la ligne près

**Décision** : `templates/page.science.liquid` est le modèle, copié sans invention.

**Rationale** : ce gabarit fait 21 lignes et contient exactement quatre gestes — charger
`learn.css`, charger `learn.js` en `defer`, ouvrir un `<div class="ln-page" data-learn>`, appeler
la section, puis ajouter `page.content` **uniquement s'il n'est pas vide** :

```liquid
{%- if page.content != blank -%}
  <section class="ln-section ln-section--tight">
    <div class="ln-shell ln-shell--narrow">
      <div class="ln-prose">{{ page.content }}</div>
    </div>
  </section>
{%- endif -%}
```

Cette garde `!= blank` est ce qui rend la séquence de déploiement sûre. Pendant la fenêtre entre
l'assignation du gabarit et le vidage du corps admin, le paragraphe résiduel s'affiche sous le
contenu du thème — visible, corrigible, jamais perdu. Une fois le corps vidé, le bloc disparaît
de lui-même. Aucune coordination fine n'est nécessaire.

**Alternatives considérées** :
- *Écrire le contenu directement dans le gabarit*, comme `page.faq.liquid` — écarté : prive du
  rechargement `shopify:section:load` que `learn.js` écoute, et sort du modèle des pages
  éditoriales longues, qui passent toutes par une section.

---

## D3 — Les composants nécessaires sont tous dans `learn.css`

**Décision** : aucun CSS, aucun JS ajouté. Le chantier est du Liquid et du texte.

**Rationale** : relevé des classes de `assets/learn.css` face aux besoins des deux groupes.

| Besoin | Composant existant | Note |
|---|---|---|
| Séquence d'usage numérotée | `.ln-steps` / `.ln-step` / `.ln-step__title` / `.ln-step__text` | La numérotation « 01, 02… » est produite par `counter-increment` en CSS — aucun chiffre à écrire dans le Liquid, donc rien à traduire |
| Ce que la séance ne fait pas | `.ln-pledge` / `.ln-pledge__row` / `.ln-pledge__mark--no` | Le modificateur `--no` existe déjà : la forme « ce qu'on promet / ce qu'on ne promet pas » est native au thème |
| Questions fréquentes d'une page | `.ln-faq` / `.ln-faq__q` / `.ln-faq__a` | |
| Raisons de confiance en liste | `.ln-values` / `.ln-value__index` / `.ln-value__title` | Utilisé par `learn-values` |
| Hero, kicker, fil d'Ariane, titre | `.ln-hero` / `.ln-kicker` / `.ln-crumbs` / `.ln-title` | |
| Corps de texte, encarts | `.ln-shell` / `.ln-shell--narrow` / `.ln-copy` / `.ln-prose` / `.ln-note` | |
| Rappel produit de bas de page | `.ln-cta` / `.ln-picks` / `.ln-pick` | Rendu par `snippets/learn-product-cta.liquid` |
| Longueurs d'onde | `.ln-waves` / `.ln-wave__nm` / `.ln-wave__swatch` | À n'utiliser que sur `brand-technology`, et alignées sur `learn-wavelengths` |

Rien ne manque. C'est le résultat le plus utile de cette phase : le budget de performance du
principe VII n'est pas sollicité, et le principe IV n'est pas mis à l'épreuve.

**Corollaire sur `learn.js`** : le script n'arme que les éléments portant `.ln-reveal` ou `.ln-tl`
(`assets/learn.js`, fonction `init`). Une page qui n'en porte aucun s'affiche strictement à
l'identique script chargé ou non. Les pages du chantier peuvent donc en utiliser sans risque, ou
s'en passer — dans les deux cas le principe IV tient sans effort.

**Alternatives considérées** :
- *Un `assets/protocols.css`* — écarté : aucun composant manquant ne le justifierait, et ce serait
  une troisième feuille éditoriale à maintenir en parallèle.

---

## D4 — Le formulaire de contact

**Décision** : `{% form 'contact' %}`, la balise native de Shopify, dans
`templates/page.contact.liquid`. Aucun JavaScript.

**Rationale** : recherche dans le dépôt — **aucun `{% form 'contact' %}` n'existe nulle part**.
La page de contact d'un mot n'a donc jamais eu de formulaire. La balise native poste vers le
gestionnaire de Shopify, qui envoie sur l'adresse de notification de la boutique et renvoie sur la
page avec `form.posted_successfully?`. Elle fonctionne sans script, ce qui satisfait directement
le principe IV, et n'introduit aucun traitement de données au-delà de ce que Shopify fait déjà.

Trois libellés sont à porter en FR et en EN : les étiquettes de champ, le bouton, et le message de
confirmation. Ils vivent dans le gabarit, comme tout libellé d'interface du thème.

Le formulaire est de la **coquille**, pas du contenu : la prose de la page — délai de réponse,
identité de l'entreprise, engagements — reste saisie dans l'admin et traduite nativement. C'est
la même répartition que `page.faq.liquid` pratique déjà.

**Alternatives considérées** :
- *Une adresse e-mail affichée en clair* — écarté : moissonnée par les robots, et n'offre aucune
  confirmation au visiteur.
- *Un service tiers de formulaire* — écarté : ressource tierce bloquante et dépendance externe,
  contraires aux principes IV et VII.

---

## D5 — Où passe la frontière entre coquille et contenu

**Décision** : le véhicule d'une page se juge à l'endroit où vit sa **prose**, pas à l'existence
d'un gabarit dédié.

**Rationale** : la spec (FR-005) interdit qu'une page relève des deux véhicules. Sans définition,
`page.contact.liquid` et `page.bundles.liquid` sembleraient enfreindre cette règle. Le dépôt tranche
déjà : `page.faq.liquid` et `page.how-to-use.liquid` existent depuis l'espace Learn, portent une
coquille bilingue — fil d'Ariane, titre, rappel produit — et n'affichent que `{{ page.content }}`
au centre. Ces deux pages sont classées « admin » sans ambiguïté.

Règle retenue, écrite dans `contracts/page-template-binding.md` : est de la **coquille** ce qui ne
peut pas être produit par l'éditeur de page de l'admin — un formulaire, une carte produit tirée du
catalogue, un fil d'Ariane, un rappel de gamme. Est du **contenu** la prose qui répond à la
promesse de la page. Une page est « thème » quand sa prose est dans le dépôt, « admin » quand elle
est dans l'admin.

**Alternatives considérées** :
- *Migrer `contact` et `bundles` en véhicule thème* — cohérent formellement, mais gèle dans le code
  précisément ce qui bouge le plus (délais, composition des packs, remises).

---

## D6 — Ce que le lot 2 attend, nommément

**Décision** : quatre pages, quatre listes de faits, chacune avec son détenteur présumé.

**Rationale** : lecture croisée du brief produit et du dépôt. Le brief marque explicitement
« mesures d'irradiance disponibles (existent-elles ? mesurées par qui, à quelle distance ?) »
comme `[À COMPLÉTER]`, et le principe III interdit de combler par un plausible.

| Page | Faits requis | Source présumée |
|---|---|---|
| `brand-technology` | Irradiance mesurée, distance de mesure, opérateur de la mesure ; nombre de LED par appareil ; plage de pulsation confirmée | Fiche fournisseur, brief produit `[À COMPLÉTER]` |
| `brand-quality` | Contrôles à réception, taux de contrôle, garantie fournisseur, procédure de SAV et de retour | Porteur du projet |
| `brand-our-story` | Date et motif de création, lien avec Pareto Physio, implantation du stock UE | Porteur du projet |
| `page.bundles` | Composition exacte de chaque pack duo et famille, produits éligibles, conditions de cumul | Admin Shopify — remises duo −10 % / famille −15 % déjà implémentées sur la fiche produit ; seule la composition manque |

Le cas de `bundles` est le moins lourd : le mécanisme de remise est vérifiable dans le thème, seule
la liste des combinaisons vendues manque. C'est plausiblement le premier des quatre à sortir de
l'attente.

**Alternatives considérées** :
- *Rédiger au conditionnel sans chiffre* — écarté par la réponse du 2026-08-25 (structure +
  emplacements marqués), et par le brief : la donnée vérifiable est l'axe de différenciation
  retenu face à un marché francophone pauvre. Une page `technology` sans chiffre perdrait son
  seul argument.

---

## D7 — Ce que l'audit dira, et ce qu'il faut en attendre

**Décision** : `scripts/audit-nav.py` est la porte de vérification, avec un résidu attendu chiffré.

**Rationale** : le script détecte l'absence de traduction par **égalité stricte du nombre de mots**
entre FR et EN, mesuré sur le texte visible de `<main id="MainContent">` hors script, style et SVG
(`RE_MAIN`, `RE_NOISE`, `RE_TAG`). Deux conséquences pratiques :

1. C'est un détecteur d'ébauche non traduite, pas un contrôle de qualité de traduction. Il ne
   signalera jamais une traduction médiocre — seulement une absence. La relecture reste humaine.
2. Le seuil de mots et le comptage sont ceux du texte **rendu**. Les 11 pages migrées comptent
   donc leur contenu de thème ; les 4 pages admin comptent leur corps traduit. Les deux véhicules
   se mesurent au même endroit, ce qui est exactement ce qui compense la déviation au principe VI.

Le script collecte ses URL en lisant les `href="..."` en dur dans `sections/`, `snippets/`,
`templates/` et `layout/`. L'entrée CytoLight Pro restant en place, les 6 pages Pro **continueront
d'être testées et signalées**. Ce résidu est attendu et chiffré dans
`contracts/audit-expectations.md` ; c'est la seule protection contre une régression qui se
noierait dans un rapport bruyant.

**Alternatives considérées** :
- *Filtrer le groupe Pro du rapport* — écarté : masquer une dette assumée la fait oublier. Elle
  reste visible, avec son chiffre attendu à côté.

---

## Incohérences documentaires relevées, hors périmètre

Signalées ici pour trace, sans action dans ce chantier :

- `snippets/learn-nav.liquid` **n'existe pas** dans le dépôt. La constitution (principe VI) le
  désigne pourtant comme « la source unique des URL et libellés de la sous-navigation Learn », et
  `CLAUDE.md` le cite parmi les fichiers portant encore du portugais. La sous-navigation Learn a
  été retirée — `CLAUDE.md` le dit par ailleurs — mais les deux documents en gardent la trace.
- La constitution liste les booléens de `main-product.liquid` comme `is_cap`, `is_mask`, `is_knee`,
  `is_foot`, `is_sauna_dome`, `is_pano_ultra` ; `CLAUDE.md` en liste trois (`is_cap`,
  `is_pano_ultra`, `is_foot`). Sans effet sur ce chantier, qui ne touche pas ce fichier.

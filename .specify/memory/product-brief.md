# Brief produit CytoLight

Ce document porte la **direction** : vision, marché, cible, gamme, identité, objectifs.
Il évolue à chaque décision. Les règles qui ne se négocient pas vivent dans
`.specify/memory/constitution.md`.

Les blocs marqués **`[À COMPLÉTER]`** attendent une réponse du porteur du projet. Tant
qu'ils sont vides, un agent DOIT les traiter comme des inconnues et poser la question
plutôt que de combler par une hypothèse plausible.

> **Dernière mise à jour** : 2026-08-21

---

## Ce qu'on vend

Des appareils de luminothérapie rouge et proche infrarouge (photobiomodulation), en direct
au consommateur, sur Shopify.

Sept longueurs d'onde — 590 nm ambre, 630 / 660 nm rouge, 810 / 830 / 850 / 940 nm proche
infrarouge — pilotables individuellement en intensité et en pulsation (1–40 Hz), par écran
tactile ou application Bluetooth. C'est le différenciateur technique central : la plupart des
concurrents proposent deux longueurs d'onde fixes.

**Statut réglementaire** : produits de bien-être, **de dispositif médical**.
Cette ligne commande tout le discours — voir constitution, principe II.

## Où on va — marché et modèle

**Géographie** : Europe. Site bilingue **FR / EN**, à parité stricte. L'ajout de nouvelles langues passerait par une spec couvrant tout
le site.

**Modèle prioritaire (12 mois)** : B2C.

**Axe B2B — CytoLight Pro** : déjà câblé dans la navigation (cliniques, kinésithérapeutes,
salles de sport, hôtels & spas, bien-être en entreprise, revendeurs), **mais aucune de ces
six pages n'existe**. C'est un actif dormant : la demande professionnelle sur ce marché a un
panier bien supérieur au B2C et un cycle de vente plus long. À arbitrer explicitement — soit
on écrit ces pages, soit on retire l'entrée du menu. Un menu qui mène nulle part coûte plus
qu'il ne rapporte.

## Gamme et positionnement prix

Stratégie retenue : **gamme en escalier**. Une porte d'entrée accessible sur les accessoires,
une montée en gamme sur les grands formats.

| Handle | Produit | Format | Position |
|---|---|---|---|
| `cytolight-cap` | Casquette | Portable, mains libres, 660 + 850 nm, 150 LED | Entrée de gamme |
| `cytolight-mask` | Masque visage | Portable | Entrée de gamme |
| `cytolight-knee` | Genouillère | Ciblé | Entrée de gamme |
| `cytolight-foot` | Botte | Ciblé | Entrée de gamme |
| `cytolight-desk` | DESK | Panneau de bureau, 7 longueurs d'onde, écran tactile | Cœur de gamme |
| `cytolight-pano` / `-plus` / `-ultra` | PANO | Panneau panoramique | Montée en gamme — |
| `cytolight-sauna-dome` | Dôme sauna | Grand format immersif | Haut de gamme |

Bundles duo (−10 %) et famille (−15 %) déjà implémentés sur la fiche produit.

**Collections par objectif** : `recovery`, `performance`, `skin-amp-glow`, `longevity`,
`work-amp-focus`. C'est l'axe d'entrée dans la gamme — on vend un résultat recherché, pas
un appareil.

**Prix de référence relevés dans le thème** : les
montants sont figés dans `sections/vg-homepage.liquid`, une section morte. Les prix réels
vivent dans l'admin Shopify et peuvent avoir divergé. Nous devons revoir les prix avant de déployer le site.

Panier moyen visé = 400€ 
marge par référence, prix plancher acceptable en
promotion, politique de remise.

## À qui on parle

Personas prioritaires :

**1. Récupération / performance** — sportif régulier, cherche à récupérer plus vite.
**2. Longévité** — profil biohacking, lit les études, compare les irradiances.
**3. Peau & éclat** — routine esthétique, sensible au format et au design.
**4. Travail & concentration** — usage de bureau, le DESK est fait pour ce moment.
**5. Sommeil et repos** - profil cherchant à améliorer son sommeil.

Questions ouvertes : lequel prime ? Âge, genre, pouvoir d'achat ? Niveau de connaissance
préalable de la photobiomodulation ? Le client achète-t-il en connaissance de cause ou faut-il
l'éduquer d'abord — ce qui change tout le rôle de l'espace Learn.

## Concurrence

Le marché de la luminothérapie rouge croît fortement (~10 %/an) mais reste dominé par un modèle DTC mono-marque, majoritairement américain (Joovv, Mito Red Light, Bestqool, Lumebox — premium à budget) et canadien (Rouge). BON CHARGE occupe le créneau lifestyle généraliste. Aucun de ces acteurs n'opère de stock UE, ce qui les expose à la TVA dès le premier euro et aux droits de douane côté acheteur français. Novaa(Lab), malgré un storytelling fondateur français, opère entièrement en anglais depuis un entrepôt en Utah — aucun vrai service au marché francophone.

Le marché francophone est structurellement pauvre, avec peu d'acteur, comme CytoLED (Pays-Bas, fondée 2019). Des prix en EUR (299–1 699 €) et une clientèle française documentée depuis 2022-2023 (influenceurs, avis, reventes d'occasion). Son positionnement — rigueur scientifique, mesures d'irradiance vérifiées, anti-marketing mensonger — est celui que Cytolight viserait naturellement.

Axes de différenciation pour un lancement à zéro :

Autorité de marque et SAV 100 % français (personne d'autre ne le fait vraiment)
Stock intra-UE — zéro friction douanière
Modèle marketplace plutôt que DTC mono-marque
Positionnement prix « smart-value » entre premium et budget
Garantie légale FR (2 ans) et rétractation (14 j) comme réassurance native
Canal B2B via l'écosystème Pareto Physio (kinés, spas, salles de sport)

**Référence explicite dans le code** : `assets/theme.css` porte le commentaire
`BON CHARGE-Inspired Shopify Theme · Warm wellness-luxe palette`. La direction artistique
actuelle est un dérivé assumé de BON CHARGE. (à modifier dans le futur)

Concurrents suivis, et sur quel axe on les bat.

Repères du secteur, à confirmer ou corriger : Joovv (référence premium US, discours
scientifique, noir et rouge), BON CHARGE (lifestyle wellness, crème et chaleureux, forte
présence Instagram), Mito Red Light, Rouge, Bestqool, Lumebox, Novaa. Sur le marché
francophone, l'offre est nettement moins structurée — c'est probablement là que se trouve
l'espace.

## Direction artistique

**Parti retenu : hybride éditorial + tech.** Le crème et le serif portent le récit, la marque
et l'espace Learn ; le noir et le rouge glow portent les moments produit et démonstration.
C'est la trajectoire naturelle des derniers commits (`feat/universal-glow-effects`,
`feat/footer-glow`) — elle est désormais assumée plutôt que subie.

**Jetons de couleur** (`config/settings_schema.json`, injectés en `:root` par
`layout/theme.liquid`) :

| Jeton | Valeur | Rôle |
|---|---|---|
| `--color-background` | `#f5eee7` | Fond crème, registre éditorial |
| `--color-background-soft` | `#faede3` | Fond alterné |
| `--color-foreground` | `#171110` | Texte et fonds sombres |
| `--color-muted` | `#7a6f66` | Texte secondaire |
| `--color-accent` | `#c7996e` | Caramel — accent chaud |
| `--color-accent-soft` | `#ebdbcb` | Fond d'accent |
| `--color-accent-deep` | `#644839` | Accent appuyé |
| `--color-promo` | `#D81126` | Rouge — promotion, et désormais le glow signature |

**Typographie** : Instrument Serif (titres, 400) + Instrument Sans (corps, 400–700),
auto-hébergées en woff2 sous-ensemble latin (64 Ko), déclarées dans `layout/theme.liquid`.

> **Incohérence à corriger** : `config/settings_data.json` porte `font_body: "Poppins"` et
> `font_display: "Poppins"` alors que le préréglage et les `@font-face` disent Instrument.
> Sans effet visible — les polices auto-hébergées sont en tête de pile CSS — mais c'est un
> piège pour la prochaine personne qui lira ce fichier.

**Registre du mouvement** : révélations au scroll, zoom cinématique, glow rouge. Armé par
JavaScript (`is-armed`), jamais masqué par le CSS seul, `prefers-reduced-motion` respecté.

**Voix et ton.** —  Vouvoiement en français. Registre : expert
et sobre et premium

## Preuve et confiance

Ordre retenu, dans cet ordre :

1. **Maintenant — preuve technique.** Pas d'étoiles. On rassure par la donnée vérifiable :
   longueurs d'onde, irradiance mesurée, nombre de LED, spécifications, garantie 2 ans,
   essai 30 jours, livraison. Ces trois engagements sont déjà affichés dans la barre du header.
2. **Ensuite — avis vérifiés.** Une fois le service choisi (Judge.me, Loox ou équivalent).
   Achat vérifié obligatoire. `snippets/structured-data.liquid` est déjà prêt : il n'émettra
   un `aggregateRating` que quand de vrais avis existeront.
3. **Après — UGC et créateurs.** Sollicitation d'influenceurs. Tout partenariat rémunéré est
   signalé comme tel.

**`[À COMPLÉTER]`** — Service d'avis envisagé, budget créateurs, mesures d'irradiance
disponibles (existent-elles ? mesurées par qui, à quelle distance ?).

## Objectifs

**Chiffre d'affaires visé à 12 mois = +1M€** 

point de départ actuel = 0 € (pré-lancement). Avec la trajectoire de commandes ci-dessous et un panier moyen de 250 € HT, le run-rate de sortie d'année (mois 12) s'établit à ~250 K€/mois, soit ~3 M€ annualisés, pour un CA cumulé Année 1 d'environ 1,1-1,3 M€ HT.

Volume mensuel de commandes :
| Etape | volume de commande |
|--- | ---|
| 3 mois | 100 commandes/mois |
| 6 mois | 250 commandes/mois |
| 12 mois | 1000 commandes/mois |

Rythme de croissance implicite : 
- ×2,5 entre M3 et M6, 
- ×4 entre M6 et M12 

L'accélération se fait essentiellement sur le second semestre, une fois l'acquisition froide (payante) activée en complément du noyau chaud.

Budget d'acquisition mensuel et canaux actifs : en reprenant la fourchette CAC déjà établie (5 % du CA en scénario audience chaude, jusqu'à 20-25 % en acquisition froide) :

| Palier | CA mensuel | Budget acquisition |		
|---|---|---|
| M3 |	~25 K€	| 1,3-5 K€/mois |
| M6 | 	~62,5 K€ |	3-12,5 K€/mois |
| M12 | 	~250 K€ |	12,5-50 K€/mois |

Canaux : réseau chaud Pareto Physio (email, communauté longevity/biohacking, partenariats kinés/spas) en priorité jusqu'à M6 pour tenir le CAC bas ; contenu/SEO FR (comparatifs, mesures d'irradiance) en construction continue ; micro-influenceurs biohacking FR à partir de M4-M6 ; Meta/Google Ads activés progressivement en S2 pour absorber le volume nécessaire au palier des 1000 commandes/mois, que le seul trafic chaud ne peut pas fournir à cette échelle.

Taux de conversion du site en target : 1,5-2 % (catégorie à achat réfléchi, AOV élevé — pas de l'impulsif). Point de vigilance : à 1,5 %, atteindre 1000 commandes/mois au palier M12 suppose environ 66 700 visiteurs qualifiés/mois — c'est ce chiffre de trafic, pas seulement le budget, qu'il faut valider comme atteignable avec le mix de canaux ci-dessus.

Ce qui définit le succès à 12 mois : proposition — un run-rate CA (~3 M€ annualisés) et une position de référence reconnue sur le marché francophone (audience/SEO/notoriété), plutôt qu'un objectif de part de marché chiffrée (impossible à mesurer proprement, personne n'a de données de marché francophone) 
Revente objectif à 3 ans. 
Le vrai test à 12 mois : est-ce que Cytolight est devenu le point de comparaison par défaut pour un Français qui cherche un panneau red light — plus que le CA seul.

## Espace Learn

**Répartition des sujets** : `learn-how-it-works` traite le mécanisme, la dose et la sécurité ;
le spectre détaillé vit sur `learn-wavelengths` pour ne pas maintenir deux fois la même liste ;
la FAQ commerciale (essai, garantie, certifications) reste sur la page `faq` de l'admin.
`learn-science` cite quinze jalons et huit publications, chacun lié à son DOI.

Les gabarits doivent être **assignés à la main dans Content → Pages après le merge** : le
sélecteur de l'admin ne liste que les gabarits du thème publié.

## Chantiers

**En cours — n°1 : étoffer et traduire les 21 pages portées par l'admin.**

Audit du 2026-08-21 (`python3 scripts/audit-nav.py`, 42 URL de la navigation, FR et EN) :
**aucun lien cassé**. Toutes les pages existent. Le défaut est ailleurs, et il suit exactement
la ligne de faille entre les deux origines de contenu.

| Origine du contenu | Volume | FR / EN | Verdict |
|---|---|---|---|
| **Le thème** (sections Liquid avec `is_fr`) | 600 – 2 800 mots | Écart de 20 à 25 %, normal | Sain |
| **L'admin** (saisi dans Shopify Pages) | 1 – 175 mots | **Identiques au mot près** | Ébauches monolingues |

Les pages servies par `templates/page.liquid` — un simple `{{ page.title }}` + `{{ page.content }}` —
n'ont jamais été rédigées au-delà d'un titre et d'un paragraphe. **21 pages sont strictement
identiques en FR et en EN : c'est la totalité des pages de l'admin, sans une exception.**

| Groupe | Non traduites | Volume |
|---|---|---|
| **CytoLight Pro** | 6 / 6 — become-a-dealer, clinics, corporate-wellness, gyms, hotels-spas, physios | 75 – 116 mots |
| **Protocoles** | 7 / 7 — daily-recovery, full-body-routine, post-workout, pre-workout, protocols, skin-routine, workday-routine | 72 – 118 mots |
| **Pourquoi CytoLight** | 4 / 4 — our-approach, our-story, quality, technology | 86 – 124 mots |
| **Divers** | 4 — bundles (43), contact (**1 mot**), faq (175), how-to-use (166) | 1 – 175 mots |

`/pages/contact` et `/pages/bundles` sont liées depuis le header : la barre utilitaire pour
« Nous contacter », le panneau Boutique pour « Packs ». Une page de contact d'un mot, atteignable
en un clic depuis toutes les pages du site, est le pire de la liste.

Les collections (`panels`, `recovery`, `performance`, `skin-amp-glow`, `longevity`,
`work-amp-focus`, `all`) sont minces — 130 à 177 mots — mais traduites. Elles relèvent d'un
autre chantier : leurs descriptions portent l'entrée par objectif dans la gamme.

**Titres SEO défectueux** : `/pages/nos-valeurs` s'intitule « our-values », `/pages/comment-ca-marche`
« how-it-works », `/pages/benefits` « benefits ». Ce sont des handles affichés comme titres — visibles
dans l'onglet du navigateur et dans les résultats Google. Correction dans l'admin, sans toucher au
thème, et sans risque de déploiement.

**Deux arbitrages en découlent.** Le menu **CytoLight Pro** expose six ébauches d'une centaine de
mots : les écrire ou retirer l'entrée. Les **7 pages Protocoles** portent une promesse de conseil
d'usage que 90 mots ne tiennent pas — et c'est précisément le contenu qui ferait revenir un
acheteur après l'achat.

> Reproductible : `python3 scripts/audit-nav.py`. Les longueurs sont mesurées sur le texte visible
> de `<main id="MainContent">`, hors script, style et SVG.

**Dette identifiée, non planifiée :**

| Objet | Constat |
|---|---|
| `sections/vg-homepage.liquid` | 649 lignes mortes, aucun template ne l'appelle. Contient « Medically certified » (principe II), des témoins fictifs aux noms conservés (principe III) et des prix figés |
| Retrait du portugais | `sections/header.liquid` uniquement |
| Vidéo hero | Pointe par défaut sur `media.paretophysio.com` — domaine tiers (principe V) |
| URL CDN en dur | `sections/cytolight-home.liquid`, image du Cap (principe V) |
| `font_body: "Poppins"` | `config/settings_data.json`, contredit les polices servies |
| Branches locales | Onze branches déjà mergées non supprimées |
| CI | Aucune. Un JSON invalide a déjà mis la boutique à terre (`70d83af`) |

**Automatisations validées, à construire** : CI GitHub Actions (theme check + validation JSON)
bloquante en PR, vérificateur de liens morts sur la navigation, budget Lighthouse, passage de
veille régulier sur la dette et les incohérences doc/code.

## Repères

| | |
|---|---|
| Boutique | `cytolight.myshopify.com` |
| Thème live, connecté à `main` | `cytolight-theme/main` |
| Thème conservé pour rollback | `CytoLight Theme v4` (non publié) |
| Taille du thème | ~500 Ko, plafond 50 Mo |
| Équipe | Deux développeurs |

# Contrat — Ce que chaque page doit contenir

**Feature**: Étoffer et traduire les pages portées par l'admin

Ce contrat est ce qu'une relecture vérifie. Il porte sur la **structure et les garanties**, pas
sur la formulation : le ton — vouvoiement, registre expert, sobre et premium — relève du brief
produit.

## Contrat commun aux 15 pages

| # | Exigence | Vérification |
|---|---|---|
| C-1 | Un `h1` unique, et une hiérarchie de titres continue sans saut de niveau | Lecture du DOM |
| C-2 | ≥ 250 mots visibles dans chaque langue | `audit-nav.py --min-mots 250` |
| C-3 | Les deux langues couvrent les mêmes faits, sans nombre de mots identique | Audit + relecture |
| C-4 | Au moins un chemin de sortie explicite, cohérent avec le sujet | Lecture |
| C-5 | Autonome : compréhensible sans ouvrir une autre page | Relecture |
| C-6 | Aucun terme proscrit, en FR comme en EN | `grep`, liste ci-dessous |
| C-7 | Tout chiffre publié est rattaché à une source nommée | Revue du dossier de faits |
| C-8 | Aucune image ajoutée ; aucun média dans `assets/` | Diff |
| C-9 | Les `aria-label` existent dans les deux langues | Lecture du Liquid |

### C-6 — Liste des termes proscrits (constitution, principe II)

**FR** : traite, traiter, soigne, soigner, guérit, guérir, guérison, soulage, soulagement,
« réduit la douleur », anti-inflammatoire, inflammation, pathologie, symptôme, thérapeutique,
« certifié médicalement », « dispositif médical », « cliniquement prouvé », prescription,
posologie, patient.

**EN** : treats, treatment, cures, cure, heals, healing, relieves, relief, "pain relief",
anti-inflammatory, inflammation, disease, symptom, therapeutic, "medically certified",
"medical device", "clinically proven", prescription, dosage, patient.

> Le mot « récupération » / « recovery » reste autorisé : c'est un ressenti et un usage, pas une
> allégation de traitement. « Bien-être », « confort », « ressenti » également.

Toute affirmation d'effet se formule au **conditionnel**. Seules les caractéristiques physiques de
l'appareil — longueur d'onde, nombre de LED, autonomie — s'énoncent à l'indicatif.

---

## Contrat du groupe Protocoles — 7 pages

Le groupe le plus exposé au principe II : il décrit des usages dirigés.

| Bloc | Obligatoire | Composant | Contenu |
|---|---|---|---|
| Hero | oui | `editorial-hero` | Fil d'Ariane, kicker « Protocole », titre |
| À qui et quand | oui | `.ln-copy` | Le moment de la journée, le profil visé |
| La séance | **oui** | `.ln-steps` / `.ln-step` | **Moment, durée, distance, fréquence** — les quatre, sans exception (FR-010) |
| Appareils adaptés | oui | `learn-product-cta` | Au moins un handle de la gamme, choisi pour le sujet |
| Ce que cette séance ne fait pas | **oui** | `.ln-pledge` + `.ln-pledge__mark--no` | La garde du principe II. Son absence est une régression, jamais une simplification |
| Renvoi | oui | `.ln-link` | Vers `learn-how-it-works` ou `learn-wavelengths` pour le mécanisme, jamais dupliqué ici |

**P-1** — Les quatre paramètres de séance sont présents et chiffrés sur chacune des 7 pages.
**P-2** — Le bloc « ce que cette séance ne fait pas » figure sur les 7, en FR et en EN.
**P-3** — Aucune longueur d'onde n'est réécrite : toute mention concorde avec
`sections/learn-wavelengths.liquid` et les fiches produit.
**P-4** — Aucune page ne cite de littérature scientifique. Le mécanisme et les références vivent
sur `learn-how-it-works` et `learn-science` ; ces pages y renvoient. Cela évite d'avoir à porter
sept encadrés de limites, et évite surtout d'en oublier un.
**P-5** — `protocols` est un index : il oriente vers les six autres et ne décrit aucune séance.

---

## Contrat du groupe Pourquoi CytoLight — 4 pages

| Page | Blocs attendus | Lot |
|---|---|---|
| `our-approach` | Ce que la marque revendique / ce qu'elle ne revendique pas (`.ln-pledge` avec ses deux modificateurs), positionnement, renvoi vers `learn-science` | 1 |
| `our-story` | Origine, motif, implantation, ce qui distingue le service | **2** |
| `quality` | Contrôles, garantie, SAV, retours | **2** |
| `technology` | Les sept longueurs d'onde (`.ln-waves`), pilotage intensité et pulsation, correspondance appareil | **2** |

**W-1** — `our-approach` est la page qui énonce explicitement ce que la marque **ne** revendique
pas. C'est la contrepartie éditoriale du principe II : elle transforme une contrainte
réglementaire en argument de rigueur.
**W-2** — Aucun avis, note, témoignage, logo de presse, effectif client ni certification n'est
affiché sur ces quatre pages (principe III).
**W-3** — `brand-technology` n'invente aucune valeur d'irradiance. Tant que la mesure, sa distance
et son opérateur ne sont pas fournis, la page reste au lot 2 et n'est pas publiée.
**W-4** — Les longueurs d'onde de `brand-technology` sont alignées sur `learn-wavelengths`, qui
reste la source. En cas de divergence, c'est `learn-wavelengths` qui fait foi.

---

## Contrat du groupe Divers — 4 pages

### `contact` — lot 1

**D-1** — Un `{% form 'contact' %}` natif, fonctionnel sans JavaScript.
**D-2** — Étiquettes de champ, bouton et message de confirmation en FR et en EN, dans le gabarit.
**D-3** — Chaque champ porte un `label` associé, atteignable au clavier, avec focus visible.
**D-4** — Le nom accessible du bouton contient son texte visible (WCAG 2.5.3).
**D-5** — La prose admin annonce un **délai de réponse**, l'identité de l'entreprise et rappelle
les engagements (essai 30 jours, garantie 2 ans, livraison).
**D-6** — Aucune donnée personnelle collectée au-delà de ce que le formulaire natif traite.

### `bundles` — lot 2

**D-7** — Composition de chaque pack et remise appliquée, concordant avec la fiche produit
(duo −10 %, famille −15 %).
**D-8** — Les cartes produit viennent de `all_products` : prix et devise suivent le marché courant,
jamais de prix écrit en dur. Un produit absent du catalogue est sauté, pas rendu vide.
**D-9** — Tant que la composition exacte n'est pas fournie, la page n'est pas publiée.

### `faq` et `how-to-use` — lot 1

**D-10** — Coquille inchangée. Seul le corps admin est étoffé et traduit.
**D-11** — La FAQ couvre ce que les autres pages lui délèguent : essai, garantie, certifications —
le bloc sécurité de `learn-how-it-works` y renvoie.
**D-12** — Aucune réponse ne revendique de certification de dispositif médical ni d'effet
thérapeutique. C'est la page la plus exposée : une question de client se répond volontiers de
travers.

---

## Ce que le contrat n'exige pas

- Aucune image. Les pages du chantier sont du texte et des composants existants.
- Aucun encadré de limites scientifiques : aucune page ne cite de littérature. Si une rédaction
  venait à en citer une, l'encadré redeviendrait obligatoire (principe II) et chaque référence
  devrait porter un DOI ou un PMID.
- Aucune animation. `learn.js` n'arme que `.ln-reveal` et `.ln-tl` ; ne pas en poser laisse la
  page strictement identique avec ou sans script.

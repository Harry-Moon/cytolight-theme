# Espace Apprendre — à reporter dans l'admin Shopify

Le contenu des pages Apprendre vit dans le dépôt. **Les balises `title` et `meta description`,
elles, n'y sont pas** : `layout/theme.liquid` les dérive de `page_title` et `page_description`,
c'est-à-dire du bloc *Search engine listing* de Content → Pages dans l'admin. Rien dans ce dépôt
ne peut les écrire.

Shopify Markets stocke **un listing SEO par langue**. Chaque tableau est donc à saisir deux fois :
une fois sur la page française, une fois sur sa traduction anglaise (Paramètres → Langues →
Traduire, ou l'application Translate & Adapt).

**Ne pas écrire « Antared » dans le champ Page title.** `layout/theme.liquid` ajoute le suffixe
` – Antared` de lui-même, sauf si le titre contient déjà le nom de la marque. L'écrire à la main
produit « … – Antared – Antared ». Les titres ci-dessous sont calibrés **suffixe compris**.

Pour la page `science`, voir `docs/science-seo-admin.md`, rédigé lors du chantier précédent.

---

## `academy` — index de l'espace

| Champ | Français |
|---|---|
| Page title | `Apprendre la luminothérapie rouge : science, dose, spectres` |
| Meta description | `Huit entrées : la recherche avec ses DOI, ce que les essais ont mesuré, le mécanisme, la dose, les longueurs d'onde, le mode d'emploi et nos règles de sélection.` |

| Champ | Anglais |
|---|---|
| Page title | `Learn red light therapy: science, dose and wavelengths` |
| Meta description | `Eight ways in: the research with its DOIs, what the trials measured, the mechanism, the dose, the wavelengths, how to use a device and our selection rules.` |

## `comment-ca-marche` — le mécanisme et la dose

| Champ | Français |
|---|---|
| Page title | `Comment marche la luminothérapie rouge : mécanisme et dose` |
| Meta description | `Du photon à la mitochondrie, la fenêtre optique 600-950 nm et la réponse biphasique à la dose. Durée, fréquence, distance : les repères qui font foi, et leurs limites.` |

| Champ | Anglais |
|---|---|
| Page title | `How red light therapy works: mechanism, dose and safety` |
| Meta description | `From photon to mitochondrion, the 600-950 nm optical window and the biphasic dose response. Duration, frequency, distance: the reference figures, and their limits.` |

## `wavelengths` — le spectre

| Champ | Français |
|---|---|
| Page title | `Longueurs d'onde : 590 à 940 nm, spectre par spectre` |
| Meta description | `Ce que fait chaque longueur d'onde, de l'ambre 590 nm au proche infrarouge 940 nm, la profondeur relative atteinte et sur quel appareil de la gamme on la trouve.` |

| Champ | Anglais |
|---|---|
| Page title | `Red light wavelengths: 590 to 940 nm, spectrum by spectrum` |
| Meta description | `What each wavelength does, from 590 nm amber to 940 nm near-infrared, the relative depth it reaches, and which device in the range carries it.` |

## `benefits` — ce qui a été mesuré

| Champ | Français |
|---|---|
| Page title | `Bienfaits de la luminothérapie rouge : neuf résultats sourcés` |
| Meta description | `Ce que les essais ont mesuré, domaine par domaine : douleur, récupération, peau, cheveux, performance, sommeil. Chaque résultat avec sa taille d'échantillon et son DOI.` |

| Champ | Anglais |
|---|---|
| Page title | `Red light therapy benefits: nine sourced results` |
| Meta description | `What the trials measured, domain by domain: pain, recovery, skin, hair, performance, sleep. Every result with its sample size and its DOI.` |

## `how-to-use` — mode d'emploi

| Champ | Français |
|---|---|
| Page title | `Mode d'emploi : utiliser un appareil de luminothérapie rouge` |
| Meta description | `La séance en cinq étapes, ce qui change d'un format à l'autre, et les cinq erreurs qui reviennent. Durée, distance et fréquence, sur peau nue.` |

| Champ | Anglais |
|---|---|
| Page title | `How to use a red light therapy device` |
| Meta description | `The session in five steps, what changes from one format to the next, and the five mistakes that keep coming back. Duration, distance and frequency, on bare skin.` |

## `faq` — questions fréquentes

| Champ | Français |
|---|---|
| Page title | `FAQ luminothérapie rouge : essai, garantie, usage` |
| Meta description | `Douze réponses : durée de séance, distance, usage quotidien, différence rouge et proche infrarouge, essai de 14 jours, garantie de 2 ans et certifications.` |

| Champ | Anglais |
|---|---|
| Page title | `Red light therapy FAQ: trial, warranty and use` |
| Meta description | `Twelve answers: session length, distance, daily use, red versus near-infrared, the 14-day trial, the 2-year warranty and certifications.` |

## `nos-valeurs` — la méthode

| Champ | Français |
|---|---|
| Page title | `Nos valeurs : comment nous sélectionnons un appareil` |
| Meta description | `Un DOI sur chaque étude citée, l'irradiance publiée avec sa distance, aucune note écrite à la main, aucune promesse thérapeutique. Six règles, vérifiables page par page.` |

| Champ | Anglais |
|---|---|
| Page title | `Our values: how we select a device, and what we refuse` |
| Meta description | `A DOI on every study cited, irradiance published with its distance, no hand-written ratings, no therapeutic promise. Six rules, checkable page by page.` |

---

## Le reste de la checklist après le merge

1. **Assigner les gabarits** dans Content → Pages. Le sélecteur « Theme template » ne liste que
   les gabarits du thème **publié** : ils n'apparaissent qu'une fois la PR mergée.
2. **Vider le corps de page** de `faq` et de `how-to-use`. Ces deux pages sont désormais écrites
   dans le thème ; le texte resté dans l'éditeur serait rendu en double sur la FAQ, et
   n'apparaîtrait plus du tout sur le mode d'emploi — mais il continuerait d'être servi si
   quelqu'un réassignait un autre gabarit.
3. **Coller les titres et descriptions ci-dessus**, dans les deux langues.
4. Passer chaque URL au **test des résultats enrichis de Google** :
   `https://search.google.com/test/rich-results`. Les pages Apprendre déclarent toutes un
   `Article` (ou un `CollectionPage` pour l'index) et un `BreadcrumbList` ; cinq d'entre elles
   déclarent en plus un `FAQPage`.
5. Vérifier la navigation : `python3 scripts/audit-nav.py`.

# Page Science — à reporter dans l'admin Shopify

Le contenu de `/pages/science` vit dans le dépôt (`sections/learn-science.liquid`).
**Les balises `title` et `meta description`, elles, n'y sont pas** : le thème les dérive de
`page_title` et `page_description`, c'est-à-dire du bloc *Search engine listing* de
Content → Pages → Science dans l'admin. Rien dans ce dépôt ne peut les écrire.

Shopify Markets stocke **un listing SEO par langue**. Les deux tableaux ci-dessous sont donc
à saisir séparément : une fois sur la page française, une fois sur sa traduction anglaise
(Paramètres → Langues → Traduire, ou l'application Translate & Adapt).

## Ce qu'il faut coller

### Français

| Champ | Valeur |
|---|---|
| Page title | `Luminothérapie rouge : études, preuves et limites` |
| Meta description | `Frise sourcée de 1903 à 2026, onze études avec leur DOI, les doses employées dans les essais et leurs limites. Aucune n'a porté sur un appareil Antared.` |
| URL handle | `science` — **ne pas modifier**, il est écrit dans le mega-menu |

### Anglais

| Champ | Valeur |
|---|---|
| Page title | `Red light therapy: studies, evidence and limits` |
| Meta description | `A sourced timeline from 1903 to 2026, eleven papers with their DOI, the doses used in the trials and their limits. None was run on an Antared device.` |
| URL handle | `science` |

**Ne pas écrire « Antared » dans le champ Page title.** `layout/theme.liquid` ajoute
lui-même ` – Antared` quand la marque est absente du titre ; l'écrire à la main produirait
« … – Antared – Antared ».

## Trois autres actions dans l'admin

1. **Gabarit** — Content → Pages → Science → *Theme template* : `page.science`. Le sélecteur ne
   liste que les gabarits du **thème publié** : cette étape n'est possible qu'après le merge.
2. **Vider le corps de page.** Le gabarit affiche `page.content` sous la section Liquid, dans
   `.ln-prose`. Si une ébauche rédigée dans l'admin y traîne, elle s'affichera en bas de page,
   dans une seule langue, sous un contenu bilingue. C'est exactement le défaut relevé sur les
   six pages Antared Pro par l'audit du 2026-08-21.
3. **Vérifier le résultat** avec le [test des résultats enrichis](https://search.google.com/test/rich-results)
   sur l'URL publiée. Trois blocs doivent être détectés : `Article`, `BreadcrumbList`, `FAQPage`.

## Ce que le dépôt gère déjà, et qu'il ne faut pas dupliquer dans l'admin

- Le fil d'Ariane, le titre H1, tout le corps éditorial et la FAQ.
- Les données structurées (`Article`, `BreadcrumbList`, `FAQPage`), en bas de
  `sections/learn-science.liquid`. Ne pas installer d'application de balisage FAQ par-dessus :
  deux `FAQPage` sur une même page se contredisent.
- Les balises Open Graph et Twitter, via `snippets/meta-social.liquid`. Elles retombent sur
  `page_title` / `page_description` pour une page — donc remplir les champs ci-dessus améliore
  aussi l'aperçu des liens partagés.

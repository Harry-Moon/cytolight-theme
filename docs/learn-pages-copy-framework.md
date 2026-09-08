# Pages Apprendre — cadre de rédaction

Méthode établie sur `/pages/science` (page pilote, septembre 2026) et destinée à être
rejouée telle quelle sur les autres pages de l'espace Apprendre : Académie, Bienfaits,
Comment ça marche, Longueurs d'onde, Mode d'emploi, FAQ, Nos valeurs, Blog.

Ce document ne remplace ni `.specify/memory/constitution.md`, qui prime, ni `CLAUDE.md`.
Il décrit ce qui est propre à un chantier de **texte**.

---

## 1. Ton de voix

| Règle | En pratique |
|---|---|
| Le chiffre avant l'adjectif | « 820 patients », pas « une vaste étude » |
| La limite dans la même phrase que le résultat | « efficace, sur 20 personnes seulement » |
| Pas de superlatif non mesuré | bannir *révolutionnaire*, *incroyable*, *ultime*, *miracle* |
| Phrases courtes, une idée par paragraphe | c'est aussi ce qui rend un passage extractible |
| Le lecteur est adulte | on lui donne la nuance, on ne la lui épargne pas |
| Nommer ce qu'on ne sait pas | « à vérifier » est une réponse acceptable, l'invention non |
| Le doute est un argument de vente | une marque qui pose ses limites est plus crédible que celle qui promet |

Les accents s'écrivent en **entités HTML** (`&eacute;`) dans le texte affiché, pour rester
aligné sur les sections existantes. **Exception : les blocs destinés au JSON-LD**, où les
entités ne sont pas décodées et apparaîtraient littéralement — voir §6.

---

## 2. Règles de citation

1. **Aucune référence sans identifiant vérifiable.** DOI de préférence, PMID à défaut. Une
   étude sans lien résolvable ne s'écrit pas.
2. **Vérifier avant d'écrire.** PubMed bloque le scraping direct ; passer par l'API E-utilities,
   qui répond sans cookie :
   `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=<PMID>&retmode=json`
   puis `efetch.fcgi?...&rettype=abstract&retmode=text` pour le résumé. Contrôler enfin que le
   DOI résout sur `doi.org`.
3. **Ne jamais reprendre un chiffre de seconde main.** Le nombre d'essais, la taille
   d'échantillon et les bornes de dose viennent du résumé, pas d'un article de blog.
4. **Préciser la source lumineuse** — laser ou LED — dès qu'elle change la lecture. Une bonne
   part de la littérature historique est du laser ; les appareils vendus sont des LED.
5. **Afficher le niveau de preuve**, avec les étiquettes déjà stylées dans `assets/learn.css` :
   `ln-grade--meta`, `ln-grade--rct`, `ln-grade--mech`, `ln-grade--signal`.
6. **Écarter une source redondante, et le dire.** Une publication qui répète une autre déjà
   citée n'ajoute que du bruit. Elle ne se retient que si elle apporte un angle absent — et
   c'est cet angle-là qu'on écrit, pas un résumé de plus.
7. **Une seule page fait foi par chiffre.** Durée, fréquence et distance viennent de
   `learn-how-it-works` ; longueurs d'onde et profondeurs de `learn-wavelengths`. Une valeur
   écrite ailleurs en premier crée une contradiction qu'aucun script ne verra.

---

## 3. Structure type d'une page Apprendre

Ordre éprouvé sur Science. Les blocs 2, 6 et 7 sont obligatoires.

| # | Bloc | Rôle |
|---|---|---|
| 1 | Hero — fil d'Ariane, kicker, H1, 3-4 repères chiffrés | situer en cinq secondes |
| 2 | **Résumé de tête** — 1 paragraphe + 5-6 puces autoportantes + date de revue | SEO, GEO, et le lecteur pressé |
| 3 | Corps éditorial propre au sujet (frise, fiches, schéma…) | la substance |
| 4 | **Position de marque** — ce que nous faisons / ce que nous ne faisons pas | désamorcer la lecture commerciale |
| 5 | **« Ce que ceci ne dit pas »** | tenue réglementaire |
| 6 | **FAQ** — 5 à 8 questions, réponses de 40 à 60 mots | GEO, et les objections réelles |
| 7 | `learn-product-cta` avec 3 produits pertinents | conversion |
| 8 | JSON-LD `Article` + `BreadcrumbList` + `FAQPage` | lisibilité machine |

Le **bloc signature** — un composant visuel propre à la page — est ce qui empêche deux pages
de se ressembler. Ils existent déjà dans `learn.css` : `.ln-timeline`, `.ln-bodymap`,
`.ln-depth`, `.ln-spectrum`, `.ln-waves`, `.ln-faq`, `.ln-pledge`, `.ln-steps`, `.ln-evidence`.
**Aucune règle CSS ne doit être ajoutée pour un chantier de texte.**

---

## 4. Contraintes réglementaires — non négociables

- **Aucune allégation de traitement, de guérison ou de diagnostic**, même indirecte, même sous
  forme de témoignage ou de question rhétorique.
- **La mention « produit de bien-être » figure sur chaque page**, avec le renvoi au
  professionnel de santé en cas de symptôme, de traitement en cours ou de grossesse.
- **Le bloc « ce que ceci ne dit pas » ne se retire pas.** C'est lui qui tient la page du bon
  côté de l'article L.121-2 du Code de la consommation et de la validation des comptes
  publicitaires Meta et TikTok.
- **Antared ne conduit aucun essai clinique et ne revendique aucune étude.** Formulation de
  référence : *« nous réglons nos appareils sur les paramètres publiés dans la littérature, et
  nous les affichons »*. Toute variante suggérant un essai mené sur un appareil Antared est un
  défaut, où qu'elle apparaisse.
- **Aucun tarif, remise ou volume qui n'existe pas encore** (principe III).
- **Jamais de type schema.org médical** — pas de `MedicalWebPage`, `MedicalTherapy`, `Drug`,
  `MedicalCondition`. `Article` et `FAQPage` suffisent, et n'engagent rien.

---

## 5. SEO — ce qui se fait, et où

| Élément | Où il vit |
|---|---|
| H1, H2, H3, corps, FAQ | la section Liquid, dans le dépôt |
| `title` et `meta description` | **l'admin Shopify**, un listing par langue — le dépôt ne peut pas les écrire |
| Open Graph / Twitter | `snippets/meta-social.liquid`, qui retombe sur les champs admin pour une page |
| JSON-LD | la section elle-même, à côté du texte qu'il décrit |

Règles : un seul `h1` ; les `h2` formulés comme des requêtes ; `title` visé à ~60 caractères
**suffixe ` – Antared` compris**, que `layout/theme.liquid` ajoute tout seul — ne pas l'écrire
à la main ; description à ~155 caractères.

**Tout lien interne porte `locale_root`**, ou passe par `pages[handle].url` quand la page
existe. Un `href="/pages/faq"` nu renvoie le visiteur anglophone sur le français. Chaque page
Apprendre doit sortir vers au moins trois autres : la page qui fait foi sur ses chiffres, une
page voisine du même espace, et un protocole ou une fiche produit.

---

## 6. GEO — cinq gestes qui font la différence

1. **Un résumé de tête autoportant.** Chaque puce doit rester vraie et compréhensible sortie de
   la page : c'est sous cette forme qu'un moteur de réponse la citera.
2. **Des réponses de 40 à 60 mots**, chacune ouverte par sa réponse directe, pas par un préambule.
3. **Un chiffre et une source par affirmation.** C'est le levier le mieux documenté : citer ses
   sources et donner des statistiques sont les deux gestes qui augmentent le plus la probabilité
   d'être cité par un moteur de réponse.
4. **Une date de revue visible**, alimentée par une seule variable Liquid (`page_updated`) qui
   sert aussi de `dateModified` au JSON-LD.
5. **Une bibliographie lisible par une machine** : le tableau `citation[]` de l'`Article`, avec
   un `ScholarlyArticle` et son DOI par publication.

**La FAQ visible et le `FAQPage` partagent une source unique.** Sur Science, les questions sont
écrites une fois dans `faq_raw` (convention du dépôt : `|` sépare les items, `~` sépare la
question de la réponse), puis rendues deux fois — en `<details>` et en JSON-LD. Les écrire deux
fois garantirait qu'elles divergent, et Google refuse un balisage qui ne correspond pas au texte
visible. **Les accents de ce bloc s'écrivent en UTF-8 brut** : un `&eacute;` n'est pas décodé
dans un `<script type="application/ld+json">` et apparaîtrait tel quel dans le résultat indexé.

Ne jamais écrire un contenu distinct « pour les IA » : c'est du *scaled content abuse* au sens
de Google. Une seule version, mieux structurée, sert les deux publics.

---

## 7. Conversion, sans rien sacrifier

- Le CTA final est **contextuel** : trois produits pertinents pour le sujet de la page, via
  `snippets/learn-product-cta.liquid`, jamais une grille de collection.
- L'honnêteté **est** l'argument. « Aucune de ces études n'a été menée sur un appareil Antared »
  vend mieux que « cliniquement prouvé », parce que la phrase suivante — nous affichons nos
  paramètres, comparez-les — devient crédible.
- Le bloc position de marque transforme une objection (« vous vendez, donc vous exagérez ») en
  preuve de sérieux, avant que la page produit n'ait à s'en charger.
- Un lien de sortie vers un protocole convertit mieux qu'un lien vers une autre page théorique :
  il propose une action, pas une lecture de plus.

---

## 8. Checklist avant d'ouvrir la PR

- [ ] Chaque source nouvelle vérifiée sur PubMed **et** son DOI résolu
- [ ] Aucun chiffre écrit ici en premier s'il vit déjà sur `learn-how-it-works` ou `learn-wavelengths`
- [ ] Bloc « ce que ceci ne dit pas » présent ; mention « produit de bien-être » présente
- [ ] Aucune formulation suggérant un essai mené sur un appareil Antared
- [ ] FR et EN à parité stricte, `aria-label` compris — aucun `TODO: traduire`
- [ ] Aucun mot d'une langue dans la branche de l'autre
- [ ] Tous les liens internes portent `locale_root` ou passent par `pages[handle].url`
- [ ] `title` / `meta description` livrés pour l'admin, dans les deux langues
- [ ] JSON-LD : aucun type médical ; le `FAQPage` correspond mot pour mot au texte visible
- [ ] Aucune règle CSS ajoutée ; uniquement des composants `ln-*` existants
- [ ] `shopify theme check` : au moins aussi propre que `origin/main` (0 infraction au 2026-09-01)
- [ ] `shopify theme dev` : page parcourue dans les deux langues, onglet Réseau sans 404
- [ ] `python3 scripts/audit-nav.py` sur la page touchée

Après le merge, dans l'admin : assigner le gabarit, coller `title` / description dans les deux
langues, **vider le corps de page**, puis passer l'URL au test des résultats enrichis de Google.

---

## 9. Ordre de traitement conseillé pour la suite

`comment-ca-marche` et `wavelengths` d'abord : ce sont les deux pages qui **font foi** sur les
chiffres que toutes les autres citent. Les traiter en dernier obligerait à repasser sur tout ce
qui aura été écrit entre-temps. Ensuite `bienfaits` (même structure de fiches d'études que
Science, mêmes étiquettes de niveau de preuve), puis `nos-valeurs`, `mode-d-emploi`, `faq`,
`academy` — l'index se rédige en dernier, une fois que l'on sait vers quoi il pointe.

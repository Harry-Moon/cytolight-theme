# Quatre articles de blog — à coller dans l'admin Shopify

Les articles de blog **ne vivent pas dans ce dépôt**. `templates/blog.liquid` et
`templates/article.liquid` ne font que mettre en page ce qui est saisi dans
Content → Blog posts. Aucun commit ne peut créer un article : c'est une action
manuelle dans l'admin, comme l'upload d'une image dans Content → Files.

Les quatre fichiers de ce dossier contiennent donc le contenu **prêt à coller**,
dans les deux langues.

| Fichier | Sujet | Page qui fait foi |
|---|---|---|
| `01-quest-ce-que-la-luminotherapie-rouge.md` | La définition, et les quatre confusions à écarter | `learn-how-it-works` |
| `02-longueur-donde-nest-pas-une-couleur.md` | 660 nm contre 850 nm, la profondeur | `learn-wavelengths` |
| `03-la-dose-fait-tout.md` | La réponse biphasique, pourquoi plus fort n'est pas mieux | `learn-how-it-works` |
| `04-lire-une-fiche-technique.md` | Irradiance, distance, surface — comparer honnêtement | `learn-values` |

L'ordre est celui de publication conseillé : chaque article s'appuie sur le
précédent, et le quatrième est celui qui convertit le mieux parce qu'il arme le
lecteur juste avant qu'il compare deux produits.

## Comment publier un article

1. Content → Blog posts → **Add blog post**.
2. Coller le **titre** de la colonne « Français ».
3. Passer l'éditeur de contenu en mode HTML (bouton `<>` de la barre d'outils)
   et coller le bloc **Corps — français** tel quel.
4. Ouvrir **Search engine listing → Edit** et coller le *page title* et la
   *meta description* fournis. Le handle se dérive du titre **à la création
   seulement** : vérifier qu'il correspond à celui indiqué, et le corriger à cet
   endroit s'il diverge — jamais en renommant le titre.
5. Renseigner l'**extrait** (champ *Excerpt*) : c'est lui qui s'affiche sur
   `/blogs/...` et dans les trois cartes de `/pages/academy`.
6. Ajouter les **tags** indiqués.
7. Choisir le blog `journal` s'il existe, `news` sinon — ce sont les deux
   handles que cherchent `learn-hub.liquid` et `learn-values.liquid`, dans cet
   ordre.
8. **Image de couverture** : facultative. Sans image, les cartes affichent le
   placeholder de Shopify, ce qui est correct mais terne. Si vous en ajoutez
   une, l'`alt` doit décrire la photo, pas répéter le titre.
9. Publier, puis répéter l'opération pour l'anglais dans **Paramètres → Langues
   → Traduire** (ou l'application Translate & Adapt) avec les blocs « anglais ».

## Deux avertissements

**Les liens internes sont écrits en dur.** Un corps d'article ne passe pas par
Liquid : `{{ locale_root }}` n'y existe pas. Les liens des blocs français sont
donc écrits à la racine (`/pages/science`) et ceux des blocs anglais préfixés
(`/en/pages/science`). C'est correct sur **`antared.care`**, où le français est
la langue racine du domaine. Ce ne l'est pas sur `cytolight.myshopify.com`, où
l'ordre est inversé : ne pas s'inquiéter d'un lien qui part dans la mauvaise
langue en prévisualisation sur le domaine technique.

**Aucun chiffre n'est écrit ici en premier.** Durée, fréquence et distance
viennent de `learn-how-it-works` ; longueurs d'onde et profondeurs de
`learn-wavelengths` ; les études et leurs DOI de `learn-science`. Si l'une de
ces pages change, ces articles changent avec elle — et pas l'inverse.

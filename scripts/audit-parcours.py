#!/usr/bin/env python3
"""Audit du parcours d'achat CytoLight.

Parcourt le catalogue reel de la boutique, en francais et en anglais, et verifie
ce qu'un acheteur rencontre avant de payer. Pendant de `audit-nav.py`, qui teste
les liens de la navigation : celui-ci teste les fiches produit et le panier.

Sept controles par fiche :

  * page        — la fiche repond 200 dans les deux langues
  * titre       — un seul <h1>, condition d'accessibilite et de SEO
  * prix        — un prix affiche, non nul, dans la devise du marche
  * panier      — le formulaire d'ajout est complet : action, variante, quantite
  * images      — aucune image cassee, aucune image sans width et height
  * promesses   — essai, garantie et seuil de livraison concordent d'une fiche a
                  l'autre et d'une langue a l'autre
  * parite      — FR et EN ne rendent pas exactement le meme nombre de mots

Le controle « promesses » est celui qui coute le plus cher quand il manque. Le
2026-08-31, deux branches ont annonce simultanement 30 et 14 jours d'essai, puis
1 et 2 ans de garantie, sur le meme site. Rien ne le signalait : ni theme check,
ni l'audit de navigation. Une contradiction sur une promesse commerciale releve
de l'article L.121-2 du Code de la consommation, pas du detail redactionnel.

Aucune dependance : bibliotheque standard Python 3 uniquement, conformement au
principe IV de la constitution.

    python3 scripts/audit-parcours.py
    python3 scripts/audit-parcours.py --base http://127.0.0.1:9292
    python3 scripts/audit-parcours.py --produit cytolight-cap --verbeux

L'ajout au panier reel n'est pas fait par defaut : c'est la seule requete de ce
script qui modifie un etat. Elle reste locale a la session (Shopify attache le
panier a un cookie), mais elle s'active explicitement :

    python3 scripts/audit-parcours.py --panier
"""

import argparse
import http.cookiejar
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from collections import defaultdict

BASE_DEFAUT = "https://cytolight.myshopify.com"
LOCALES = (("fr", ""), ("en", "/en"))
ENTRE_REQUETES = 0.4   # politesse : Shopify bride le storefront
DELAI_429 = 20
UA = "Mozilla/5.0 (CytoLight parcours audit)"

RE_H1 = re.compile(r"<h1[\s>]", re.I)
RE_IMG = re.compile(r"<img\b[^>]*>", re.I)
RE_ATTR = re.compile(r'(\w[\w-]*)\s*=\s*["\']([^"\']*)["\']')
RE_FORM_PANIER = re.compile(
    r"""<form[^>]+action=["'][^"']*/cart/add["'][^>]*>(.*?)</form>""", re.S | re.I)
RE_VARIANTE = re.compile(
    r"""name=["']id["'][^>]*value=["'](\d+)["']|value=["'](\d+)["'][^>]*name=["']id["']""")
RE_QUANTITE = re.compile(r"""name=["']quantity["']""")
RE_MAIN = re.compile(r'<main[^>]*>(.*?)</main>', re.S | re.I)
RE_BRUIT = re.compile(r"<(script|style|svg|noscript)[^>]*>.*?</\1>", re.S | re.I)
RE_TAG = re.compile(r"<[^>]+>")
RE_LIQUID_ERREUR = re.compile(r"Liquid (?:error|syntax error)", re.I)
# Une vitrine protegee repond 200 en servant la page de mot de passe. Sans ce
# garde-fou, chaque fiche remonterait « pas de prix, pas de formulaire, FR = EN »
# et le rapport designerait le theme au lieu du reglage de la boutique.
RE_MOT_DE_PASSE = re.compile(
    r"<title>\s*(?:Please Log In|Mot de passe|Password)\s*</title>"
    r"|name=[\"']password[\"'][^>]*type=[\"']password[\"']"
    r"|/password[\"'][^>]*method=[\"']post", re.I)

# Promesses commerciales : chaque motif capture la valeur annoncee. Le script ne
# juge pas la valeur, il verifie qu'il n'y en a qu'une sur tout le catalogue.
PROMESSES = {
    "essai": re.compile(r"(?:essai|trial)[^.<]{0,24}?(\d+)\s*(?:jours?|days?|j\b)"
                        r"|(\d+)\s*[- ](?:jours?|days?)[^.<]{0,18}?(?:essai|trial)", re.I),
    "garantie": re.compile(r"(?:garantie|warranty)[^.<]{0,20}?(\d+)\s*(?:ans?|years?)"
                           r"|(\d+)\s*[- ](?:ans?|years?)[^.<]{0,14}?(?:garantie|warranty)", re.I),
    "livraison": re.compile(r"(?:livraison|shipping|delivery)[^.<]{0,40}?(\d+)\s*&#8364;"
                            r"|&#8364;\s*(\d+)[^.<]{0,24}?(?:livraison|shipping|delivery)", re.I),
}

VERT, ROUGE, JAUNE, GRIS, RAZ = "\033[32m", "\033[31m", "\033[33m", "\033[90m", "\033[0m"


class Boutique:
    """Client HTTP poli : un cookie jar, un delai entre requetes, 429 respecte."""

    def __init__(self, base):
        self.base = base.rstrip("/")
        self.jar = http.cookiejar.CookieJar()
        self.opener = urllib.request.build_opener(
            urllib.request.HTTPCookieProcessor(self.jar))
        self.opener.addheaders = [("User-Agent", UA)]
        self._dernier = 0.0

    def _patienter(self):
        ecoule = time.time() - self._dernier
        if ecoule < ENTRE_REQUETES:
            time.sleep(ENTRE_REQUETES - ecoule)
        self._dernier = time.time()

    def get(self, chemin, donnees=None, essais=4):
        """Renvoie (code, corps). Un 429 est une attente demandee, pas un defaut."""
        url = chemin if chemin.startswith("http") else self.base + chemin
        delai = DELAI_429
        for tentative in range(essais):
            self._patienter()
            requete = urllib.request.Request(url, data=donnees)
            try:
                with self.opener.open(requete, timeout=45) as reponse:
                    return reponse.status, reponse.read().decode("utf-8", "replace")
            except urllib.error.HTTPError as err:
                if err.code == 429 and tentative < essais - 1:
                    attente = int(err.headers.get("Retry-After") or delai)
                    time.sleep(attente)
                    delai *= 2
                    continue
                return err.code, err.read().decode("utf-8", "replace")
            except (urllib.error.URLError, TimeoutError) as err:
                if tentative < essais - 1:
                    time.sleep(2)
                    continue
                return 0, f"{err}"
        return 0, ""

    def tete(self, url):
        """Code HTTP seul, pour verifier qu'une image repond."""
        self._patienter()
        requete = urllib.request.Request(url, method="HEAD")
        try:
            with self.opener.open(requete, timeout=30) as reponse:
                return reponse.status
        except urllib.error.HTTPError as err:
            return err.code
        except Exception:
            return 0


def texte_visible(html):
    corps = RE_MAIN.search(html)
    corps = corps.group(1) if corps else html
    return RE_TAG.sub(" ", RE_BRUIT.sub(" ", corps))


def absolu(base, src):
    if src.startswith("//"):
        return "https:" + src
    if src.startswith("http"):
        return src
    if src.startswith("/"):
        return base + src
    return None


def lire_catalogue(boutique, limite=None):
    """Les handles reels du catalogue, page par page. Pas de liste en dur."""
    handles, page = [], 1
    while True:
        code, corps = boutique.get(f"/collections/all/products.json?limit=250&page={page}")
        if code != 200:
            return handles, code
        try:
            lot = json.loads(corps).get("products", [])
        except json.JSONDecodeError:
            return handles, 0
        if not lot:
            break
        handles.extend(p["handle"] for p in lot)
        if limite and len(handles) >= limite:
            break
        page += 1
    return (handles[:limite] if limite else handles), 200


def relever_promesses(html):
    """{'essai': {'14'}, 'garantie': {'2'}, ...} tel qu'annonce sur cette page."""
    releve = {}
    for nom, motif in PROMESSES.items():
        valeurs = {g for m in motif.finditer(html) for g in m.groups() if g}
        if valeurs:
            releve[nom] = valeurs
    return releve


def auditer_fiche(boutique, handle, prefixe):
    """Les six controles qui se jugent sur une seule page."""
    code, html = boutique.get(f"{prefixe}/products/{handle}")
    fiche = {"code": code, "defauts": [], "promesses": {}, "mots": 0}
    if code != 200:
        fiche["defauts"].append(f"page       HTTP {code}")
        return fiche

    fiche["mots"] = len(texte_visible(html).split())
    fiche["promesses"] = relever_promesses(html)

    if RE_LIQUID_ERREUR.search(html):
        fiche["defauts"].append("page       erreur Liquid rendue dans la page")

    nb_h1 = len(RE_H1.findall(html))
    if nb_h1 != 1:
        fiche["defauts"].append(f"titre      {nb_h1} <h1> au lieu d'un seul")

    formulaire = RE_FORM_PANIER.search(html)
    if not formulaire:
        fiche["defauts"].append("panier     aucun formulaire vers /cart/add")
    else:
        interieur = formulaire.group(1)
        variante = RE_VARIANTE.search(interieur)
        if not variante:
            fiche["defauts"].append("panier     pas d'identifiant de variante dans le formulaire")
        else:
            fiche["variante"] = variante.group(1) or variante.group(2)
        if not RE_QUANTITE.search(interieur):
            fiche["defauts"].append("panier     pas de champ quantite")

    prix = re.search(r"""class=["']cl-price["']>([^<]+)<""", html)
    if not prix:
        fiche["defauts"].append("prix       aucun prix affiche")
    else:
        chiffres = re.sub(r"[^\d]", "", prix.group(1))
        fiche["prix"] = prix.group(1).strip()
        if not chiffres or int(chiffres) == 0:
            fiche["defauts"].append(f"prix       prix nul ou illisible ({prix.group(1)!r})")

    sans_dimension, casse = 0, []
    vues = set()
    for balise in RE_IMG.findall(html):
        attrs = dict(RE_ATTR.findall(balise))
        if not (attrs.get("width") and attrs.get("height")):
            sans_dimension += 1
        url = absolu(boutique.base, attrs.get("src", ""))
        if url and url not in vues:
            vues.add(url)
            if boutique.tete(url) >= 400:
                casse.append(url.rsplit("/", 1)[-1].split("?")[0])
    if sans_dimension:
        fiche["defauts"].append(f"images     {sans_dimension} image(s) sans width/height (CLS)")
    if casse:
        fiche["defauts"].append(f"images     {len(casse)} cassee(s) : {', '.join(casse[:3])}")

    return fiche


def essayer_panier(boutique, variante, prefixe):
    """Ajout reel puis vidage. Seule requete du script qui modifie un etat."""
    donnees = urllib.parse.urlencode({"id": variante, "quantity": 1}).encode()
    code, corps = boutique.get(f"{prefixe}/cart/add.js", donnees=donnees)
    if code not in (200, 201):
        return f"ajout au panier refuse (HTTP {code})"
    code, corps = boutique.get(f"{prefixe}/cart.js")
    if code != 200:
        return f"panier illisible apres ajout (HTTP {code})"
    try:
        panier = json.loads(corps)
    except json.JSONDecodeError:
        return "panier illisible apres ajout (reponse non JSON)"
    if panier.get("item_count", 0) < 1:
        return "panier vide apres un ajout accepte"
    if panier.get("total_price", 0) <= 0:
        return "panier a zero apres ajout"
    boutique.get(f"{prefixe}/cart/clear.js")
    return None


def main():
    a = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    a.add_argument("--base", default=BASE_DEFAUT, help=f"racine testee (defaut : {BASE_DEFAUT})")
    a.add_argument("--produit", action="append", metavar="HANDLE",
                   help="limiter a ce handle ; repetable")
    a.add_argument("--limite", type=int, metavar="N", help="ne tester que les N premiers produits")
    a.add_argument("--panier", action="store_true",
                   help="ajouter reellement au panier puis le vider (modifie un etat de session)")
    a.add_argument("--verbeux", action="store_true", help="afficher aussi les fiches saines")
    args = a.parse_args()

    boutique = Boutique(args.base)
    print(f"{GRIS}Parcours d'achat — {boutique.base}{RAZ}\n")

    code, accueil = boutique.get("/")
    if code == 200 and RE_MOT_DE_PASSE.search(accueil):
        print(f"{JAUNE}La vitrine est protegee par mot de passe.{RAZ}\n"
              f"Elle repond 200 en servant la page de mot de passe, donc tout audit\n"
              f"lance maintenant decrit cette page et pas la boutique. Levez la\n"
              f"protection dans Online Store > Preferences, ou visez un theme de\n"
              f"developpement :\n\n"
              f"    shopify theme dev --store cytolight.myshopify.com\n"
              f"    python3 scripts/audit-parcours.py --base http://127.0.0.1:9292\n")
        return 2

    if args.produit:
        handles, code = args.produit, 200
    else:
        handles, code = lire_catalogue(boutique, args.limite)
    if code != 200 or not handles:
        print(f"{ROUGE}Catalogue illisible (HTTP {code}). "
              f"La boutique est-elle joignable ?{RAZ}")
        return 2
    print(f"{len(handles)} produit(s) au catalogue, testes en FR et en EN.\n")

    promesses_globales = defaultdict(lambda: defaultdict(set))
    fiches_en_defaut = 0

    for handle in handles:
        defauts, mots = [], {}
        for langue, prefixe in LOCALES:
            fiche = auditer_fiche(boutique, handle, prefixe)
            mots[langue] = fiche["mots"]
            defauts += [f"[{langue}] {d}" for d in fiche["defauts"]]
            for nom, valeurs in fiche["promesses"].items():
                for v in valeurs:
                    promesses_globales[nom][v].add(f"{handle} ({langue})")
            if args.panier and fiche.get("variante"):
                souci = essayer_panier(boutique, fiche["variante"], prefixe)
                if souci:
                    defauts.append(f"[{langue}] panier     {souci}")

        if mots.get("fr") and mots["fr"] == mots.get("en"):
            defauts.append(f"[--] parite     FR et EN rendent {mots['fr']} mots, au mot pres")

        if defauts:
            fiches_en_defaut += 1
            print(f"{ROUGE}✗{RAZ} {handle}")
            for d in defauts:
                print(f"    {d}")
        elif args.verbeux:
            print(f"{VERT}✓{RAZ} {handle}  {GRIS}fr {mots['fr']} mots · en {mots['en']} mots{RAZ}")

    print()
    for langue, prefixe in LOCALES:
        code, _ = boutique.get(f"{prefixe}/cart")
        etat = f"{VERT}200{RAZ}" if code == 200 else f"{ROUGE}{code}{RAZ}"
        print(f"  page panier [{langue}] : {etat}")

    print(f"\n{GRIS}── Promesses commerciales ──{RAZ}")
    incoherentes = 0
    for nom in PROMESSES:
        valeurs = promesses_globales.get(nom)
        if not valeurs:
            print(f"  {JAUNE}?{RAZ} {nom:<10} jamais annoncee sur les fiches")
            continue
        if len(valeurs) == 1:
            valeur = next(iter(valeurs))
            print(f"  {VERT}✓{RAZ} {nom:<10} {valeur}, partout")
        else:
            incoherentes += 1
            print(f"  {ROUGE}✗{RAZ} {nom:<10} {len(valeurs)} valeurs different d'une page a l'autre :")
            for valeur, ou in sorted(valeurs.items()):
                exemples = ", ".join(sorted(ou)[:3])
                reste = f" (+{len(ou) - 3})" if len(ou) > 3 else ""
                print(f"        {valeur:<4} → {exemples}{reste}")

    total = len(handles)
    print(f"\n── {total - fiches_en_defaut} fiche(s) saine(s) / {total} testee(s) ──")
    if incoherentes:
        print(f"{ROUGE}{incoherentes} promesse(s) commerciale(s) contradictoire(s) "
              f"sur le catalogue.{RAZ}")
    return 1 if (fiches_en_defaut or incoherentes) else 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\ninterrompu")
        sys.exit(130)
